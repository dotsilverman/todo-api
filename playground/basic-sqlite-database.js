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

/* Promises we are doing in order:
add entries to database
find entry by description
print each entry
catch error
*/
sequelize.sync({
    // force: true
}).then(function () {
    console.log('Everything is synced');

    // fetch todo object if find print JSON to screen
    // otherwise print an error saying todo not found
    Todo.findById(3).then(function (todo) {
        if (todo) {
            console.log(todo.toJSON());
        } else {
            console.log('no todo found');
        }
    }).catch(function (e) {
        console.log(e);
    })

   //  Todo.create({
   //      description : 'Take out trash',
   //      completed : false
   //  }).then(function (todo) {
   //      return Todo.create({
   //          description : 'Clean office'
   //      });
   // }).then(function () {
   //  //    return Todo.findById(1)
   //      return Todo.findAll({
   //          where : {
   //              description : {
   //                  $like : '%Office'
   //              }
   //          }
   //      });
   // }).then(function (todos) {
   //     if (todos) {
   //         todos.forEach(function (todo) {
   //             console.log(todo.toJSON());
   //         });
   //     } else {
   //         console.log('no todo found');
   //     }
   //  }).catch(function (e) {
   //      console.log(e);
   //  });
});
