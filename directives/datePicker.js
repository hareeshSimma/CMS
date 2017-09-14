angular.module('SMSApp')
.directive('featureDate',function(){
  return{
		restrict : 'E',
		scope:{
			 dateCallback: '&'
		},
		template:'<div id="featureDate" class="input-append date"><input type="text" class="form-control" ng-model="fdate"><span class="add-on"><i class="icon-th"></i></span></div>',
		link:function(scope,element,att,ctrl){
			element.find('#featureDate').datepicker({
				format: 'dd-mm-yyyy',
			    autoclose: true,
			    todayBtn: "linked",
			    startDate:new Date()
			}).on('changeDate',function(e){
				var data={
					'date':scope.fdate
				}
				scope.dateCallback(data);
			});
		}
	}

})
.directive('pastDate',function(){
	return{
		restrict : 'E',
		scope:{
			 dateCallback: '&'
		},
		template:'<div id="pastDate" class="input-append date"><input type="text" name="pastDate" ng-model="pastDate" class="form-control"><span class="add-on"><i class="icon-th"></i></span></div>',
		link:function(scope,element,att,ctrl){
			element.find('#pastDate').datepicker({
				format: 'dd-mm-yyyy',
			    autoclose: true,
			    todayBtn: "linked",
			    endDate:new Date(),
			   
			}).on('changeDate',function(e){
				var data={
					'date':scope.pastDate
				}
				scope.dateCallback(data);
			});
				
		}
	}
})
.directive('fromToDate',function(){
return{
		restrict : 'E',
		scope:{
			ngOptions :'='
		},
		template:'<div id="fromToDate" class="input-daterange" id="datepicker"><input type="text" class="input-small" name="start" /><span class="add-on">to</span><input type="text" class="input-small" name="end" /></div>',
		link:function(scope,element,att,ctrl){
			element.find('#fromToDate').datepicker({
			    autoclose: true,
			    todayBtn: "linked",
			}).on('changeDate',function(e){

			});
				
		}
	}

});