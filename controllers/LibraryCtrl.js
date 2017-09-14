angular.module('SMSApp')
  .controller('libraryCtrl', function ($scope,$rootScope,$modal,ServerCall,AdminService,$timeout) {
 var userRole=sessionStorage.getItem("role");
    var userName=sessionStorage.getItem('uid');
    if(userName == undefined)
        return;
    if(userRole != undefined){
         $rootScope.$emit('menuReset',userRole);
    }
  // $scope.tab = 1;
  // $scope.isAddBook=true;
  $scope.isDefault=true;
 /* Default tabs visible */
  var setDefault=function()
  {
    $scope.isAddBook=false;
    $scope.isIssueBook=false;
    $scope.isTransReport=false;
    $scope.isDateReport=false;
  }
  var defaultSelection=function(){
    $scope.cType="";
    $scope.class="";
    $scope.section="";
    $scope.semester="";
  }
   function selInnerLi(data) {
                $('#library li').removeClass('selTab');
                $('#library li:nth-child(' + data + ')').addClass('selTab');
            }
   $rootScope.$on('libMenu',function(eve,data){
    $scope.setTab(data);
    selInnerLi(data);
  });
         /* Tab click function */
  $scope.setTab = function(newTab){
      $scope.isDefault=false;
     defaultSelection();
      $scope.tab = newTab;
      setDefault();
      switch(newTab){   
      case 1:
        $scope.isAddBook=true;
        $scope.getAddBookList();
        break;
      case 2:
        $scope.isIssueBook=true;
        $scope.getIssueBookList();
        break;
      case 3:
        $scope.isTransReport=true;
        break;
      case 4:
        $scope.isDateReport=true;
      }   
    };
    /* Tab active and inactive color function */
    $scope.isSet = function(tabNum){
      return $scope.tab === tabNum;
    };

  //Bookstart 
  /* Book list start */
    var addBookSuccCB=function(res){
      if(res.data)
      $scope.bookList=res.data;
      else
      $scope.bookList=[];
    }
    var addBookErrCB=function(res){
      debugger;
    }
    $scope.getAddBookList=function(){
      var dataObj={
            'optId':0,
            'type':'addBook'
            }
      ServerCall.getData('php/library.php','POST',dataObj,addBookSuccCB,addBookErrCB)
    };
    /* Book  list end */

    /* Default Load*/
      if($scope.tab==1)
      $scope.getAddBookList();

    /* Add and Edid add Bookmodal start */
    $scope.addBook=function(data){
    $modal.open({
    templateUrl: 'views/library/addBookModal.html',
    controller: function($scope,$modalInstance,ServerCall,$location,$rootScope){
        $timeout(function(){
       $("#AddBookForm").validate({
         rules: {
            bookName:"required",
            bookTitle:"required",
            author:"required",
            publisher:"required",
            yop:{ 
                  "required":true,
                  "digits":true,
                  "minlength":3,
                  "maxlength":4
                  },
            quantity:{ 
                      "required":true,
                      "digits":true,
                      },
            year:{ 
                  "required":true,
                  "digits":true,
                  
                  "maxlength":4,
                  },
        },
        messages: {
            bookName:"Please enter Book Name",
            bookTitle:"Please enter Book Code",
            author:"Please enter Author Name",
            publisher:"Please enter Publisher Name",
            yop:{
                "required":"Please enter year of Publication"
                },
            quantity: { 
                      "required":"Please enter the Quantity of Books"
                       },
            year:  { 
                  "required":"Please enter the Quantity of Books"
                   },
         },
    });
     },1000); 

        $scope.isSave=true;
        $scope.isSaved=true;
      
        if(data != undefined){
         $scope.isSave=false;
         $scope.bookName=data.bookName;
         $scope.bookTitle=data.bookTitle;
         $scope.author=data.author;
         $scope.publisher=data.publisher;
         $scope.yop=data.yop;
         $scope.supplier=data.supplier;
         $scope.quantity=data.quantity;
         $scope.year=data.year;
         $scope.cType=data.cType;
         $scope.stream=data.className;
         $scope.semesters=data.semester;
        }
        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(data){
          if(data.status=='success'){
            $scope.genIds=$scope.bookIds;
            $scope.msgId="Books are saved & BookId's are generated Succefully.";
            $scope.isSaved=false;
            $rootScope.$broadcast('addBook');
          }
        }
        var errCB=function(data){
          $scope.msg="Book Code already exists. Please update the Record.";
          $scope.isSaved=false;
        }
        
        $scope.save=function(opt){
          $scope.bookIds='';
          for(var i=1;i<=$scope.quantity;i++){
            $scope.bookIds=$scope.bookIds+$scope.bookTitle+'_'+i+',';
          }

          if($("#AddBookForm").valid()){
            var dataObj={
           'bookName':$scope.bookName,
           'bookTitle':$scope.bookTitle,
           'author':$scope.author,
           'publisher':$scope.publisher,
           'yop':$scope.yop,
           'supplier':$scope.supplier,
           'quantity':$scope.quantity,
           'year':$scope.year,
           'cType':$scope.cType,
           'className':$scope.stream,
           'semester':$scope.semesters,
           'bookIds':$scope.bookIds.substring(0,$scope.bookIds.length-1),
           'type':'addBook'
            }
            if(opt=='2'){
              dataObj.optId=2;
              dataObj.id=data.id;
            }else{
                dataObj.optId=1;
            }
           ServerCall.getData('php/library.php','POST',dataObj,sucCB,errCB)
        }
      }
    },
    size: 'lg',
    backdrop: 'static',
    keyboard: 'false'

    })
   }; 
    /* Add and Edit add Book modal end */

    /* Delete Book start */
   $scope.deleteBook=function(data){
            $modal.open({
    templateUrl: 'views/confirmationModal.html',
    controller: function($scope,$modalInstance,ServerCall,$location,$rootScope){
        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(data){
          if(data.status=='success'){
            $modalInstance.close();
            $rootScope.$broadcast('addBook');
          }
        }
        var errCB=function(data){
        }
        $scope.yes=function(){
          var dataObj={
            'type':'addBook',
            'optId':3,
            'id':data.id
            }
           ServerCall.getData('php/library.php','POST',dataObj,sucCB,errCB)
        }
    },
    size: 'sm',
    backdrop: 'static',
    keyboard: 'false',
    })
   }
   /* Delete Book end */


   //Issue Book start 
  /* Issue Book list start */
    var issueBookSuccCB=function(res){
      if(res.data)
      $scope.issbookList=res.data;
      else
      $scope.issbookList=[];
    }
    var issueBookErrCB=function(res){
      debugger;
    }
    $scope.getIssueBookList=function(){
      var dataObj={
            'optId':4,
            'type':'issueBook'
            }
      ServerCall.getData('php/library.php','POST',dataObj,issueBookSuccCB,issueBookErrCB)
    };
    /* Issue Book  list end */

    /* Add and Edid Issue Book modal start */
    $scope.addIssueBook=function(data){
    $modal.open({
    templateUrl: 'views/library/issueBookModal.html',
    controller: function($scope,$modalInstance,ServerCall,$location,$rootScope){
       
        $scope.isSave=true;
        // Default Data(course, class, etc...)
        $scope.classes=[];
        $scope.cTypes=JSON.parse(sessionStorage.getItem('cTypes'));
        var clsArr=JSON.parse(sessionStorage.getItem('classes'));
        $scope.sections=JSON.parse(sessionStorage.getItem('sections'));
        var semArr=JSON.parse(sessionStorage.getItem('semesters'));

       $scope.changeCourseType=function(cType){
         $scope.streams=[];
         $scope.streams=AdminService.changeCourseType(cType,clsArr);
         $scope.getStdDet();
        };
       
       $scope.changeStream=function(stream){
          $scope.semesters=[];
          $scope.semList=AdminService.changeStream(stream,semArr);
          $scope.getStdDet();
        };
        // Default data end
     
     //student name start
     $scope.stdList=[];
     var studentSuccCB=function(res){
     if(res.data){
      $scope.nameObj=[];
      for (var i=0;i<res.data.length;i++) {
            $scope.stdList.push(res.data[i].admNo);
            $scope.nameObj[res.data[i].admNo]=res.data[i].name;
           }
          }
        }
    var studentsErrCB=function(res){
      debugger;
    }
    $scope.stdSearch=function(){
    $scope.stdList=[];
         var dataObj={
            'optId':0,
            'type':'students'
            }
              dataObj.cType=$scope.cType;
              dataObj.className=$scope.class;
              dataObj.section=$scope.section;
              dataObj.semester=$scope.semesters;

      ServerCall.getData('php/student.php','POST',dataObj,studentSuccCB,studentsErrCB)
    };
    $scope.getStdDet=function(){
      if($scope.cType != undefined && $scope.class != undefined && $scope.section!=undefined && $scope.semesters != undefined)
        $scope.stdSearch();
    }
    $scope.getStuNameList=function(admNo){
          $scope.name=$scope.nameObj[admNo];
      };//student name end

    // Emp Details(emp Name) Start
      // Emp Details(empId) Start
      $scope.empIdList=[];
      var employeeSuccCB=function(res){
      if(res.data){
        $scope.empIdNameObj={};
              for(var i=0;i<res.data.length;i++){
                $scope.empIdList.push(res.data[i].empId)
                $scope.empIdNameObj[res.data[i].empId]=res.data[i].name;
              }
            }
          }
    var employeeErrCB=function(res){
      debugger;
    }
    $scope.getEmployeeList=function(){
      var dataObj={
            'optId':0,
            'type':'employee'
            };
      ServerCall.getData('php/employee.php','POST',dataObj,employeeSuccCB,employeeErrCB);
     };
     $scope.getEmployeeList();
     // Emp Details (EmpId) Ends

    $scope.getEmpNameList=function(empId){
          $scope.empName=$scope.empIdNameObj[empId];
      };// Emp Details (EmpName) Ends
  
        if(data != undefined){
        // var booksArr=data.bookTitle.split(',');
         $scope.changeCourseType(data.cType);
         $scope.changeStream(data.className);
         $scope.getStdDet(data.admNo);
         
         $scope.isSave=false;
         $timeout(function(){
         $scope.user=data.user;
         $scope.cType=data.cType;
         $scope.class=data.className;
         $scope.semesters=data.semester;
         $scope.section=data.section;
         $scope.bName=data.bookTitle;
         // $scope.bName2=booksArr[1];
         // $scope.bName3=booksArr[2];
         $scope.date1=data.date1;
         $scope.date2=data.date2;
         $scope.date3=data.date3;

         $scope.admNo=data.admNo;
         if (data.name != undefined){
         $scope.name=data.name};

         $scope.empId=data.empId;
         if(data.nameEmp != undefined){
         $scope.empName=data.nameEmp};

         },1000); 
        }
        
        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(data){
          if(data.status=='success'){
            $modalInstance.close();
            $rootScope.$broadcast('issueBook');
          }else{
            $scope.msg=data.message;
          }
        }
        var errCB=function(data){

        }

        /* Date selection call back*/
        $scope.fnDate1=function(selDate){
          $scope.date1=selDate;
        }
        $scope.fnValidDate1=function(selDate,sub){
          $scope.date2=selDate;
        }
        
        $scope.save=function(opt){
        // var booksStr='';
        // booksStr=$scope.bName +','+$scope.bName2+','+$scope.bName3;

           var dataObj={
           'user':$scope.user,
           'cType':$scope.cType,
           'className':$scope.class,
           'semester':$scope.semesters,
           'section':$scope.section,
           'bookTitle':$scope.bName,
           'date1':$scope.date1,
           'date2':$scope.date2,
           'date3':$scope.date3,
           'type':'issueBook'
            }
            if($scope.admNo!=undefined){
              dataObj.admNo=$scope.admNo;
              dataObj.name=$scope.name;
              dataObj.empId='';
              dataObj.nameEmp='';
            }
            if($scope.empId != undefined){
              dataObj.empId=$scope.empId;
              dataObj.nameEmp=$scope.empName;
               dataObj.admNo='';
              dataObj.name='';
            }
            if(opt=='6'){
              dataObj.optId=6;
              dataObj.id=data.id;
            }else{
                 dataObj.optId=5;
            }
           ServerCall.getData('php/library.php','POST',dataObj,sucCB,errCB)
        }
    },
    size: 'lg',
    backdrop: 'static',
    keyboard: 'false'
    })
   }; 
    /* Add and Edit Issue Book modal end */

    /* Delete Issue Book start */
   $scope.deleteIssueBook=function(data){
            $modal.open({
    templateUrl: 'views/confirmationModal.html',
    controller: function($scope,$modalInstance,ServerCall,$location,$rootScope){
        $scope.close=function(){
          $modalInstance.close();
        }
        var sucCB=function(data){
          if(data.status=='success'){
            $modalInstance.close();
            $rootScope.$broadcast('issueBook');
          }
        }
        var errCB=function(data){
        }
        $scope.yes=function(){
          var dataObj={
            'type':'issueBook',
            'optId':7,
            'id':data.id
            }
           ServerCall.getData('php/library.php','POST',dataObj,sucCB,errCB)
        }
    },
    size: 'sm',
    backdrop: 'static',
    keyboard: 'false',
    })
   }
   /* Delete Issue Book end */
   
   /*Library Report Start*/
   /*Library faculty Report Start*/
   var libFacSuccCB=function(res){
      if(res.data)
      $scope.libraryList=res.data;
      else
      $scope.libraryList=[];
    }
    var libFacErrCB=function(res){
      
    }
   $scope.libFacSearch=function(){
      var dataObj={
            'type':'issueBook'
            }
              dataObj.cType=$scope.cType;
              dataObj.className=$scope.class;
              dataObj.section=$scope.section;
              dataObj.semester=$scope.semester;
              dataObj.optId=9;
      ServerCall.getData('php/library.php','POST',dataObj,libFacSuccCB,libFacErrCB)
    };
    /*Library faculty report End*/

    /*Library Student Report Start*/
   var libStuSuccCB=function(res){
      if(res.data)
      $scope.libraryList=res.data;
      else
      $scope.libraryList=[];
    }
    var libStuErrCB=function(res){
      
    }
   $scope.libStdSearch=function(){
    if($("#ReportForm").valid()){
      var dataObj={
            'type':'issueBook'
            }
              dataObj.cType=$scope.cType;
              dataObj.className=$scope.class;
              dataObj.section=$scope.section;
              dataObj.semester=$scope.semester;
              dataObj.optId=10;
      ServerCall.getData('php/library.php','POST',dataObj,libStuSuccCB,libStuErrCB)
    }
    };
     $timeout(function(){
       $("#ReportForm").validate({
         rules: {
            cType : "required",
            class : "required",
            semester : "required",
            section : "required",
        },
        messages: {
            cType : "Please select CourseType",
            class : "Please select Stream",
            semester : "Please select Semester",
            section : "Please select Section",
         },
    });
     },1000);

    /*Library Student Report End*/

     /* defalut Data  start */
        $scope.classes=[];
        $scope.cTypes=JSON.parse(sessionStorage.getItem('cTypes'));
        var clsArr=JSON.parse(sessionStorage.getItem('classes'));
        $scope.sections=JSON.parse(sessionStorage.getItem('sections'));
        var semArr=JSON.parse(sessionStorage.getItem('semesters'));

        $scope.changeCourseType=function(cType){
         $scope.streams="";
         $scope.streams=AdminService.changeCourseType(cType,clsArr);
        };

         $scope.changeStream=function(stream){
         if(stream=='')
          $scope.semesters=[];
        else if(stream=='FINANCE'||stream=='HUMAN RESOURCES')
          $scope.semesters=semArr.slice(0,4);
         else if(stream=='IT' || stream=='C.S.E'|| stream=='E.E.E'|| stream=='E.C.E'|| stream=='CIVIL'|| stream=='MECH'|| stream=='AERONAUTICAL'|| stream=='AGRICULTURAL'|| stream=='CHEMICAL')
           $scope.semesters=semArr.slice(0,8);
        else if(stream=='M.C.A')
          $scope.semesters=semArr.slice(0,5);
        };
     /* default Data end */
     /*Library Report End*/

      /*Library Student Date Report Start*/
   var libStuDateSuccCB=function(res){
      if(res.data)
      $scope.libDatesList=res.data;
      else
      $scope.libDatesList=[];
    }
    var libStuDateErrCB=function(res){
      
    }
   $scope.libStdDateSearch=function(){
     if($("#ReportForm").valid()){
      var dataObj={
            'type':'issueBook'
            }
              dataObj.cType=$scope.cType;
              dataObj.className=$scope.class;
              dataObj.section=$scope.section;
              dataObj.semester=$scope.semester;
              dataObj.date2=$scope.date2;
              dataObj.optId=8;
      ServerCall.getData('php/library.php','POST',dataObj,libStuDateSuccCB,libStuDateErrCB)
    }
    };
     
     $scope.fnValidDate=function(selDate){
     $scope.date2=selDate;
        }


    /*Library Student Date Report End*/

   /*Call Back Events Start*/
   $rootScope.$on('addBook',function(){
      $scope.getAddBookList();
    });
    $rootScope.$on('issueBook',function(){
      $scope.getIssueBookList();
    });
    $rootScope.$on('students',function(args,data){
      $scope.stdSearch(data);
    });
    /*Call Back Events End */

  });