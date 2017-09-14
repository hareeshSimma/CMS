angular.module('SMSApp')
        .controller('adminCtrl', function ($scope, $timeout, $rootScope, $modal, ServerCall, AdminService) {
            var userRole = sessionStorage.getItem("role");
            var userName = sessionStorage.getItem('uid');
            if (userName == undefined)
                return;
            if (userRole != undefined) {
                $rootScope.$emit('menuReset', userRole);
            }
            $scope.isDefault = true;
            //scope.tab = 1;
            $scope.tab = 1;
            // $scope.isCtype=true;
            // $scope.isSinfo=true;
            /* Default tabs visible */
            var setDefault = function () {
                $scope.isCtype = false;
                $scope.isClass = false;
                $scope.isSection = false;
                $scope.isUsers = false;
                $scope.isSubjects = false;
                $scope.isFee = false;
                $scope.isVehicle = false;
                $scope.isSinfo = false;
                $scope.isNews = false;
                $scope.isExams = false;
                $scope.isEmployee = false;

            }
            function selInnerLi(data) {
                $('#admin li').removeClass('selTab');
                $('#admin li:nth-child(' + data + ')').addClass('selTab');
            }
            $rootScope.$on('adminMenu', function (eve, data, bool) {
                if (bool) {
                    $scope.setTab(data);
                    selInnerLi(data);
                    bool = false;
                }

            });

            /* Tab click function */
            $scope.setTab = function (newTab) {
                $scope.tab = newTab;
                $scope.isDefault = false;
                setDefault();
                switch (newTab) {

                    case 1:
                        $scope.isSinfo = true;
                        $scope.getSinfoList();
                        break;
                    case 2:
                        $scope.isSubjects = true;
                        $scope.getSubjectsList();
                        break;
                    case 3:
                        $scope.isExams = true;
                        $scope.getExamsList();
                        break;
                    case 4:
                        $scope.isNews = true;
                        $scope.getNewsList();
                        break;
                    case 5:
                        $scope.isUsers = true;
                        $scope.getUsersList();
                        break;
                    case 6:
                        $scope.isEmployee = true;
                        $scope.getEmpList();
                        break;

                }
            };
            /* Tab active and inactive color function */
            $scope.isSet = function (tabNum) {
                return $scope.tab === tabNum;
            };

            /* Add and Edit Course type modal end */

            /* Delete Course Type start */
            $scope.deleteCType = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('cType');
                            }
                        }
                        var errCB = function (data) {
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'cType',
                                'optId': 2,
                                'pkString': data.cType
                            }
                            ServerCall.getData('Admin', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: false
                })
            }
            /* Delete Course Type end */

            //Course type code end

            //Class code start

            /* class list start */
            var classSuccCB = function (res) {
                if (res.data)
                    $scope.classList = res.data;
                else
                    $scope.classList = [];
            }
            var classErrCB = function (res) {
                debugger;
            }
            $scope.getClassList = function () {
                var dataObj = {
                    'optId': 3,
                    'type': 'class'
                }
                ServerCall.getData('Admin', 'POST', dataObj, classSuccCB, classErrCB)
            };
            /* class list end*/

            /* Add and Edid Class modal start */

            $scope.addClass = function (data) {
                $modal.open({
                    templateUrl: 'views/admin/classModal.html',
                    controller: function ($timeout, $scope, $modalInstance, $location, $rootScope, cTypeData, ServerCall) {
                        $scope.isSave = true;
                        $scope.cTypeList = cTypeData;

                        if (data != undefined) {
                            $scope.isSave = false;
                            $timeout(function () {
                                $scope.cType = data.cType;
                                $scope.class = data.class;
                            }, 100);

                        }
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('class');
                            }
                        }
                        var errCB = function (data) {

                        }
                        $scope.save = function (opt) {
                            var dataObj = {
                                'cType': $scope.cType,
                                'className': $scope.class,
                                'type': 'class'
                            }
                            if (opt == '1') {
                                dataObj.optId = 1;
                                dataObj.pkString = data.class;
                            }
                            ServerCall.getData('Admin', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        cTypeData: function () {
                            return $scope.cTypeList;
                            ;
                        }
                    }
                })
            };
            /* Add and Edit Class modal end */

            /* Delete Class start */
            $scope.deleteClass = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, $location, $rootScope, ServerCall) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('class');
                            }
                        }
                        var errCB = function (data) {
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'class',
                                'optId': 2,
                                'pkString': data.class
                            }
                            ServerCall.getData('Admin', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: false
                })
            }
            /* Delete Class end */

            //Class code end



            //Section code start

            /* Section list start */

            var sectionSuccCB = function (res) {
                if (res.data)
                    $scope.sectionList = res.data;
                else
                    $scope.sectionList = [];
            }
            var sectionErrCB = function (res) {
                debugger;
            }
            $scope.getSectionList = function () {
                var dataObj = {
                    'optId': 3,
                    'type': 'section'
                }
                ServerCall.getData('Admin', 'POST', dataObj, sectionSuccCB, sectionErrCB)
            };
            /* class list end*/

            /* Add and Edid Class modal start */

            $scope.addSection = function (data) {
                $modal.open({
                    templateUrl: 'views/admin/sectionModal.html',
                    controller: function ($timeout, $scope, $modalInstance, $location, $rootScope, cTypeData, classData, ServerCall) {
                        $scope.isSave = true;
                        $scope.cTypeList = cTypeData;
                        $scope.classList = classData;
                        $scope.changeCourseType = function (cType) {
                            $scope.class = "";
                            $scope.selClassList = AdminService.changeCourseType(cType, $scope.classList);
                        };
                        if (data != undefined) {
                            $scope.isSave = false;
                            $scope.changeCourseType(data.cType);
                            $timeout(function () {
                                $scope.cType = data.cType;
                                $scope.class = data.class;
                                $scope.section = data.section;
                            }, 100);

                        }

                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('section');
                            }
                        }
                        var errCB = function (data) {

                        }
                        $scope.save = function (opt) {
                            var dataObj = {
                                'cType': $scope.cType,
                                'className': $scope.class,
                                'section': $scope.section,
                                'type': 'section'
                            }
                            if (opt == '1') {
                                dataObj.optId = 1;
                                dataObj.pkString = data.section;
                            }
                            ServerCall.getData('Admin', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'md',
                    backdrop: 'static',
                    keyboard: 'false',
                    resolve: {
                        cTypeData: function () {
                            return $scope.cTypeList;
                        },
                        classData: function () {
                            return $scope.classList;
                        }
                    }
                })
            };
            /* Add and Edit Section modal end */

            /* Delete Section start */
            $scope.deleteSection = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, $location, $rootScope, ServerCall) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('section');
                            }
                        }
                        var errCB = function (data) {
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'section',
                                'optId': 2,
                                'pkString': data.section
                            }
                            ServerCall.getData('Admin', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            /* Delete Section end */

            //Section code end


            //Medium code start

            /* Medium list start */

            var mediumSuccCB = function (res) {
                if (res.data)
                    $scope.mediumList = res.data;
                else
                    $scope.mediumList = [];
            }
            var mediumErrCB = function (res) {
                debugger;
            }
            $scope.getMediumList = function () {
                var dataObj = {
                    'optId': 3,
                    'type': 'medium'
                }
                ServerCall.getData('Admin', 'POST', dataObj, mediumSuccCB, mediumErrCB)
            };
            /* Medium list end*/

            /* Add and Edid Medium modal start */

            $scope.addMedium = function (data) {
                $modal.open({
                    templateUrl: 'views/admin/mediumModal.html',
                    controller: function ($timeout, $scope, $modalInstance, $location, $rootScope, cTypeData, classData, sectionData, ServerCall) {
                        $scope.isSave = true;
                        $scope.cTypeList = cTypeData;
                        $scope.classList = classData;
                        $scope.sectionList = sectionData;
                        $scope.changeCourseType = function (cType) {
                            $scope.class = "";
                            $scope.selClassList = AdminService.changeCourseType(cType, $scope.classList);
                        };
                        $scope.changeClass = function (classData) {
                            $scope.section = "";
                            $scope.selSectionList = AdminService.changeClass(classData, $scope.sectionList);
                        };

                        if (data != undefined) {
                            $scope.isSave = false;
                            $scope.changeCourseType(data.cType);
                            $scope.changeClass(data.class);
                            $timeout(function () {
                                $scope.cType = data.cType;
                                $scope.class = data.class;
                                $scope.section = data.section;
                                $scope.medium = data.medium;
                            }, 100);

                        }

                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('medium');
                            }
                        }
                        var errCB = function (data) {

                        }
                        $scope.save = function (opt) {
                            var dataObj = {
                                'cType': $scope.cType,
                                'className': $scope.class,
                                'section': $scope.section,
                                'medium': $scope.medium,
                                'type': 'medium'
                            }
                            if (opt == '1') {
                                dataObj.optId = 1;
                                dataObj.pkString = data.medium;
                            }
                            ServerCall.getData('Admin', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'md',
                    backdrop: 'static',
                    keyboard: 'false',
                    resolve: {
                        cTypeData: function () {
                            return $scope.cTypeList;
                        },
                        classData: function () {
                            return $scope.classList;
                        },
                        sectionData: function () {
                            return $scope.sectionList;
                        }
                    }
                })
            };
            /* Add and Edit Medium modal end */

            /* Delete Medium start */
            $scope.deleteMedium = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, $location, $rootScope, ServerCall) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('medium');
                            }
                        }
                        var errCB = function (data) {
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'medium',
                                'optId': 2,
                                'pkString': data.medium
                            }
                            ServerCall.getData('Admin', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            /* Delete Medium end */

            //Medium code end


            //News code start 

            // News list start //
            var newsSuccCB = function (res) {
                if (res.data)
                    $scope.newsList = res.data;
                else
                    $scope.newsList = [];
            }
            var newsErrCB = function (res) {
                debugger;
            };
            $scope.getNewsList = function () {
                var dataObj = {
                    'optId': 0,
                    'type': 'news'
                };
                ServerCall.getData('php/common.php', 'POST', dataObj, newsSuccCB, newsErrCB);
            };

            // News list end //


//     Add and Edid news modal start //
            $scope.addNews = function (data) {
                $modal.open({
                    templateUrl: 'views/admin/newsModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.isSave = true;
                        $timeout(function () {
                            $("#NewsForm").validate({
                                rules: {
                                    News: "required",
                                },
                                messages: {
                                    News: "Please enter News",
                                },
                            });
                        }, 1000);

                        if (data != undefined) {
                            $scope.isSave = false;
                            $scope.News = data.news;
                            $scope.date = data.ndate;
                        }
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('news');
                            }
                            else{
                                $scope.msg=data;
                            }
                        }
                        var errCB = function (data) {
                         $scope.msg=data;
                        }
                        /* Date selection call back*/
                        $scope.fnDateSelection = function (selDate) {
                            $scope.date = selDate;
                        }
                        $scope.save = function (opt) {
                            if ($("#NewsForm").valid()) {
                                var dataObj = {
                                    'news': $scope.News,
                                    'ndate': $scope.date,
                                    'type': 'news'
                                }
                                if (opt == '2') {
                                    dataObj.optId = 2;
                                    dataObj.id = data.id;
                                } else {
                                    dataObj.optId = 1;
                                }
                                ServerCall.getData('php/common.php', 'POST', dataObj, sucCB, errCB)
                            }
                        }
                    },
                    size: 'md',
                    backdrop: 'static',
                    keyboard: 'false'
                })
            };
            // Add and Edit news modal end/ /

            // Delete news start//
            $scope.deleteNews = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('news');
                            }
                            else{
                                  $scope.msg=data;
                            }
                        }
                        var errCB = function (data) {
                              $scope.msg=data;
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'news',
                                'optId': 3,
                                'id': data.id
                            }
                            ServerCall.getData('php/common.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            // Delete News end //

            //Subjects code start
            // Subjects list start //
            var subjectsSuccCB = function (res) {
                if (res.data)
                    $scope.subjectsList = res.data;
                else
                    $scope.subjectsList = [];
            }
            var subjectsErrCB = function (res) {
                debugger;
            }
            $scope.getSubjectsList = function () {
                var dataObj = {
                    'optId': 4,
                    'type': 'subjects'
                }
                ServerCall.getData('php/admin.php', 'POST', dataObj, subjectsSuccCB, subjectsErrCB)
            };
            /* Subjects list end*/

            // Add and Edid Subjects modal start //
            $scope.addSubjects = function (data) {
                $modal.open({
                    templateUrl: 'views/admin/subjectsModal.html',
                    controller: function ($timeout, $scope, $modalInstance, $location, $rootScope, ServerCall, AdminService) {
                        $scope.isSave = true;
                        $timeout(function () {
                            $("#SubjectsForm").validate({
                                rules: {
                                    cType: "required",
                                    class: "required",
                                    semester: "required",
                                    section: "required",
                                    aceYear: "required",
                                    subject: "required"
                                },
                                messages: {
                                    cType: "Please select CourseType",
                                    class: "Please select Class",
                                    semester: "Please select Semester",
                                    section: "Please select Section",
                                    aceYear: "Please select Acdemic Year",
                                    subject: "Please enter Subject Name"
                                },
                            });
                        }, 1000);

                        $scope.semesters = [];
                        $scope.subList = [];
                        $scope.noOfSub = 0;
                        $scope.sub = {};
                        $scope.classes = [];
                        $scope.cTypes = JSON.parse(sessionStorage.getItem('cTypes'));
                        var clsArr = JSON.parse(sessionStorage.getItem('classes'));
                        $scope.sections = JSON.parse(sessionStorage.getItem('sections'));
                        var semArr = JSON.parse(sessionStorage.getItem('semesters'));

                        $scope.changeCourseType = function (cType) {
                            $scope.streams = [];
                            $scope.streams = AdminService.changeCourseType(cType, clsArr);
                        };
                        $scope.changeStream = function (stream) {
                            $scope.semesters = [];
                            $scope.semesters = AdminService.changeStream(stream, semArr, $scope.cType);
                        };

                        $scope.addSubTextBox = function () {
                            $scope.noOfSub = $scope.noOfSub + 1;
                            var tempObj = {
                                'subName': 'subjects' + ($scope.noOfSub)
                            }
                            $scope.subList.push(tempObj);
                        }

                        $scope.deleteSubTextBox = function (data) {
                            if ($scope.noOfSub != 1) {
                                var _tempsub = {};
                                var index = 1;
                                delete $scope.sub[data];
                                $scope.noOfSub = $scope.noOfSub - 1;
                                angular.forEach($scope.sub, function (val, key) {
                                    _tempsub['subject' + index] = val;
                                    index++;
                                });
                                $scope.sub = _tempsub;
                            }
                            $scope.subList.pop();
                        }

                        if (data != undefined) {
                            var subArr = data.subjects.split(',');
                            $scope.noOfSub = subArr.length;
                            for (var i = 1; i <= subArr.length; i++) {
                                $scope.sub['subject' + i] = subArr[i - 1];
                                $scope.subList.push({
                                    'subName': 'subject' + i
                                });
                            }
                            $scope.subList.shift();
                            $scope.isSave = false;
                            $timeout(function () {
                                $scope.cType = data.cType;
                                $scope.class = data.class;
                                $scope.semester = data.semester;
                                $scope.section = data.section;
                                $scope.aceYear = data.aceYear;
                            }, 100)
                            /*Sscope.subjects=data.subject;*/
                            $scope.changeCourseType(data.cType);
                            $scope.changeStream(data.class);
                        }

                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('subjects');
                            } else {
                                $scope.msg = data.message;
                            }
                        }
                        var errCB = function (data) {
                           $scope.msg=data;
                        }
                        $scope.save = function (opt) {
                            if ($("#SubjectsForm").valid()) {
                                var subjectStr = '';
                                angular.forEach($scope.sub, function (val, key) {

                                    subjectStr = subjectStr + val + ',';
                                });
                                subjectStr = subjectStr.substring(0, subjectStr.length - 1);
                                var dataObj = {
                                    'cType': $scope.cType,
                                    'className': $scope.class,
                                    'section': $scope.section,
                                    'semester': $scope.semester,
                                    'acdemicYear': $scope.aceYear,
                                    'subjects': subjectStr,
                                    'type': 'subjects'
                                }
                                if (opt == '6') {
                                    dataObj.optId = 6;
                                    dataObj.id = data.id;
                                } else {
                                    dataObj.optId = 5;
                                }
                                ServerCall.getData('php/admin.php', 'POST', dataObj, sucCB, errCB)
                            }
                        }
                    },
                    size: 'md',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            };
            // Add and Edit Subjects modal end/ /

            ///Delete Subjects start //
            $scope.deleteSubjects = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, $location, $rootScope, ServerCall) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('subjects');
                            }
                        }
                        var errCB = function (data) {
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'subjects',
                                'optId': 7,
                                'id': data.id
                            }
                            ServerCall.getData('php/admin.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            // Delete Subjects end //

            //News code start 

            /* News list start */



//    var newsSuccCB=function(res){
//      if(res.data)
//      $scope.newsList=res.data;
//      else
//      $scope.newsList=[];
//    }
//    var newsErrCB=function(res){
//      debugger;
//    }
//    $scope.getNewsList=function(){
//      var dataObj={
//            'optId':0,
//            'type':'news'
//            }
//      ServerCall.getData('php/common.php','POST',dataObj,newsSuccCB,newsErrCB)
//    };
//
//  
//       
//   
//    /* Add and Edid news modal start */
//    $scope.addNews=function(data){
//    $modal.open({
//    templateUrl: 'views/admin/newsModal.html',
//    controller: function($scope,$modalInstance,ServerCall,$location,$rootScope){
//        $scope.isSave=true;
//        $timeout(function(){
//       $("#NewsForm").validate({
//         rules: {
//            News: "required",
//        },
//        messages: {
//            News: "Please enter News",
//         },
//    });
//     },1000);
//
//        if(data != undefined){
//          $scope.isSave=false;
//          $scope.News=data.news;
//          $scope.date=data.ndate;
//        }
//        $scope.close=function(){
//          $modalInstance.close();
//        }
//        var sucCB=function(data){
//          if(data.status=='success'){
//            $modalInstance.close();
//            $rootScope.$broadcast('news');
//          }
//        }
//        var errCB=function(data){
//
//        }
//        /* Date selection call back*/
//        $scope.fnDateSelection=function(selDate){
//          $scope.date=selDate;
//        }
//        $scope.save=function(opt){
//          if($("#NewsForm").valid()){
//            var dataObj={
//            'news':$scope.News,
//            'ndate':$scope.date,
//            'type':'news'
//            }
//            if(opt=='2'){
//              dataObj.optId=2;
//              dataObj.id=data.id;
//            }
//           ServerCall.getData('php/common.php','POST',dataObj,sucCB,errCB)
//        }
//      }
//    },
//    size: 'md',
//    backdrop: 'static',
//    keyboard: 'false'
//    })
//   }; 
//   /*Add and Edit news modal end */
//
//   /*Delete news start*/
//   $scope.deleteNews=function(data){
//            $modal.open({
//    templateUrl: 'views/confirmationModal.html',
//    controller: function($scope,$modalInstance,ServerCall,$location,$rootScope){
//        $scope.close=function(){
//          $modalInstance.close();
//        }
//        var sucCB=function(data){
//          if(data.status=='success'){
//            $modalInstance.close();
//            $rootScope.$broadcast('news');
//          }
//        }
//        var errCB=function(data){
//        }
//        $scope.yes=function(){ 
//          var dataObj={
//            'type':'news',
//            'optId':3,
//            'id':data.id
//            }
//           ServerCall.getData('php/common.php','POST',dataObj,sucCB,errCB)
//        }
//    },
//    size: 'sm',
//    backdrop: 'static',
//    keyboard: 'false',
//    })
//   }

            /* Delete News end */
            //Vehicle code start 

            /* Vehicle list start */
            var VehicleSuccCB = function (res) {
                if (res.data)
                    $scope.vehicleList = res.data;
                else
                    $scope.vehicleList = [];
            }
            var VehicleErrCB = function (res) {
                debugger;
            }
            $scope.getVehicleList = function () {
                var dataObj = {
                    'optId': 3,
                    'type': 'vehicle'
                }
                ServerCall.getData('Admin', 'POST', dataObj, VehicleSuccCB, VehicleErrCB)
            };




            /* Add and Edid vehicle modal start */

            $scope.addVehicle = function (data) {
                $modal.open({
                    templateUrl: 'views/admin/vehicleModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.isSave = true;

                        if (data != undefined) {
                            $scope.isSave = false;
                            $scope.Vehicle = data.vehicle;
                            $scope.Route = data.route;
                            $scope.Capacity = data.capacity;

                        }
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('vehicle');
                            }
                        }
                        var errCB = function (data) {

                        }
                        $scope.save = function (opt) {
                            var dataObj = {
                                'vehicle': $scope.Vehicle,
                                'route': $scope.Route,
                                'capacity': $scope.Capacity,
                                'type': 'vehicle'
                            }
                            if (opt == '1') {
                                dataObj.optId = 1;
                                dataObj.id = data.id;
                            }
                            ServerCall.getData('Admin', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'md',
                    backdrop: 'static',
                    keyboard: 'false'
                })
            };
            /* Add and Edit vehicle modal end */

            /* Delete vehicle start */
            $scope.deleteVehicle = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('vehicle');
                            }
                        }
                        var errCB = function (data) {
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'vehicle',
                                'optId': 2,
                                'id': data.id
                            }
                            ServerCall.getData('Admin', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            /* Delete Vehicle end */

            // Vehicle end

            //school  info code start 
            //  school  info list start/ /
            var SinfoSuccCB = function (res) {
                if (res.data)
                    $scope.sinfoList = res.data;
                else
                    $scope.sinfoList = [];
            }
            var SinfoErrCB = function (res) {
                debugger;
            }
            $scope.getSinfoList = function () {
                var dataObj = {
                    'optId': 3,
                    'type': 'sinfo'
                }
                ServerCall.getData('php/admin.php', 'POST', dataObj, SinfoSuccCB, SinfoErrCB)
            };

            // Add and Edid school  info modal start //
            $scope.addSinfo = function (data) {
                $modal.open({
                    templateUrl: 'views/admin/schoolInfoModal.html',
                    controller: function ($scope, $modalInstance, $location, $rootScope, $timeout, stateData, districtData, ServerCall) {
                        $timeout(function () {
                            $("#SinfoForm").validate({
                                rules: {
                                    address: "required",
                                    CollegeName: "required",
                                    CollegeCaption: "required",
                                    CampusName: "required",
                                    CampusCode: "required",
                                    Street: "required",
                                    PinCode: {
                                        "required": true,
                                        "digits": true,
                                        "minlength": 4
                                    },
                                    PhoneNumber: {
                                        "required": true,
                                        "digits": true,
                                        "minlength": 10,
                                        "maxlength": 12
                                    },
                                    Email: {
                                        "required": true,
                                        "email": true
                                    },
                                    Logo: "required",
                                    CollegeCode: "required",
                                    Website: "required",
                                    state: "required",
                                    District: "required",
                                },
                                messages: {
                                    address: "Please enter Address",
                                    CollegeName: "Please enter Your College Name",
                                    CollegeCaption: "Please enter College Caption",
                                    CampusName: "Please enter Campus Name",
                                    CampusCode: "Please enter Campus Code",
                                    Street: "Please enter Street ",
                                    PinCode: {
                                        "required": "Please enter pincode",
                                    },
                                    PhoneNumber: {
                                        "required": "Please enter PhoneNumber",
                                    },
                                    Email: {
                                        "required": "Please enter EmailId"
                                    },
                                    Logo: "Please select logo",
                                    CollegeCode: "Please enter College Code",
                                    Website: "Please enter Website",
                                    state: "Please select State",
                                    District: "Please select District",
                                },
                            });
                        }, 1000);

                        $scope.isSave = true;
                        $scope.states = [];
                        $scope.cities = [];
                        $scope.states = JSON.parse(sessionStorage.getItem('states'));
                        $scope.distArr = JSON.parse(sessionStorage.getItem('districts'));

                        $scope.changeState = function (state) {
                            $scope.district = "";
                            if (state == '')
                                $scope.districts = [];
                            else if (state == 'Telangana')
                                $scope.districts = $scope.distArr.slice(13, 22);
                            else
                                $scope.districts = $scope.distArr.slice(0, 12);
                        };

                        if (data != undefined) {
                            $scope.isSave = false;
                            $scope.CollegeName = data.collegeName;
                            $scope.CollegeCaption = data.collegeCaption;
                            $scope.CampusName = data.campusName;
                            $scope.CampusCode = data.campusCode;
                            $scope.city = data.city;
                            $scope.Street = data.street;
                            $scope.PinCode = data.pinCode;
                            $scope.PhoneNumber = data.phoneNumber;
                            $scope.Email = data.email;
                            $scope.Logo = data.logo;
                            $scope.CollegeCode = data.collegeCode;
                            $scope.Website = data.website;
                            $scope.Estd = data.estd;
                            $timeout(function () {
                                $scope.state = data.state;
                                $scope.District = data.district;
                            }, 100)
                        }
                        $scope.fnSinfoSelection = function (selDate) {
                            $scope.Estd = selDate
                        }

                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('sinfo');
                            }
                            else{
                                  $scope.msg=data.message;
                                 
                            }
                        }
                        var errCB = function (data) {
                             $scope.msg=data.message;
                        }
                        $scope.save = function (opt) {
                            if ($("#SinfoForm").valid()) {
                                var dataObj = {
                                    'collegeName': $scope.CollegeName,
                                    'collegeCaption': $scope.CollegeCaption,
                                    'campusName': $scope.CampusName,
                                    'campusCode': $scope.CampusCode,
                                    'state': $scope.state,
                                    'district': $scope.District,
                                    'city': $scope.city,
                                    'street': $scope.Street,
                                    'pinCode': $scope.PinCode,
                                    'phoneNumber': $scope.PhoneNumber,
                                    'email': $scope.Email,
                                    'logo': $scope.Logo,
                                    'collegeCode': $scope.CollegeCode,
                                    'website': $scope.Website,
                                    'estd': $scope.Estd,
                                    'type': 'sinfo'
                                }
                                if (opt == '1') {
                                    dataObj.optId = 1;
                                    dataObj.pkString = data.collegeCode;
                                } else {
                                    dataObj.optId = 0;
                                }
                                ServerCall.getData('php/admin.php', 'POST', dataObj, sucCB, errCB)
                            }
                        }
                    },
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: 'false',
                    resolve: {
                        stateData: function () {
                            return $scope.stateList;
                        },
                        districtData: function () {
                            return $scope.districtList;
                        }
                    }
                })
            };
            // Add and Edit school  info modal end //

            // Delete school  info start //
            $scope.deleteSinfo = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('sinfo');
                            }
                            else{
                                  $scope.msg=data.message;
                            }
                        }
                        var errCB = function (data) {
                            $scope.msg=data.message;
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'sinfo',
                                'optId': 2,
                                'pkString': data.collegeCode
                            }
                            ServerCall.getData('php/admin.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            // Delete school  info end
            // school  info end

// exams code start

            // exams list start 

            /* exams list end*/

            // Add and Edid exams modal start //


// exams code start

            // exams list start //

            var examsSuccCB = function (res) {
                if (res.data)
                    $scope.examsList = res.data;
                else
                    $scope.examsList = [];
            }
            var examsErrCB = function (res) {
                debugger;
            }
            $scope.getExamsList = function () {
                var dataObj = {
                    'optId': 8,
                    'type': 'exams'
                }
                ServerCall.getData('php/admin.php', 'POST', dataObj, examsSuccCB, examsErrCB)
            };
            /* exams list end*/

            // Add and Edid exams modal start //

            $scope.addExams = function (data) {
                $modal.open({
                    templateUrl: 'views/admin/examsModal.html',
                    controller: function ($timeout, $scope, $modalInstance, $location, $rootScope, cTypeData, classData, sectionData, mediumData, ServerCall) {
                        $timeout(function () {
                            $("#ExamForm").validate({
                                rules: {
                                    cType: "required",
                                    class: "required",
                                    semester: "required",
                                    section: "required",
                                    exm: "required",
                                },
                                messages: {
                                    cType: "Please select Course",
                                    class: "Please select Class",
                                    semester: "Please select Section",
                                    section: "Please select Medium",
                                    exm: "Please check atleast one Exam",
                                },
                            });
                        }, 1000);

                        $scope.isSave = true;
                        $scope.classes = [];
                        $scope.exm = {};

                        $scope.cTypes = JSON.parse(sessionStorage.getItem('cTypes'));
                        var clsArr = JSON.parse(sessionStorage.getItem('classes'));
                        $scope.sections = JSON.parse(sessionStorage.getItem('sections'));
                        var semArr = JSON.parse(sessionStorage.getItem('semesters'));
                        $scope.exams = JSON.parse(sessionStorage.getItem('exams'));

                        $scope.changeCourseType = function (cType) {
                            $scope.streams = [];
                            $scope.streams = AdminService.changeCourseType(cType, clsArr);
                        };

                        $scope.changeStream = function (stream) {

                            if (stream == '')
                                $scope.semesters = [];
                            else if (stream == 'FINANCE' || stream == 'HUMAN RESOURCES')
                                $scope.semesters = semArr.slice(0, 4);
                            else if (stream == 'IT' || stream == 'C.S.E' || stream == 'E.E.E' || stream == 'E.C.E' || stream == 'CIVIL' || stream == 'MECH' || stream == 'AERONAUTICAL' || stream == 'AGRICULTURAL' || stream == 'CHEMICAL')
                                $scope.semesters = semArr.slice(0, 8);
                            else if (stream == 'M.C.A')
                                $scope.semesters = semArr.slice(0, 6);

                        };

                        if (data != undefined) {
                            $scope.isSave = false;
                            var _tempSelExams = {};
                            $scope.changeCourseType(data.cType);
                            $scope.changeStream(data.className);
                            if (data.exams != undefined) {
                                var _tempExmArr = data.exams.split(',');
                                for (var i = 0; i < _tempExmArr.length; i++) {
                                    _tempSelExams[_tempExmArr[i]] = true;
                                }
                            }
                            $timeout(function () {
                                $scope.cType = data.cType;
                                $scope.class = data.className;
                                $scope.section = data.section;
                                $scope.semester = data.semester;
                                $scope.exm = _tempSelExams;
                                $scope.aceYear = data.aceYear;
                            }, 100);

                        }

                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('exams');
                            } else {
                                $scope.msg = data.message;
                            }
                        }
                        var errCB = function (data) {
                            $scope.msg=data.message;
                        }
                        $scope.save = function (opt) {
                            if ($("#ExamForm").valid()) {
                                var examStr = '';
                                angular.forEach($scope.exm, function (val, key) {
                                    if (val == true)
                                        examStr = examStr + key + ',';
                                });
                                examStr = examStr.substring(0, examStr.length - 1);
                                var dataObj = {
                                    'cType': $scope.cType,
                                    'className': $scope.class,
                                    'section': $scope.section,
                                    'semester': $scope.semester,
                                    'acdemicYear': $scope.aceYear,
                                    'exams': examStr,
                                    'type': 'exams'
                                }
                                if (opt == '10') {
                                    dataObj.optId = 10;
                                    dataObj.id = data.id;
                                } else {
                                    dataObj.optId = 9;
                                }
                                ServerCall.getData('php/admin.php', 'POST', dataObj, sucCB, errCB)
                            }
                        }
                    },
                    size: 'md',
                    backdrop: 'static',
                    keyboard: 'false',
                    resolve: {
                        cTypeData: function () {
                            return $scope.cTypeList;
                        },
                        classData: function () {
                            return $scope.classList;
                        },
                        sectionData: function () {
                            return $scope.sectionList;
                        },
                        mediumData: function () {
                            return $scope.mediumList;
                        }
                    }
                })
            };
            //Add and Edit Exam modal end /

            // Delete Exam start /
            $scope.deleteExams = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, $location, $rootScope, ServerCall) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('exams');
                            }
                            else{
                                  $scope.msg=data.message;
                            }
                        }
                        var errCB = function (data) {
                          $scope.msg=data.message;
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'exams',
                                'optId': 11,
                                'id': data.id
                            }
                            ServerCall.getData('php/admin.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            // Delete Exams end /

            //Exams code end

            /* Default Load*/
            if ($scope.tab == 8)
                $scope.getSinfoList();


            /* leave code start */
            /*var leavesSuccCB=function(res){
             if(res.data)
             $scope.leavesList=res.data;
             else
             $scope.leavesList=[];
             }
             var leavesErrCB=function(res){
             debugger;
             }
             $scope.getLeavesList=function(){
             var dataObj={
             'optId':3,
             'type':'leaves'
             }
             ServerCall.getData('Admin','POST',dataObj,leavesSuccCB,leavesErrCB)
             };
             */
            // Add and Edit leaves modal start //
            /* $scope.addLeaves=function(data){
             $modal.open({
             templateUrl: 'views/admin/leaveModal.html',
             controller: function($scope,$modalInstance,ServerCall,$location,$rootScope,$timeout){
             $scope.isSave=true;
             if(data != undefined){
             $scope.isSave=false;
             $timeout(function(){
             $scope.location=data.location;
             $scope.empType=data.employee;
             $scope.leaveType=data.leavetype;
             $scope.aceYear=data.acdemicYear;
             $scope.noflvs=data.nooflvs;
             }, 100);
             }
             $scope.close=function(){
             $modalInstance.close();
             }
             var sucCB=function(data){
             if(data.status=='success'){
             $modalInstance.close();
             $rootScope.$broadcast('leaves');
             }
             }
             var errCB=function(data){
             
             }*/
            /* Date selection call back*/
            /* $scope.fnDateSelection=function(selDate){
             $scope.date=selDate;
             }
             $scope.save=function(opt){
             var dataObj={
             'location':$scope.location,
             'employee':$scope.empType,
             'leavetype':$scope.leaveType,
             'acdemicYear':$scope.aceYear,
             'nooflvs':$scope.noflvs,
             'type':'leaves'
             }
             if(opt=='1'){
             dataObj.optId=1;
             dataObj.id=data.id;
             }
             ServerCall.getData('Admin','POST',dataObj,sucCB,errCB)
             }
             
             },
             size:'md',
             backdrop:'static',
             keyboard:'false'
             })
             }; */
            // Add and Edit leaves modal end/ /

            // Delete leaves start//
            /*$scope.deleteLeaves=function(data){
             $modal.open({
             templateUrl: 'views/confirmationModal.html',
             controller: function($scope,$modalInstance,ServerCall,$location,$rootScope){
             $scope.close=function(){
             $modalInstance.close();
             }
             var sucCB=function(data){
             if(data.status=='success'){
             $modalInstance.close();
             $rootScope.$broadcast('leaves');
             }
             }
             var errCB=function(data){
             }
             $scope.yes=function(){ 
             var dataObj={
             'type':'leaves',
             'optId':2,
             'id':data.id
             }
             ServerCall.getData('Admin','POST',dataObj,sucCB,errCB)
             }
             },
             size: 'sm',
             backdrop: 'static',
             keyboard: 'false',
             })
             }*/
            // Delete leaves end //

            //Users  Start


            // users list start //

            var usersSuccCB = function (res) {
                if (res.data)
                    $scope.usersList = res.data;
                else
                    $scope.usersList = [];
            }
            var usersErrCB = function (res) {
                debugger;
            }
            $scope.getUsersList = function () {
                var dataObj = {
                    'optId': 12,
                    'type': 'users'
                }
                ServerCall.getData('php/admin.php', 'POST', dataObj, usersSuccCB, usersErrCB)
            };
            /* Users list end*/
            // Add and Edid exams modal start //

            $scope.addUsers = function (data) {
                $modal.open({
                    templateUrl: 'views/admin/userModal.html',
                    controller: function ($timeout, $scope, $modalInstance, $location, $rootScope, ServerCall) {
                        $scope.tabs = [
                            {
                                name: "ADMIN TAB",
                                id: 'admin'
                            },
                            {
                                name: 'STUDENT TAB',
                                id: 'student'
                            }, {
                                name: 'EXAM TAB',
                                id: 'exam'
                            }, {
                                name: 'EXAM FEE TAB',
                                id: 'examFee'
                            }, {
                                name: 'ATTENDENCE TAB',
                                id: 'attendence'
                            }, {
                                name: 'EMPLOYEE TAB',
                                id: 'employee'
                            }, {
                                name: 'FINANCE TAB',
                                id: 'finance'
                            }, {
                                name: 'TRANSPORT TAB',
                                id: 'transport'
                            }, {
                                name: 'STORE TAB',
                                id: 'store'
                            }, {
                                name: 'PLACEMENT TAB',
                                id: 'placement'
                            }, {
                                name: 'HOSTEL TAB',
                                id: 'hostel'
                            }


                        ];

                        $timeout(function () {
                            $("#UserForm").validate({
                                rules: {
                                    uname: "required",
                                    pwd: "required",
                                },
                                messages: {
                                    uname: "Please Enter Uname",
                                    pwd: "Please Enter Password"
                                }
                            });
                        }, 1000);

                        $scope.isSave = true;
                        $scope.classes = [];
                        $scope.tab = {};
                        $scope.fnChk = function (tab) {

                        }
                        if (data != undefined) {
                            $scope.isSave = false;
                            var _tempSelTabs = {};
                            if (data.tabs != undefined) {
                                var _tempTabsArr = data.tabs.split(',');
                                if (_tempTabsArr[0] == 'all') {
                                    $scope.isAll = true;
                                }
                                for (var i = 0; i < _tempTabsArr.length; i++) {
                                    _tempSelTabs[_tempTabsArr[i]] = true;
                                }
                            }
                            $scope.tab = _tempSelTabs;
                            $scope.uname = data.uname;
                            $scope.pwd = data.pwd;
                        }

                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('users');
                            }
                            else{
                                 $scope.msg=data.message;
                            }
                        }
                        var errCB = function (data) {
                            $scope.msg=data.message;
                        }
                        $scope.save = function (opt) {
                            if ($("#UserForm").valid()) {
                                var roleStr = '';
                                if ($scope.isAll) {
                                    roleStr = 'all'
                                } else {
                                    angular.forEach($scope.tab, function (val, key) {
                                        if (val == true && key != 'all')
                                            roleStr = roleStr + key + ',';
                                    });
                                    roleStr = roleStr.substring(0, roleStr.length - 1);
                                }
                                var dataObj = {
                                    'uname': $scope.uname,
                                    'pwd': $scope.pwd,
                                    'role': roleStr,
                                    'school': '',
                                    'type': 'users'
                                };
                                if (data != undefined) {
                                    dataObj.optId = 14;
                                    dataObj.id = data.id;
                                } else {
                                    dataObj.optId = 13;
                                }
                                ServerCall.getData('php/admin.php', 'POST', dataObj, sucCB, errCB)
                            }
                        }
                    },
                    size: 'md',
                    backdrop: 'static',
                    keyboard: 'false',
                    resolve: {
                    }
                })
            };
            //Add and Edit Users modal end /
            //Delete User Start
            $scope.deleteUsers = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, $location, $rootScope, ServerCall) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('users');
                            }else{
                                  $scope.msg=data.message;
                            }
                        }
                        var errCB = function (data) {
                            $scope.msg=data.message;
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'users',
                                'optId': 15,
                                'id': data.id
                            }
                            ServerCall.getData('php/admin.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }


            //Delete User End
            //Users End


            /*employee code start*/
            var employeeSuccCB = function (res) {

                if (res.data)
                    $scope.employeeList = res.data;
                else
                    $scope.employeeList = [];
            }
            var employeeErrCB = function (res) {
                debugger;
            }
            $scope.getEmpList = function () {
                var dataObj = {
                    'optId': 0,
                    'type': 'employee'
                };
                ServerCall.getData('php/employee.php', 'POST', dataObj, employeeSuccCB, employeeErrCB);

            };

            /* employee list end */
            /* Add and Edid employee modal start */

            $scope.addEmployee = function (data) {
                $modal.open({
                    templateUrl: 'views/employee/empModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.isSave = true;
                        $scope.isPersonlDet = true;
                        $scope.isPreview = true;
                        $scope.goNext = function () {
                            $scope.isPersonlDet = false;
                        }
                        $scope.goBack = function () {
                            $scope.isPersonlDet = true;

                        }
                        $scope.goPreview = function () {
                            /*$scope.isPersonlDet=false;*/
                            $scope.isPreview = false;

                        }
                        $scope.goModify = function () {
                            $scope.isPreview = true;
                        }
                        $scope.banks = JSON.parse(sessionStorage.getItem('banks'));
                        if (data != undefined) {
                            $scope.isSave = false;
                            $scope.empType = data.employee;
                            $scope.name = data.name;
                            $scope.dob = data.dob;
                            $scope.gender = data.gender;
                            $scope.qulf = data.qualification;
                            $scope.exprnc = data.experience;
                            $scope.phNo = data.phonenumber;
                            $scope.salary = data.salary;
                            $scope.address = data.address;
                            $scope.email = data.emailid;
                            $scope.Joiningdate = data.doj;
                            $scope.Maritalstatus = data.maritalstatus;
                            $scope.Prvorg = data.previousorg;
                            $scope.Bldgrp = data.bloodgrp;
                            $scope.vehicle = data.vehicle;
                            $scope.photo = "path" //data.photo;
                            $scope.desig = data.desig;
                            $scope.component = data.component;
                            $scope.freq = data.freq;
                            $scope.currency = data.currency;
                            $scope.casual = data.casual;
                            $scope.maternity = data.maternity;
                            $scope.sick = data.sick;
                            $scope.amt = data.amt;
                            $scope.comments = data.comments;
                            $scope.acNo = data.acNo;
                            $scope.acType = data.acType;
                            $scope.bank = data.bank;
                            $scope.ifsc = data.ifsc;


                        }
                        $scope.fnDOJSelection = function (selDate) {
                            $scope.Joiningdate = selDate
                        }
                        $scope.fnDOBSelection = function (selDate) {
                            $scope.dob = selDate
                        }


                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('employee');
                            }
                            else{
                                 $scope.msg=data.message;
                            }
                        }
                        var errCB = function (data) {
                       $scope.msg=data.message;
                        }
                        $scope.save = function (opt) {
                            var dataObj = {
                                'employee': $scope.empType,
                                'name': $scope.name,
                                'dob': $scope.dob,
                                'gender': $scope.gender,
                                'qualification': $scope.qulf,
                                'experience': $scope.exprnc,
                                'phonenumber': $scope.phNo,
                                'salary': $scope.salary,
                                'address': $scope.address,
                                'emailid': $scope.email,
                                'doj': $scope.Joiningdate,
                                'maritalstatus': $scope.Maritalstatus,
                                'previousorg': $scope.Prvorg,
                                'bloodgrp': $scope.Bldgrp,
                                'photo': 'path',
                                'vehicle': $scope.vehicle,
                                'desig': $scope.desig,
                                'component': $scope.component,
                                'freq': $scope.freq,
                                'currency': $scope.currency,
                                'casual': $scope.casual,
                                'maternity': $scope.maternity,
                                'sick': $scope.sick,
                                'amt': $scope.amt,
                                'comments': $scope.comments,
                                'acNo': $scope.acNo,
                                'acType': $scope.acType,
                                'bank': $scope.bank,
                                'ifsc': $scope.ifsc,
                                'type': 'employee'
                            }
                            if (opt == '2') {
                                dataObj.optId = 2;
                                dataObj.pkValue = data.empId;
                            }
                            else {
                                dataObj.optId = 1;
                                dataObj.clRemain = $scope.casual;
                                dataObj.slRemain = $scope.sick;
                                dataObj.mlRemain = $scope.maternity;
                            }
                            ServerCall.getData('php/employee.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: 'false',
                    resolve: {
                        employeeData: function () {
                            return $scope.employeeList;
                        }
                    }
                })
            };
            /* Add and Edit employee modal end */

            /* Delete employee start */
            $scope.deleteEmployee = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('employee');
                            }
                            else{
                                  $scope.msg=data.message;
                            }
                        }
                        var errCB = function (data) {
                             $scope.msg=data.message;
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'employee',
                                'optId': 3,
                                'pkValue': data.empId
                            }
                            ServerCall.getData('php/employee.php', 'POST', dataObj, sucCB, errCB);
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }

//employee end
            /* call back Events */
            $rootScope.$on('exams', function () {
                $scope.getExamsList();
            });

            $rootScope.$on('subjects', function () {
                $scope.getSubjectsList();
            });

            $rootScope.$on('section', function () {
                $scope.getSectionList();
            });

            $rootScope.$on('class', function () {
                $scope.getClassList();
            });

            $rootScope.$on('cType', function () {
                $scope.getCTypeList();
            });
            $rootScope.$on('news', function () {
                $scope.getNewsList();
            });
            $rootScope.$on('vehicle', function () {
                $scope.getVehicleList();
            });
            $rootScope.$on('sinfo', function () {
                $scope.getSinfoList();
            });
            $rootScope.$on('leaves', function () {
                $scope.getLeavesList();
            });
            $rootScope.$on('users', function () {
                $scope.getUsersList();
            });
            $rootScope.$on('employee', function () {
                $scope.getEmpList();

            });
        });


/*Events End */
 