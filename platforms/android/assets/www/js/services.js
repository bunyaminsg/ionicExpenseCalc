angular.module('starter.services', [])

.factory('Expenses', function($resource) {
  return {
    all: function() {
      return $resource('http://146.185.136.134:8080/api/allExpenses',{'query': { method: 'GET' }});
    },
    allTime: function() {
      return $resource('http://146.185.136.134:8080/api/showAllTime',{'query': { method: 'GET' }});
    },
    today: function() {
      return $resource('http://146.185.136.134:8080/api/todayExpenses',{'query': { method: 'GET' }});
    },
    categories: function() {
      return $resource('http://146.185.136.134:8080/api/monthCategories',{'query': { method: 'GET' }});
    },
    add: function() {
      return $resource('http://146.185.136.134:8080/api/add',{'save':   {method:'POST'}});
    },
    delete: function(__id) {
      return $resource('http://146.185.136.134:8080/api/:id',{id: __id},{'delete': {method:'DELETE'}});
    },
    total: function(_category){
      return $resource('http://146.185.136.134:8080/api/total/:category',{category: _category},{'query': {method:'GET'}});
    },
    filter: function() {
      return $resource('http://146.185.136.134:8080/api/filter',{'save':   {method:'POST'}});
    },
    newExpense: function(name,category,value) {
      return {
        'name': name,
        'category': category,
        'amount': value
      };
    }
  }
});
