/*
db.js:
ceates a new sqlite database
loads todo model
exports a db object which has todo model, sequelize instance, and sequelize library
*/

var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sequelize;

// environment variables
// if env = production, run on heroku, else, run in sqlite database
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

var db = {};

// load sequelize models
db.todo = sequelize.import(__dirname + '/models/todo.js');
db.user = sequelize.import(__dirname + '/models/user.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
