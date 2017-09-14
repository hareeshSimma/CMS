angular.module('SMSApp')
.directive('graph',function(){
	var obj={};
	obj.restrict='E',
	obj.template="<nvd3 options='options' data='data'></nvd3>",
	obj.scope={
		'options':'=',
		'data':'='
	};
	return obj;
});