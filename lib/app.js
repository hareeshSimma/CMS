'use strict';

/**
 * @ngdoc overview
 * @name SMSApp
 * @description
 * # SMSApp
 *
 * Main module of the application.
 */
angular .module('SMSApp', ['ngRoute', 'ui.bootstrap','nvd3'] )
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'mainCtrl'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'mainCtrl'
      })
      .when('/admin', {
        templateUrl: 'views/admin/admin.html',
        controller: 'adminCtrl'
      })
      .when('/exam', {
        templateUrl: 'views/exams/exams.html',
        controller: 'examsCtrl'
      })
      .when('/fee', {
        templateUrl: 'views/fee/fee.html',
        controller: 'feeCtrl'
      })
      .when('/hr', {
        templateUrl: 'views/employee/employee.html',
        controller: 'empCtrl'
      })
      .when('/student', {
        templateUrl: 'views/student/student.html',
        controller: 'studentCtrl'
      })
     

     .when('/store', {
        templateUrl: 'views/store/store.html',
        controller: 'storeCtrl'
      })

      .when('/accounts', {
        templateUrl: 'views/accounts/accounts.html',
        controller: 'accCtrl'
      })
      .when('/transport', {
        templateUrl: 'views/transport/transport.html',
        controller: 'transportCtrl'
      })
   .when('/finance', {
        templateUrl: 'views/finance/finance.html',
        controller: 'financeCtrl'
      })

.when('/hostel', {
        templateUrl: 'views/hostel/hostel.html',
        controller: 'hostelCtrl'
      })
.when('/library', {
        templateUrl: 'views/library/library.html',
        controller: 'libraryCtrl'
      })
.when('/placement', {
        templateUrl: 'views/placement/placement.html',
        controller: 'placementCtrl'
      })
.when('/examFee', {
        templateUrl: 'views/examFee/fee.html',
        controller: 'examFeeCtrl'
      })
  .when('/attendence', {
        templateUrl: 'views/attendence/attendence.html',
        controller: 'attendenceCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })



      
