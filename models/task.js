var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

//Define Schema - data types cna be
//String, Number, Date, Boolean...
var taskSchema = new Schema ({
	name : String,
  completed : Boolean,

  /* A reference to the User object who created this task
   It is possible to populate this field with all of the
   details of the User object: look up the populate() function */

  _creator : { type : ObjectId, ref : 'User' }

});

//Compile schema into a Mongoose model
var Task = mongoose.model('Task', taskSchema);

//And provide as an export. Other parts of code will
//be able to work with Task objects
module.exports = Task;