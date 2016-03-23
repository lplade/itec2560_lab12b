var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

//This gets called for any routes with url parameters
//...

router.param('task_id', function(req, res, next, taskId){
	console.log("params being extracted from URL for " + taskId );
	//Request task matching this ID, limit to one result.
	req.db.tasks.find( {_id: ObjectID(taskId) }).limit(1).toArray(function(error, task){
		if (error) {
			console.log('param error ' + error);
			return next(error);
		}
		if (task.length != 1) {
			return next(new Error(task.length + ' tasks found, should be 1'));
		}
		req.task = task[0];
		return next();
	});
});

module.exports = router;