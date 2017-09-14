angular.module('SMSApp')
        .controller('empCtrl', function ($scope, ServerCall, $rootScope, $modal, $filter, $timeout) {
            var userRole = sessionStorage.getItem("role");
            var userName = sessionStorage.getItem('uid');
            if (userName == undefined)
                return;
            if (userRole != undefined) {
                $rootScope.$emit('menuReset', userRole);
            }
           // $scope.tab = 1;
            $scope.isDefault = true;
            $scope.isRegister = true;
            $scope.employee = {};
            $scope.checkList = {};
            /* Default tabs visible */
            var setDefault = function () {
                $scope.isRegister = false;
                $scope.isIdCard = false;
                $scope.isAttendence = false;
                $scope.isCertificate = false;
                $scope.isLeave = false;
                $scope.isJobVacancy = false;
                $scope.isCanApply = false;
                $scope.isCanStatus = false;
            }

            function selInnerLi(data) {
                $('#hr li').removeClass('selTab');
                $('#hr li:nth-child(' + data + ')').addClass('selTab');
            }
            $rootScope.$on('hrMenu', function (eve, data) {
                $scope.setTab(data);
                selInnerLi(data);
            });
           
            /* Tab click function */
            $scope.setTab = function (newTab) {
                $scope.tab = newTab;
                $scope.isDefault = false;
                $scope.employee = {};
                $scope.chkAll = {};
                setDefault();
                switch (newTab) {
//                    case 1:
//                        $scope.isJobVacancy = true;
//                        $scope.getJobVacancyList();
//                        break;
//                    case 2:
//                        $scope.isCanApply = true;
//                        $scope.getJobApplyList();
//                        break;
//                    case 3:
//                        $scope.isCanStatus = true;
//                        break;
//                    case 4:
//                        $scope.isRegister = true;
//                        $scope.getEmployeeList();
//                        break;
                    case 1:
                        $scope.isIdCard = true;
                        $scope.getEmployeeList();
                        break;
//                    case 6:
//                        $scope.isAttendence = true;
//                        $scope.getEmployeeList();
//                        $scope.isOther = true;
//                        break;
                    case 2:
                        $scope.isCertificate = true;
                        $scope.getEmployeeList();
                        break;
//                    case 8:
//                        $scope.isLeave = true;
//                        $scope.getEmployeeList();
//                        break;

                        /* case 9:
                         $scope.isSms=true;
                         break;*/
                }
            };
            /* Tab active and inactive color function */
            $scope.isSet = function (tabNum) {
                return $scope.tab === tabNum;
            };

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
            $scope.getEmployeeList = function () {
                var dataObj = {
                    'optId': 0,
                    'type': 'employee'
                };
                ServerCall.getData('php/employee.php', 'POST', dataObj, employeeSuccCB, employeeErrCB);

            };

            /* employee list end */


            //default Load
            if ($scope.tab == 1)
                $scope.getEmployeeList()
            // Delete employee end //

            /* Events Start */
            $rootScope.$on('employee', function () {
                $scope.getEmployeeList();

            });

            /*Events End */

            /* Attendence code start*/


            /* check box selection */

            $scope.checkAll = function (bool) {
                $scope.employeeList = $filter('filter')($scope.employeeList, {name: $scope.fName})
                if (bool) {
                    for (var i = 0; i < $scope.employeeList.length; i++) {
                        var key = $scope.employeeList[i].empId;
                        $scope.checkList[key] = true;
                    }

                } else {
                    for (var i = 0; i < $scope.employeeList.length; i++) {
                        var key = $scope.employeeList[i].empId;
                        $scope.checkList[key] = false;
                    }
                }
            };
//Start Attendence Code

            $scope.fnAttSave = function () {
                var _tempAttObj = $scope.att;
                var dataArr = [];
                angular.forEach($scope.attEmp, function (obj, key) {
                    var _tempObj = {
                        'date': $scope.selDate,
                        'employee': $scope.empType,
                        'status': _tempAttObj[obj.empId],
                        'empId': obj.empId,
                        'name': obj.name
                    };
                    dataArr.push(_tempObj);
                });
                var opt = ($scope.attEmp[0] && ($scope.attEmp[0].isNew == true)) ? 0 : 1;
                var dataObj = {
                    'type': 'attendence',
                    'optId': opt,
                    'attendence': dataArr
                };
                var sucCB = function (data) {
                    $scope.saveAttendence = false;
                    alert(data.message);
                    $scope.attEmp = [];
                };
                var errCB = function (data) {

                };
                ServerCall.getData('Employee', 'POST', dataObj, sucCB, errCB);
            };
            $scope.fnDSelection = function (selDate) {
                $scope.selDate = selDate;
                $scope.saveAttendence = false;
                $scope.$apply();
            };
            $scope.enterAttendence = function () {
                $scope.att = {};
                var sucCB = function (data) {
                    $scope.attEmp = data.data;
                    if ($scope.attEmp && $scope.attEmp.length)
                        $scope.saveAttendence = true;
                    $timeout(function () {
                        angular.forEach($scope.attEmp, function (obj) {
                            $scope.att[obj.empId] = obj.status;
                        });
                    }, 500);
                };
                var errCB = function (data) {

                };
                var dataObj = {
                    'type': 'attendence',
                    'optId': 3,
                    'employee': $scope.empType,
                    'attDate': $scope.selDate
                };
                ServerCall.getData('Employee', 'POST', dataObj, sucCB, errCB);
            };

//End Attendence Code

            /* IdCard code start*/
            /*generate id code*/
            $scope.generateIdCard = function (selEmployees, empList) {
                $modal.open({
                    templateUrl: 'views/employee/genrateIdModal.html',
                    controller: function ($timeout, $scope, $modalInstance, $location, $rootScope, ServerCall, AdminService) {
                        var selEmployee = selEmployees;
                        var totalEmps = empList;
                        $scope.idGenEmployee = [];
                        angular.forEach(totalEmps, function (obj, index) {
                            if (selEmployee[obj.empId])
                                $scope.idGenEmployee.push(obj);
                        });
                        $scope.close = function () {
                            $modalInstance.close();
                        }



                        $scope.printId = function () {
                            var printData = document.getElementsByClassName('modal-body')[0].innerHTML;
                            sessionStorage.setItem('printData', printData);
                            window.open('/SMS/print.html', "", "width=800,height=600");

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
                            ServerCall.getData('Admin', 'POST', dataObj, SinfoSuccCB, SinfoErrCB)
                        };
                        $scope.getSinfoList();
                    },
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: 'false'
                })
            };


            var leaveSuccCB = function (res) {
                if (res.data)
                    $scope.leaveList = res.data;
                else
                    $scope.leaveList = [];
            }
            var leaveErrCB = function (res) {
                debugger;
            }
            $scope.getLeaveList = function () {
                var dataObj = {
                    'optId': 3,
                    'type': 'leave'
                };
                ServerCall.getData('Employee', 'POST', dataObj, leaveSuccCB, leaveErrCB);
            };
            // leave list end //

            // Add and Edit Leave modal start //
            $scope.applyLeave = function (data) {
                $modal.open({
                    templateUrl: 'views/employee/applyLeaveModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope, $timeout) {
                        $timeout(function () {
                            $("#LeaveForm").validate({
                                rules: {
                                    empid: "required",
                                    LeaveType: "required",
                                    Reason: "required"
                                },
                                messages: {
                                    empid: "Please select EmpId",
                                    LeaveType: "Please select Leave Type",
                                    Reason: "Please enter Reason"
                                },
                            });
                        }, 1000);


                        // $scope.getSinfoList();

                        $scope.isSave = true;
                        $scope.leavesList = [];
                        var employeeSuccCB = function (res) {
                            if (res.data) {
                                $scope.empIdsList = res.data;
                            }
                        }
                        var employeeErrCB = function (res) {
                            debugger;
                        }
                        $scope.getEmployeeList = function () {
                            var dataObj = {
                                'optId': 3,
                                'type': 'employee'
                            };
                            ServerCall.getData('Employee', 'POST', dataObj, employeeSuccCB, employeeErrCB);

                        };
                        $scope.getEmployeeList();



                        if (data != undefined && data.hasOwnProperty()) {
                            $scope.isSave = false;
                            $scope.empid = data.empid;
                            $scope.empType = data.empType;
                            $scope.LeaveType = data.leaveType;
                            $scope.avlbllvs = data.avlbllvs;
                            $scope.usdlvs = data.usdlvs;
                            $scope.leftlvs = data.leftlvs;
                            $scope.StartDate = data.startDate;
                            $scope.EndDate = data.endDate;
                            $scope.Nod = data.nod;
                            $scope.Reason = data.reason;
                        }
                        $scope.fnLeavSelection = function (selDate) {
                            $scope.StartDate = selDate;
                            calNoOfDays();
                        }

                        $scope.fnLeaveSelection = function (sDate) {
                            $scope.EndDate = sDate;
                            calNoOfDays();
                        }

                        $scope.lType = function (leaveType) {
                            if (leaveType == '') {
                                $scope.avlbllvs = [];
                            }
                            else if (leaveType == "Casual") {
                                $scope.avlbllvs = $scope.empObj.clRemain;
                                $scope.usdlvs = $scope.empObj.casual - $scope.empObj.clRemain;
                            }
                            else if (leaveType == "Meternity") {
                                $scope.avlbllvs = $scope.empObj.mlRemain;
                                $scope.usdlvs = $scope.empObj.maternity - $scope.empObj.mlRemain;
                            }
                            else if (leaveType == "Sick") {
                                $scope.avlbllvs = $scope.empObj.slRemain;
                                $scope.usdlvs = $scope.empObj.sick - $scope.empObj.slRemain;
                            }
                        }
                        function  calNoOfDays() {
                            if ($scope.StartDate == undefined || $scope.EndDate == undefined)
                                return;
                            var startDate = $scope.StartDate;
                            var endDate = $scope.EndDate;
                            $scope.nod = Math.floor((Date.parse(endDate) - Date.parse(startDate)) / 86400000);
                        }

                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('leave');
                            }
                            else{
                                $scope.msg=data.message;
                            }
                        }
                        var errCB = function (data) {
                              $scope.msg=data.message;
                        }

                        $scope.save = function (opt) {
                            if ($("#LeaveForm").valid()) {
                                var dataObj = {
                                    'empid': $scope.empObj.empId,
                                    'empType': $scope.empObj.employee,
                                    'leaveType': $scope.leaveType,
                                    'avlbllvs': $scope.avlbllvs,
                                    'usdlvs': $scope.usdlvs,
                                    'startDate': $scope.StartDate,
                                    'endDate': $scope.EndDate,
                                    'nod': $scope.nod,
                                    'reason': $scope.Reason,
                                    'remainLeaves': $scope.avlbllvs - $scope.nod,
                                    'type': 'leave'
                                }

                                if (opt == '1') {
                                    dataObj.optId = 1;
                                    dataObj.pkValue = data.id;
                                }
                                ServerCall.getData('Employee', 'POST', dataObj, sucCB, errCB)
                            }
                        }
                    },
                    size: 'md',
                    backdrop: 'static',
                    keyboard: 'false',
                    resolve: {
                        leaveData: function () {
                            return $scope.leaveList;
                        }
                    }
                })
            };
            // Add and Edit leave modal end //

            /* Delete leave start */
            $scope.deleteLeave = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('leave');
                            }
                        }
                        var errCB = function (data) {
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'leave',
                                'optId': 2,
                                'pkValue': data.id
                            }
                            ServerCall.getData('Employee', 'POST', dataObj, sucCB, errCB);
                        }
                    },
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }

            /* Delete leave end */







            /*certificate code start*/
            var certificateSuccCB = function (res) {
                $scope.EmployeeList = [];
                setDefaultView();
                $scope.isCertificate = true;
            }
            var certificateErrCB = function (res) {
                debugger;
            }

            $scope.getCertificateList = function () {
                var dataObj = {
                    'optId': 3,
                    'type': 'certificate'
                };
                ServerCall.getData('Employee', 'POST', dataObj, certificateSuccCB, certificateErrCB);

            };

            /* Add and Edit certificate modal start */
            $scope.generateCertificate = function (selEmployees, empList) {
                $modal.open({
                    templateUrl: 'views/employee/certificateModal.html',
                    controller: function ($timeout, $scope, $modalInstance, $location, $rootScope, ServerCall, AdminService) {
                        var selEmployee = selEmployees;
                        var totalEmps = empList;
                        var defaultDis = function () {
                            $scope.isExperience = false;
                            $scope.isRelieving = false;
                            $scope.isOffer = false;

                        }
                        $scope.certiGenEmployee = [];
                        angular.forEach(totalEmps, function (obj, index) {
                            if (selEmployee[obj.empId])
                                $scope.certiGenEmployee.push(obj);
                        });
                        $scope.close = function () {
                            $modalInstance.close();
                        }

                        var SinfoSuccCB = function (res) {
                            debugger;
                            if (res.data)
                                $scope.sinfoObj = res.data[0];
                            $scope.sName = $scope.sinfoObj.campusName;
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
                            ServerCall.getData('Admin', 'POST', dataObj, SinfoSuccCB, SinfoErrCB)
                        };
                        $scope.getSinfoList();
                        $scope.selCertType = function (type) {
                            defaultDis();
                            switch (type) {
                                case 'Experience':
                                    $scope.isExperience = true;
                                    break;
                                case 'Relieving':
                                    $scope.isRelieving = true;
                                    break;
                                case 'Offer':
                                    $scope.isOffer = true;
                                    break;
                            }
                        }
                    },
                    size: 'lg',
                    backdrop: 'static',
                    keyboard: 'false'
                })
            };
            /*generate id card cod end*/

