var session = require('express-session');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();
var express = require('express');
var router_express = express.Router();
var models = require('./models');
var hash = require('blueimp-md5');



var router_session=require('./routers/router_session.js');
var router_register = require('./routers/router_register.js');
var router_course = require('./routers/router_course.js');
var router_lecture = require('./routers/router_lecture.js');
var router_resource = require('./routers/router_resource.js');
var router_assessment = require('./routers/router_assessment.js');
var router_announcement = require('./routers/router_announcement.js');
var router_forum = require('./routers/router_forum.js');

var secret = 'XARF235HPCKTM';


module.exports = function(app){
	
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan('dev'));
//--------------------Tokenize------------------------------------------------------------

	

	router_express.route('/authenticate')
		.post(function(request,responce){
			
			//console.log(request.headers['token'] );
			models.Profile.find({email : request.body.email},function(err,user){
					
					if(err) {
						responce.json({messg : 'ERROR_AUTH'});
					}
					else{
							if(user.length > 0)
							{	
								if((request.body.email).localeCompare(user[0].email) == 0){
										if(hash.md5((request.body.password)).localeCompare(user[0].password) != 0) {responce.json({messg : 'ERROR_AUTH'}); return;}

										var token = jwt.sign(user[0]._id,secret);
										// set the cookie here
										responce.cookie('token',token);
										//responce.setHeader('token',token);
										responce.json({success : true,messg : 'SUCCESS_AUTH',token : token});
								}
								else{
								responce.json({messg : 'ERROR_AUTH'});	
								}

							}
							else{
								responce.json({messg : 'ERROR_AUTH'});	
							}	
					}
					
				});
			
		});
	
	//-----------------------------------create profile and get token---------------------------------	

	router_express.route('/profile')
		
	//creating a new profile	
		.post(function(request,responce){
				var profile = new models.Profile;		
				profile.first_name = request.body.first_name;
				profile.last_name = request.body.last_name;
				profile.email = request.body.email;
				profile.phno = request.body.phno;
				profile.details = request.body.details;
				profile.password = hash.md5(request.body.password);
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


	//----------------------------------------------------------------------------------

//IMPORTANT
	router_express.use(function(request,responce,next){

		// this line to update to get cookie token
		//console.log(request.cookies['token']);
		var token = request.cookies['token'];
		//var token = request.headers['token'];

		/*if(token){
			jwt.verify(token,secret,function(err,decode){
				if(err){
					responce.json({messg : 'FAILED_AUTH',error : err});
				}else{

					request.decode =decode;
					next();
				}
			});
			next();
		}else{
				return	responce.status(403).send({messg : 'FAILED_AUTH', error : 'TOKEN_NOTFOUND'});			
		}*/
		next();

	});



//-----------------------------------
/* open this paragraph of code

app.use(session({secret: 'XARF235HPCKTM',
				resave: false,
				saveUninitialized: true,
				cookie: {secure: false}					
				}));



/*
app.get('/',function(request,responce){
	
	if(request.session.profileID)
		responce.send('current user:'+request.session.profileID+'   <a href="/logout">logout</a>');
	else
		responce.send('please <a href="/login">login</a>');
})
*/


//router_express.use(authentication);    //---open this line

/*

function authentication(request,responce,next){
	console.log(request.path);

	if(request.session.profileID){
		next();
	}
	else{
		if(request.path == '/login' || request.path == '/profile'){
			next();
		}
		else{
			responce.json({messg : 'failed_session'});	
			return;
		}
		
	}
		
}
*/


router_session.routerSession(router_express);
router_register.routerRegister(router_express);
router_course.routerCourse(router_express);
router_lecture.routerLecture(router_express);
router_resource.routerResource(router_express);
router_assessment.routerAssessment(router_express);
router_announcement.routerAnnouncement(router_express);
router_forum.routerForum(router_express);





app.use("/api",router_express)
	
}