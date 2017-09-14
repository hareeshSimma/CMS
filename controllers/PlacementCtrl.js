
angular.module('SMSApp')
        .controller('placementCtrl', function ($scope, $rootScope, $modal, ServerCall, AdminService, $timeout) {
            var userRole = sessionStorage.getItem("role");
            var userName = sessionStorage.getItem('uid');
            if (userName == undefined)
                return;
            if (userRole != undefined) {
                $rootScope.$emit('menuReset', userRole);
            }
            // $scope.tab = 1;
            //$scope.isCompanyProfile=true;
            $scope.isDefault = true;
            var setDefault = function () {
                $scope.isCompanyProfile = false;
                $scope.isInterview = false;
                $scope.isStudents = false;
                $scope.isReports = false;
            }
            function selInnerLi(data) {
                $('#placement li').removeClass('selTab');
                $('#placement li:nth-child(' + data + ')').addClass('selTab');
            }
            $rootScope.$on('placementMenu', function (eve, data) {
                $scope.setTab(data);
                selInnerLi(data);
            });

            $scope.setTab = function (newTab) {
                $scope.tab = newTab;
                $scope.isDefault = false;
                setDefault();
                switch (newTab) {
                    case 1:
                        $scope.isCompanyProfile = true;
                        $scope.getCompanyProfileList();
                        break;
                    case 2:
                        $scope.isInterview = true;
                        $scope.getInterviewList();
                        break;
                    case 3:
                        $scope.isStudents = true;
                        $scope.getStudentsList();
                        break;
                    case 4:
                        $scope.isReports = true;
                        break;
                }
            };

            /* Tab active and inactive color function */
            $scope.isSet = function (tabNum) {
                return $scope.tab === tabNum;
            };

            //company code start 
            /* Company list start */
            var CompanyProfileSuccCB = function (res) {
                if (res.data)
                    $scope.companyProfileList = res.data;
                else
                    $scope.companyProfileList = [];
            }
            var CompanyProfileErrCB = function (res) {
                debugger;
            }
            $scope.getCompanyProfileList = function () {
                var dataObj = {
                    'optId': 0,
                    'type': 'companyProfile'
                }
                ServerCall.getData('php/placement.php', 'POST', dataObj, CompanyProfileSuccCB, CompanyProfileErrCB)
            };

            /* Default Load*/
            if ($scope.tab == 1)
                $scope.getCompanyProfileList();

            /* Add and Edid company profile modal start */
            $scope.addCompanyProfile = function (data) {
                $modal.open({
                    templateUrl: 'views/placement/companyProfileModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope, $timeout) {
                        $timeout(function () {
                            $("#ComProfileForm").validate({
                                rules: {
                                    CompanyCode: "required",
                                    CompanyName: "required",
                                    Contact: "required",
                                    Phone: {
                                        "required": true,
                                        "digits": true,
                                        "minlength": 10,
                                        "maxlength": 12
                                    },
                                    Mobile: {
                                        "required": true,
                                        "digits": true,
                                        "minlength": 10,
                                        "maxlength": 12
                                    },
                                    Emailid: {
                                        "required": true,
                                        "email": true
                                    },
                                    state: "required",
                                    City: "required",
                                    address: "required",
                                },
                                messages: {
                                    CompanyCode: "Please enter Company Code",
                                    CompanyName: "Please enter Company Name",
                                    Contact: "Please enter Name",
                                    Phone: {
                                        "required": "Please enter Ph.No"
                                    },
                                    Mobile: {
                                        "required": "Please enter Mobile Number"
                                    },
                                    Emailid: {
                                        "required": "Please enter MailId"
                                    },
                                    state: "Please select State",
                                    City: "Please enter City",
                                    address: "Please enter Address",
                                },
                            });
                        }, 1000);

                        $scope.isSave = true;
                        if (data != undefined) {
                            $scope.isSave = false;
                            $scope.CompanyCode = data.companyCode;
                            $scope.CompanyName = data.companyName;
                            $scope.Estd = data.estd;
                            $scope.Contact = data.contact;
                            $scope.Phone = data.phone;
                            $scope.Mobile = data.mobile;
                            $scope.Emailid = data.emailid;
                            $scope.Fax = data.fax;
                            $scope.state = data.state;
                            $scope.City = data.city;
                            $scope.Address = data.address;
                        }
                        $scope.states = JSON.parse(sessionStorage.getItem('states'));

                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('companyProfile');
                            }
                        }
                        var errCB = function (data) {

                        }

                        $scope.save = function (opt) {
                            if ($("#ComProfileForm").valid()) {
                                var dataObj = {
                                    'companyCode': $scope.CompanyCode,
                                    'companyName': $scope.CompanyName,
                                    'estd': $scope.Estd,
                                    'contact': $scope.Contact,
                                    'phone': $scope.Phone,
                                    'mobile': $scope.Mobile,
                                    'emailid': $scope.Emailid,
                                    'fax': $scope.Fax,
                                    'state': $scope.state,
                                    'city': $scope.City,
                                    'address': $scope.Address,
                                    'type': 'companyProfile'
                                }
                                if (opt == '2') {
                                    dataObj.optId = 2;
                                    dataObj.id = data.id;
                                } else {
                                    dataObj.optId = 1;
                                }
                                ServerCall.getData('php/placement.php', 'POST', dataObj, sucCB, errCB)
                            }
                        }
                    },
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: 'false'
                })
            };
            /* Add and Edit company profile modal end */

            /* Delete company profile start */
            $scope.deleteCompanyProfile = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('companyProfile');
                            }
                        }
                        var errCB = function (data) {
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'companyProfile',
                                'optId': 3,
                                'id': data.id
                            }
                            ServerCall.getData('php/placement.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            /* Delete company profile end */
            // company profile end


            //interview code start 
            /* Interview list start */
            var InterviewSuccCB = function (res) {
                if (res.data)
                    $scope.interviewList = res.data;
                else
                    $scope.interviewList = [];
            }
            var InterviewErrCB = function (res) {
                debugger;
            }
            $scope.getInterviewList = function () {
                var dataObj = {
                    'optId': 4,
                    'type': 'interview'
                }
                ServerCall.getData('php/placement.php', 'POST', dataObj, InterviewSuccCB, InterviewErrCB)
            };

            /* Add and Edid interview schedule modal start */
            $scope.addInterview = function (data) {
                $modal.open({
                    templateUrl: 'views/placement/interviewScheduleModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope, $timeout) {
                        $timeout(function () {
                            $("#InterviewForm").validate({
                                rules: {
                                    AcdYr: "required",
                                    Person: "required",
                                    Start: "required",
                                    Close: "required",
                                    Venue: "required",
                                    Mobile: {
                                        "required": true,
                                        "digits": true,
                                        "minlength": 10,
                                        "maxlength": 12,
                                    },
                                    Company: "required",
                                    cType: "required",
                                    class: "required",
                                    semester: "required",
                                },
                                messages: {
                                    AcdYr: "Please select Academic Year",
                                    Person: "Please enter Name",
                                    Start: "Please enter Starting Time",
                                    Close: "Please enter Closing Time",
                                    Venue: "Please enter Venue",
                                    Mobile: {
                                        "required": "Please enter Mobile Num"
                                    },
                                    Company: "Please select Company Name",
                                    cType: "Please select Course Type",
                                    class: "Please select Stream",
                                    semester: "Please select Semester",
                                },
                            });
                        }, 1000);

                        $scope.isSave = true;
                        $scope.companyProfileList = [];
                        var CompanyProfileSuccCB = function (res) {
                            if (res.data) {
                                for (var i = 0; i < res.data.length; i++) {
                                    $scope.companyProfileList.push(res.data[i].companyName);
                                }
                            }
                        }
                        var CompanyProfileErrCB = function (res) {
                            debugger;
                        }
                        $scope.getCompanyProfileList = function () {
                            var dataObj = {
                                'optId': 0,
                                'type': 'companyProfile'
                            }
                            ServerCall.getData('php/placement.php', 'POST', dataObj, CompanyProfileSuccCB, CompanyProfileErrCB)
                        };
                        $scope.getCompanyProfileList();

                        /*course type & stream dropdown code start */
                        $scope.semesters = [];
                        $scope.classes = [];
                        $scope.cTypes = JSON.parse(sessionStorage.getItem('cTypes'));
                        var clsArr = JSON.parse(sessionStorage.getItem('classes'));
                        var semArr = JSON.parse(sessionStorage.getItem('semesters'));

                        $scope.changeCourseType = function (cType) {
                            $scope.streams = [];
                            $scope.streams = AdminService.changeCourseType(cType, clsArr);
                        };
                        $scope.changeStream = function (stream) {
                            $scope.semesters = [];
                            $scope.semesters = AdminService.changeStream(stream, semArr, $scope.cType);
                        };

                        /*course type & stream dropdown code end */
                        if (data != undefined) {
                            $scope.isSave = false;
                            $scope.AcdYr = data.acdYr;
                            /*$scope.Section=data.section;*/
                            $scope.Person = data.person;
                            $scope.IDate = data.idate;
                            $scope.CDate = data.cdate;
                            $scope.Start = data.start;
                            $scope.Close = data.close;
                            $scope.Venue = data.venue;
                            $scope.Mobile = data.mobile;
                            $timeout(function () {
                                $scope.Company = data.company;
                                $scope.cType = data.cType;
                                $scope.class = data.className;
                                $scope.semester = data.semester;
                            }, 100)
                        }

//        $scope.fnInterviewSelection=function(selIdate){
//        $scope.IDate=selIdate
//        }
//        $scope.fnClosingSelection=function(selCdate){
//        $scope.CDate=selCdate   
//        }
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('interview');
                            }
                        }
                        var errCB = function (data) {
                        }

                        $scope.save = function (opt) {
                            if ($("#InterviewForm").valid()) {
                                var dataObj = {
                                    'acdYr': $scope.AcdYr,
                                    'company': $scope.Company,
                                    'cType': $scope.cType,
                                    'className': $scope.class,
                                    /*'section':$scope.Section,*/
                                    'semester': $scope.semester,
                                    'person': $scope.Person,
                                    'idate': $scope.IDate.toLocaleDateString(),
                                    'cdate': $scope.IDate.toLocaleDateString(),
                                    'start': $scope.Start,
                                    'close': $scope.Close,
                                    'venue': $scope.Venue,
                                    'mobile': $scope.Mobile,
                                    'type': 'interview'
                                }
                                if (opt == '6') {
                                    dataObj.optId = 6;
                                    dataObj.id = data.id;
                                } else {
                                    dataObj.optId = 5;
                                }
                                ServerCall.getData('php/placement.php', 'POST', dataObj, sucCB, errCB)
                            }
                        }
                    },
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: 'false'
                })
            };
            /* Add and Edit interview schedule modal end */

            /* Delete interview schedule start */
            $scope.deleteInterview = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('interview');
                            }
                        }
                        var errCB = function (data) {
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'interview',
                                'optId': 7,
                                'id': data.id
                            }
                            ServerCall.getData('php/placement.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            /* Delete interview schedule end */
            // interview schedule end

//students allocation code start 
            // students allocation list start //
            var StudentsSuccCB = function (res) {
                if (res.data)
                    $scope.studentsList = res.data;
                else
                    $scope.studentsList = [];
            }
            var StudentsErrCB = function (res) {
                debugger;
            }
            $scope.getStudentsList = function () {
                var dataObj = {
                    'optId': 8,
                    'type': 'students'
                }
                ServerCall.getData('php/placement.php', 'POST', dataObj, StudentsSuccCB, StudentsErrCB)
            };

            // Add and Edid students allocation modal start //  
            $scope.addStudents = function (data) {
                $modal.open({
                    templateUrl: 'views/placement/studentReportModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope, $timeout) {
                        $timeout(function () {
                            $("#StuReportForm").validate({
                                rules: {
                                    cType: "required",
                                    class: "required",
                                    section: "required",
                                    semesters: "required",
                                    admNo: "required",
                                    AcdYr: "required",
                                    CompanyName: "required",
                                    status: "required",
                                    Remarks: "required",
                                },
                                messages: {
                                    cType: "Please select Course",
                                    class: "Please select Stream",
                                    section: "Please select Section",
                                    semesters: "Please select Semester",
                                    admNo: "Please select AdmNo",
                                    AcdYr: "Please select Academic Year",
                                    CompanyName: "Please select Company Name",
                                    status: "Please select Status",
                                    Remarks: "Please enter Remarks",
                                },
                            });
                        }, 1000);

                        $scope.isSave = true;
                        // Default Data(course, class, etc...)
                        $scope.classes = [];
                        $scope.cTypes = JSON.parse(sessionStorage.getItem('cTypes'));
                        var clsArr = JSON.parse(sessionStorage.getItem('classes'));
                        $scope.sections = JSON.parse(sessionStorage.getItem('sections'));
                        var semArr = JSON.parse(sessionStorage.getItem('semesters'));

                        $scope.changeCourseType = function (cType) {
                            $scope.streams = "";
                            $scope.streams = AdminService.changeCourseType(cType, clsArr);
                            $scope.getStdDet();
                        };

                        $scope.changeStream = function (stream) {
                            $scope.semesters = '';
                            $scope.semList = AdminService.changeStream(stream, semArr);
                            $scope.getStdDet();
                        };
                        // Default data end

                        //student name start
                        var studentSuccCB = function (res) {
                            $scope.stdList = [];
                            $scope.name = [];
                            if (res.data) {
                                $scope.stdList = res.data;
                                $scope.name = res.data;
                            }
                        }
                        var studentsErrCB = function (res) {
                            debugger;
                        }
                        $scope.stdSearch = function () {
                            $scope.stdList = [];
                            var dataObj = {
                                'optId': 0,
                                'type': 'students'
                            }
                            dataObj.cType = $scope.cType;
                            dataObj.className = $scope.class;
                            dataObj.section = $scope.section;
                            dataObj.semester = $scope.semesters;
                                  ServerCall.getData('php/student.php','POST',dataObj,studentSuccCB,studentsErrCB)
                           // ServerCall.getData('Student', 'POST', dataObj, studentSuccCB, studentsErrCB)
                        };
                        $scope.getStdDet = function () {
                            if ($scope.cType != undefined && $scope.class != undefined && $scope.section != undefined && $scope.semesters != undefined)
                                $scope.stdSearch();
                        }//student name end

                        /*drop drown for company name*/
                        $scope.companyProfileList = [];
                        var CompanyProfileSuccCB = function (res) {
                            if (res.data) {
                                for (var i = 0; i < res.data.length; i++) {
                                    $scope.companyProfileList.push(res.data[i].companyName);
                                }
                            }
                        }
                        var CompanyProfileErrCB = function (res) {
                            debugger;
                        }
                        $scope.getCompanyProfileList = function () {
                            var dataObj = {
                                'optId': 0,
                                'type': 'companyProfile'
                            }
                            ServerCall.getData('php/placement.php', 'POST', dataObj, CompanyProfileSuccCB, CompanyProfileErrCB)
                        };
                        $scope.getCompanyProfileList();
                        /*drop drown for company name end */

                        if (data != undefined) {
                            $scope.isSave = false;
                            $timeout(function () {
                                $scope.cType = data.cType;
                                $scope.class = data.className;
                                $scope.section = data.section;
                                $scope.semesters = data.medium;
                                $scope.stuObj = data.admNo;
                                $scope.stuObj.name = data.name;
                                $scope.AcdYr = data.acdYr;
                                $scope.CompanyName = data.companyName;
                                $scope.Status = data.status;
                                $scope.Remarks = data.remarks;
                                $scope.Date = data.date;
                            }, 100);
                        }

                        $scope.fnSinfoSelection = function (selDate) {
                            $scope.Estd = selDate;
                        }
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('students');
                            }
                            else{
                                $scope.msg=data.message;
                            }
                        }
                        var errCB = function (data) {
                                $scope.msg=data.message;
                        }
                        $scope.save = function (opt) {
                            if ($("#StuReportForm").valid()) {
                                var dataObj = {
                                    'cType': $scope.cType,
                                    'className': $scope.class,
                                    'section': $scope.section,
                                    'medium': $scope.semesters,
                                    'admNo': $scope.stuObj.admNo,
                                    'name': $scope.stuObj.name,
                                    'acdYr': $scope.AcdYr,
                                    'companyName': $scope.CompanyName,
                                    'status': $scope.Status,
                                    'remarks': $scope.Remarks,
                                    'date': $scope.Date,
                                    'type': 'students'
                                }

                                if (opt == '10') {
                                    dataObj.optId = 10;
                                    dataObj.id = data.id;
                                } else {
                                    dataObj.optId = 9;
                                }
                                ServerCall.getData('php/placement.php', 'POST', dataObj, sucCB, errCB)
                            }
                        }
                    },
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: 'false'
                })
            };
            // Add and Edit students allocation modal end //

            // Delete students allocation start //
            $scope.deleteStudents = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('students');
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
                                'type': 'students',
                                'optId': 11,
                                'id': data.id
                            }
                            ServerCall.getData('php/placement.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            // Delete students allocation end /


            // interview schedule reports start
            /*
             var CompanyProfileSuccCB=function(res){
             $scope.companyList=[];
             if(res.data){
             for(var i=0;i<res.data.length;i++){
             $scope.companyList.push(res.data[i].companyName);       
             }
             }
             }
             var CompanyProfileErrCB=function(res){
             debugger;
             }
             $scope.getCompanyProfileList=function(){
             var dataObj={
             'optId':3,
             'type':'companyProfile'
             }
             ServerCall.getData('Placement','POST',dataObj,CompanyProfileSuccCB,CompanyProfileErrCB)
             };
             
             $scope.getCompanyProfileList();
             
             /course type & stream dropdown code start /
             $scope.semesters=[];
             $scope.classes=[];
             
             $scope.cTypes=JSON.parse(sessionStorage.getItem('cTypes'));
             var clsArr=JSON.parse(sessionStorage.getItem('classes'));
             var semArr=JSON.parse(sessionStorage.getItem('semesters'));
             
             $scope.changeCourseType=function(cType){
             $scope.streams=[];
             $scope.streams=AdminService.changeCourseType(cType,clsArr);
             $scope.getAcdYr();
             $scope.getCompany();
             };
             $scope.changeStream=function(stream){
             $scope.semesters=[];
             $scope.semesters=AdminService.changeStream(stream,semArr,$scope.cType);
             $scope.getAcdYr();
             $scope.getCompany();
             };
             
             $scope.getAcdYr=function(){
             if($scope.cType != undefined && $scope.class != undefined && $scope.semesters != undefined  && $scope.companyName!=undefined && $scope.acdYr!=undefined)
             $scope.Search();
             }
             
             $scope.getCompany=function(){
             if($scope.cType != undefined && $scope.class != undefined && $scope.semesters != undefined && $scope.companyName!=undefined && $scope.acdYr!=undefined)
             $scope.Search();
             }
             
             var ReportsSuccCB=function(res){
             $scope.reportList=[];
             if(res.data){
             var _tempData=res.data[0];
             $scope.classes=AdminService.changeCourseType(_tempData.cType,clsArr);
             $timeout(function(){
             $scope.cType=_tempData.cType;
             $scope.class=_tempData.class;
             $scope.semesters=_tempData.semesters;
             },100);
             $scope.reportList=res.data;
             }
             }
             var ReportsErrCB=function(res){
             debugger;
             }
             $scope.Search=function(searchData){
             var dataObj={
             'optId':3,
             'type':'reports'
             }
             if(searchData==undefined){
             dataObj.cType=$scope.cType;
             dataObj.className=$scope.class;
             dataObj.semesters=$scope.semesters;
             }else{
             dataObj.cType=searchData.cType;
             dataObj.className=searchData.className;
             dataObj.semesters=searchData.semesters;
             }
             ServerCall.getData('Placement','POST',dataObj,ReportsSuccCB,ReportsErrCB)
             };*/


            // interview schedule reports end


            /* call back Events */
            $rootScope.$on('companyProfile', function () {
                $scope.getCompanyProfileList();
            });
            $rootScope.$on('interview', function () {
                $scope.getInterviewList();
            });
            $rootScope.$on('students', function () {
                $scope.getStudentsList();
            });
            $rootScope.$on('reports', function () {
                $scope.getReportsList();
            });
            $rootScope.$on('reports', function (args, data) {
                $scope.Search(data);
            });

            /* Date selection call back*/
            $scope.fnIDateSelection = function (selIdate) {
                $scope.idate = selIdate;
            }
            $scope.fnCDateSelection = function (selCdate) {
                $scope.cdate = selCdate;
            }

            /* Date selection call back*/
            $scope.fnDateSelection = function (selDate) {
                $scope.date = selDate;
            }
        });
