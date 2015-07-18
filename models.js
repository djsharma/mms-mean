var schemas = require('./schemas');
var mongoose = require('mongoose');
var models={};

Object.keys(schemas).forEach(function(name){
	models[name] = mongoose.model(name,schemas[name]);
});

module.exports = models;