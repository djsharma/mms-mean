var mongoose = require('mongoose');
module.exports = new mongoose.Schema({
	
	topic: {
		type: String,
		required: true
	},

	text: {
		type: String
	},

	profile_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Profile'},

	comment_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
		
});
