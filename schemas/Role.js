var mongoose = require('mongoose');
module.exports = new mongoose.Schema({

	profile_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
	course_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Course'}],
	role_type: {
		type: String,
		require: true,
	}

});
