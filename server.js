var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
	id: 1,
	description: 'Meet mom for lunch',
	completed: false
}, {
	id: 2,
	description: 'Go to market',
	completed: false
}, {
	id: 3,
	description: 'Do udacity course',
	completed: true
}];

app.get('/', function (request, response) {
	response.send('Todo API Root');
});

app.get('/todos', function (request, response) {
	response.json(todos);
});

app.get('/todos/:id', function (request, response) {
	var todoId = parseInt(request.params.id, 10);
	var matchedTodo;

	todos.forEach(function (todo) {
		if (todoId === todo.id) {
			matchedTodo = todo;
		}

	});

	if (matchedTodo) {
		response.json(matchedTodo);
	} else {
		response.status(404).send();
	}

	// response.send('Asking for todo with id of ' + request.params.id);
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});