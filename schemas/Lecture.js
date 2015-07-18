var mongoose = require('mongoose');
module.exports = new mongoose.Schema({
		
	course_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Course'},
	
	link: {
		type: String,
		required: false
	},

	posted: {
		type: String,
	},

	details: {
		type: String,
	},

	resource_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Resource'}]

});

