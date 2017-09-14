angular.module('SMSApp')
        .controller('examFeeCtrl', function ($scope,$rootScope,AdminService) {
            var userRole = sessionStorage.getItem("role");
            var userName = sessionStorage.getItem('uid');
            if (userName == undefined)
                return;
            if (userRole != undefined) {
                $rootScope.$emit('menuReset', userRole);
            }
            $scope.isDefault=true;
//          $scope.isentermarks=true;
             
            /* Default tabs visible */
            var setDefault = function () {
             $scope.isentermarks = false;
             $scope.isregularFee=false;
              $scope.isSupplyFee = false;
            };
            function selInnerLi(data) {
                $('#examFee li').removeClass('selTab');
                $('#examFee li:nth-child(' + data + ')').addClass('selTab');
            }
            $rootScope.$on('examFeeMenu', function (eve, data) {
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
                        $scope.isentermarks = true;
                        break;
                    case 2:
                        $scope.isregularFee = true;
                        break;
                         case 3:
                        $scope.isSupplyFee = true;
                        break;
                }
            };
            /* Tab active and inactive color function */
            $scope.isSet = function (tabNum) {
                return $scope.tab === tabNum;
            };
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
            $scope.banks = JSON.parse(sessionStorage.getItem('banks'));
            $scope.semesters = [];
            $scope.classes = [];
        $scope.cTypes=JSON.parse(sessionStorage.getItem('cTypes'));
        var clsArr=JSON.parse(sessionStorage.getItem('classes'));
        $scope.sections=JSON.parse(sessionStorage.getItem('sections'));
        var semArr=JSON.parse(sessionStorage.getItem('semesters'));

                      $scope.changeCourseType = function (cType) {
                            $scope.streams = [];
                             $scope.semester='';
                              $scope.section='';
                              $scope.streams="";
                            $scope.streams = AdminService.changeCourseType(cType, clsArr);
                           
                        };

                        $scope.changeStream = function (stream) {
                            $scope.semesters = [];
                            $scope.semester='';
                              $scope.section='';  
                            $scope.semesters = AdminService.changeStream(stream, semArr, $scope.cType);
                        };

        });