var mongoose = require('mongoose');
var models = require('../models');

function routerAnnouncement(router_express){

	//add an announcement for course
	router_express.route('/announcement/:course_id')
		.post(function(request,responce){
			var announcement = new models.Announcement;
			announcement.announcement_text = request.body.announcement_text;
			announcement.date = request.body.date;
			announcement.course_id = request.params.course_id;

			announcement.save(function(err,object){
				if(err) {responce.json({messg : 'error_announcement_add',error : err});return;}
				models.Course.findById(request.params.course_id,function(err,course){
					if(course == null) {responce.json({messg : 'error_announcement_course_DOESNOTEXIST'});return;}
							course.announcement_id.push(object.id);
								course.save(function(err){
									if(err) responce.json({messg : 'error_announcement_add',error : err});	
									else{
										//call to notification api here
										responce.json({messg : 'success_announcement_add', resource : object.id});
									}									
								});
				});
			});


		})

	//get all the announcement for the course	
		.get(function(request,responce){
			models.Course.findOne({_id : request.params.course_id}).populate('announcement_id').exec(function(err,course){
				if(course == null) {responce.json({messg : 'error_announcement_course_DOESNOTEXIST'});return;}
				responce.json(course.announcement_id);
			});
		});



	//remove an announcement for cource
	router_express.route('/announcement/:announcement_id')
		.delete(function(request,responce){

			models.Announcement.findById(request.params.announcement_id,function(err,announcement){
				if(err) {responce.json({messg : 'error_announcement_remove',error : err});return;}
				if(announcement==null) {responce.json({messg: 'announcement_not_found'});return;}
				var courseID = announcement.course_id;
				announcement.remove(request.params.announcement_id,function(err){
					if(err) {responce.json({messg : 'error_announcement_remove',error : err});return;}
					models.Course.update({_id: courseID},{ $pullAll : {announcement_id: [request.params.announcement_id]}},function(err){
									if(err) responce.json({messg : 'error_announcement_remove',error : err});
									else{
										responce.json({messg : 'success_announcement_remove'});
									} 
					});
				});
			});

		});
}
exports.routerAnnouncement =routerAnnouncement;