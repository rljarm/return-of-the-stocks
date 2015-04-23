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
  var fbStock = $scope.fbRoot.child('Stocks');
  var afStock = $firebaseArray(fbStock);
  $scope.stocks = afStock;
  $scope.total = 0;

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
   symbol = $filter('uppercase')($scope.stock.symbol);

    console.log(symbol);
    $http.jsonp('http://dev.markitondemand.com/Api/v2/Quote/jsonp?symbol='+ symbol +'&callback=JSON_CALLBACK').then(function(response){
   $scope.stock.price = response.data.LastPrice;
   $scope.total = $scope.total + $scope.stock.quantity * response.data.LastPrice;
   console.log($scope.total);

  $scope.stocks.$add($scope.stock);
  newTotal($scope.stock.price, $scope.stock.quantity);

  });
  };
  function newTotal(price, qty){
    $scope.user.balance -= price * qty;
    $scope.user.$save();
  }

}]);