//Job Vacancy code start 
            /* Job Vacancy list start */
            var jobVacancySuccCB = function (res) {
                if (res.data)
                    $scope.jobVacancyList = res.data;
                else
                    $scope.jobVacancyList = [];
            }
            var jobVacancyErrCB = function (res) {
                debugger;
            }
            $scope.getJobVacancyList = function () {
                var dataObj = {
                    'optId': 3,
                    'type': 'jobVacancy'
                }
                ServerCall.getData('Employee', 'POST', dataObj, jobVacancySuccCB, jobVacancyErrCB)
            };
            /* Job Vacancy end */

            /* Add and Edid Job Vacancy modal start */
            $scope.addJobVacncy = function (data) {
                $modal.open({
                    templateUrl: 'views/employee/addJobVacancyModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope, $timeout) {
                        $timeout(function () {
                            $("#addJobForm").validate({
                                rules: {
                                    title: "required",
                                    vName: "required",
                                    hManager: "required",
                                    positions: "required",
                                    describe: "required",
                                },
                                messages: {
                                    title: "Please select Job Title",
                                    vName: "Please enter Vacancy Name",
                                    hManager: "Please enter Hiring Manager Name",
                                    positions: "Please enter no.of Positions",
                                    describe: "Please enter Description",
                                },
                            });
                        }, 1000);

                        $scope.isSave = true;
                        if (data != undefined) {
                            $scope.isSave = false;
                            $scope.title = data.title;
                            $scope.vName = data.vName;
                            $scope.hManager = data.hManager;
                            $scope.positions = data.positions;
                            $scope.describe = data.describe;
                        }
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('jobVacancy');
                            }
                        }
                        var errCB = function (data) {

                        }
                        $scope.save = function (opt) {
                            if ($("#addJobForm").valid()) {
                                var dataObj = {
                                    'title': $scope.title,
                                    'vName': $scope.vName,
                                    'hManager': $scope.hManager,
                                    'positions': $scope.positions,
                                    'describe': $scope.describe,
                                    'type': 'jobVacancy'
                                }
                                if (opt == '1') {
                                    dataObj.optId = 1;
                                    dataObj.id = data.id;
                                }
                                ServerCall.getData('Employee', 'POST', dataObj, sucCB, errCB)
                            }
                        }
                    },
                    size: 'md',
                    backdrop: 'static',
                    keyboard: 'false'
                })
            };
            /* Add and Edit Job Vacancy modal end */

            /* Delete Job Vacancy start */
            $scope.deleteJobVacancy = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('jobVacancy');
                            }
                        }
                        var errCB = function (data) {
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'jobVacancy',
                                'optId': 2,
                                'id': data.id
                            }
                            ServerCall.getData('Employee', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            /* Delete Job Vacancy end */


            //Job Apply code start 
            /* Job Apply list start */
            var jobApplySuccCB = function (res) {
                if (res.data)
                    $scope.jobApplyList = res.data;
                else
                    $scope.jobApplyList = [];
            }
            var jobApplyErrCB = function (res) {
                debugger;
            }
            $scope.getJobApplyList = function () {
                var dataObj = {
                    'optId': 3,
                    'type': 'jobApply'
                }
                ServerCall.getData('Employee', 'POST', dataObj, jobApplySuccCB, jobApplyErrCB)
            };
            /* Job Vacancy end */

            /* Add and Edid JobA pply start */
            $scope.addCanApply = function (data) {
                $modal.open({
                    templateUrl: 'views/employee/canApplyJobModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope, $timeout) {
                        $timeout(function () {
                            $("#CanApplyForm").validate({
                                rules: {
                                    name: "required",
                                    email: {
                                        "required": true,
                                        "email": true,
                                    },
                                    phNo: {
                                        "required": true,
                                        "digits": true,
                                        "maxlength": 12,
                                        "minlength": 10,
                                    },
                                    vacancy: "required",
                                    comment: "required",
                                },
                                messages: {
                                    name: "Please enter name",
                                    email: {
                                        "required": "Please enter ur MailId"
                                    },
                                    phNo: {
                                        "required": "Please enter Ph.No"
                                    },
                                    vacancy: "Please select Vacancy",
                                    comment: "Please ur Comment",
                                },
                            });
                        }, 1000);
                        $scope.vacancyNameList = [];
                        var jobVacancySuccCB = function (res) {
                            if (res.data) {
                                // for(var i=0;i<res.data.length;i++){
                                //   $scope.hstNameList.push(res.data[i].hostelName);}
                                $scope.vacancyNameList = res.data;
                            }
                        }
                        var jobVacancyErrCB = function (res) {
                            debugger;
                        }
                        $scope.getJobVacancyList = function () {
                            var dataObj = {
                                'optId': 3,
                                'type': 'jobVacancy'
                            }
                            ServerCall.getData('Employee', 'POST', dataObj, jobVacancySuccCB, jobVacancyErrCB)
                        };
                        $scope.getJobVacancyList();

                        $scope.isSave = true;
                        if (data != undefined) {
                            $scope.isSave = false;
                            $scope.name = data.name;
                            $scope.email = data.emailid;
                            $scope.phNo = data.phNo;
                            $timeout(function () {
                                $scope.vacancy = data.vacancy;
                            }, 1000);
                            $scope.comment = data.comment;
                            // $scope.resume=data.resume;
                            $scope.dao = data.dao;

                        }
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('jobApply');
                            }
                        }
                        var errCB = function (data) {

                        }
                        $scope.fnDOASelection = function (selDate) {
                            $scope.dao = selDate;
                        }
                        $scope.save = function (opt) {
                            if ($("#CanApplyForm").valid()) {
                                var dataObj = {
                                    'name': $scope.name,
                                    'emailid': $scope.email,
                                    'phNo': $scope.phNo,
                                    'vacancy': $scope.vacancy,
                                    'comment': $scope.comment,
                                    // 'resume':$scope.resume,
                                    'dao': $scope.dao,
                                    'type': 'jobApply'
                                }
                                if (opt == '1') {
                                    dataObj.optId = 1;
                                    dataObj.id = data.id;
                                }
                                ServerCall.getData('Employee', 'POST', dataObj, sucCB, errCB)
                            }
                        }
                    },
                    size: 'md',
                    backdrop: 'static',
                    keyboard: 'false'
                })
            };
            /* Add and Edit Job Apply modal end */

            /* Delete Job Apply start */
            $scope.deleteCanApply = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('jobApply');
                            }
                        }
                        var errCB = function (data) {
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'jobApply',
                                'optId': 2,
                                'id': data.id
                            }
                            ServerCall.getData('Employee', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            /* Delete Job Apply end */


            //Job Apply Status code start 
            /* Job Apply Status list start */
            var jobStatusSuccCB = function (res) {
                if (res.data)
                    $scope.jobStatusList = res.data;
                else
                    $scope.jobStatusList = [];
            }
            var jobStatusErrCB = function (res) {
                debugger;
            }
            $scope.getJobStatusList = function () {
                var dataObj = {
                    'optId': 3,
                    'type': 'jobStatus'
                }
                ServerCall.getData('Employee', 'POST', dataObj, jobStatusSuccCB, jobStatusErrCB)
            };
            /* Job Vacancy end */

            /* Add and Edid Job Vacancy modal start */
            $scope.addCanStatus = function (data) {
                $modal.open({
                    templateUrl: 'views/employee/canApplyStatusModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope, $timeout) {
                        $timeout(function () {
                            $("#CanStatusForm").validate({
                                rules: {
                                    vacancy: "required",
                                    mao: "required",
                                    status: "required",
                                    name: "required",
                                },
                                messages: {
                                    vacancy: "Please select Vacancy Name",
                                    mao: "Please select method of application",
                                    status: "Please enter no.of Positions",
                                    name: "Please enter name",
                                },
                            });
                        }, 1000);

                        $scope.vacancyList = [];
                        var jobVacancySuccCB = function (res) {
                            if (res.data) {
                                $scope.hrNameObj = {};
                                for (var i = 0; i < res.data.length; i++) {
                                    $scope.vacancyList.push(res.data[i].vName)
                                    $scope.hrNameObj[res.data[i].vName] = res.data[i].hManager;
                                }
                            }
                        }
                        var jobVacancyErrCB = function (res) {
                            debugger;
                        }
                        $scope.getJobVacancyList = function () {
                            var dataObj = {
                                'optId': 3,
                                'type': 'jobVacancy'
                            }
                            ServerCall.getData('Employee', 'POST', dataObj, jobVacancySuccCB, jobVacancyErrCB)
                        };
                        $scope.getJobVacancyList();

                        $scope.getHrName = function (vName) {
                            $scope.hManager = $scope.hrNameObj[vName];
                        };

                        $scope.isSave = true;
                        if (data != undefined) {
                            $scope.isSave = false;
                            // $scope.title=data.title;
                            $scope.vacancy = data.vacancy;
                            $scope.hManager = data.hManager;
                            $scope.status = data.status;
                            $scope.name = data.name;
                            $scope.dao = data.dao;
                            $scope.mao = data.mao;
                        }
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('jobStatus');
                            }
                        }
                        var errCB = function (data) {
                        }
                        $scope.fnDOASelection = function (selDate) {
                            $scope.dao = selDate;
                        }

                        $scope.save = function (opt) {
                            if ($("#CanStatusForm").valid()) {
                                var dataObj = {
                                    // 'title':$scope.title,
                                    'vacancy': $scope.vacancy,
                                    'hManager': $scope.hManager,
                                    'status': $scope.status,
                                    'name': $scope.name,
                                    'dao': $scope.dao,
                                    'mao': $scope.mao,
                                    'type': 'jobStatus'
                                }
                                if (opt == '1') {
                                    dataObj.optId = 1;
                                    dataObj.id = data.id;
                                }
                                ServerCall.getData('Employee', 'POST', dataObj, sucCB, errCB)
                            }
                        }
                    },
                    size: 'md',
                    backdrop: 'static',
                    keyboard: 'false'
                })
            };
            /* Add and Edit Job Status modal end */

            /* Delete Job Status start */
            $scope.deleteCanStatus = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('jobStatus');
                            }
                        }
                        var errCB = function (data) {
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'jobStatus',
                                'optId': 2,
                                'id': data.id
                            }
                            ServerCall.getData('Employee', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            /* Delete Job Status end */


            //default Load 

            if ($scope.tab == 1)
                $scope.getEmployeeList();

            /* Events Start */
            $rootScope.$on('employee', function () {
                $scope.getEmployeeList();

            });
            $rootScope.$on('leave', function () {
                $scope.getLeaveList();

            });
            $rootScope.$on('jobVacancy', function () {
                $scope.getJobVacancyList();
            });
            $rootScope.$on('jobApply', function () {
                $scope.getJobApplyList();
            });
            $rootScope.$on('jobStatus', function () {
                $scope.getJobStatusList();
            });
            /*Events End */
            $scope.fnFromSelection = function (selDate) {
                $scope.date = selDate;
            }
            $scope.fnToSelection = function (sDate) {
                $scope.date = sDate;
            }

        });

/*$scope.fnFromSelection=function(selDate){
 $scope.date=selDate;
 }
 $scope.fnToSelection=function(sDate){
 $scope.date=sDate;
 }
 
 });
 */


