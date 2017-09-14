angular.module('SMSApp')
        .controller('examsCtrl', function ($filter, $scope, $rootScope, $modal, ServerCall, AdminService, $timeout) {
            var userRole = sessionStorage.getItem("role");
            var userName = sessionStorage.getItem('uid');
            if (userName == undefined)
                return;
            if (userRole != undefined) {
                $rootScope.$emit('menuReset', userRole);
            }
           
            $scope.isTimeTable = true;
            $scope.isDefault=true;
            /* Default tabs visible */
            var setDefault = function () {
                $scope.isTimeTable = false;
                $scope.isHallTicket = false;
                $scope.isMarks = false;
                $scope.isReport = false;
                $scope.isFinalReport = false;
                $scope.isSearch = false;
            }
            var defaultSelection = function () {
                $scope.cType = "";
                $scope.class = "";
                $scope.section = "";
                $scope.semester = "";
                $scope.examsArr = "";

            }
            var setDefaultView = function () {
                $scope.isTimeTable = false;
                $scope.isHallTicket = false;
                $scope.isMarks = false;
                $scope.isReport = false;
                $scope.isFinalReport = false;
                $scope.isSearch = false;

            }
            function selInnerLi(data) {
                $('#exams li').removeClass('selTab');
                $('#exams li:nth-child(' + data + ')').addClass('selTab');
            }
            $rootScope.$on('examMenu', function (eve, data) {
                $scope.setTab(data);
                selInnerLi(data);
            });


            /* Tab click function */
            $scope.setTab = function (newTab) {
                defaultSelection();
                $scope.tab = newTab;
                $scope.isDefault=false;
                $scope.std = {};
                $scope.chkAll = {};
                setDefault();
                switch (newTab) {
                    case 1:
                        $scope.isTimeTable = true;
                        break;
                    case 2:
                        $scope.isHallTicket = true;
                        $scope.isOther = true;
                        $scope.stdList = [];
                        break;
                    case 3:
                        $scope.isMarks = true;
                        break;
                    case 4:
                        $scope.isReport = true;
                        break;
                    case 5:
                        $scope.isFinalReport = true;
                        break;
                }
            };
            /* Tab active and inactive color function */
            $scope.isSet = function (tabNum) {
                return $scope.tab === tabNum;
            };

            var studentSuccCB = function (res) {
                $scope.stdList = [];
                  $scope.msg='';
                if (res.data) {
                    $scope.stdList = res.data;

                }
                else{
                    $scope.msg=res;
                }
            }
            var studentsErrCB = function (res) {
                debugger;
            }
            $scope.stdSearch = function (searchData) {
                var dataObj = {
                    'optId': 0,
                    'type': 'students'
                }
                if (searchData == undefined) {
                    dataObj.cType = $scope.cType;
                    dataObj.className = $scope.class;
                    dataObj.semester = $scope.semester;
                    dataObj.section = $scope.section;

                }
                ServerCall.getData('php/student.php','POST',dataObj,studentSuccCB,studentsErrCB)
            };
//default codestart
            $scope.classes = [];
            $scope.cTypes = JSON.parse(sessionStorage.getItem('cTypes'));
            var clsArr = JSON.parse(sessionStorage.getItem('classes'));
            $scope.sections = JSON.parse(sessionStorage.getItem('sections'));
            var semArr = JSON.parse(sessionStorage.getItem('semesters'));

            $scope.changeCourseType = function (cType) {
                $scope.streams = [];
                $scope.semesters = [];
                /*  $scope.examsArr=[];*/
                $scope.class = '';
                $scope.semester = '';
                $scope.section = '';
                $scope.selTest = '';
                $scope.streams = AdminService.changeCourseType(cType, clsArr);
                $scope.getTestSubject();
            };
            $scope.changeStream = function (stream, cType) {
                $scope.semesters = [];
                $scope.examsArr = [];
                $scope.semester = '';
                $scope.section = '';
                $scope.selTest = '';
                $scope.semesters = AdminService.changeStream(stream, semArr, $scope.cType);
                $scope.getTestSubject();
            };


            /*  default code end*/


//TimeTable code start 
            /* Time table list start */
            var ttSuccCB = function (res) {
                 $scope.msg='';
                if (res.data){
                    $scope.ttList = res.data;
                }
                else{
                     $scope.msg=res;
                    $scope.ttList = [];
                   
                }
            }
            var ttErrCB = function (res) {
                $scope.msg=res;
            }
            $scope.searchTimeTable = function () {
                var dataObj = {
                    'optId': 1
                }
                dataObj.cType = $scope.cType;
                dataObj.className = $scope.class;
                dataObj.section = $scope.section;
                dataObj.semester = $scope.semester;
                dataObj.testName = $scope.selTest;
                ServerCall.getData('php/exam.php', 'POST', dataObj, ttSuccCB, ttErrCB)
            };
            /*add and edit time table code start*/

            $scope.addTimeTable = function (data) {
                $modal.open({
                    templateUrl: 'views/exams/timeTableModal.html',
                    controller: function ($filter, $timeout, $scope, $modalInstance, ServerCall, $location, $rootScope, AdminService, testData, subData, defData) {
                        $scope.isSave = true;
                        $scope.isTTFormat = false;
                        $scope.subArr = subData;
                        var saveAndContinue = false;
                     if (data != undefined) {
                            $scope.isSave = false;

                            $timeout(function () {
                                $scope.selSub = data.subject;
                                $scope.startttime = data.sTime;
                                $scope.endttime = data.eTime;
                                $scope.ttDate = data.dates;
                            }, 100);
                        }

                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $scope.selSub = '';
                                $scope.startttime = '';
                                $scope.endttime = '';
                                $scope.ttDate = '';
                                if (!saveAndContinue) {
                                    $modalInstance.close();
                                    $rootScope.$broadcast('timetable');

                                }
                                else{
                                    $scope.msg=data.message;
                                }
                            }
                        }
                        var errCB = function (data) {
                        $scope.msg=data.message;
                        }
                        $scope.fnTTDateSel = function (date, sub) {
                            $scope.ttDate = date;
                        }
                        $scope.save = function (opt) {
                            saveAndContinue = false;
                            if (opt == 1)
                                saveAndContinue = true;
                            var dataObj = {
                                'type': 'timeTable',
                                'cType': defData.cType,
                                'className': defData.className,
                                'semester': defData.semester,
                                'section': defData.section,
                                'testName': testData,
                                'subjects': $scope.selSub,
                                'startTimes': $scope.startttime,
                                'endTimes': $scope.endttime,
                                'dates': $scope.ttDate
                            }

                            if (opt == '3') {
                                dataObj.optId = 3;
                                dataObj.pkVal = data.id;
                            }else{
                                 dataObj.optId = 2;
                            }
                            ServerCall.getData('php/exam.php', 'POST', dataObj, sucCB, errCB)

                        }
                    },
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        testData: function () {
                            return $scope.selTest
                        },
                        subData: function () {
                            return $scope.subArr
                        },
                        defData: function () {
                            return $scope.dObj
                        }
                    }
                })
            };
            /* Add and Edit Time Table modal end */

            /* Delete Time Table start */
            $scope.deleteTimeTable = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {

                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {

                                $modalInstance.close();
                                $rootScope.$broadcast('timetable');
                            }
                        }
                        var errCB = function (data) {
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'timeTable',
                                'optId': 4,
                                'pkVal': data.id
                            }
                            ServerCall.getData('php/exam.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: false
                })
            }
            /* Delete timetable end */



            /*   default test and subject*/
            var testSubSucCB = function (data) {
                var examStr = data.exams;
                var subStr = data.subjects;
                $scope.examsArr = (examStr != undefined ? examStr.split(',') : []);
                $scope.subArr = (subStr != undefined ? subStr.split(',') : []);
                $scope.examsArr = $filter('orderBy')($scope.examsArr, false);
                $scope.subArr = $filter('orderBy')($scope.subArr, false);
            }
            var testSubErrCB = function (data) {

            }
            $scope.getTestSubject = function () {
                $scope.examsArr = [];
                $scope.subArr = [];
                $scope.selTest = '';
                if ($scope.cType == '' || $scope.class == '' || $scope.section == '' || $scope.semester == '')
                    return;
                $scope.dObj = {
                    'optId': 5,
                    'cType': $scope.cType,
                    'className': $scope.class,
                    'section': $scope.section,
                    'semester': $scope.semester
                }
                ServerCall.getData('php/common.php', 'POST', $scope.dObj, testSubSucCB, testSubErrCB)
                $scope.stdSearch();
            }
            /* default test subject end*/


            // check box selection 
            $scope.checkAll = function (bool) {
                if (bool) {
                    for (var i = 0; i < $scope.stdList.length; i++) {
                        var key = $scope.stdList[i].admNo;
                        $scope.std[key] = true;
                    }
                } else {
                    for (var i = 0; i < $scope.stdList.length; i++) {
                        var key = $scope.stdList[i].admNo;
                        $scope.std[key] = false;
                    }
                }
            };
            /*check all end*/


