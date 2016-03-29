var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Define Schema - data types cna be
//String, Number, Date, Boolean...
var taskSchema = new Schema ({
	name : String,
	completed : Boolean
});

//Compile schema into a Mongoose model
var Task = mongoose.model('Task', taskSchema);

//And provide as an export. Other parts of code will
//be able to work with Task objects
module.exports = Task;