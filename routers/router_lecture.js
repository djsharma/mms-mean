var models = require('../models');
var mongoose = require('mongoose');

function routerLecture(router_express){
	//add lecture for course registered course_id 
	
	router_express.route('/lecture/:course_id')

		.post(function(request,responce){
			
			models.Course.findById(request.params.course_id,function(err,course){
				if(err) responce.json({messg: 'error_lecture_add',error : err});
				else{
					//first add lecture in db then update in course
					var lecture = new models.Lecture;
					lecture.link = request.body.link;
					lecture.details = request.body.details;
					lecture.posted = request.body.posted;
					lecture.course_id = request.params.course_id;

					lecture.save(function(err,object){
						if(err) responce.json({messg : 'error_lecture_add',error : err});
						else{
							//lecture added in db now update in course
							course.lecture_id.push(object.id);
							course.save(function(err){
								if(err) responce.json({messg : 'error_lecture_add',error : err});
								else{
									responce.json({messg : 'success_lecture_add'});
								} 								
							});

						}
					});
				}
			});

		})




	//get all the lectures for course_id ////////////////////////////put
		.get(function(request,responce){
			models.Course.findOne({_id : request.params.course_id}).populate('lecture_id').exec(function(err,course){
				responce.json(course.lecture_id);
			});
		});




	//remove lecture by lecture_id
	router_express.route('/lecture/:lecture_id')

		.delete(function(request,responce){
			
			
			models.Lecture.findById(request.params.lecture_id,function(err,lecture){
				if(err) responce.json({messg : 'error_lecture_remove',error : err});
				else {
						var course_id = lecture.course_id;
						lecture.remove(request.params.lecture_id,function(err){
							if(err) responce.json({messg : 'error_lecture_remove',error : err});
							else{
								models.Course.update({_id: course_id},{ $pullAll : {lecture_id: [request.params.lecture_id]}},function(err){
									if(err) responce.json({messg : 'error_lecture_remove',error : err});
									else{
										responce.json({messg : 'success_lecture_remove'});
									} 
								});
							}
						});
				}
			});
		});
}

exports.routerLecture = routerLecture; 
