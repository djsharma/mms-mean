var mongoose = require('mongoose');
module.exports = new mongoose.Schema({
	notification_id: {
		type: Number,
		unique: true,
		required: true
	},

	course_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}],

	notification_text: {
		type: String
	}
}); 

