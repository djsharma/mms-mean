var mongoose = require('mongoose');
module.exports = new mongoose.Schema({

	assessment_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Assessment'}],

	profile_id: [{type: mongoose.Schema.Types.ObjectId, ref: 'Profile'}],

	marks: {
		type: Number
	},

	exempted: {
		type: Boolean 
	}

}); 

