
angular.module('SMSApp')
        .controller('transportCtrl', function ($scope, $rootScope, $modal, ServerCall, AdminService, $timeout) {
            var userRole = sessionStorage.getItem("role");
            var userName = sessionStorage.getItem('uid');
            if (userName == undefined)
                return;
            if (userRole != undefined) {
                $rootScope.$emit('menuReset', userRole);
            }
            //$scope.tab = 1;
            //$scope.isVehicle=true;
            $scope.isDefault = true;
            var setDefault = function () {
                $scope.isVehicle = false;
                $scope.isVehicleRoute = false;
                $scope.isInsurance = false;
                $scope.isAllotment = false;
            }
            function selInnerLi(data) {
                $('#transport li').removeClass('selTab');
                $('#transport li:nth-child(' + data + ')').addClass('selTab');
            }
            $rootScope.$on('transportMenu', function (eve, data) {
                $scope.setTab(data);
                selInnerLi(data);
            });
            $scope.setTab = function (newTab) {
                $scope.tab = newTab;
                $scope.isDefault = false;
                setDefault();
                switch (newTab) {
                    case 1:
                        $scope.isVehicle = true;
                        $scope.getVehicleList();
                        break;
                    case 2:
                        $scope.isVehicleRoute = true;
                        $scope.getVehicleRouteList();
                        break;
                    case 3:
                        $scope.isAllotment = true;
                        $scope.getAllotmentList();
                        break;
                    case 4:
                        $scope.isInsurance = true;
                        $scope.getInsuranceList();
                        break;
                }
            };

            /* Tab active and inactive color function */
            $scope.isSet = function (tabNum) {
                return $scope.tab === tabNum;
            };

//Vehicle code start 
            /* Vehicle list start */
            var VehicleSuccCB = function (res) {
                $scope.msg='';
                if (res.data){
                    $scope.vehicleList = res.data;
                }
                else{
                    $scope.msg=res;
                    $scope.vehicleList = [];
                }
            }
            var VehicleErrCB = function (res) {
                debugger;
            }
            $scope.getVehicleList = function () {
                var dataObj = {
                    'optId': 0,
                    'type': 'vehicle'
                }
                ServerCall.getData('php/transport.php', 'POST', dataObj, VehicleSuccCB, VehicleErrCB)
            };

            /* Default Load*/
            if ($scope.tab == 1)
                $scope.getVehicleList();

            /* Add and Edid vehicle modal start */
            $scope.addVehicle = function (data) {
                $modal.open({
                    templateUrl: 'views/transport/vehicleModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope, $timeout) {
                        $timeout(function () {
                            $("#VehDetailsForm").validate({
                                rules: {
                                    Vehicle: "required",
                                    VehicleType: "required",
                                    FuelType: "required",
                                    Odometer: "required",
                                    Ownership: "required",
                                    Capacity: "required",
                                },
                                messages: {
                                    Vehicle: "Please enter Vehicle",
                                    VehicleType: "Please enter Vehicle Type",
                                    FuelType: "Please enter Fuel Type",
                                    Odometer: "Please enter Odometer",
                                    Ownership: "Please selection Ownership",
                                    Capacity: "Please enter Capacity"
                                },
                            });
                        }, 1000);

                        $scope.isSave = true;
                        if (data != undefined) {
                            $scope.isSave = false;
                            $scope.Vehicle = data.vehicle;
                            $scope.VehicleType = data.vehicleType;
                            $scope.FuelType = data.fuelType;
                            $scope.Odometer = data.odometer;
                            $scope.Capacity = data.capacity;
                            $scope.Ownership = data.ownership;
                            $scope.Purchase = data.purchase;
                            $scope.OwnName = data.ownName;
                            $scope.Lstart = data.lstart;
                            $scope.Lend = data.lend;
                        }
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('vehicle');
                            }
                            $scope.msg=data.message;
                        }
                        var errCB = function (data) {
                           $scope.msg=data.message;
                        }

                        /*dropdown change code start*/
                        var defaultDis = function () {
                            $scope.isOwn = false;
                            $scope.isRent = false;
                        }

                        $scope.selOwnership = function (type) {
                            defaultDis();
                            switch (type) {
                                case 'Own':
                                    $scope.isOwn = true;
                                    break;
                                case 'Rent':
                                    $scope.isRent = true;
                                    break;
                            }
                        }
                        /*dropdown change code end*/

                        $scope.save = function (opt) {
                            if ($("#VehDetailsForm").valid()) {
                                var dataObj = {
                                    'vehicle': $scope.Vehicle,
                                    'vehicleType': $scope.VehicleType,
                                    'fuelType': $scope.FuelType,
                                    'odometer': $scope.Odometer,
                                    'capacity': $scope.Capacity,
                                    'ownership': $scope.Ownership,
                                    'purchase': $scope.Purchase,
                                    'ownName': $scope.OwnName,
                                    'lstart': $scope.Lstart,
                                    'lend': $scope.Lend,
                                    'type': 'vehicle'
                                }
                                if (opt == '2') {
                                    dataObj.optId = 2;
                                    dataObj.id = data.id;
                                }
                                else {
                                    dataObj.optId = 1;
                                }
                                ServerCall.getData('php/transport.php', 'POST', dataObj, sucCB, errCB)
                            }
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
                            else{
                                 $scope.msg=data.message;
                            }
                        var errCB = function (data) {
                             $scope.msg=data.message;
                        }
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'vehicle',
                                'optId': 3,
                                'vehicleNum': data.vehicle,
                                'vehicleNumber': data.vehicle,
                                'id': data.id
                            };
           ServerCall.getData('php/transport.php', 'POST', dataObj, sucCB, errCB);

                        };
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                });
            };
            /* Delete Vehicle end */
            // Vehicle end


