var mongoose = require('mongoose');
var models = require('../models');

function routerForum(router_express){
	//create a topic
	router_express.route('/topic')
		.post(function(request,response){
			console.log('found here');
			var topic = new models.Forum;
			topic.topic = request.body.topic;
			topic.text = request.body.text;
			topic.profile_id = request.decode;

			topic.save(function(err,object){
				if(err) {response.json({messg : 'error_topic_add',error : err}); return;}
				response.json({messg : 'success_topic_add', topicID : object.id});
			});
		});
	

	//create a comment for topic 
	router_express.route('/comment/:topic_id')
		.post(function(request,response){
			
			var comment = new models.Comment;
			comment.comment = request.body.comment;
			comment.profile_id = request.decode;
			comment.topic_id = request.params.topic_id;

			comment.save(function(err,object){
				if(err) {response.json({messg : 'error_comment_add',error : err}); return;}
				
				models.Forum.findById(request.params.topic_id,function(err,topic){
					if(err) {response.json({messg : 'error_topic_search',error : err}); return;}
					if(topic == null) {response.json({messg : 'error_topic_null'}); return;}
					topic.comment_id.push(object.id);
					topic.save(function(err){
						if(err) {response.json({messg : 'error_comment_add',});return;}
						response.json({messg : 'success_comment_add',commentID : object.id});	
					});
				});

			});

		});
	
	//get all topic ////////////////////////////////////////////////////////////////////////////////////////////
	router_express.route('/topic')
		.get(function(request,response){
			models.Forum.find(function(err,topics){
				if(err) {
					response.json({messg :'error_get_topics',error : err});
				}else{
					response.json(topics);
				}

			});
		});
	

	//get all comment for topic //////////////////////////////////////////////////////////////////////////////////
	router_express.route('/comment/:topic_id')
		.get(function(request,response){
			
			models.Forum.findOne({_id : request.params.topic_id}).populate('comment_id').exec(function(err,topic){
				if(topic == null) {response.json({messg : 'error_comment_topic_DOESNOTEXIST'});return;}
				response.json(topic.comment_id);
			});

		});
	

	//update a topic
	router_express.route('/topic/:topic_id')
		.put(function(request,response){
			models.Forum.findById(request.params.topic_id,function(err,topic){
				if(err) {response.json({messg : 'error_topic_search',error : err}); return;}
				if(topic == null) {response.json({messg : 'error_topic_DOESNOTEXIST'});return;}
				//if(topic.profile_id != request.decode) {response.json({messg : 'error_topic_edit_session'});return;}
				topic.topic = request.body.topic;
				topic.text = request.body.text;

				topic.save(function(err,object){
					//if(err) {response.json({messg : 'error_topic_edit'}); return;}
					response.json({messg : 'success_topic_edit'});
				});

			});

		})
	//delete a topic
		.delete(function(request,response){

			// remove all the comments for topic
			//remove the topic

			models.Forum.findById(request.params.topic_id,function(err,topic){

				if(err) {response.json({messg : 'error_topic_search',error : err}); return;}
				if(topic == null) {response.json({messg : 'error_topic_DOESNOTEXIST'});return;}
				//if(topic.profile_id != request.decode) {response.json({messg : 'error_topic_delete_session'});return;}

				//loop and delete comments
				
				var arrayLength = topic.comment_id.length;
				var array = topic.comment_id;
				for(var i = 0; i < arrayLength; i++){
					models.Comment.findById(array[i],function(err,comment){
							comment.remove();
					});
				}
				
				topic.remove(function(err){
					if(err) {response.json({messg : 'error_topic_remove',error : err}); return;}
					response.json({messg : 'success_topic_remove'});
				});


			});

			

		});
	

	//update a comment for topic 
	router_express.route('/comment/:comment_id')
		
		.put(function(request,response){
			
			models.Comment.findById(request.params.comment_id,function(err,comment){

				if(err) {response.json({messg : 'error_comment_search',error : err}); return;}
				if(comment == null) {response.json({messg : 'error_comment_DOESNOTEXIST'});return;}
				//if(comment.profile_id != request.decode) {response.json({messg : 'error_comment_edit_session'});return;}
				
				comment.comment = request.body.comment;
				comment.save(function(err){
					if(err) {response.json({messg : 'error_comment_edit',error : err});return;}
					response.json({messg : 'success_comment_edit'});
				});



			});

		})

	//delete a comment for topic	
		.delete(function(request,response){

			models.Comment.findById(request.params.comment_id,function(err,comment){
				
				if(err) {response.json({messg : 'error_comment_remove'}); return;}
				if(comment == null) {response.json({messg : 'comment_NOTFOUND'}); return;}
				var topicID = comment.topic_id;
				
				comment.remove(request.params.comment_id,function(err,comment){
					if(err) {response.json({messg : 'error_comment_remove'});  return;}
					if(comment == null) {response.json({messg : 'comment_NOTFOUND'});  return;}		
						
						
						models.Forum.update({_id: topicID},{ $pullAll : {comment_id: [request.params.comment_id]}},function(err){
									if(err) response.json({messg : 'error_comment_remove',error : err});
									else{
										response.json({messg : 'success_comment_remove'});
									} 
						});
						
				});
			});
		});

}
exports.routerForum =routerForum;
