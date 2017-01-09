var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var _ = require('underscore');

var todos = [];

var todoNextId = 1;

// var todos = [{
//   id: 1,
//   description: 'Meet mom for lunch',
//   completed: false,
// }, {
//   id: 2,
//   description: 'Go to market',
//   completed: false
// }, {
//   id: 3,
//   description: 'Take Brad to walk.',
//   completed: true
// }];

app.use(bodyParser.json());

app.get('/', function (req, res) {
  // console.log(req);
  res.send('Todo API Root');
});

// GET /todos
// GET /todos/:id

app.get('/todos', function (req, res) {
  res.json(todos);
});

app.get('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id, 10);
  // console.log(todoId);
  // var foundTodo = false;
  var matchedTodo =_.findWhere(todos, {id: todoId});

  // todos.forEach( function (todo) {
  //   // console.log(todo.id + 'id type: ' + typeof(todo.id));
  //   // if (todoId === todo.id) {
  //   //   // console.log('Found Todo!');
  //   //   res.json(todo);
  //   //   foundTodo = true;
  //   // }
  //
  //   // Andrew's response
  //   if (todoId === todo.id) {
  //     matchedTodo = todo;
  //   }
  // });
  // if (foundTodo === false) {
  //   // console.log('Todo not found.');
  //   res.status(404).send();
  // }

  if (matchedTodo) {
    res.json(matchedTodo);
  } else {
    res.status(404).send();
  }
});


// POST /todos
app.post('/todos', function (req, res) {
  var body = _.pick(req.body, ["completed", "description"]);

  if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {
    return res.status(400).send(); // 400 means wrong post done
  }

  console.log('Description: ' + body.description);
  // console.log('Description lenght: ' + body.description.length);
  //todos.push({id: todoNextId, description: body.description, completed: body.completed});
  //todoNextId++;

  // another way
  // body = _.pick(body, ["description", "completed"]);
  body.id = todoNextId++;
  body.description = body.description.trim();
  todos.push(body);

  res.json(body);
});

app.delete('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id, 10);
  var matchedTodo = _.findWhere(todos, {id: todoId});
  if (matchedTodo) {
    todos = _.without(todos, matchedTodo);
    res.json(matchedTodo);
  } else {
    res.status(404).send();
  }

});

// PUT /todos/:id
app.put('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id, 10);
  var body = _.pick(req.body, ["completed", "description"]);
  var validAttributes = {};
  var matchedTodo = _.findWhere(todos, {id: todoId});

  if (!matchedTodo) {
    return res.status(404).send();
  }

  if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
    validAttributes.completed = body.completed;
  } else if (body.hasOwnProperty('completed')) {
    return res.status(400).send();
  }
  if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
    validAttributes.description = body.description.trim();
  } else if (body.hasOwnProperty('description')) {
    return res.status(400).send();
  }

  _.extend(matchedTodo, validAttributes);
  return res.json(matchedTodo);

});

app.listen(PORT, function () {
  console.log('Express listening on port ' + PORT + '!');
});
