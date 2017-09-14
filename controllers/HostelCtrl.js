angular.module('SMSApp')
        .controller('hostelCtrl', function ($scope, $rootScope, $timeout, $modal, ServerCall, AdminService) {
            var userRole = sessionStorage.getItem("role");
            var userName = sessionStorage.getItem('uid');
            if (userName == undefined)
                return;
            if (userRole != undefined) {
                $rootScope.$emit('menuReset', userRole);
            }
            //$scope.tab = 1;
            //$scope.isHstDet=true;
            $scope.isDefault = true;
            /* Default tabs visible */
            var setDefault = function ()
            {
                $scope.isHstDet = false;
                $scope.isRoomDet = false;
                $scope.isStdAllot = false;
                $scope.isStdVacated = false;
            }
            function selInnerLi(data) {
                $('#hostel li').removeClass('selTab');
                $('#hostel li:nth-child(' + data + ')').addClass('selTab');
            }
            $rootScope.$on('hostelMenu', function (eve, data) {
                $scope.setTab(data);
                selInnerLi(data);
            });
            /* Tab click function */
            $scope.setTab = function (newTab) {
                $scope.isDefault = false;
                $scope.tab = newTab;
                setDefault();
                switch (newTab) {
                    case 1:
                        $scope.isHstDet = true;
                        $scope.getHstDetList();
                        break;
                    case 2:
                        $scope.isRoomDet = true;
                        $scope.getRoomDetList();
                        break;
                    case 3:
                        $scope.isStdAllot = true;
                        $scope.getStuAllotList();
                        break;
                    case 4:
                        $scope.isStdVacated = true;
                        $scope.getStuVacatedList();
                        break;
                }
            };
            /* Tab active and inactive color function */
            $scope.isSet = function (tabNum) {
                return $scope.tab === tabNum;
            };

            //Hostel Details  start 
            /* Hostel Details  list start */
            var HstDetSuccCB = function (res) {
                if (res.data)
                    $scope.hstDetList = res.data;
                else
                    $scope.hstDetList = [];
            }
            var HstDetErrCB = function (res) {
                debugger;
            }
            $scope.getHstDetList = function () {
                var dataObj = {
                    'optId': 0,
                    'type': 'hstDet'
                }
                ServerCall.getData('php/hostel.php', 'POST', dataObj, HstDetSuccCB, HstDetErrCB)
            };

            /* Add and Edid hostel details modal start */
            $scope.addHstDet = function (data) {
                $modal.open({
                    templateUrl: 'views/hostel/hstDetailsModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $timeout(function () {
                            $("#HstDetForm").validate({
                                rules: {
                                    AcaYr: "required",
                                    hostelName: "required",
                                    hostelLct: "required",
                                    gender: "required",
                                    hostelCap: {
                                        "required": true,
                                        "digits": true,
                                    },
                                },
                                messages: {
                                    AcaYr: "Please select Academic Year",
                                    hostelName: "Please enter Hostel Name",
                                    hostelLct: "Please enter Hostel Location",
                                    gender: "Please select gender",
                                    hostelCap: {
                                        "required": "Please enter Hostel Capacity",
                                        "digits": "Please enter digits only",
                                    },
                                },
                            });
                        }, 1000);

                        $scope.isSave = true;
                        if (data != undefined) {
                            $scope.isSave = false;
                            $scope.AcaYr = data.acaYear;
                            $scope.hostelName = data.hostelName;
                            $scope.hostelLct = data.hostelLocation;
                            $scope.gender = data.hostelFor;
                            $scope.hostelCap = data.hostelCap;
                        }
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('hstDet');
                            }
                            $scope.msg=data.message;
                        }
                        var errCB = function (data) {
                            $scope.msg=data.message;
                        }
                        $scope.save = function (opt) {
                            if ($("#HstDetForm").valid()) {
                                var dataObj = {
                                    'acaYear': $scope.AcaYr,
                                    'hostelName': $scope.hostelName,
                                    'hostelLocation': $scope.hostelLct,
                                    'hostelFor': $scope.gender,
                                    'hostelCap': $scope.hostelCap,
                                    'type': 'hstDet'
                                }
                                if (opt == '2') {
                                    dataObj.optId = 2;
                                    dataObj.id = data.id;
                                } else {
                                    dataObj.optId = 1;
                                }
                                ServerCall.getData('php/hostel.php', 'POST', dataObj, sucCB, errCB)
                            }
                        }
                    },
                    size: 'md',
                    backdrop: 'static',
                    keyboard: 'false'
                })
            };
            /* Add and Edit hostel details modal end */

            /* Default Load*/
            if ($scope.tab == 1)
                $scope.getHstDetList();

            /* Delete hostel details start */
            $scope.deleteHstDet = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('hstDet');
                            }
                        }
                        var errCB = function (data) {
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'hstDet',
                                'optId': 3,
                                'hostelName': data.hostelName,
                                'id': data.id
                            }
                            ServerCall.getData('php/hostel.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            //Hostel Details End

            //Room Details  start 
            /* Room Details  list start */
            var RoomDetSuccCB = function (res) {
                if (res.data)
                    $scope.roomDetList = res.data;
                else
                    $scope.roomDetList = [];
            }
            var RoomDetErrCB = function (res) {
                debugger;
            }
            $scope.getRoomDetList = function () {
                var dataObj = {
                    'optId': 4,
                    'type': 'roomDet'
                }
                ServerCall.getData('php/hostel.php', 'POST', dataObj, RoomDetSuccCB, RoomDetErrCB)
            };

            /* Add and Edid hostel details modal start */
            $scope.addRoomDet = function (data) {
                $modal.open({
                    templateUrl: 'views/hostel/roomDetModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $timeout(function () {
                            $("#RoomDetForm").validate({
                                rules: {
                                    hstName: "required",
                                    roomNum: {
                                        "required": true,
                                        "digits": true,
                                    },
                                    capacity: {
                                        "required": true,
                                        "digits": true,
                                    },
                                },
                                messages: {
                                    hstName: "Please select Hostel Name",
                                    roomNum: {
                                        "required": "Please enter Room Number",
                                        "digits": "Please enter digits only",
                                    },
                                    capacity: {
                                        "required": "Please enter Room Capacity",
                                        "digits": "Please enter digits only",
                                    },
                                },
                            });
                        }, 1000);

                        $scope.isSave = true;
                        $scope.hstNameList = [];
                        $scope.hostelLct = [];
                        $scope.changeHostelName = function (hName) {
                            var hLoc = $scope.hstNameList.filter(function (obj) {
                                if (obj.hostelName == hName)
                                    return obj.hostelLocation
                            })
                            $scope.hostelLocation = hLoc[0].hostelLocation;
                        }

                        var HstDetSuccCB = function (res) {
                            if (res.data) {
                                /*for(var i=0;i<res.data.length;i++){
                                 $scope.hstNameList.push(res.data[i].hostelName);
                                 }*/
                                $scope.hstNameList = res.data;
                                $scope.hostelLct = res.data;
                            }
                        }
                        var HstDetErrCB = function (res) {
                            debugger;
                        }
                        $scope.getHstDetList = function () {
                            var dataObj = {
                                'optId': 0,
                                'type': 'hstDet'
                            }
                            ServerCall.getData('php/hostel.php', 'POST', dataObj, HstDetSuccCB, HstDetErrCB)
                        };
                        $scope.getHstDetList();

                        if (data != undefined) {
                            $scope.isSave = false;
                            $scope.roomNum = data.rmNum;
                            $scope.capacity = data.rmCap;
                            $timeout(function () {
                                $scope.hostelName = data.hostelName;
                                $scope.hostelLocation = data.hostelLocation;
                            }, 500)
                        }
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('roomDet');
                            }
                            else{
                                $scope.msg=data.message;
                            }
                        }
                        var errCB = function (data) {
                $scope.msg=data.message;

                        }
                        $scope.save = function (opt) {
                            if ($("#RoomDetForm").valid()) {
                                var dataObj = {
                                    'rmNum': $scope.roomNum,
                                    'rmCap': $scope.capacity,
                                    'hostelName': $scope.hostelName,
                                    'hostelLocation': $scope.hostelLocation,
                                    'type': 'roomDet'
                                }
                                if (opt == '6') {
                                    dataObj.optId = 6;
                                    dataObj.id = data.id;
                                } else {
                                    dataObj.optId = 5;
                                }
                                ServerCall.getData('php/hostel.php', 'POST', dataObj, sucCB, errCB)
                            }
                        }
                    },
                    size: 'md',
                    backdrop: 'static',
                    keyboard: 'false'
                })
            };
            /* Add and Edit hostel details modal end */


            /* Default Load*/
            if ($scope.tab == 1)
                $scope.getHstDetList();

            /* Delete hostel details start */
            $scope.deleteRoomDet = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('roomDet');
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
                                'type': 'roomDet',
                                'optId': 7,
                                'rmNum': data.rmNum,
                                'id': data.id
                            }
                            ServerCall.getData('php/hostel.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            //Hostel Details End

            /* Student Allotment list start */
            var StuAllotSuccCB = function (res) {
                if (res.data)
                    $scope.stuAllotList = res.data;
                else
                    $scope.stuAllotList = [];
            }
            var StuAllotErrCB = function (res) {
                debugger;
            }
            $scope.getStuAllotList = function () {
                var dataObj = {
                    'optId': 8,
                    'type': 'stuAllot'
                }
                ServerCall.getData('php/hostel.php', 'POST', dataObj, StuAllotSuccCB, StuAllotErrCB)
            };

            /* Add and Edid stu Allotment modal start */
            $scope.addStuAllot = function (data) {
                $modal.open({
                    templateUrl: 'views/hostel/hstStuAllModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $timeout(function () {
                            $("#StudentAllotForm").validate({
                                rules: {
                                    AcaYr: "required",
                                    cType: "required",
                                    class: "required",
                                    section: "required",
                                    semesters: "required",
                                    admNo: "required",
                                    hstName: "required",
                                    roomNum: "required",
                                },
                                messages: {
                                    AcaYr: "Please select Academic Year",
                                    cType: "Please select Course Type",
                                    class: "Please select Stream",
                                    section: "Please select Section",
                                    semesters: "Please select Semester",
                                    admNo: "Please select admNo",
                                    hstName: "Please select Hostel Name",
                                    roomNum: "Please select Room Number",
                                },
                            });
                        }, 1000);

                        $scope.isSave = true;
                        $scope.isSaved = true;
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
                        $scope.stdList = [];
                        var studentSuccCB = function (res) {
                            if (res.data) {
                                $scope.nameObj = [];
                                for (var i = 0; i < res.data.length; i++) {
                                    $scope.stdList.push(res.data[i].admNo);
                                    $scope.nameObj[res.data[i].admNo] = res.data[i].name;
                                }
                            }
                        }
                        var studentsErrCB = function (res) {
                            debugger;
                        }
                        $scope.stdSearch = function () {
                            $scope.stdList = [];
                            var dataObj = {
                                'optId': 0, //doubt
                                'type': 'students'
                            }
                            dataObj.cType = $scope.cType;
                            dataObj.className = $scope.class;
                            dataObj.section = $scope.section;
                            dataObj.semester = $scope.semesters;

                            ServerCall.getData('php/student.php', 'POST', dataObj, studentSuccCB, studentsErrCB)
                        };
                        $scope.getStdDet = function () {
                            if ($scope.cType != undefined && $scope.class != undefined && $scope.section != undefined && $scope.semesters != undefined)
                                $scope.stdSearch();
                        }
                        $scope.getStuNameList = function (admNo) {
                            $scope.name = $scope.nameObj[admNo];
                        };//student name end

                        // loading Hostel Name
                        $scope.hstNameList = [];
                        var HstDetSuccCB = function (res) {
                            if (res.data) {
                                // for(var i=0;i<res.data.length;i++){
                                //   $scope.hstNameList.push(res.data[i].hostelName);}
                                $scope.hstNameList = res.data;
                            }
                        }

                        var HstDetErrCB = function (res) {
                            debugger;
                        }
                        $scope.getHstDetList = function () {
                            var dataObj = {
                                'optId': 0,
                                'type': 'hstDet'
                            }
                            ServerCall.getData('php/hostel.php', 'POST', dataObj, HstDetSuccCB, HstDetErrCB)
                        };
                        $scope.getHstDetList();// end

                        /* Room Details  list start */
                        $scope.roomNumbList = [];
                        var roomDetSuccCB = function (res) {
                            if (res.data) {
                                for (var i = 0; i < res.data.length; i++) {
                                    $scope.roomNumbList.push(res.data[i].rmNum);
                                }
                            }
                        }
                        var roomDetErrCB = function (res) {
                            debugger;
                        }
                        $scope.getRoomList = function (hostelName) {
                            $scope.roomNum = '';
                            $scope.hostelName = hostelName;
                            $scope.roomNumbList = [];
                            var dataObj = {
                            'optId': 4,
                             'hostelName': hostelName,
                              'type': 'stuAllot'
                            }
                            ServerCall.getData('php/hostel.php', 'POST', dataObj, roomDetSuccCB, roomDetErrCB)

                        }; // room Details List End


                        /* Date selection call back*/
                        $scope.fnDOJSelection = function (selDate, sub) {
                            $scope.doj = selDate;
                        }
                        $scope.fnFrom = function (selDate, sub) {
                            $scope.from = selDate;
                        }
                        $scope.fnTo = function (selDate, sub) {
                            $scope.to = selDate;
                        }

                        if (data != undefined) {
                            $scope.changeCourseType(data.course);
                            $scope.changeStream(data.className);
                            // $scope.getStdDet();

                            $scope.isSave = false;
                            $timeout(function () {
                                $scope.getStdDet();
                                $scope.cType = data.course;
                                $scope.class = data.className;
                                $scope.section = data.section;
                                $scope.semesters = data.medium;
                                $scope.admNo = data.admNo;
                                $scope.name = data.name;
                                $scope.hstName = data.hostelName;
                                $scope.roomNum = data.rmNum;
                                $scope.AcaYr = data.acaYear;
                                $scope.doj = data.doj;
                                $scope.from = data.from;
                                $scope.to = data.to;
                            }, 100);
                        }
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('stuAllot');
                            } 
                            else {
                                $scope.msg = data.message;
                            }
                        }
                        var errCB = function (data) {
                        $scope.msg = "Room already alloted for that candidate.";
                        $scope.isSaved = false;
                        }

                        $scope.save = function (opt) {
                            if ($("#StudentAllotForm").valid()) {
                                var dataObj = {
                                    'course': $scope.cType,
                                    'className': $scope.class,
                                    'section': $scope.section,
                                    'medium': $scope.semesters,
                                    'admNo': $scope.admNo,
                                    'name': $scope.name,
                                    // 'admNo':$scope.stuObj.admNo,
                                    // 'name':$scope.stuObj.name,
                                    'hostelName': $scope.hstName,
                                    'rmNum': $scope.roomNum,
                                    'acaYear': $scope.AcaYr,
                                    'doj': $scope.doj,
                                    'from': $scope.from,
                                    'to': $scope.to,
                                    'type': 'stuAllot'
                                }
                                if (opt == '10') {
                                    dataObj.optId = 10;
                                    dataObj.id = data.id;
                                }
                                else{
                                    dataObj.optId = 9;
                                }
                                ServerCall.getData('php/hostel.php', 'POST', dataObj, sucCB, errCB)
                            }
                        }
                    },
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: 'false'
                })
            };
            /* Add and Edit Student Allotment modal end */

            /* Delete Student Allotment  start */
            $scope.deleteStuAllot = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('stuAllot');
                            }
                        }
                        var errCB = function (data) {
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'stuAllot',
                                'optId': 11,
                                'id': data.id,
                            }
                            ServerCall.getData('php/hostel.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            //Hostel Student Allotment End

            /* Student Vacated list start */
            var StuVacatedSuccCB = function (res) {
                if (res.data)
                    $scope.stuVacatedList = res.data;
                else
                    $scope.stuVacatedList = [];
            }
            var StuVacatedErrCB = function (res) {
                debugger;
            }
            $scope.getStuVacatedList = function () {
                var dataObj = {
                    'optId': 12,
                    'type': 'stuVacated'
                }
                ServerCall.getData('php/hostel.php', 'POST', dataObj, StuVacatedSuccCB, StuVacatedErrCB)
            };

            /* Add and Edid stu Vacated modal start */
            $scope.addStuVacated = function (data) {
                $modal.open({
                    templateUrl: 'views/hostel/hstStuVacatedModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $timeout(function () {
                            $("#StuVacateForm").validate({
                                rules: {
                                    cType: "required",
                                    class: "required",
                                    semesters: "required",
                                    section: "required",
                                    admNo: "required",
                                    AcaYr: "required",
                                    reason: "required",
                                },
                                messages: {
                                    cType: "Please select Course",
                                    class: "Please select Class",
                                    semesters: "Please select Section",
                                    section: "Please select Medium",
                                    admNo: "Please check atleast one Exam",
                                    AcaYr: "Please select Academic Year",
                                    reason: "Please enter the Reason",
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
                                'optId': 4,
                                'type': 'stuVacated'
                            }
                            dataObj.course = $scope.cType;
                            dataObj.className = $scope.class;
                            dataObj.section = $scope.section;
                            dataObj.medium = $scope.semesters;

                            ServerCall.getData('Hostel', 'POST', dataObj, studentSuccCB, studentsErrCB)
                        };
                        $scope.getStdDet = function () {
                            if ($scope.cType != undefined && $scope.class != undefined && $scope.section != undefined && $scope.semesters != undefined)
                                $scope.stdSearch();
                        }//student name end

                        if (data != undefined) {
                            $scope.changeCourseType(data.cType);
                            $scope.changeStream(data.className);

                            $scope.isSave = false;
                            $timeout(function () {
                                $scope.cType = data.course;
                                $scope.class = data.className;
                                $scope.section = data.section;
                                $scope.semesters = data.medium;
                                $scope.stuObj = data.admNo;
                                $scope.stuObj.name = data.name;
                                $scope.AcaYr = data.acaYear;
                                $scope.dol = data.dol;
                                $scope.reason = data.reason;
                            }, 100);
                        }
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('stuVacated');
                            }
                            else{
                                $scope.msg = data.message;
                            }
                        }
                        var errCB = function (data) {
                            $scope.msg = data.message;
                        }
                        /* Date selection call back*/
                        $scope.fnDOl = function (selDate, sub) {
                            $scope.dol = selDate;
                        }

                        $scope.save = function (opt) {
                            // if($("#StuVacateForm").valid()){
                            var dataObj = {
                                'course': $scope.cType,
                                'className': $scope.class,
                                'section': $scope.section,
                                'medium': $scope.semesters,
                                'admNo': $scope.stuObj.admNo,
                                'name': $scope.stuObj.name,
                                'acaYear': $scope.AcaYr,
                                'dol': $scope.dol,
                                'reason': $scope.reason,
                                'type': 'stuVacated'
                            }
                            if (opt == '14') {
                                dataObj.optId = 14;
                                dataObj.id = data.id;
                            }else{
                                dataObj.optId = 13;
                            }
                            ServerCall.getData('php/hostel.php', 'POST', dataObj, sucCB, errCB)
                            // }
                        }
                    },
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: 'false'
                })
            };
            /* Add and Edit Student Vacated modal end */

            /* Delete Student Vacated start */
            $scope.deleteStuVacated = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('stuVacated');
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
                                'type': 'stuVacated',
                                'optId': 15,
                                'id': data.id,
                            }
                            ServerCall.getData('php/hostel.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            //Hostel Student Vacated End

            // Events start 
            $rootScope.$on('hstDet', function () {
                $scope.getHstDetList();
            });
            $rootScope.$on('roomDet', function () {
                $scope.getRoomDetList();
            });
            $rootScope.$on('stuAllot', function () {
                $scope.getStuAllotList();
            });
            $rootScope.$on('stuVacated', function () {
                $scope.getStuVacatedList();
            });
            $rootScope.$on('students', function (args, data) {
                $scope.stdSearch(data);
            });
            //Events End

        }); 