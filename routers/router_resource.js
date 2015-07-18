var mongoose = require('mongoose');
var models = require('../models');

function routerResource(router_express){
//add resource and provide link to course
//update resource 
//delete a resource and remove link from course
//get all the resource for course


	router_express.route('/resource/:course_id')
		//add a resource and provide link in course
		.post(function(request,responce){
			var resource = new models.Resource;
			resource.links = request.body.links;
			resource.descript = request.body.descript;
			resource.course_id = request.params.course_id;
			resource.save(function(err,object){
				if(err) resource.json({messg : 'error_resource_add',error : err});
				else{
					
					models.Course.findById(request.params.course_id,function(err,course){
							course.resource_id.push(object.id);
								course.save(function(err){
									if(err) responce.json({messg : 'error_resource_add',error : err});	
									else{
										responce.json({messg : 'success_resource_add', resource : object.id});
									}									
								});
					});
				}
			});

		})

	//get all the resources for course
		.get(function(request,responce){
			models.Course.findOne({_id : request.params.course_id}).populate('resource_id').exec(function(err,course){
				responce.json(course.resource_id);
			});
		});





	//update a resource
	router_express.route('/resource/:resource_id')
	//update a resource
		.put(function(request,responce){
			models.Resource.findById(request.params.resource_id,function(err,resource){
				if (err) {responce.json({messg : 'error_resource_search',error : err}); return;}
				if(resource == null) {responce.json({messg : 'resource_NOTAVAILABLE'}); return;}
				
					resource.links = request.body.links;
					resource.description = request.body.description;
					resource.save(function(err){
						if(err) responce.json({messg : 'error_resource_update',error : err});
						else{
							responce.json({messg : 'success_resource_update'});
						}
					});
				
			});
		})	

	//delete the resource
		.delete(function(request,responce){
			models.Resource.findById(request.params.resource_id,function(err,resource){
				if (err) responce.json({messg : 'error_resource_search',error : err});
				else{
					if (resource == null) {responce.json(err);return;}
					var courseID = resource.course_id;

					resource.remove(request.params.resource_id,function(err){
						if (err) responce.json({messg : 'error_resource_remove',error : err});
						else{
								models.Course.update({_id: courseID},{ $pullAll : {resource_id: [request.params.resource_id]}},function(err){
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

exports.routerResource = routerResource;