'use strict';
/**
 * @ngdoc function
 * @description
 mainCtrl * Controller of the SMS
 */
angular.module('SMSApp')
        .controller('mainCtrl', function ($scope, $location, $modal, $rootScope, $timeout, ServerCall, AdminService) {
            var userRole = sessionStorage.getItem("role");
            var userName = sessionStorage.getItem('uid');


            $scope.isAll = false;
            $scope.setCSSClass = function () {
                $timeout(function () {
                    $('#myView').addClass('m-t110')
                }, 100);
            }
            switch ($location.path()) {
                case '/admin':
                    $scope.mainTab = 1;

                    break;
                case '/student':
                    $scope.mainTab = 2;

                    break;
                case '/exam':
                    $scope.mainTab = 3;

                    break;
                case '/finance':
                    $scope.mainTab = 4;

                    break;
                case '/employee':
                    $scope.mainTab = 5;

                    break;
                case '/store':
                    $scope.mainTab = 6;

                    break;
                case '/transport':
                    $scope.mainTab = 7;

                    break;

                case '/hostel':
                    $scope.mainTab = 11;

                    break;

                case '/library':
                    $scope.mainTab = 13;

                    break;

                case '/home':
                    $scope.mainTab = 0;

                    break;

                case '/placement':
                    $scope.mainTab = 12;

                    break;

                default:

                    $scope.mainTab = 0;
                    break;
            }

            $scope.oneAtATime = true;
            $scope.myInterval = 3000;
            $scope.slides = [{'imgName': 's1'}, {'imgName': 's2'}, {'imgName': 's3'}, {'imgName': 's4'}, {'imgName': 's5'}];


            $scope.setActive = function (tabNum) {
                return $scope.mainTab === tabNum;
            };
            function defMenuSel() {
                $scope.adminTop = false;
                $scope.studentTop = false;
                $scope.examTop = false;
                $scope.hrTop = false;
                $scope.financeTop = false;
                $scope.transportTop = false;
                $scope.storeTop = false;
                $scope.placementTop = false;
                $scope.hostelTop = false;
            }

            $scope.clickMainTab = function (path, tab, id) {
                defMenuSel();
                $scope[id] = true;
                if ($scope.prePath == path) {
                    $scope[id] = false;
                    return;
                }

                if ($('.colList').hasClass('in'))
                    $('.colList').removeClass('in');
                $('.menu > li').removeClass('selTab');
                $('#' + id).addClass('selTab');
                var _tempSelTo = '#' + id;
                $('#' + id + '+ ul>li').removeClass('selTab');
                $scope.mainTab = tab;
                $scope.prePath = angular.copy(path);
                $location.path(path);
            };
            $scope.setTab = function (eveName, tabNo) {
                $('.menu').toggleClass('menuToggle');
                $rootScope.$broadcast(eveName, tabNo, true);
            };
            $scope.menuToggle = function () {
                $('.menu').toggleClass('menuToggle');
            };
            $scope.logout1 = function () {
                $modal.open({
                    templateUrl: 'views/confirmationModal.html',
                    controller: function ($scope, $modalInstance, $timeout, $location, $rootScope, ServerCall, AdminService) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {

                                $("#closeBtn").trigger("click");
                                $rootScope.$broadcast('logOut');

                            }
                        }
                        var errCB = function (data) {
                        }
                        $scope.yes = function () {
                            $modalInstance.close();
                            var dataObj = {
                                optId: 2
                            }
                            ServerCall.getData('php/users.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'sm',
                    backdrop: 'static',
                    keyboard: false
                })
            };

            $rootScope.$on('menuReset', function (eve, data) {
                $scope.menuDisplay(data);
            });
            $scope.menuDisplay = function (data) {
                $scope.isAll = false;
                var arrTabs = (data != undefined ? data.split(',') : []);
                if (arrTabs[0] == 'all') {
                    $scope.isAll = true;
                } else {
                    for (var i = 0; i < arrTabs.length; i++) {
                        $scope[arrTabs[i] + 'Per'] = true;
                    }
                }
            };
            $rootScope.$on('loggedIn', function (eve, data) {
                $scope.mainTab = 0;
                $location.path('/home');
                $scope.isValidUser = true;
                $scope.setCSSClass();
                $scope.menuDisplay(data)
            });
            $rootScope.$on('logOut', function () {
                $location.path('/');
                $scope.isValidUser = false;
                sessionStorage.clear();
                $('#myView').removeClass('m-t110')
            });
            var logoutSucc = function () {
                $location.path('/');
                $scope.isValidUser = false;
                sessionStorage.clear();
                $('#myView').removeClass('m-t110')
            }
            var logoutErr = function () {

            }
            $scope.logout = function () {
                var dataObj = {
                    optId: 2
                }
                ServerCall.getData('php/users.php', 'POST', dataObj, logoutSucc, logoutErr)

            }
            $scope.openLogin = function () {
                $modal.open({
                    templateUrl: 'views/loginModal.html',
                    controller: function ($scope, $modalInstance, ServerCall, $location, $rootScope) {
                        $scope.close = function () {
                            $modalInstance.close();
                        }
                        var sucCB = function (data) {
                            if (data.status == 'success') {
                                defaultData();
                                sessionStorage.setItem('uid', data.userInfo.uname);
                                sessionStorage.setItem('role', data.userInfo.role);
                                sessionStorage.setItem('code', data.userInfo.schoolCode);
                                $modalInstance.close();
                                $rootScope.$broadcast('loggedIn', data.userInfo.role);
                            } else {
                                $scope.msg = data;
                                $scope.uname = '';
                                $scope.pwd = '';
                            }
                           
                        }
                        var errCB = function (data) {
                            $scope.isValidUser = false;
                        }
                        $scope.login = function () {
                            var dataObj = {
                                'uname': $scope.uname,
                                'pwd': $scope.pwd,
                                'optId': 1
                            };
                            ServerCall.getData('php/users.php', 'POST', dataObj, sucCB, errCB)
                        }
                    },
                    size: 'md',
                    backdrop: 'static',
                    keyboard: false
                });
            }

            $scope.closeTab = function () {
                $(".navbar-collapse").collapse('hide');
            }
            if (sessionStorage.getItem('uid') == null) {
                $location.path('/');
                $scope.isValidUser = false;
            } else {
                $scope.isValidUser = true;
            }
            /* News list start */
            var newsSuccCB = function (res) {
                if (res.data)
                    $scope.newsList = res.data;
                else
                    $scope.newsList = [];
            }
            var newsErrCB = function (res) {
                //debugger;
            }
            $scope.getNewsList = function () {
                var dataObj = {
                    'optId': 0,
                    'type': 'news'
                };
                ServerCall.getData('php/common.php', 'POST', dataObj, newsSuccCB, newsErrCB);
            };

            /* News list end */
            $scope.getNewsList();

            /* load default Data */
            var defSuccCB = function (res) {
                var defData = [];
                if (res != undefined) {
                    AdminService.cTypes = res.ctypes;
                    AdminService.classes = res.classes;
                    AdminService.sections = res.sections;
                    AdminService.mediums = res.mediums;
                    AdminService.exams = res.exams;
                    AdminService.subjects = res.subjects;
                    AdminService.states = res.states;
                    AdminService.districts = res.districts;
                    AdminService.semesters = res.semesters;
                    AdminService.banks = res.banks;
                    sessionStorage.setItem('cTypes', JSON.stringify(res.ctypes));
                    sessionStorage.setItem('classes', JSON.stringify(res.classes));
                    sessionStorage.setItem('sections', JSON.stringify(res.sections));
                    sessionStorage.setItem('mediums', JSON.stringify(res.mediums));
                    sessionStorage.setItem('exams', JSON.stringify(res.exams));
                    sessionStorage.setItem('subjects', JSON.stringify(res.subjects));
                    sessionStorage.setItem('states', JSON.stringify(res.states));
                    sessionStorage.setItem('districts', JSON.stringify(res.districts));
                    sessionStorage.setItem('semesters', JSON.stringify(res.semesters));
                    sessionStorage.setItem('banks', JSON.stringify(res.banks));


                }
            }
            var defErrCB = function (res) {
                debugger;
            }
            var defaultData = function () {
                //var dataObj={};
                //ServerCall.getData('CommonData','POST',dataObj,defSuccCB,defErrCB)
                var dataObj = {
                    'optId': 4
                };
                ServerCall.getData('php/common.php', 'POST', dataObj, defSuccCB, defErrCB);

            }
            if (userRole != undefined) {
                $scope.menuDisplay(userRole);
            }
        });
