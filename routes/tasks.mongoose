var express = require('express');
var router = express.Router();

var Task = require('./../models/task.js');  //Specify model used


/*** All incomplete tasks
 * Creates a list of all tasks which are not completed */
router.get('/', function(req, res, next){

  Task.find({completed:false}, function(error, allTasks) {
    if (error) {
      return next(error);
    }
    res.render('tasks', {title : 'TODO', tasks : allTasks});
  });
});


/*** Adds a new task to the database then redirects to task list */
router.post('/addtask', function(req, res, next) {

  if (!req.body || !req.body.task_name) {
    return next(new Error('no data provided'));
  }

  //Create a new task by instantiating a Task object...
  var newTask = Task({ name : req.body.task_name, completed: false });

  //Then call the save method to save it to the database. Note callback.
  newTask.save(function(err){
    if (err) {
      return next(err);
    } else {
      res.redirect('/tasks');
    }
  });
});


/**  Get all of the completed tasks. */
router.get('/completed', function(req, res, next){

  Task.find({completed:true}, function(error, tasklist){
    if (error) {
      return next(error);
    }
    res.render('tasks_completed', { title:'Completed', tasks: tasklist || [] })
  });
});


/**Set all tasks to completed, display empty tasklist */
router.post('/alldone', function(req, res, next){

  //req.db.tasks.updateMany({completed: false }, {$set: { completed:true }}, function(error, count) {
   Task.update( {completed : false }, {completed : true} , {multi : true}, function(error, response){
    if (error) {
      console.log('error ' + error);
      return next(error);
    }
    res.redirect('/tasks');
  });
});


/**This gets called for any routes with url parameters e.g. DELETE and POST tasks/taskID
 This is really helpful because it provides a task object (_id, name, completed) as req.task
 Order matters here. This is beneath the other routes, but above routes which need the parameter.
 Otherwise it would be called for /tasks/completed which we don't want to do '/completed' isn't an id.
 */
router.param('task_id', function(req, res, next, taskId) {

  console.log("params being extracted from URL for " + taskId);

  Task.findById(taskId, function (err, task) {
    if (err) {
      return next(err);
    }
    req.task = task;
    return next();

  });
});


/** Complete a task. POST to /tasks/task_id
 Set task with specific ID to completed = true  */
router.post('/:task_id', function(req, res, next) {

  if (!req.body.completed) {
    return next(new Error('body missing parameter?'))
  }

  Task.findByIdAndUpdate(req.task._id, {completed:true}, function(error, result){
    if (error) {
      return next(error);
    }
    res.redirect('/tasks')
  });
});


/** deleteTask
 Delete task with particular ID from database. This is called with AJAX */
router.delete('/:task_id', function(req, res, next) {

  Task.findByIdAndRemove(req.task._id, function(error, result) {
    if (error) {
      return next(error);
    }
    res.sendStatus(200); //send success to AJAX call.
  });
});



module.exports = router;
