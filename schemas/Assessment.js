var mongoose = require('mongoose');
module.exports = new mongoose.Schema({
	
	asssessment_name: {
		type: String,
		required: true
	},

	details: {
		type: String
	},

	course_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Course' },

	max_marks: {
		type: Number
	},

	weightage: {
		type: Number
	},

	date_of_assess: {
		type: Number
	},

	
	time_of_assess: {
		type: Number
	},
	
	duration: {
		type: Number
	}

});
 
