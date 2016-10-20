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
  $scope.getCategories = function () {
    Expenses.categories().query(function(result){
          $scope.categories = result;
        }, function(error){
          $scope.categories = [];
        });
  }
  $scope.getCategories();
})

.controller('SettingsCtrl', function($scope, Expenses, $cordovaFile) {
  $scope.settings = {
    enableFriends: true
  };

  $scope.exportJSON = function () {
    $scope.exps = Expenses.all();
    $cordovaFile.createFile(cordova.file.externalDataDirectory,"Expenses.json",true);
    $cordovaFile.writeExistingFile(cordova.file.externalDataDirectory, "Expenses.json", Expenses.all().stringify());
  }
});