// / Hall Ticket start 

            // / Students List Start /
            var studentSuccCB = function (res) {
                $scope.stdList = [];
                  $scope.msg='';
                if (res.data) {
                    $scope.stdList = res.data;

                }
                else{
                 $scope.msg=res;  
                }
            }
            var studentsErrCB = function (res) {
               $scope.msg=res;  
            }
            $scope.stdSearch = function (searchData) {
                var dataObj = {
                    'optId': 0,
                    'type': 'students'
                }
                if (searchData == undefined) {
                    dataObj.cType = $scope.cType;
                    dataObj.className = $scope.class;
                    dataObj.semester = $scope.semester;
                    dataObj.section = $scope.section;

                }
               ServerCall.getData('php/student.php','POST',dataObj,studentSuccCB,studentsErrCB)
            };

            // / Students List End /
            // / Add and Edit Hall Ticket modal start /

            $scope.getHallTickets = function (data) {
                $modal.open({
                    templateUrl: 'views/exams/hallTicketModal.html',
                    controller: function ($timeout, $scope, $modalInstance, $location, $rootScope, $filter, ServerCall, testData, stdData, selStd) {
                        $scope.std = selStd;
                        $scope.testArr = testData;
                        $scope.selStu = [];
                        var stdArr = stdData;

                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var timingsSuccCB = function (data) {
                            $scope.ttTimings = $filter('orderBy')(data.data, 'date', false);
                            angular.forEach(stdArr, function (obj, key) {
                                if ($scope.std[obj.admNo] == true)
                                    $scope.selStu.push(obj);
                            })
                        }
                        var timingsErrCB = function (data) {

                        }
                        $scope.changeTest = function (testName) {
                            var sObj = (stdArr.length ? stdArr[0] : undefined);
                            if (sObj == undefined)
                                return;
                            var dataObj = {
                                'cType': sObj.cType,
                                'className': sObj.class,
                                'section': sObj.section,
                                'semester': sObj.semester,
                                'testName': testName,
                                'optId': '1'
                            }
                            ServerCall.getData('php/exam.php', 'POST', dataObj, timingsSuccCB, timingsErrCB)

                        }
                        var SinfoSuccCB = function (res) {
                            debugger;
                            if (res.data)
                                $scope.sinfoObj = res.data[0];
                            $scope.sCampusName = $scope.sinfoObj.campusName;
                            $scope.sState = $scope.sinfoObj.state;
                            $scope.sDistrict = $scope.sinfoObj.district;
                            $scope.sCity = $scope.sinfoObj.city;
                            $scope.sStreet = $scope.sinfoObj.street;
                            $scope.sPinCode = $scope.sinfoObj.pinCode;
                            $scope.sPhoneNo = $scope.sinfoObj.phoneNumber;
                            $scope.sEmail = $scope.sinfoObj.email;
                            $scope.sLogo = $scope.sinfoObj.logo;
                            $scope.sCode = $scope.sinfoObj.schoolCode;
                            $scope.sWebsite = $scope.sinfoObj.website;
                        }
                        var SinfoErrCB = function (res) {
                            debugger;
                        }
                        $scope.getSinfoList = function () {
                            var dataObj = {
                                'optId': 3,
                                'type': 'sinfo'
                            }
                            ServerCall.getData('php/admin.php', 'POST', dataObj, SinfoSuccCB, SinfoErrCB);
                        };
                        $scope.getSinfoList();

                    },
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        testData: function () {
                            return $scope.examsArr
                        },
                        stdData: function () {
                            return $scope.stdList
                        },
                        selStd: function () {
                            return $scope.std
                        }
                    }
                })
            };
            /* Hall ticket end */

            /* marks code start*/

            /* marks list start*/

            var marksSuccCB = function (res) {
                  $scope.msg='';
                if (res.data){
                    $scope.marksList = res.data;
                }
                else{
                    $scope.msg=res;
                    $scope.marksList = [];
                }
            }
            var marksErrCB = function (res) {
           $scope.msg=res;
            }
            $scope.searchMarksData = function () {
               var dataObj={};
                dataObj.cType = $scope.cType;
                dataObj.className = $scope.class;
                dataObj.section = $scope.section;
                dataObj.semester = $scope.semester;
                dataObj.testName = $scope.selTest;
                dataObj.optId = 9;
                ServerCall.getData('php/exam.php', 'POST', dataObj, marksSuccCB, marksErrCB)


            };

            /* Marks Enter Modal Start */
            $scope.enterMarks = function (data) {
                $modal.open({
                    templateUrl: 'views/exams/marksModal.html',
                    controller: function ($timeout, $scope, $modalInstance, $location, $rootScope, $filter, ServerCall, subData, stdData, selTest) {
                        $scope.stdList = stdData;
                        var selStdObj = {};
                        $scope.selObj = '';
                        $scope.subList = subData;
                        $scope.marksInfo = {};
                        $scope.isSave = true;
                        var saveAndContinue = false;

                        if (data != undefined) {
                            $scope.isSave = false;
                            $timeout(function () {
                                $scope.selObj = data.name;
                                $scope.name = data.name;
                                $scope.admNo = data.admNo;
                                $scope.maxMarks = data.maxMarks;
                                $scope.marks = data.marks;

                            }, 100);
                        }
                        $scope.close = function () {
                            $modalInstance.close();
                        }

                        var sucCB = function (data) {

                            if (data.status == 'success') {
                                $scope.marksInfo = {};
                                $scope.selObj = {};
                                $scope.name = {};
                                $scope.admNo = {};
                                $scope.marks = {};
                                if (!saveAndContinue)
                                    $modalInstance.close();
                                $rootScope.$broadcast('marks');
                            }
                            else{
                                $scope.msg=data.message;
                            }
                        }
                        var errCB = function (data) {
                     $scope.msg=data.message;
                        }
                        $scope.selStudent = function (stdObj) {
                            selStdObj = stdObj;
                        }
                        $scope.fnTTDateSel = function (date, sub) {
                            $scope.ttDate = date;
                        }
                        $scope.save = function (opt) {
                            saveAndContinue = false;
                            if (opt == 2)
                                saveAndContinue = true;
                            var marks = '';
                            var sum = 0;
                            angular.forEach($scope.marksInfo, function (val, key) {
                                marks = marks + key + ':' + val + ',';
                                sum = sum + parseInt(val);
                            });
                            marks = marks.substring(0, marks.length - 1);
                            var percent = (sum / ($scope.subList.length * $scope.maxMarks)) * 100;
                            var dataObj = {
                                'type': 'marks',
                                'cType': selStdObj.cType,
                                'className': selStdObj.class,
                                'section': selStdObj.section,
                                'semester': selStdObj.semester,
                                'testName': selTest,
                                'admNo': selStdObj.admNo,
                                'name': selStdObj.name,
                                'marks': marks,
                                'maxMarks': $scope.maxMarks,
                                'total': sum,
                                'percent': $filter('number')(percent, 2)
                            }

                            if (opt == '7') {
                                dataObj.optId = 7;
                                dataObj.pkVal = data.id;
                            }else{
                                dataObj.optId=6;
                            }

                            ServerCall.getData('php/exam.php', 'POST', dataObj, sucCB, errCB)

                        }


                    },
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        subData: function () {
                            return $scope.subArr
                        },
                        stdData: function () {
                            return $scope.stdList
                        },
                        selTest: function () {
                            return $scope.selTest
                        }
                    }
                })
            };

            // check box selection 
            $scope.checkAll = function (bool) {
                if (bool) {
                    for (var i = 0; i < $scope.stdList.length; i++) {
                        var key = $scope.stdList[i].admNo;
                        $scope.std[key] = true;
                    }
                } else {
                    for (var i = 0; i < $scope.stdList.length; i++) {
                        var key = $scope.stdList[i].admNo;
                        $scope.std[key] = false;
                    }
                }
            };
            /*check all end*/
            /* Delete marks start */
            $scope.deleteMarks = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('marks');
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
                                'type': 'marks',
                                'optId': 8,
                                'id': data.id

                                        /*'pkString':data.marksDate*/
                            }
                            ServerCall.getData('php/exam.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: false
                })
            }
            /* Delete marks  end */


            /* Report  generation start */
            var openProgressReportModal = function () {
                $modal.open({
                    templateUrl: 'views/exams/progressReportModal.html',
                    controller: function ($timeout, $scope, $modalInstance, $location, $rootScope, reportData, AdminService, barData, attData, marksData) {
                        $scope.barOpt = AdminService.barOpt;
                        $scope.pieOpt = AdminService.pieOpt;
                        $scope.reportData = reportData;
                        $scope.barData = barData;
                        $scope.marksData = marksData;
                        $scope.attData = attData;
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var SinfoSuccCB = function (res) {
                            debugger;
                            if (res.data)
                                $scope.sinfoObj = res.data[0];
                            $scope.sCampusName = $scope.sinfoObj.campusName;
                            $scope.sState = $scope.sinfoObj.state;
                            $scope.sDistrict = $scope.sinfoObj.district;
                            $scope.sCity = $scope.sinfoObj.city;
                            $scope.sStreet = $scope.sinfoObj.street;
                            $scope.sPinCode = $scope.sinfoObj.pinCode;
                            $scope.sPhoneNo = $scope.sinfoObj.phoneNumber;
                            $scope.sEmail = $scope.sinfoObj.email;
                            $scope.sLogo = $scope.sinfoObj.logo;
                            $scope.sCode = $scope.sinfoObj.schoolCode;
                            $scope.sWebsite = $scope.sinfoObj.website;
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
                        $scope.getSinfoList();



                    },
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        reportData: function () {
                            return $scope.reportData
                        },
                        marksData: function () {
                            return $scope.marksData
                        },
                        barData: function () {
                            return $scope.barData
                        },
                        attData: function () {
                            return $scope.attData
                        }
                    }

                })


            }

            /* Report  generation start */
            var openFinalReport = function () {
                $modal.open({
                    templateUrl: 'views/exams/finalReportModal.html',
                    controller: function ($timeout, $scope, $modalInstance, $location, $rootScope, reportData, AdminService, barData, attData, marksData, subData) {
                        $scope.barOpt = AdminService.barOpt;
                        $scope.reportData = reportData;
                        $scope.barData = barData;
                        $scope.subListArr = subData;
                        $scope.marksListArr = marksData;
                        $scope.attData = attData;
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var SinfoSuccCB = function (res) {

                            if (res.data)
                                $scope.sinfoObj = res.data[0];
                            $scope.sCampusName = $scope.sinfoObj.campusName;
                            $scope.sState = $scope.sinfoObj.state;
                            $scope.sDistrict = $scope.sinfoObj.district;
                            $scope.sCity = $scope.sinfoObj.city;
                            $scope.sStreet = $scope.sinfoObj.street;
                            $scope.sPinCode = $scope.sinfoObj.pinCode;
                            $scope.sPhoneNo = $scope.sinfoObj.phoneNumber;
                            $scope.sEmail = $scope.sinfoObj.email;
                            $scope.sLogo = $scope.sinfoObj.logo;
                            $scope.sCode = $scope.sinfoObj.schoolCode;
                            $scope.sWebsite = $scope.sinfoObj.website;
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
                        $scope.getSinfoList();
                    },
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        reportData: function () {
                            return $scope.reportData
                        },
                        marksData: function () {
                            return $scope.marksListArr
                        },
                        barData: function () {
                            return $scope.barData
                        },
                        attData: function () {
                            return $scope.attData
                        },
                        subData: function () {
                            return $scope.subListArr
                        }
                    }
                })
            }

            $timeout(function () {
                $("#ReportForm").validate({
                    rules: {
                        cType: "required",
                        class: "required",
                        semester: "required",
                        section: "required",
                        selTest: "required",
                        admNo: "required",
                    },
                    messages: {
                        cType: "Please select Course",
                        class: "Please select Class",
                        semester: "Please select Section",
                        section: "Please select Medium",
                        selTest: "Please select the Test",
                        admNo: "Please select Student AdmNo",
                    },
                });
            }, 1000);

            var reportSuccCB = function (data) {
                $scope.msg='';
                if (!(data.data && data.data.length)){
                    $scope.msg=data;
                    return;
                    
                }
                $scope.reportData = data.data[0];
                var marks = [];
                var _tempMarksArr = $scope.reportData.marks.split(',');
                angular.forEach(_tempMarksArr, function (obj) {
                    var objArr = obj.split(':');
                    var _tempObj = {
                        "label": objArr[0],
                        "value": objArr[1]
                    }
                    marks.push(_tempObj);
                });
                $scope.barData = [
                    {
                        key: $scope.selTest,
                        values: marks
                    }
                ];
                $scope.attData = [
                ];
                $scope.marksData = angular.copy(marks);
                $scope.marksData.push({
                    'label': 'Total',
                    'value': $scope.reportData.total
                });
                $scope.marksData.push({
                    'label': 'Percent',
                    'value': $scope.reportData.percent
                })
                openProgressReportModal();
               
            }
              
            var reportErrCB = function (data) {
                $scope.msg=data;
            }

            $scope.getProgressReport = function (data) {
                if ($("#ReportForm").valid()) {
                    var dataObj = {
                        'cType': $scope.cType,
                        'className': $scope.class,
                        'section': $scope.section,
                        'semester': $scope.semester,
                        'testName': $scope.selTest,
                        'admNo': $scope.selObj.admNo,
                        'type': 'marks',
                        'optId': 5
                    }
                    ServerCall.getData('php/exam.php', 'POST', dataObj, reportSuccCB, reportErrCB)
                }
            };
            /* Progress Report  end */

            /* Final Report Start */
            $timeout(function () {
                $("#FinalForm").validate({
                    rules: {
                        cType: "required",
                        class: "required",
                        semester: "required",
                        section: "required",
                        admNo: "required",
                    },
                    messages: {
                        cType: "Please select Course",
                        class: "Please select Class",
                        semester: "Please select Section",
                        section: "Please select Medium",
                        admNo: "Please select Student AdmNo",
                    },
                });
            }, 1000);

            var finalReportSuccCB = function (data) {
                if (!(data.data && data.data.length)){
                    $scope.msg=data;
                    return;
                }
                debugger;

                var testList = data.data;
                $scope.reportData = testList[0];
                //for Subjects
                $scope.subListArr = [];
                $scope.marksListArr = [];
                var _tempObj = testList[0];
                var _tempMarks = _tempObj.marks;
                var _tempMarksArr = _tempMarks.split(',');
                angular.forEach(_tempMarksArr, function (obj, index) {
                    $scope.subListArr.push(obj.split(':')[0]);
                });
                $scope.subListArr.unshift('Test Name');
                $scope.subListArr.push('Total');
                $scope.subListArr.push('Percentage');
                //end get Subjects;

                //Get Marks
                var _tempBarData = [];
                angular.forEach(testList, function (obj, index) {
                    var _tempArr = [];
                    _tempArr.push(obj.test);
                    var _tMarksArr = obj.marks.split(',');
                    angular.forEach(_tMarksArr, function (obj, index) {
                        _tempArr.push(obj.split(':')[1]);
                    });
                    _tempArr.push(obj.total);
                    _tempArr.push(obj.percent);
                    $scope.marksListArr.push(_tempArr);
                    var _obj = {
                        'label': obj.test,
                        'value': obj.percent
                    }
                    _tempBarData.push(_obj);
                });

                $scope.barData = [
                    {
                        key: "Final Report",
                        values: _tempBarData
                    }
                ];
                //End Marks

                openFinalReport();
            }
            var finalReportErrCB = function (data) {
            $scope.msg=data;
            }
            $scope.getFinalReport = function (data) {
                if ($("#FinalForm").valid()) {
                    var dataObj = {
                        'cType': $scope.cType,
                        'className': $scope.class,
                        'section': $scope.section,
                        'semester': $scope.semester,
                        'admNo': $scope.selObj.admNo,
                        'testName': '',
                        'type': 'marks',
                        'optId': 5
                    }
                    ServerCall.getData('php/exam.php', 'POST', dataObj, finalReportSuccCB, finalReportErrCB);
                }
            };
            /* Final Report End */

//* call back evnt*/

            $rootScope.$on('marks', function () {
                $scope.searchMarksData();
            });
            $rootScope.$on('timetable', function () {
                $scope.searchTimeTable();
            });

        });