//Vehicle Route code start 
            /* Vehicle Route list start */
            var VehicleRouteSuccCB = function (res) {
                if (res.data)
                    $scope.vehicleRouteList = res.data;
                else
                    $scope.vehicleRouteList = [];
            }
            var VehicleRouteErrCB = function (res) {
                debugger;
            }
            $scope.getVehicleRouteList = function () {
                var dataObj = {
                    'optId': 4,
                    'type': 'vehicleRoute'
                }
                ServerCall.getData('php/transport.php', 'POST', dataObj, VehicleRouteSuccCB, VehicleRouteErrCB)
            };
            /* Default Load*/
            if ($scope.tab == 1)
                $scope.getVehicleRouteList();


            /* Add and Edid vehicle Route modal start */

            $scope.addVehicleRoute = function (data) {
                $modal.open({
                    templateUrl: 'views/transport/vehicleRouteModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope, $timeout) {
                        $timeout(function () {
                            $("#VehRouteForm").validate({
                                rules: {
                                    VehicleNum: "required",
                                    Route: "required",
                                    Destination: "required",
                                    DriverName: "required",
                                    DriverNumber: {
                                        "required": true,
                                        "digits": true,
                                        "minlength": 10,
                                        "maxlength": 12
                                    },
                                    License: "required",
                                },
                                messages: {
                                    VehicleNum: "Please select Vehicle Number",
                                    Route: "Please enter Route",
                                    Destination: "Please enter Destination",
                                    DriverName: "Please enter Driver Name",
                                    DriverNumber: {
                                        "required": "Please enter Ph.No",
                                    },
                                    License: "Please enter License",
                                },
                            });
                        }, 1000);

                        $scope.isSave = true;
                        $scope.vehicleList = [];
                        var VehicleSuccCB = function (res) {
                            if (res.data) {
                                $scope.vehicleList = res.data;
                            }
                        }
                        var VehicleErrCB = function (res) {
                            debugger;
                        }
                        $scope.getVehicleList = function () {
                            var dataObj = {
                                'optId': 0,
                                'type': 'vehicle'
                            }
                            ServerCall.getData('php/transport.php', 'POST', dataObj, VehicleSuccCB, VehicleErrCB)
                        };
                        $scope.getVehicleList();

                        if (data != undefined) {
                            $scope.isSave = false;
                            $scope.vehicleObj = {
                                'vehicle': data.vehicleNum,
                                'vehicleType': data.vehicleType,
                                'capacity': data.capacity,
                            }
                            /* $scope.vehicleObj.vehicle=data.vehicleNum;
                             $scope.vehicleObj.vehicleType=data.vehicleType;
                             $scope.vehicleObj.capacity=data.capacity;*/
                            $scope.Route = data.route;
                            /* $scope.Source=data.source;*/
                            $scope.Destination = data.destination;
                            $scope.DriverName = data.driverName;
                            $scope.DriverNumber = data.driverNumber;
                            $scope.License = data.license;
                        }
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('vehicleRoute');
                            }else{
                             $scope.msg=data.message;
                        }
                    }
                        var errCB = function (data) {
                         $scope.msg=data.message;
                        }

                        $scope.save = function (opt) {
                            if ($("#VehRouteForm").valid()) {
                                var dataObj = {
                                    'vehicleNum': $scope.vehicleObj.vehicle,
                                    'vehicleType': $scope.vehicleObj.vehicleType,
                                    'capacity': $scope.vehicleObj.capacity,
                                    'route': $scope.Route,
                                    /* 'source':$scope.Source,*/
                                    'destination': $scope.Destination,
                                    'driverName': $scope.DriverName,
                                    'driverNumber': $scope.DriverNumber,
                                    'license': $scope.License,
                                    'type': 'vehicleRoute'
                                }
                                if (opt == '6') {
                                    dataObj.optId = 6;
                                    dataObj.id = data.id;
                                }
                                else {
                                    dataObj.optId = 5;
                                }
                                ServerCall.getData('php/transport.php', 'POST', dataObj, sucCB, errCB)
                            }
                        }
                    },
                    size: 'md',
                    backdrop: 'static',
                    keyboard: 'false'
                })
            };
            /* Add and Edit vehicle Route modal end */

            /* Delete vehicle Route start */
            $scope.deleteVehicleRoute = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('vehicleRoute');
                            }else{
                             $scope.msg=data.message;
                         }
                        }
                        var errCB = function (data) {
                             $scope.msg=data.message;
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'vehicleRoute',
                                'optId': 7,
                                'id': data.id
                            }
                            ServerCall.getData('php/transport.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            /* Delete Vehicle Route end */
            // Vehicle Route end


            //Vehicle Insurance code start 
            /* Vehicle  insurance list start */
            var InsuranceSuccCB = function (res) {
                if (res.data)
                    $scope.insuranceList = res.data;
                else
                    $scope.insuranceList = [];
            }
            var InsuranceErrCB = function (res) {
                debugger;
            }
            $scope.getInsuranceList = function () {
                var dataObj = {
                    'optId': 8,
                    'type': 'insurance'
                }
                ServerCall.getData('php/transport.php', 'POST', dataObj, InsuranceSuccCB, InsuranceErrCB)
            };

            /* Add and Edid vehicle insurance modal start */
            $scope.addInsurance = function (data) {
                $modal.open({
                    templateUrl: 'views/transport/insuranceModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope, $timeout) {
                        $timeout(function () {
                            $("#VehInsuForm").validate({
                                rules: {
                                    VehicleNumber: "required",
                                    InsuranceCompany: "required",
                                    Insurer: "required",
                                },
                                messages: {
                                    VehicleNumber: "Please select Vehicle Number",
                                    InsuranceCompany: "Please enter Company Name",
                                    Insurer: "Please enter Insurer",
                                },
                            });
                        }, 1000);

                        $scope.isSave = true;
                        $scope.vehicleList = [];
                        var VehicleSuccCB = function (res) {
                            if (res.data) {
                                for (var i = 0; i < res.data.length; i++) {
                                    $scope.vehicleList.push(res.data[i].vehicle);

                                }
                            }
                        }
                        var VehicleErrCB = function (res) {
                            debugger;
                        }
                        $scope.getVehicleList = function () {
                            var dataObj = {
                                'optId': 0,
                                'type': 'vehicle'
                            }
                            ServerCall.getData('php/transport.php', 'POST', dataObj, VehicleSuccCB, VehicleErrCB)
                        };
                        $scope.getVehicleList();

                        if (data != undefined) {
                            $scope.isSave = false;
                            $timeout(function () {
                                $scope.VehicleNumber = data.vehicleNumber;
                            }, 1000)
                            $scope.InsuranceCompany = data.insuranceCompany;
                            $scope.Insurer = data.insurer;
                            $scope.Date = data.date;
                            $scope.ExpiresOn = data.expiresOn;

                        }
                        $scope.fnInsuranceSelection = function (selDate) {
                            $scope.Date = selDate
                        }
                        $scope.fnFutureDateSelection = function (selFutureDate) {
                            $scope.ExpiresOn = selFutureDate
                        }
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('insurance');
                            }
                            else{
                                 $scope.msg=data.message;
                            }
                        }
                        var errCB = function (data) {
                           $scope.msg=data.message;
                        }
                        $scope.save = function (opt) {
                            if ($("#VehInsuForm").valid()) {
                                var dataObj = {
                                    'vehicleNumber': $scope.VehicleNumber,
                                    'insuranceCompany': $scope.InsuranceCompany,
                                    'insurer': $scope.Insurer,
                                    'date': $scope.Date,
                                    'expiresOn': $scope.ExpiresOn,
                                    'type': 'insurance'
                                }
                                if (opt == '10') {
                                    dataObj.optId = 10;
                                    dataObj.id = data.id;
                                }
                                else {
                                    dataObj.optId = 9;
                                }
                                ServerCall.getData('php/transport.php', 'POST', dataObj, sucCB, errCB)
                            }
                        }
                    },
                    size: 'md',
                    backdrop: 'static',
                    keyboard: 'false'
                })
            };
            /* Add and Edit vehicle insurance modal end */

            /* Delete vehicle insurance start */
            $scope.deleteInsurance = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('insurance');
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
                                'type': 'insurance',
                                'optId': 11,
                                'id': data.id
                            }
                            ServerCall.getData('php/transport.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            /* Delete Vehicle insurance end */
            // Vehicle insuranceend


            /* Vehicle Route Allotment list start */
            var AllotmentSuccCB = function (res) {
                if (res.data)
                    $scope.allotmentList = res.data;
                else
                    $scope.allotmentList = [];
            }
            var AllotmentErrCB = function (res) {
                debugger;
            }
            $scope.getAllotmentList = function () {
                var dataObj = {
                    'optId': 12,
                    'type': 'allotment'
                }
                ServerCall.getData('php/transport.php', 'POST', dataObj, AllotmentSuccCB, AllotmentErrCB)
            };
            /* Default Load*/
            if ($scope.tab == 1)
                $scope.getAllotmentList();


            /* Add and Edid vehicle Route Allotment modal start */

            $scope.addAllotment = function (data) {
                $modal.open({
                    templateUrl: 'views/transport/routeAllotmentModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope, $timeout) {
                        $scope.isSave = true;

                        $scope.cTypes = JSON.parse(sessionStorage.getItem('cTypes'));
                        var clsArr = JSON.parse(sessionStorage.getItem('classes'));
                        $scope.sections = JSON.parse(sessionStorage.getItem('sections'));
                        ;
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

                        };
                        $scope.changeStream = function (stream, cType) {
                            $scope.semesters = [];
                            $scope.examsArr = [];
                            $scope.semester = '';
                            $scope.section = '';
                            $scope.selTest = '';
                            $scope.semesters = AdminService.changeStream(stream, semArr, $scope.cType);
                         //   $scope.getTestSubject();
                        };
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
                            dataObj.semester = $scope.semester;

                            ServerCall.getData('php/student.php', 'POST', dataObj, studentSuccCB, studentsErrCB)
                        };
                        $scope.getStdDet = function () {
                            if ($scope.cType != undefined && $scope.class != undefined && $scope.section != undefined && $scope.semester != undefined)
                                $scope.stdSearch();
                        }
                        //student name end

                        if (data != undefined) {
                            $scope.isSave = false;
                            $scope.changeCourseType(data.cType);
                            $timeout(function () {
                                $scope.cType = data.cType;
                                $scope.className = data.class;
                                $scope.section = data.section;
                                $scope.semester = data.semester;
                            }, 100);


                            $scope.stuObj = {
                                'admNo': data.admNo,
                                'name': data.name,
                            }
                            $scope.Route = data.route;
                            /*$scope.stuObj.admNo=data.admNo;
                             $scope.stuObj.name=data.name;*/
                            // $scope.Sno=data.sno;
                            //$scope.Sname=data.sname;

                        }

                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('allotment');
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
                                'cType': $scope.cType,
                                'className': $scope.class,
                                'section': $scope.section,
                                'semester': $scope.semester,
                                'admNo': $scope.stuObj.admNo,
                                'name': $scope.stuObj.name,
                                //'sno':$scope.Sno,
                                // 'sname':$scope.Sname,
                                'route': $scope.Route,
                                'type': 'allotment'
                            }
                            if (opt == '14') {
                                dataObj.optId = 14;
                                dataObj.id = data.id;
                            }
                            else {
                                dataObj.optId = 13;
                            }
                            ServerCall.getData('php/transport.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'md',
                    backdrop: 'static',
                    keyboard: 'false'
                })
            };
            /* Add and Edit vehicle Route Allotment modal end */

            /* Delete vehicle Route Allotment start */
            $scope.deleteAllotment = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('allotment');
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
                                'type': 'allotment',
                                'optId': 15,
                                'id': data.id
                            }
                            ServerCall.getData('php/transport.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            /* Delete Vehicle Route Allotment end */

            // Vehicle Route  Allotment end












            /* call back Events */
            $rootScope.$on('vehicle', function () {
                $scope.getVehicleList();
            });
            $rootScope.$on('vehicleRoute', function () {
                $scope.getVehicleRouteList();
            });

            $rootScope.$on('insurance', function () {
                $scope.getInsuranceList();
            });

            $rootScope.$on('allotment', function () {
                $scope.getAllotmentList();
            });


            /* Date selection call back*/
            $scope.fnDateSelection = function (selDate) {
                $scope.date = selDate;
            }
            $scope.fnExpiresOnSelection = function (selFutureDate) {
                $scope.expiresOn = selFutureDate;
            }
        });