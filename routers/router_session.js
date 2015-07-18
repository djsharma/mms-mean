var models = require('../models');
var profile = new models.Profile;

function routerSession(router_express){
	/*
	router_express.route('/login')
		//check the mongoose model for username and password  and change this to post methode
		.post(function(request,responce){

				models.Profile.find({email : request.body.email},function(err,user){
					
					if(err) {
						responce.json({messg : 'error_login'});
					}
					else{


							if(user.length > 0)
							{	
								if((request.body.email).localeCompare(user[0].email) == 0){
										request.session.profileID =  user[0].id;
										//console.log(user[0].id);
										responce.json({messg : 'success_login', profile_id : user[0].id});
								}
								else{
								responce.json({messg : 'failed_login'});	
								}

							}
							else{
								responce.json({messg : 'failed_noMatching'});	
							}	
						
					}
					
				});


				
		});

	router_express.route('/logout')
		
		.get(function(request,responce){
				
				request.session.destroy(function(err){
				if(err)	
					responce.json({messg : 'error'});
				else
					responce.json({messg : 'succcess_logout'});
				});
				

		});	
	*/

	//IMPORTANT OPEN THIS TO CREATE PROFILE

	/*router_express.route('/profile')
		
	//creating a new profile	
		.post(function(request,responce){
				
				profile.first_name = request.body.first_name;
				profile.last_name = request.body.last_name;
				profile.email = request.body.email;
				profile.phno = request.body.phno;
				profile.details = request.body.details;
				profile.password = request.body.password;
				profile.valid = true;

				profile.save(function(err,object){
					if(err)
						responce.json({messg : 'error_regprofile', error : err});
					else
					{
						//console.log(object.id);
						responce.json({messg : 'success_regprofile', profile_id : object.id});
					}
				});

				//responce.json({messg : 'success in home data extraction'});
		});
*/
	router_express.route('/profile/:profile_id')
	//get the user profile by ID //////////////////////////////////////////////////////////////////////////
	.get(function(request,responce){
		models.Profile.findById(request.params.profile_id,function(err,user){
			if(err)
				responce.json({messg : 'err_get_profile'});

			responce.json({
				first_name : user.first_name,
				last_name : user.last_name,
				email : user.email,
				phno : user.phno,
				details : user.details
			});

		});
	})

	//delete an existing profile //delete all the  data related to profile_id bugs
	.delete(function(request,responce){
		

		models.Profile.findById(request.params.profile_id,function(err,profile){

			profile.valid = false;
			profile.save(function(err){
				if(err)
					responce.json({messg : 'error_profile_delete'});
				else
					responce.json({messg : 'success_profile_delete'});
			});

			/*
			profile.remove(request.params.profile_id,function(err){
				if(err)
					responce.json({messg : 'error_profile_delete'});
				else
					responce.json({messg : 'success_profile_delete'});
			});
			*/
		});


	})


	//updating an existing profile
		.put(function(request,responce){
				//console.log(request.params.profile_id);
				models.Profile.findById(request.params.profile_id,function(err,user){
					if(err)
						responce.json({messg : 'err_profile_updation'});

					user.first_name = request.body.first_name;
					user.last_name = request.body.last_name;
					user.email = request.body.email;
					user.phno = request.body.phno;
					user.details = request.body.details;
					user.password = request.body.password;

					user.save(function(err){
						if(err){
							responce.json({messg : err});
						}else{
							responce.json({messg : 'success_update'});
						}
					});

				});

		});	

		
}

exports.routerSession=routerSession;
