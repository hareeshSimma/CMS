/**
 * 
 */
 'use strict';

angular.module('SMSApp')
.service('ServerCall',function($http){
var _self=this;
_self.globalURL="http://localhost:80/CVRCMS/";
_self.getData=function(path,method,data,sucessCB, errorCB){
var reqObj={
	'url':_self.globalURL+path,
	'method':method,
	'data':data,
         "headers":
            {
               "Content-Type": "application/x-www-form-urlencoded"
            }
};
$http(reqObj)
.success(function(data, status, headers, config) {
	sucessCB(data);
	})
.error(function(data, status, headers, config) {
	errorCB(data);
});
};
return _self;
});