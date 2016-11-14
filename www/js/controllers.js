angular.module('starter.controllers', [])

.controller('ExpenseCtrl', function($scope, $ionicModal, Expenses) {
  // Create our modal
  $ionicModal.fromTemplateUrl('new-expense.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
  });

  $scope.getExpenses = function(){
    $scope.expenses = [];
    Expenses.all().query(function(result){
          console.log(result);
          $scope.expenses = result;
        }, function(error){
          console.log(error);
          $scope.expenses = [];
        });
  }
  
  $scope.getTodayExpenses = function () {
    Expenses.today().query(function(result){
          $scope.todayExpenses = result;
        }, function(error){
          $scope.todayExpenses = [];
        });
  }

  $scope.getTodayExpenses();

  $scope.createExpense = function(expense) {
    var today = new Date();
    var newExpense = Expenses.newExpense(expense.name, expense.category.toLowerCase(), expense.value);
    Expenses.add().save(newExpense, 
      function(result){
        console.log("added.");
        $scope.getTodayExpenses();
      }, function(error){
        console.log("add failed");
      });
    expense.name = "";
    expense.category = "";
    expense.value = 0;
    $scope.closeNewExpense();
  };

  $scope.filterExpenses = function(filt){
    Expenses.filter().save(filt, 
      function(result){
        $scope.todayExpenses = result;
      }, function(error){
        $scope.todayExpenses = [];
      });
  }

  $scope.removeExpense = function(expense) {
    Expenses.delete(expense._id).delete(function(result){
        console.log("deleted.");
        $scope.getTodayExpenses();
      }, function(error){
        console.log("delete failed");
      });
  };

  $scope.newExpense = function() {
    $scope.taskModal.show();
  };

  $scope.closeNewExpense = function() {
    $scope.taskModal.hide();
  }


})

.controller('DashCtrl', function($scope, Expenses) {
  $scope.polarToCartesian= function(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }

  $scope.describeArc = function(x, y, radius, startAngle, endAngle){

      var start = $scope.polarToCartesian(x, y, radius, endAngle);
      var end = $scope.polarToCartesian(x, y, radius, startAngle);

      var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

      var d = [
          "M", start.x, start.y, 
          "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
      ].join(" ");

      return d;       
  }

  $scope.d1 = $scope.describeArc(150, 150, 100, 0, 40);
  $scope.d2 = $scope.describeArc(150, 150, 100, 0, 60);
  $scope.d3 = $scope.describeArc(150, 150, 100, 0, 60);

  $scope.getCategories = function () {
    Expenses.categories().query(function(result){
          $scope.categories = result;
          if(result.length>0)
            $scope.getCategoryTotals();
        }, function(error){
          $scope.categories = [];
        });
  }
  $scope.getCategories();
  $scope.categoryTotals = {};
  $scope.getCategoryTotals = function(){
    console.log("here");
    for(var i=0;i<$scope.categories[0].categories.length;i++){
      Expenses.total($scope.categories[0].categories[i]).query(function(result){
        console.log(result);
        $scope.categoryTotals[result.category] = result.total;
        $scope.calcTotal();
        $scope.calcPercent();
      });
    }
  }
  $scope.categoryPercentage = [];
  $scope.calcPercent = function(){
    $scope.categoryPercentage = [];
    for(var key in $scope.categoryTotals){
      $scope.categoryPercentage.push({ 
        name: key,
        per: Math.round((parseFloat($scope.categoryTotals[key])/$scope.total)*100)/100.0,
        col: "rgb(" + parseInt(Math.random()*255) + "," + parseInt(Math.random()*255) + "," + parseInt(Math.random()*255) + ")"
      });
    }
    $scope.categoryPercentage.sort(function(a, b) {
        return parseFloat(b.per) - parseFloat(a.per);
    });
    var r=0;
    for(var i=0;i<$scope.categoryPercentage.length;i++){
      $scope.categoryPercentage[i].r = r;
      r += ($scope.categoryPercentage[i].per * 360);
    }
  }
  $scope.total = 0;
  $scope.calcTotal = function(){
    $scope.total = 0;
    for(var key in $scope.categoryTotals){
      $scope.total += $scope.categoryTotals[key];
    }
  }
})

.controller('SettingsCtrl', function($scope, Expenses, $cordovaFile) {
  $scope.settings = {
    enableFriends: true
  };

  $scope.allTimeExpenses = [];
  $scope.total = 0;

  $scope.getAllExp = function(){  
    Expenses.allTime().query(function(result){
      console.log("result",result);
      $scope.allTimeExpenses = result;
      $scope.total = 0;
      for (var i = $scope.allTimeExpenses.length - 1; i >= 0; i--) {
        $scope.total += $scope.allTimeExpenses[i].amount;
      }
    });
  };

  $scope.getAllExp();

  /*$scope.exportJSON = function () {
    $scope.exps = Expenses.all();
    $cordovaFile.createFile(cordova.file.externalDataDirectory,"Expenses.json",true);
    $cordovaFile.writeExistingFile(cordova.file.externalDataDirectory, "Expenses.json", Expenses.all().stringify());
  }*/


});
