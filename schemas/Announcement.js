var mongoose = require('mongoose');

module.exports = new mongoose.Schema({

	
	course_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},

	announcement_text: {
		type: String,
		required: true
	},

	date: {
		type: String,
		required: true
	}

});

