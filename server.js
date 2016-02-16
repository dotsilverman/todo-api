var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());

app.get('/', function (request, response) {
	response.send('Todo API Root');
});

// GET /todos?completed=true
app.get('/todos', function (request, response) {
	var queryParams = request.query;
	var filteredTodos = todos;

	if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
		filteredTodos = _.where(filteredTodos, {completed: true});
	} else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
		filteredTodos =_.where(filteredTodos, {completed: false});
	}

	response.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function (request, response) {
	var todoId = parseInt(request.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId}); 

	if (matchedTodo) {
		response.json(matchedTodo);
	} else {
		response.status(404).send();
	}
});

// POST /todos, add a todo item
app.post('/todos', function (request, response) {
	//var body = request.body;
	var body = _.pick(request.body, 'description', 'completed');

	// catch bad request
	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
		return response.status(400).send();
	}

	body.description = body.description.trim();

	// add id field
	body.id = todoNextId++;

	// push body into array
	todos.push(body);

	// test with a post request and then a get request
	console.log('description: ' + body.description);

	response.json(body);
});

// DELETE /todos/:id
app.delete('/todos/:id', function (request, response) {
	var todoId = parseInt(request.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (!matchedTodo) {
		response.status(404).json({"error" : "no todo found with that id"});
	} else {
		todos = _.without(todos, matchedTodo);
		response.json(matchedTodo);
	}
});

// PUT /todos/:id, update items
app.put('/todos/:id', function (request, response) {
	var todoId = parseInt(request.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});
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
	if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		return response.status(400).send();
	} 

	// make the update
	_.extend(matchedTodo, validAttributes);
	response.json(matchedTodo);

});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});