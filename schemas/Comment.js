var mongoose = require('mongoose');
module.exports = new mongoose.Schema({

	topic_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Forum'},
	
	profile_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Profile'},
	
	comment: {
		type: String,
	}

});

