// This module defines the databases used by the Todo API
// First the require the modules and env variables

var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize; // Creates a sequelize instance

// var sequelize = new Sequelize(undefined, undefined, undefined, {
//   'dialect': 'sqlite',
//   'storage': __dirname + '/data/dev-todo-api.sqlite'
// });

// This checks if this is running at local env (dev) or Heroku (prod)
if (env === 'production') {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres'
  });
} else {
  sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/data/dev-todo-api.sqlite'
  });
}

// This defines the database object
var db = {};

// Configures the databases of this instance, the todo and users database
// Importing their modules to the db object
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.user = sequelize.import(__dirname + '/models/user.js');
db.token = sequelize.import(__dirname + '/models/token.js');
db.sequelize = sequelize; // Adds the sequelize to the db object
db.Sequelize = Sequelize; // Adds the Sequelize modules to the db object

// Configure the relationship between user and todo
// A todo belongs to a user and the user may have many todos
db.todo.belongsTo(db.user);
db.user.hasMany(db.todo);

// Then export the db object, which has the modules and configs of the
// todo and users databases and sequelize modules
module.exports = db;
