angular.module('SMSApp')
  .controller('studentCtrl', function ($timeout,$scope,$rootScope,$modal,$timeout,$filter,ServerCall,AdminService) {
   var userRole=sessionStorage.getItem("role");
    var userName=sessionStorage.getItem('uid');
    if(userName == undefined)
        return;
    if(userRole != undefined){
         $rootScope.$emit('menuReset',userRole);
    }
           //   $scope.tab = 1;
    $scope.isRegister=false;
    $scope.isOther=false;
    $scope.saveAttendence=false;
    $scope.isDefault=true;
    $scope.std={};
  var defaultSelection=function(){
    $scope.cType="";
    $scope.class="";
    $scope.section="";
   $scope.semester="";
 
  };
   function selInnerLi(data){
       $('#student li').removeClass('selTab');
      $('#student li:nth-child('+data+')').addClass('selTab');
  }
   $rootScope.$on('studentMenu',function(eve,data){
    $scope.setTab(data);
    selInnerLi(data);
  });
    /* Default tabs visible */
  var setDefault=function(){
    $scope.isRegister=false;
    $scope.isIdCard=false;
    $scope.isCertificates=false;
    $scope.isAttendence=false;
    $scope.isSMS=false;
    $scope.isSearch=false;
  }
   var setDefaultView=function(){
    $scope.isRegisterView=false;
    $scope.isIdCardView=false;
    $scope.isCertificatesView=false;
    $scope.isAttendenceView=false;
    $scope.isSMSView=false;
    $scope.isSearchView=false;
  };
  $scope.export=function(etype){
      var _tempObj={
          'type':etype,
          'escape':'false'
      };
       $('#tableID').tableExport(_tempObj);
  }
  $scope.exportExcel=function(){
     
  };
  $scope.exportPdf=function(){
      $('#tableID').tableExport({type:'pdf',escape:'false'});
  };
  /* Tab click function */
  $scope.setTab = function(newTab){
      $scope.stdList=[];
      $scope.isDefault=false;
      $scope.std={};
      $scope.chkAll={};
      $scope.tab = newTab;
      setDefault();
      setDefaultView();
      defaultSelection();
      switch(newTab){
        case 1:
        $scope.isRegister=true;
        $scope.isOther=false;
        break;
        case 2:
        $scope.isIdCard=true;
        $scope.isOther=true;
        break;
        case 3:
        $scope.isCertificates=true;
        $scope.isOther=true;
        break;
        case 4:
        $scope.isAttendence=true;
        $scope.saveAttendence=false;
        $scope.attEntStds=[];
        $scope.isOther=true;
        break;
        case 5:
        $scope.isSearchView=true;
        $scope.getEnquiryStuList();
        break;
      /*  case 6:
        $scope.isSMS=true;
        $scope.isOther=true;
        break;*/
        case 6:
        $scope.isReport=true;
      
        break;

       }
    };

    /* Tab active and inactive color function */
    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };

    /* Students List Start */
    var studentSuccCB=function(res){
      $scope.stdList=[];
      $scope.msg='';
      setDefaultView();
      $scope.isRegisterView=true;
      if(res.data){
      var _tempData=res.data[0];
        $scope.streams=AdminService.changeCourseType(_tempData.cType,clsArr);
        $scope.semesters=AdminService.changeStream(_tempData.class,semArr);
        $timeout(function(){
          $scope.cType=_tempData.cType;
          $scope.class=_tempData.class;
          $scope.section=_tempData.section;
          $scope.semester=_tempData.semester;
        },100);
        $scope.stdList=res.data;
      }else{
          $scope.msg=res;
      }
      
    }
    var studentsErrCB=function(res){
      debugger;
    }
    $scope.stdSearch=function(searchData){
         var dataObj={
            'optId':0,
            'type':'students'
            }
            if(searchData==undefined){
              dataObj.cType=$scope.cType;
              dataObj.className=$scope.class;
              dataObj.semester=$scope.semester;
              dataObj.section=$scope.section;
             
            }else{
            dataObj.cType=searchData.cType;
            dataObj.className=searchData.className;
            dataObj.semester=searchData.semester;
            dataObj.section=searchData.section;
            }
      ServerCall.getData('php/student.php','POST',dataObj,studentSuccCB,studentsErrCB)
    };
    /* Students List End */

    /* Add and Edit Students modal start */
    $scope.addNewStudent=function(data){
    $modal.open({
    templateUrl: 'views/student/stdRegModal.html',
    controller: function($timeout,$scope,$modalInstance,$location,$rootScope,ServerCall,AdminService){
        $scope.isSave=true;
        $scope.isPersonlDet=true;
        $scope.isPreview=true;
        /*$scope.classes=[];*/
        var dataObj={};
        $scope.classes=[];
        $scope.cTypes=JSON.parse(sessionStorage.getItem('cTypes'));
        var clsArr=JSON.parse(sessionStorage.getItem('classes'));
        $scope.sections=JSON.parse(sessionStorage.getItem('sections'));
        var semArr=JSON.parse(sessionStorage.getItem('semesters'));
    //get Admission No
      function getAdmissionNo(){
          dataObj.type="students";
          dataObj.optId=4;
         ServerCall.getData('Student','POST',dataObj,function(data){
          $scope.currAdmNo=data.admNo;
         },
         function(data){

         });
      }
      //getAdmissionNo();
     $scope.changeCourseType=function(cType){
        $scope.streams=[];
        $scope.semesters=[];
        $scope.semester='';
        $scope.section='';
        $scope.streams="";
        $scope.streams=AdminService.changeCourseType(cType,clsArr);
         
        }; 
    $scope.changeStream=function(stream,cType){
          $scope.semesters=[];
          $scope.semester='';
          $scope.section='';  
          $scope.semesters=AdminService.changeStream(stream,semArr);
        
        };
          // Default data end


        /* Date selection call back*/
        $scope.fnDOBSelection=function(selDate){
          $scope.dob=selDate;
        }
        $scope.fnDOASelection=function(selDate){
          $scope.doa=selDate;
        }
      
        $scope.goNext=function(){
          $scope.isPersonlDet=false;
        }
        $scope.goBack=function(){
          $scope.isPersonlDet=true;
        } 

        $scope.goPreview=function(){
          $scope.isPreview=false;
         /* $scope.isPersonlDet=false; */     
         } 
         /*  call back*/
      
            if(data != undefined){
            $scope.isSave=false;
            $scope.changeCourseType(data.cType);
            $scope.changeStream(data.class);

          $timeout(function(){
            $scope.admTyp=data.admType;
            $scope.cType=data.cType;
            $scope.class=data.class;
            $scope.section=data.section;
            $scope.semester=data.semester;
            $scope.fee=data.fee;
            $scope.name=data.name;
            $scope.fname=data.fname;
            $scope.mname=data.mname;
            $scope.gender=data.gender;
            $scope.residence=data.residence;
            $scope.address=data.address;
            $scope.aceYear=data.aceYear;
            $scope.doa=data.doa;
            $scope.dob=data.dob;
            $scope.phNo=data.phNo;
            $scope.sName=data.Surname;          
            $scope.mothertongue=data.mtongue;
            $scope.Caste=data.caste;
            $scope.bloodgroup=data.bgroup;
            $scope.Pschool=data.pschool;
            $scope.Pclass=data.pclass;
            $scope.fqual=data.pqual;
            $scope.occu=data.occup;
            $scope.iMarks=data.iMarks;
            $scope.email=data.emailid;
            $scope.National=data.national;
            $scope.Religion=data.religion;
            $scope.Transport=data.transport;
            $scope.Gname=data.gname;
            },100);
        }
        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(res){
          if(res.status=='success'){
            $modalInstance.close();
            $rootScope.$broadcast('students',dataObj);
          }
          else{
              $scope.msg=res;
          }
        }
        var errCB=function(data){
              $scope.msg=data;
        }

        $scope.save=function(opt){
           dataObj={
            'admType':$scope.admTyp,
            'cType':$scope.cType,
            'className':$scope.class,
            'section':$scope.section,
            'semester':$scope.semester,
            'name':$scope.name,
            'fname':$scope.fname,
            'mname':$scope.mname,
            'gender':$scope.gender,
            'residence':$scope.residence,
            'address':$scope.address,
            'acdemicYear':$scope.aceYear,
            'doa':$scope.doa,
            'dob':$scope.dob,
            "phno":$scope.phNo,
            "iMarks":$scope.iMarks,
            "Surname":$scope.sName,
            "mtongue":$scope.mothertongue,
            "caste":$scope.Caste,
            "bgroup":$scope.bloodgroup,
            "pqual":$scope.fqual,
            "occup":$scope.occu,
            "emailid": $scope.email,
            "national":$scope.National,
            "religion": $scope.Religion,
            "transport":$scope.Transport,
            "gname":$scope.Gname,
            'type':'students'
            }
            if(opt=='2'){
              dataObj.optId=2;
              dataObj.admNo=data.admNo;
            }
            else{
              dataObj.optId=1;  
            }
           ServerCall.getData('php/student.php','POST',dataObj,sucCB,errCB)
      }
    },
    size: 'lg',
    backdrop: 'static',
    keyboard: 'false'
    })
   }; 
   /* Add and Edit Students modal end */

   /* Delete Students start */
   $scope.deleteStudent=function(data){
      $modal.open({
    templateUrl: 'views/confirmationModal.html',
    controller: function($scope,$modalInstance,$location,$rootScope,ServerCall){
        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(res){
          if(res.status=='success'){
            $modalInstance.close();
            $rootScope.$broadcast('students',data);
          }
          else{
              $scope.msg=res.message;
          }
        }
        var errCB=function(res){
            $scope.msg=res.message;
        }
        $scope.yes=function(){
          var dataObj={
            'type':'students',
            'optId':3,
            'admNo':data.admNo
            }
           ServerCall.getData('php/student.php','POST',dataObj,sucCB,errCB)
        }
    },
    size: 'sm',
    backdrop: 'static',
    keyboard: 'false'
    })
   }
   /* Delete Students end */
   
  /* check box selection */
  $scope.checkAll=function(bool){
    $scope.stdList=$filter('filter')($scope.stdList,{name:$scope.fName})
    if(bool){
      for(var i=0;i<$scope.stdList.length;i++){
          var key=$scope.stdList[i].admNo;
          $scope.std[key]=true;
      }
     
    }else{
       for(var i=0;i<$scope.stdList.length;i++){
          var key=$scope.stdList[i].admNo;
          $scope.std[key]=false;
      }
    }
  };

  /* defalut Data  start */
        $scope.classes=[];
        $scope.cTypes=JSON.parse(sessionStorage.getItem('cTypes'));
        var clsArr=JSON.parse(sessionStorage.getItem('classes'));
        $scope.sections=JSON.parse(sessionStorage.getItem('sections'));
        var semArr=JSON.parse(sessionStorage.getItem('semesters'));

        $scope.changeCourseType=function(cType){
         $scope.class=[];
         $scope.semesters=[];
         $scope.class='';
         $scope.semester='';
         $scope.section='';
         $scope.streams=AdminService.changeCourseType(cType,clsArr);
        };
         $scope.changeStream=function(stream,cType){
          $scope.semesters=[];
          $scope.semester='';
          $scope.section='';
          $scope.semesters=AdminService.changeStream(stream,semArr,$scope.cType);
        
        };
  /* default Data end */

  $scope.generateIdCard=function(selStudents,stuList){
      $modal.open({
    templateUrl: 'views/student/genrateIdModal.html',
    controller: function($timeout,$scope,$modalInstance,$location,$rootScope,ServerCall,AdminService){
       var selStd=selStudents;
       var totalStus=stuList;
       $scope.idGenStd=[];
       angular.forEach(totalStus,function(obj,index){
           if(selStd[obj.admNo])
            $scope.idGenStd.push(obj);
       });
        $scope.close=function(){
          $modalInstance.close();
        }
     $scope.printId=function(){
    
         var printData=document.getElementsByClassName('modal-body')[0].innerHTML;
         sessionStorage.setItem('printData',printData);
         window.open('/SMS/print.html',"", "width=800,height=600");

         }


         /*  school  info list start */
        var SinfoSuccCB=function(res){
          if(res.data){
          $scope.sinfoObj=res.data[0];
          $scope.sName=$scope.sinfoObj.campusName;
          $scope.sState=$scope.sinfoObj.state;
          $scope.sDistrict=$scope.sinfoObj.district;
          $scope.sCity=$scope.sinfoObj.city;
          $scope.sStreet=$scope.sinfoObj.street;
          $scope.sPinCode=$scope.sinfoObj.pinCode;
          $scope.sPhoneNo=$scope.sinfoObj.phoneNumber;
          $scope.sEmail=$scope.sinfoObj.email;
          $scope.sLogo=$scope.sinfoObj.logo;
          $scope.sCode=$scope.sinfoObj.schoolCode;
          $scope.sWebsite=$scope.sinfoObj.website;
        }
        }
        var SinfoErrCB=function(res){
          debugger;
        }
        $scope.getSinfoList=function(){
          var dataObj={
                'optId':3,
                'type':'sinfo'
                }
          ServerCall.getData('Admin','POST',dataObj,SinfoSuccCB,SinfoErrCB)
        };
      $scope.getSinfoList();
    },
    size: 'lg',
    backdrop: 'static',
    keyboard: 'false'
    })
  };


   $scope.generateCertificates=function(selStudents,stuList){
      $modal.open({
    templateUrl: 'views/student/generateCerModal.html',
    controller: function($timeout,$scope,$modalInstance,$location,$rootScope,ServerCall,AdminService){
       $scope.today=new Date();
       var selStd=selStudents;
       var totalStus=stuList;
       var defaultDis=function(){
       $scope.isBonified=false;
       $scope.isStudy=false;
       $scope.isTc=false;
       $scope.isMerit=false;
      }
       $scope.stdCertList=[];
       angular.forEach(totalStus,function(obj,index){
           if(selStd[obj.admNo])
            $scope.stdCertList.push(obj);
       });
        $scope.close=function(){
          $modalInstance.close();
        }

          /*  school  info list start */
        var SinfoSuccCB=function(res){
          debugger;
          if(res.data)
          $scope.sinfoObj=res.data[0];
          $scope.sName=$scope.sinfoObj.campusName;
          $scope.sState=$scope.sinfoObj.state;
          $scope.sDistrict=$scope.sinfoObj.district;
          $scope.sCity=$scope.sinfoObj.city;
          $scope.sStreet=$scope.sinfoObj.street;
          $scope.sPinCode=$scope.sinfoObj.pinCode;
          $scope.sPhoneNo=$scope.sinfoObj.phoneNumber;
          $scope.sEmail=$scope.sinfoObj.email;
          $scope.sLogo=$scope.sinfoObj.logo;
          $scope.sCode=$scope.sinfoObj.schoolCode;
          $scope.sWebsite=$scope.sinfoObj.website;
        }
        var SinfoErrCB=function(res){
          debugger;
        }
        $scope.getSinfoList=function(){
          var dataObj={
                'optId':3,
                'type':'sinfo'
                }
          ServerCall.getData('Admin','POST',dataObj,SinfoSuccCB,SinfoErrCB)
        };
      $scope.getSinfoList();
     $scope.selCertType=function(type){
        defaultDis();
       switch(type){
        case 'Bonafide':
        $scope.isBonified=true;
        break;
        case 'Study':
        $scope.isStudy=true;
        break;
        case 'Transfer':
        $scope.isTc=true;
        break;
        case 'Merit':
        $scope.isMerit=true;
        break;
       }
     }
    },
    size: 'lg',
    backdrop: 'static',
    keyboard: 'false'
    })
  };
//Enter Student Attendence Start
$scope.fnAttSave=function(){
    var _tempAttObj=$scope.att;
    var dataArr=[];
    angular.forEach($scope.attEntStds,function(obj,key){
        var _tempObj={
             'date':$scope.selDate,
            'cType':$scope.cType,
            'className':$scope.class,
             'section':$scope.section,
             'semister':$scope.semester,
             'status':_tempAttObj[obj.admNo],
              'admNo':obj.admNo,
              'name':obj.name
        };
        dataArr.push(_tempObj);
    });
    var opt=($scope.attEntStds[0]&& ($scope.attEntStds[0].isNew == true))?0 : 1;
     var dataObj={
              'type':'attendence',
              'optId':opt,
              'attendence':dataArr
              };
       var sucCB=function(data){
            $scope.saveAttendence=false;
            alert('successfully inserted'); 
            $scope.attEntStds=[];
       };
       var errCB=function(data){
           
       };
       ServerCall.getData('Student','POST',dataObj,sucCB,errCB);
};
 $scope.fnDSelection=function(selDate){
        $scope.selDate=selDate;
         $scope.saveAttendence=false;
         $scope.$apply();
     };
$scope.enterAttendence=function(){
    $scope.att={};
    var sucCB=function(data){
        $scope.attEntStds=data.data;
        if($scope.attEntStds && $scope.attEntStds.length)
            $scope.saveAttendence=true;
        $timeout(function(){
            angular.forEach($scope.attEntStds,function(obj){
                $scope.att[obj.admNo]=obj.status;
            });
        },500);
    };
    var errCB=function(data){
        
    };
     var dataObj={
              'type':'attendence',
              'optId':3,
              'cType':$scope.cType,
              'className':$scope.class,
              'section':$scope.section,
              'semester':$scope.semester,
              'attDate':$scope.selDate
       };
     ServerCall.getData('Student','POST',dataObj,sucCB,errCB);
};

//Enter Student Attendence End
//$scope.enterAttendence=function(selStudents,stuList){
//    $modal.open({
//    templateUrl:'views/student/enterAttenModal.html',
//    controller: function($timeout,$scope,$modalInstance,$location,$rootScope,ServerCall,AdminService){
//       var selStd=selStudents;
//       $scope.std={};
//       $scope.chkAll={};
//       var totalStus=stuList;
//       $scope.attEntStd=[];
//       angular.forEach(totalStus,function(obj,index){
//           if(selStd[obj.admNo])
//            $scope.attEntStd.push(obj);
//       });
//        $scope.close=function(){
//          $modalInstance.close();
//        }
//        $scope.fnDSelection=function(selDate){
//          $scope.selDate=selDate;
//        }
//        var sucCB=function (res) {
//           // body...
//            $modalInstance.close();
//         }
//         var errCB=function(res) {
//           // body...
//         }
//        /* check box selection */
//         $scope.checkModalAll=function(bool){
//         $scope.attEntStd=$filter('filter')($scope.attEntStd,{name:$scope.fName})
//         if(bool){
//          for(var i=0;i<$scope.attEntStd.length;i++){
//          var key=$scope.attEntStd[i].admNo;
//          $scope.std[key]=true;
//          }
//     
//          }else{
//          for(var i=0;i<$scope.attEntStd.length;i++){
//          var key=$scope.attEntStd[i].admNo;
//          $scope.std[key]=false;
//          }
//        }
//      };
//
//        $scope.saveAtten=function() {
//         // body...
//         var dataArr=[];
//         var sample=$scope.std;
//         angular.forEach($scope.std,function(val,key) {
//           // body...
//           var _tempObj={
//            'id':key,
//            'attenType':val,
//            'date':$scope.selDate
//           }
//           dataArr.push(_tempObj);
//         });
//
//         var dataObj={
//              'type':'attendence',
//              'optId':0,
//              'attendence':dataArr
//              }
//             ServerCall.getData('Student','POST',dataObj,sucCB,errCB);
//       }
//    },
//    size: 'lg',
//    backdrop: 'static',
//    keyboard: 'false'
//    })
//  };

     //enquiry students code start 
  /*  enquiry students  list start */
    var enquiryStuSuccCB=function(res){
      if(res.data)
      $scope.enquiryStuList=res.data;
      else
      $scope.enquiryStuList=[];
    }
    var enquiryStuErrCB=function(res){
      debugger;
    }
    $scope.getEnquiryStuList=function(){
      var dataObj={
            'optId':3,
            'type':'enquiry'
            }
      ServerCall.getData('Student','POST',dataObj,enquiryStuSuccCB,enquiryStuErrCB)
    };

    /* Add and Edit Enquiry Students modal start */
    $scope.enquiryRegistration=function(data){
    $modal.open({
    templateUrl: 'views/student/stuEnquiryForm.html',
    controller: function($timeout,$scope,$modalInstance,$location,$rootScope,ServerCall,AdminService){
        $timeout(function(){
       $("#StuEnquiryForm").validate({
        rules: {
            cType: "required",
            class: "required",
            semesters: "required",
            aceYear: "required",
            name: "required",
            fname: "required",
            gender: "required",
            phNo: {
                  "required":true,
                  "maxlength":11,
                  "digits":true,
                  },
            address: "required",
        },
        messages: {
            cType: "Please select CourseType",
            class: "Please select Class",
            semesters: "Please select Medium",
            aceYear: "Please select Academic Year",
            name: "Please enter Student Name",
            fname: "Please enter Father's Name",
            gender: "Please select Gender",
            phNo: {
                    "required":"Please enter Phone Number",
                    "maxlength":"Your Ph.No should be less than 10 Characters only",
                    "digits":"Please enter Digits only",
                  },
            address: "Please enter Address",
        },
    });
     },1000);

        $scope.isSave=true;
        var dataObj={};
        
       /* defalut Data  start */
       $scope.classes=[];
        $scope.sub={};
        $scope.cTypes=JSON.parse(sessionStorage.getItem('cTypes'));
        var clsArr=JSON.parse(sessionStorage.getItem('classes'));
        $scope.sections=JSON.parse(sessionStorage.getItem('sections'));
        var semArr=JSON.parse(sessionStorage.getItem('semesters'));

       $scope.changeCourseType=function(cType){
         $scope.streams="";
         $scope.streams=AdminService.changeCourseType(cType,clsArr);
         };
       
       $scope.changeStream=function(stream){
          $scope.semesters=[];
          $scope.semesters=AdminService.changeStream(stream,semArr);
          };
       /* default Data end */
      
        if(data != undefined){
            $scope.isSave=false;
            $scope.changeCourseType(data.cType);
        $timeout(function(){
            $scope.cType=data.cType;
            $scope.class=data.className;
            $scope.semesters=data.semester;
            $scope.aceYear=data.acdemicYear;
            $scope.name=data.name;
            $scope.fname=data.fname;
            $scope.gender=data.gender;
            $scope.phNo=data.phno;
            $scope.address=data.address;
            },100);
        }
        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(res){
          if(res.status=='success'){
            $modalInstance.close();
            $rootScope.$broadcast('enquiry',dataObj);
          }
          else{
              $scope.msg=res.message;
          }
        }
        var errCB=function(data){
        $scope.msg=data.message;
        }
        $scope.save=function(opt){
          if($("#StuEnquiryForm").valid()){
           dataObj={
            'cType':$scope.cType,
            'className':$scope.class,
            'semester':$scope.semesters,
            'acdemicYear':$scope.aceYear,
            'name':$scope.name,
            'fname':$scope.fname,
            'gender':$scope.gender,
            'phno':$scope.phNo,
            "address":$scope.address,
            'type':'enquiry'
            }
            if(opt=='1'){
              dataObj.optId=1;
              dataObj.id=data.id;
            }
           ServerCall.getData('Student','POST',dataObj,sucCB,errCB)
        }
      }
    },
    size: 'lg',
    backdrop: 'static',
    keyboard: 'false'
    })
   }; 
    /* Add and Edit Enquiry Students modal end */

   /* Delete Enduiry Students start */
   $scope.deleteEnqStudent=function(data){
      $modal.open({
    templateUrl: 'views/confirmationModal.html',
    controller: function($scope,$modalInstance,$location,$rootScope,ServerCall){
        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(res){
          if(res.status=='success'){
            $modalInstance.close();
            $rootScope.$broadcast('enquiry');
          } 
          else{
              $scope.msg=res.message;
          }
        }
        var errCB=function(res){
         $scope.msg=res.message;
        }
        $scope.yes=function(){
          var dataObj={
            'type':'enquiry',
            'optId':2,
            'id':data.id
            }
           ServerCall.getData('Student','POST',dataObj,sucCB,errCB)
        }
    },
    size: 'sm',
    backdrop: 'static',
    keyboard: 'false'
    })
   }
   /* Delete Enquiry Students end */

   $scope.enterMsg=function(selStudents,stuList){
      $modal.open({
    templateUrl: 'views/student/sendMsgModal.html',
    controller: function($timeout,$scope,$modalInstance,$location,$rootScope,ServerCall,AdminService){
       var selStd=selStudents;
       var totalStus=stuList;
       $scope.phNos='';
       $scope.msgGenStd=[];
       angular.forEach(totalStus,function(obj,index){
           if(selStd[obj.admNo]){
            $scope.msgGenStd.push(obj);
            $scope.phNos=$scope.phNos+','+obj.phNo;
          }
       });
       $scope.phNos=$scope.phNos.substring(1,$scope.phNos.length);
        $scope.close=function(){
          $modalInstance.close();
        }
     },
    size: 'lg',
    backdrop: 'static',
    keyboard: 'false'
    })
  };
   /* $scope.changeCourseType=function(cType){
          $scope.streams=[];
       $scope.streams=AdminService.changeCourseType(cType,clsArr);
        };  */

  /* Events start */
   $rootScope.$on('students',function(args,data){
    $scope.stdSearch(data);
    });

   $rootScope.$on('enquiry',function(data){
    $scope.getEnquiryStuList(data);
    });
  /* Events End */
   //     selInnerLi(1);
  });
