var mongoose = require('mongoose');
module.exports= new mongoose.Schema({
	
	
	profile_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile'}],

	student_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile'}],

	lecture_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lecture'}], 

	resource_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resource'}], 

	assessment_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assessment'}], 

	announcement_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Announcement'}], 

	title: {
		type: String,
		required: true
	},

	details: {
		type: String,
	},

	start_date: {
		type: String,
		required: true
	},

	end_date: {
		type: String,
		required: true
	}

});
