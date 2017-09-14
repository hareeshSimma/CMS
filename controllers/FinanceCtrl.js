angular.module('SMSApp')
        .controller('financeCtrl', function ($scope, $rootScope, $modal, ServerCall, AdminService) {
            var userRole = sessionStorage.getItem("role");
            var userName = sessionStorage.getItem('uid');
            if (userName == undefined)
                return;
            if (userRole != undefined) {
                $rootScope.$emit('menuReset', userRole);
            }
            //$scope.tab = 1;
            // $scope.isFallocation=true;
            $scope.isDefault=true;
            /* Default tabs visible */
            var setDefault = function () {
                $scope.isFallocation = false;
                $scope.isFcollection = false;
            }
            function selInnerLi(data) {
                $('#finance li').removeClass('selTab');
                $('#finance li:nth-child(' + data + ')').addClass('selTab');
            }
            $rootScope.$on('financeMenu', function (eve, data) {
                $scope.setTab(data);
                selInnerLi(data);
            });
            /* Tab click function */
            $scope.setTab = function (newTab) {
                $scope.tab = newTab;
                $scope.isDefault=false;
                setDefault();
                switch (newTab) {
                    case 1:
                        $scope.isFallocation = true;
                        break;
                    case 2:
                        $scope.isFcollection = true;
                        break;
                }
            };
            /* Tab active and inactive color function */
            $scope.isSet = function (tabNum) {
                return $scope.tab === tabNum;
            };

            //feeallocation code start 

            /* feeallocation list start */
            var FallocationSuccCB = function (res) {
                if (res.data)
                    $scope.fallocationList = res.data;
                else
                    $scope.fallocationList = [];
            }
            var FallocationErrCB = function (res) {
                debugger;
            }
            $scope.getFallocationList = function () {
                var dataObj = {
                    'optId': 3,
                    'type': 'fallocation'
                }
                ServerCall.getData('Finance', 'POST', dataObj, FallocationSuccCB, FallocationErrCB)
            };


            /* Default Load*/
            if ($scope.tab == 1)
                $scope.getFallocationList();

            /* Add and Edit feeallocation modal start */

            $scope.addFallocation = function (data) {
                $modal.open({
                    templateUrl: 'views/finance/feeallocationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope, AdminService) {
                        $scope.isSave = true;
                        $scope.classes = [];
                        $scope.subList = [];
                        $scope.noOfOth = 0;
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

                        $scope.addOthTextBox = function () {
                            $scope.noOfOth = $scope.noOfOth + 1;
                            var tempObj = {
                                'subName': 'others' + ($scope.noOfOth)
                            }
                            $scope.subList.push(tempObj);
                        }

                        $scope.deleteOthTextBox = function (data) {
                            if ($scope.noOfOth != 1) {
                                var _tempsub = {};
                                var index = 1;
                                delete $scope.sub[data];
                                $scope.noOfOth = $scope.noOfOth - 1;
                                angular.forEach($scope.sub, function (val, key) {
                                    _tempsub['subject' + index] = val;
                                    index++;
                                });
                                $scope.sub = _tempsub;
                            }
                            $scope.subList.pop();

                        }

                        if (data != undefined) {
                            $scope.isSave = false;
                            $scope.cType = data.cType;
                            $scope.ClassName = data.className;
                            $scope.AcdYear = data.acdYear;
                            $scope.AdmFee = data.admFee;
                            $scope.AcdFee = data.acdFee;
                            $scope.TransFee = data.transFee;
                            $scope.HstlFee = data.hstlFee;
                            $scope.ExamFee = data.examFee;
                            $scope.StatFee = data.statFee;
                        }
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('fallocation');
                            }
                        }
                        var errCB = function (data) {

                        }
                        $scope.save = function (opt) {
                            var dataObj = {
                                'cType': $scope.cType,
                                'className': $scope.ClassName,
                                'acdYear': $scope.AcdYear,
                                'admFee': $scope.AdmFee,
                                'acdFee': $scope.AcdFee,
                                'transFee': $scope.TransFee,
                                'hstlFee': $scope.HstlFee,
                                'examFee': $scope.ExamFee,
                                'statFee': $scope.StatFee,
                                'type': 'fallocation'
                            }
                            if (opt == '1') {
                                dataObj.optId = 1;
                                dataObj.id = data.id;
                            }
                            ServerCall.getData('Finance', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'md',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            };

            /* Add and Edit feeallocation modal end */

            /* Delete feeallocation start */
            $scope.deleteFallocation = function (data) {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                $modalInstance.close();
                                $rootScope.$broadcast('fallocation');
                            }
                        }
                        var errCB = function (data) {
                        }
                        $scope.yes = function () {
                            var dataObj = {
                                'type': 'fallocation',
                                'optId': 2,
                                'id': data.id
                            }
                            ServerCall.getData('Finance', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: 'false',
                })
            }
            /* Delete feeallocation end */

            // feeallocation end

            /* Default Load*/
            if ($scope.tab == 1)
                $scope.getFallocationList();

            /* call back Events */
            $rootScope.$on('fallocation', function () {
                $scope.getFallocationList();
            });


            //fee collection code start 

            var FcollectionSuccCB = function (res) {
                if (res.data)
                    $scope.fcollectionList = res.data;
                else
                    $scope.fcollectionList = [];
            }
            var FcollectionErrCB = function (res) {
                debugger;
            }
            $scope.getList = function () {
                var dataObj = {
                    'optId': 3,
                    'type': 'fallocation'
                }
                ServerCall.getData('finance', 'POST', dataObj, FallocationSuccCB, FallocationErrCB)
            };




            /* fee collection list start */

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


            /* default Data end */

            /*search code*/
            var studentSuccCB = function (res) {
                $scope.stdList = [];
                $scope.stdList = res.data;

            }
            var studentsErrCB = function (res) {
                debugger;
            }

            $scope.stdSearch = function () {
                $scope.stdList = [];
                var dataObj = {
                    'optId': 3,
                    'type': 'students'
                }
                dataObj.cType = $scope.cType;
                dataObj.className = $scope.class;
                dataObj.section = $scope.section;
                dataObj.medium = $scope.medium;

                ServerCall.getData('Student', 'POST', dataObj, studentSuccCB, studentsErrCB)

            };
            /*feeallocation list start */


            /* Events start */
            $rootScope.$on('students', function (args, data) {

                $scope.stdSearch(data);

            });
            /* Events End */


            /* var FallocationSuccCB=function(res){
             $scope.isChecked=true;
             $scope.FallocationList=[];
             $scope.AdmFee= response.data.admFee;
             
             }
             var FallocationErrCB=function(res){
             debugger;
             }
             
             $scope.getFallocationList=function(){
             var dataObj={
             'optId':3,
             'type':'fallocation'
             }
             ServerCall.getData('Finance','POST',dataObj,FallocationSuccCB,FallocationErrCB)
             };
             */
// drop down selection of mode of payment  code start


            var defaultDis = function () {
                $scope.isCash = false;
                $scope.isCheque = false;
            }


            $scope.selPaymentType = function (type) {
                defaultDis();
                switch (type) {
                    case 'Cash':
                        $scope.isCash = true;
                        break;
                    case 'Cheque':
                        $scope.isCheque = true;
                        break;
                }
            }


            /*bank dropdown start*/

            $scope.banks = JSON.parse(sessionStorage.getItem('banks'));



            /*drop down selection code end
             */


        });