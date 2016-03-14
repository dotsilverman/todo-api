var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
    'dialect' : 'sqlite',
    'storage' : __dirname + '/basic-sqlite-database.sqlite'
});

// define Todo object and attributes for database
var Todo = sequelize.define('todo', {
    description : {
        type : Sequelize.STRING,
        allowNull : false,
        validate : {
            len : [1, 250]
        }
    },
    completed : {
        type : Sequelize.BOOLEAN,
        allowNull : false,
        defaultValue : false
    }
});

var User = sequelize.define('user',{
    email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

/* Promises we are doing in order:
* add entries to database
* find entry by description
* print each entry
* catch error
*/
sequelize.sync({
    force: true
}).then(function () {
    console.log('Everything is synced');

    User.create({
        email: 'dot@example.com'
    }).then(function () {
        return Todo.create({
            description: 'Clean yard'
        });
    }).then(function (todo) {
        User.findById(1).then(function (user) {
            user.addTodo(todo);
        });
    });
});
