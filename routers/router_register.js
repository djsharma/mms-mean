//register a course
//register for a course

var models = require('../models');
var Profile = models.Profile;
var mongoose = require('mongoose');


function routerRegister(router_express){
	
//register for an existing course 
	router_express.route('/register/:course_id')
		//register for an existing course work
		.post(function(request,responce){
			
			models.Profile.findById(request.decode,function(err,user){
				user.course_id.push(request.params.course_id); 
				user.save(function(err){
					if(err) responce.json({messg : 'error_reg_course',error : err});
					else{

							models.Course.findById(request.params.course_id,function(err,course){
							course.student_id.push(request.decode);
								course.save(function(err){
									if(err) responce.json({messg : 'error_reg_course',error : err});	
									else{
										responce.json(user);
									}									
								});
							});
					}
				});
			});
		});	



//drop an existing course
	router_express.route('/register/:course_id')
		.delete(function(request,responce){
			var profile_id = request.decode;
			
			models.Profile.update({ _id : profile_id},{ $pullAll: {course_id: [request.params.course_id]}  },function(err,rawResponse){
					
					if(err) responce.json({ messg : 'error_drop_course', error : err});
					else{
							
						models.Course.update({_id: request.params.course_id},{ $pullAll: {student_id: [profile_id]} },function(err){
							if(err) responce.json({ messg : 'error_drop_course', error : err});
							else{
									responce.json({ messg : 'success_drop_course' ,responce : rawResponse});
							}
						});
					}
			} );	
			
		});
	
		
}

exports.routerRegister=routerRegister;