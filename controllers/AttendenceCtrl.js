angular.module('SMSApp')
        .controller('attendenceCtrl', function ($scope, $rootScope) {
            var userRole = sessionStorage.getItem("role");
            var userName = sessionStorage.getItem('uid');
            if (userName == undefined)
                return;
            if (userRole != undefined) {
                $rootScope.$emit('menuReset', userRole);
            }
            $scope.isDefault=true;
            /* Default tabs visible */
            var setDefault = function () {

            }
            function selInnerLi(data) {
                $('#attendence li').removeClass('selTab');
                $('#attendence li:nth-child(' + data + ')').addClass('selTab');
            }
            $rootScope.$on('attendenceMenu', function (eve, data) {
                $scope.setTab(data);
                selInnerLi(data);
            });
            /* Tab click function */
            $scope.setTab = function (newTab) {
                $scope.isDefault=false;
                $scope.tab = newTab;
                setDefault();
                switch (newTab) {
                    case 1:
                        $scope.isAcc = true;
                        break;
                    case 2:
                        $scope.isSearch = true;
                        break;
                }
            };
            /* Tab active and inactive color function */
            $scope.isSet = function (tabNum) {
                return $scope.tab === tabNum;
            };



        });