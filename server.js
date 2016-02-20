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
	db.todo.findById(todoId).then(function(todo) {
		if (!!todo) {
			todo.destroy();
		} else {
			response.status(404).send();
		},
		function(e) {
			response.status(500).send();
		}
	});

	// var todoId = parseInt(request.params.id, 10);
	// var matchedTodo = _.findWhere(todos, {
	// 	id: todoId
	// });
	//
	// if (!matchedTodo) {
	// 	response.status(404).json({
	// 		"error": "no todo found with that id"
	// 	});
	// } else {
	// 	todos = _.without(todos, matchedTodo);
	// 	response.json(matchedTodo);
	// }
});

// PUT /todos/:id, update items
app.put('/todos/:id', function(request, response) {
	var todoId = parseInt(request.params.id, 10);
	var matchedTodo = _.findWhere(todos, {
		id: todoId
	});
	var body = _.pick(request.body, 'description', 'completed');
	var validAttributes = {};

	if (!matchedTodo) {
		return response.status(404).send();
	}

	// validate item's 'completed' attribute
	if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
		validAttributes.completed = body.completed;
	} else if (body.hasOwnProperty('completed')) {
		return response.status(400).send();
	}

	// validate item's 'description' attribute
	if (body.hasOwnProperty('description') && _.isString(body.description) &&
		body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return response.status(400).send();
	}

	// make the update
	_.extend(matchedTodo, validAttributes);
	response.json(matchedTodo);

});

// start the server
db.sequelize.sync().then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});
