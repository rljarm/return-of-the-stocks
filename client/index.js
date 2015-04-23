'use strict';

angular.module('day-trader', ['firebase'])
.run(['$rootScope', '$window', function($rootScope, $window) {
  $rootScope.fbRoot = new $window.Firebase('https://return-of-stocks.firebaseio.com/');
}])
.controller('master', ['$scope', '$filter', '$firebaseObject', '$firebaseArray', '$http', function($scope, $filter, $firebaseObject, $firebaseArray, $http){
  var fbUser = $scope.fbRoot.child('user');
  var afUser = $firebaseObject(fbUser);
  $scope.user = afUser;
  var fbPort = $scope.fbRoot.child('portfolios');
  var afPort = $firebaseArray(fbPort);
  $scope.portfolios = afPort;
  var symbol = $scope.symbol;

  // $scope.isToggleButton = true;
  $scope.haveUserInfo = true;
  $scope.start = function(){

    $scope.user.$save();
    $scope.isToggleButton = true;
    $scope.haveUserInfo = false;
  };
  $scope.toggleForm = function(){
    $scope.haveUserInfo = true;
    $scope.isToggleButton = false;
  };
  $scope.buildPort = function(){

    $scope.portfolios.$add($scope.portfolio);

  };
  $scope.buy = function(){
   symbol = $filter('uppercase')($scope.symbol);
  //  $scope.portfolio.name.symbol = symbol;
    console.log(symbol);
    $http.jsonp('http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol='+ symbol +'&callback=JSON_CALLBACK').then(function(response){
  var price = $scope.portfolio.quantity *(response.data.LastPrice);
  $scope.portfolios.$add($scope.portfolio);
  });
  };

}]);
