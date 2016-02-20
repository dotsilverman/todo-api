var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function(request, response) {
	response.send('Todo API Root');
});

// GET /todos?completed=true&q=work
app.get('/todos', function(request, response) {
	var query = request.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed == 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed == 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		response.json(todos);
	}, function(e) {
		response.status(500).send();
	});
});

// GET /todos/:id
app.get('/todos/:id', function(request, response) {
	var todoId = parseInt(request.params.id, 10);

	db.todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			response.json(todo.toJSON());
		} else {
			response.status(404).send();
		}
	}, function(e) {
		response.status(500).send();
	});
});

// POST /todos, add a todo item
app.post('/todos', function(request, response) {
	var body = _.pick(request.body, 'description', 'completed');

	db.todo.create(body).then(function(todo) {
		response.json(todo.toJSON());
	}, function(e) {
		response.status(400).json(e);
	});
});

// DELETE /todos/:id
app.delete('/todos/:id', function(request, response) {
	var todoId = parseInt(request.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(rowsDeleted) {
		if (rowsDeleted === 0) {
			response.status(404).json({
				error: 'No todo with id'
			});
		} else {
			response.status(204).send();
		}
	}, function(e) {
		response.status(500).send();
	});
});

// PUT /todos/:id, update items
app.put('/todos/:id', function(request, response) {
	var todoId = parseInt(request.params.id, 10);
	var body = _.pick(request.body, 'description', 'completed');
	var attributes = {};

	// validate item's 'completed' attribute
	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	// validate item's 'description' attribute
	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	// if findById works, first function fired
	// if findById fails, second chained function
	db.todo.findById(todoId).then(function(todo) {
		if (todo) {
			todo.update(attributes).then(function(todo) {
				response.json(todo.toJSON());
			}, function(e) {
				response.status(400).send();
			});
		} else {
			response.status(404).send();
		}
	}, function() {
		response.status(500).send();
	});
});

// start the server
db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});
