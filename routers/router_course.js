var mongoose = require('mongoose');
var models = require('../models');

function routerCourse(router_express){

	//register a course

	router_express.route('/course')
	// registere a new course	
		.post(function(request,responce){
				//instructor profile id
				var course = new models.Course({
					profile_id : mongoose.Types.ObjectId(request.body.profile_id),
					title : request.body.title,
					details : request.body.details,
					start_date : request.body.start_date,
					end_date : request.body.end_date
				});
				

				course.save(function(err,object){
					if(err){
						responce.json({messg : 'error_reg_course',error : err});
					}else{
						responce.json({messg : 'success_reg_course' , course_id : object.id});
					}
				});
		})


	//get all the courses /////////////////////change it to put request
		.get(function(request,responce){
			//console.log(request.decode);
			models.Course.find(function(err,courses){
				if(err){ responce.json({messg : 'error_get_courses'});}
				else{
					responce.json(courses); //bug give only some details not whole collection to user. improve this(use findOne here)
				}
			}).limit(1);
		});


	router_express.route('/course/:course_id')	
	//get course detail from course_id //////////////////////change it to post request
		.get(function(request,responce){
			models.Course.findById(request.params.course_id,function(err,course_obj){
				if(err) {
					responce.json({messg : 'error_get_course_id'});
				}else{
					responce.json(course_obj);
				}
			});
		})



	//update course details
		.put(function(request,responce){
			models.Course.findById(request.params.course_id,function(err,course_obj){
				if(err) responce.json({messg : 'failed_search_course_id'});
				course_obj.profile_id = request.body.profile_id;
				course_obj.details = request.body.details;
				course_obj.title = request.body.title;
				course_obj.start_date = request.body.start_date;
				course_obj.end_date = request.body.end_date;

				course_obj.save(function(err){
					if(err) {
						responce.json({messg : 'error_update_course'});
					}else{
						responce.json({messg : 'success_update_course'});
					}
				});
			});
		})

	// delete a course /bugs to be solved 
		.delete(function(request,responce){

			//bug to edit

			//remove all the lectures first
			//remove all the resources
			//remove all the announcement
			//remove all the assessments and submissions

			models.Course.remove(request.params.course_id,function(err){
				if(err)
				responce.json({messg : 'error_course_delete'});
				else
				responce.json({messg : 'success_course_delete'});
			});


		});

}

exports.routerCourse = routerCourse;
