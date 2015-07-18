var mongoose = require('mongoose');
var models = require('../models');

function routerAssessment(router_express){
	//add an assessment for course
	
	router_express.route('/assessment/:course_id')
		.post(function(request,responce){
			var assessment = new models.Assessment;
			assessment.asssessment_name = request.body.asssessment_name;
			assessment.details = request.body.details;
			assessment.course_id = request.params.course_id;
			assessment.max_marks = request.body.max_marks;
			assessment.weightage = request.body.weightage;
			assessment.date_of_assess = request.body.date_of_assess;
			assessment.time_of_assess = request.body.time_of_assess;
			assessment.duration = request.body.duration;

			assessment.save(function(err,object){
				if(err) responce.json({messg : 'error_assessment_add',error : err});
				else{
					
					models.Course.findById(request.params.course_id,function(err,course){
							if(course == null) {responce.json({messg : 'error_assessment_course_DOESNOTEXIST'});return;}
							course.assessment_id.push(object.id);
								course.save(function(err){
									if(err) responce.json({messg : 'error_assessment_add',error : err});	
									else{
										responce.json({messg : 'success_assessment_add', resource : object.id});
									}									
								});
					});
				}
			});	
		})

	//get all the assessments
		.get(function(request,responce){
			models.Course.findOne({_id : request.params.course_id}).populate('assessment_id').exec(function(err,course){
				responce.json(course.assessment_id);
			});
		});

	



	//update an assesssment 
	router_express.route('/assessment/:assessment_id')
		.put(function(request,responce){
			models.Assessment.findById(request.params.assessment_id,function(err,assessment){
				if(err) {responce.json({messg : 'error_assessment_update',error : err});return;}
				if(assessment == null) {responce.json({messg : 'assessment_NOTAVAILABLE'}); return;}
				assessment.asssessment_name = request.body.asssessment_name;
				assessment.details = request.body.details;
				assessment.max_marks = request.body.max_marks;
				assessment.weightage = request.body.weightage;
				assessment.date_of_assess = request.body.date_of_assess;
				assessment.time_of_assess = request.body.time_of_assess;
				assessment.duration = request.body.duration;
			
				assessment.save(function(err,object){
					if(err) {responce.json({messg : 'error_assessment_update',error : err}); return;}
					responce.json({messg : 'success_assessment_update'});
				});
			});
		})
	
	//delete an assessment for course

		.delete(function(request,responce){
			models.Assessment.findById(request.params.assessment_id,function(err,assessment){
				if(err) {responce.json({messg : 'error_assessment_remove',error : err});return;}
				if(assessment==null) {responce.json({messg: 'assessment_not_found'});return;}
				var courseID = assessment.course_id;
				assessment.remove(request.params.assessment_id,function(err){
					if(err) {responce.json({messg : 'error_assessment_remove',error : err});return;}
					models.Course.update({_id: courseID},{ $pullAll : {assessment_id: [request.params.assessment_id]}},function(err){
									if(err) responce.json({messg : 'error_assessment_remove',error : err});
									else{
										responce.json({messg : 'success_assessment_remove'});
									} 
					});
				});
			});
		});
	
	//submit an assessment

		router_express.route('/submission/:assessment_id')
			.post(function(request,responce){
				var submission = new models.Submission;
				submission.submission_date = request.body.submission_date;
				submission.assessment_id = request.params.assessment_id;
				submission.profile_id = request.decode;

				submission.save(function(err,object){
					if(err) {responce.json({messg : 'error_assessment_update',error : err}); return;}
					responce.json({messg : 'success_submission_submit'});
				});
			})		
	//get all submission for an assessment

			.get(function(request,responce){
				models.Submission.findOne({assessment_id : request.params.assessment_id},'profile_id submission_date',function(err,submission){
					if(err) {responce.json({messg : 'error_reading_submission',error : err}); return;}
					
					responce.json(submission);
				});
			});
	//delete submission
		router_express.route('/submission/:submission_id')
			.delete(function(request,responce){
				
				models.Submission.findById(request.params.submission_id,function(err,submission){
					if(err) {responce.json({messg : 'error_reading_submission',error : err}); return;}
					if(submission == null) {responce.json({messg : 'submissions_NOTAVAILABLE'}); return;}	
					submission.remove(request.params.submission_id,function(err){
						if(err) {responce.json({messg : 'error_reading_submission',error : err}); return;}
						responce.json({messg : 'success_submission_remove',submissionID : request.params.submission_id});
					});

				});
			});		

}
exports.routerAssessment =routerAssessment;