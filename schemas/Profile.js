var mongoose = require('mongoose');
module.exports = new mongoose.Schema({
	
	first_name: {
		type: String,
		required: true 
	},

	last_name: {
		type: String,
		required: true
	},

	email: {
		type: String,
		unique: true,
		index: true
		//required: true
	},

	password: {
		type: String,
		required: true
	},

	phno: {
		type: Number,
		unique: true
		//required: false
	},

	details: {
		type: String,
		required: false
	},

	course_id: [{ type: mongoose.Schema.Types.ObjectId,	ref: 'Course'}],
	
	valid: {
		type: Boolean,
		required: true
	}

});


