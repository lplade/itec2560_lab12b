var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;


/** All incomplete tasks
 * Creates a list of all tasks which are not completed */
router.get('/', function(req, res, next){

  req.db.tasks.find({
    completed:false
  }).toArray(function(error, tasklist){
    if (error) {
      return next(error);
    }
    /*tasks : tasks || []
     means if tasklist is true (has a value, not undefined or false)
     set tasks to tasklist; else set it to empty array []  */
    var allTasks = tasklist || [];
    res.render('tasks', {title: "TODO", tasks: allTasks });
  })
});


/*** Adds a new task to the database then redirects to task list */
router.post('/addtask', function(req, res, next) {

  if (!req.body || !req.body.task_name) {
    return next(new Error('no data provided'));
  }

  req.db.tasks.save({ name : req.body.task_name, completed: false }, function(error, task){
    if (error) {
      return next(error);
    }
    if (!task) {
      return next(new Error('error saving new task'));
    }
    res.redirect('/tasks');  //redirect to list of tasks
  });
});


/*  Get all of the completed tasks. */
router.get('/completed', function(req, res, next){

  req.db.tasks.find({completed:true}).toArray(function(error, tasklist){
    if (error) {
      return next(error);
    }
    res.render('tasks_completed', { title:'Completed', tasks: tasklist || [] })
  });
});


/**Set all tasks to completed, display empty tasklist */
router.post('/alldone', function(req, res, next){

  req.db.tasks.updateMany({completed: false }, {$set: { completed:true }}, function(error, count) {
    if (error) {
      console.log('error ' + error);
      return next(error);
    }
    res.redirect('/tasks');
  });
});


//This gets called for any routes with url parameters e.g. DELETE and POST tasks/taskID
//This is REALLY HELPFUL because it provides a task object (_id, name, completed) as
//attribute of req object.
//Order matters - this is located here so it doesn't operate on the methods above.

router.param('task_id', function(req, res, next, taskId){
  console.log("params being extracted from URL for " + taskId );
  //Request task matching this ID, limit to one result.
  req.db.tasks.find( { _id : ObjectID(taskId) }).limit(1).toArray(function(error, task){
    if (error) {
      console.log('param error '+ error);
      return next(error);
    }
    if (task.length != 1) {
      return next(new Error(task.length + ' tasks found, should be 1'));
    }
    req.task = task[0];
    return next();

  });
});

/* Complete a task. POST to /tasks/task_id
 Set task with specific ID to completed = true  */
router.post('/:task_id', function(req, res, next) {

  if (!req.body.completed) {
    return next(new Error('body missing parameter?'))
  }

  req.db.tasks.updateOne({_id: ObjectID(req.task._id)}, {$set :{completed:true}}, function(error, result){
    if (error) {
      return next(error);
    }
    res.redirect('/tasks')
  });
});



/* deleteTask
 Delete task with particular ID from database. This is called with AJAX */
router.delete('/:task_id', function(req, res, next) {

  req.db.tasks.remove({_id: ObjectID(req.task._id)}, function(error, result){
    if (error) {
      return next(error);
    }
    res.sendStatus(200); //send success to AJAX call.
  });
});






module.exports = router;
