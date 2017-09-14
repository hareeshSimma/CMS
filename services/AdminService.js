/**
 * 
 */
 'use strict';

angular.module('SMSApp')
.service('AdminService',function(){
var _self=this;
_self.cTypes=[];
_self.classes=[];
_self.sections=[];
_self.subjects=[];
_self.exams=[];
_self.barOpt={
            chart: {
                type: 'multiBarHorizontalChart',
                height: 350,
                 margin: {
                right: 150,
                left: 150
                },
                x: function(d){return d.label;},
                y: function(d){return d.value;},
                valueFormat: function(d){
                        return d
                },
                showControls: false,
                stacked: false,
                showValues: true,
                transitionDuration: 500,
               
                showLegend: false,
                yAxis: {
                    axisLabel: 'Marks',
                    tickFormat: function(d){
                        return d3.format(',')(d);
                    },
                    valueFormat: function(d){
                        return d3.format(',')(d);
                    }
                }
            }
        };
  _self.lineOpt={
            chart: {
                type: 'lineChart',
                showLegend: true,
                margin: {
                    top: 20,
                    right: 70,
                    bottom: 80,
                    left: 100
                },
               valueFormat: function(d){
                        return d3.format(',2f')(d);
                    },
                xAxis: {
                     axisLabelDistance: 10,
                     staggerLabels: true,
                    tickFormat: function(d) {
                         return (_self.lblData.values[d] != undefined ? _self.lblData.values[d].label : '');
                    }
                },
                legend:{
                    margin:{top: 5, right: 0, bottom: 5, left: 0}
                },
                yAxis: {
                    tickFormat: function(d) {
                        return d3.format('.02f')(d);
                    },
                    axisLabelDistance: 0
                },
                 wrapLabels: true,
               
            }
          }
  _self.pieOpt={
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d){return d.key;},
                y: function(d){return d.y;},
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };


 _self.changeCourseType=function(cType,clsArr){
        var streams=[];
        
         if(cType=='')
          streams=[];
        else if(cType=='M.C.A')
       streams=clsArr.slice(11,12);
         else if(cType=='M.B.A')
          streams=clsArr.slice(09,11);
        else if(cType=='M.Tech')
         streams=clsArr.slice(0,09);
        else if(cType=='B.Tech')
         streams=clsArr.slice(0,09);

        return streams;

        };

    _self.changeStream=function(stream,semArr,cType){
         var semesters=[];

         if(stream=='')
          semesters=[];
        else if(stream=='FINANCE'||stream=='HUMAN RESOURCES'||cType=='M.Tech')
          semesters=semArr.slice(0,4);
         else if(stream=='IT' || stream=='C.S.E'|| stream=='E.E.E'|| stream=='E.C.E'|| stream=='CIVIL'|| stream=='MECH'|| stream=='AERONAUTICAL'|| stream=='AGRICULTURAL'|| stream=='CHEMICAL')
           semesters=semArr.slice(0,8);
        else if(stream=='M.C.A')
          semesters=semArr.slice(0,6);
        return semesters;
       
        };

_self.changeCourseType_old=function(cType,classList){
  var dataLen=(classList && classList.length) ? classList.length : 0;
        var selClassList=[];
        for(var i=0;i<dataLen;i++){
            var tempDataObj=classList[i];
            if(tempDataObj.cType== cType)
              selClassList.push(tempDataObj.class);
        }
        return selClassList;
      };
 _self.changeClass=function(classData,sectionList){
        var secLen=(sectionList && sectionList.length)? sectionList.length : 0;
        var selSectionList=[];
        for(var i=0;i<secLen;i++){
            var tempDataObj=sectionList[i];
            if(tempDataObj.class== classData)
              selSectionList.push(tempDataObj.section);
        }
        return selSectionList;
      };

   _self.changeSection=function(sectionData,mediumList){
        var medLen=(mediumList && mediumList.length)?mediumList.length : 0;
        var selMediumList=[];
        for(var i=0;i<medLen;i++){
            var tempDataObj=mediumList[i];
            if(tempDataObj.section== sectionData)
             selMediumList.push(tempDataObj.medium);
          }
          return selMediumList;
        };    
return _self;
});