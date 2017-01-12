var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
var todos = [];

//var todoNextId = 1;

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

app.get('/', function(req, res) {
  // console.log(req);
  res.send('Todo API Root');
});

// GET /todos
// GET /todos/:id

app.get('/todos', function(req, res) {
  // var queryParams = _.pick(req.query, "completed");
  // var queryParams = req.query;
  var query = req.query;
  // console.log(query);
  var where = {};

  if (query.hasOwnProperty('completed') && query.completed === 'true') {
    where.completed = true;
  } else if (query.hasOwnProperty('completed') && query.completed ===
    'false') {
    where.completed = false;
  }

  if (query.hasOwnProperty('q') && query.q.length > 0) {
    where.description = {
      $like: '%' + query.q + '%'
    };
  }
  // console.log(where);

  db.todo.findAll({
    where: where
  }).then(function(todos) {
    res.json(todos);
  }, function(e) {
    res.send(500).send(e.message);
  });
  // var filteredTodos = todos;
  // if (queryParams.hasOwnProperty('completed') && queryParams.completed ===
  //   'true') {
  //   filteredTodos = _.where(filteredTodos, {
  //     completed: true
  //   });
  // } else if (queryParams.hasOwnProperty('completed') && queryParams.completed ===
  //   'false') {
  //   filteredTodos = _.where(filteredTodos, {
  //     completed: false
  //   });
  // }
  //
  // if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
  //   filteredTodos = _.filter(filteredTodos, function(todo) {
  //     return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) >
  //       -1;
  //   });
  // }
  // res.json(filteredTodos);
});

app.get('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  db.todo.findById(todoId).then(function(todo) {
    if (todo) {
      res.json(todo.toJSON());
    } else {
      res.status(404).send();
    }
  }, function(e) {
    res.status(500).send(e.message);
  });

  // console.log(todoId);
  // var foundTodo = false;
  // var matchedTodo = _.findWhere(todos, {
  //   id: todoId
  // });

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

  // if (matchedTodo) {
  //   res.json(matchedTodo);
  // } else {
  //   res.status(404).send();
  // }

});

// POST /todos
app.post('/todos', function(req, res) {
  var body = _.pick(req.body, ["completed", "description"]);

  // call create on db.todos
  //  respond with 200 and todo object
  //  if fails, pass in error object
  //  respond with 400
  //  res.status(400).json(e)

  db.todo.create(body).then(function(todo) {
    console.log('Todo created');
    console.log(todo.toJSON());
    res.json(todo.toJSON());
  }).catch(function(e) {
    console.log('Error occurred: ' + e.message);
    res.status(400).send(e.message);
  });


  // if (!_.isBoolean(body.completed) || !_.isString(body.description) || body
  //   .description.trim().length === 0) {
  //   return res.status(400).send(); // 400 means wrong post done
  // }
  //
  // console.log('Description: ' + body.description);
  // console.log('Description lenght: ' + body.description.length);
  //todos.push({id: todoNextId, description: body.description, completed: body.completed});
  //todoNextId++;

  // another way
  // body = _.pick(body, ["description", "completed"]);
  // body.id = todoNextId++;
  // body.description = body.description.trim();
  // todos.push(body);

  // res.json(body);
});

app.delete('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);

  db.todo.destroy({
    where: {
      id: todoId
    }
  }).then(function(numberOfRows) {
    if (numberOfRows > 0) {
      res.status(204).send();
    } else {
      res.status(404).json({
        error: 'No todo with id.'
      });
    }
  }, function(e) {
    res.status(500).send(e.message);
  });
  // var matchedTodo = _.findWhere(todos, {
  //   id: todoId
  // });
  // if (matchedTodo) {
  //   todos = _.without(todos, matchedTodo);
  //   res.json(matchedTodo);
  // } else {
  //   res.status(404).send();
  // }

});

// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
  var todoId = parseInt(req.params.id, 10);
  var body = _.pick(req.body, ["completed", "description"]);
  var attributes = {};

  if (body.hasOwnProperty('completed')) {
    attributes.completed = body.completed;
  }
  if (body.hasOwnProperty('description')) {
    attributes.description = body.description;
  }

  db.todo.findById(todoId).then(function(todo) {
    if (todo) {
      todo.update(attributes).then(function(todo) {
        res.json(todo.toJSON());
      }, function(e) {
        res.status(400).send(e.message);
      });
    } else {
      res.status(404).send();
    }
  }, function(e) {
    res.status(500).send(e.message);
  });
  // var validAttributes = {};
  // var matchedTodo = _.findWhere(todos, {
  //   id: todoId
  // });
  //
  // if (!matchedTodo) {
  //   return res.status(404).send();
  // }
  //
  // if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
  //   validAttributes.completed = body.completed;
  // } else if (body.hasOwnProperty('completed')) {
  //   return res.status(400).send();
  // }
  // if (body.hasOwnProperty('description') && _.isString(body.description) &&
  //   body.description.trim().length > 0) {
  //   validAttributes.description = body.description.trim();
  // } else if (body.hasOwnProperty('description')) {
  //   return res.status(400).send();
  // }
  //
  // _.extend(matchedTodo, validAttributes);
  // return res.json(matchedTodo);

});

db.sequelize.sync().then(function() {
  app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
  });
});

// app.listen(PORT, function() {
//   console.log('Express listening on port ' + PORT + '!');
// });
