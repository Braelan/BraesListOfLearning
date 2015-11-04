
var app = angular.module('learnThis', ['ui.router']);

app.factory('posts', ['$http',
  function($http){
  var o = {
    posts: []
  };
 // makes request to backend
  o.getAll = function() {
    return $http.get('/posts').success(function(data) {
      angular.copy(data, o.posts);
    });
  };
//creates a a post, taking in a post object
o.create = function(post) {
  return $http.post('/posts', post).success(function(data){
    o.posts.push(data);
  });
};

o.upvote = function(post) {
  return $http.put('/posts/'+ post._id + '/upvote').success(function(data){
      post.upvotes += 1;
    });
};

o.get = function(id) {
  return $http.get('/posts/' + id).then(function(res){
    return res.data
  })
};

o.addComment = function(id, comment){
  return $http.post('/posts/'+id + '/comments', comment);
};

o.upvoteComment = function(post, comment) {
  return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
   .success(function(data){
     comment.upvotes +=1;
   });
};
  return o;
}]);


app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/home.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['posts', function(posts){
          return posts.getAll();
        }]
      }
    });
    $stateProvider
    .state('posts', {
      url: '/posts/{id}',
      templateUrl: '/posts.html',
      controller: 'PostsCtrl',
      resolve: {
        post: ['$stateParams', 'posts', function($stateParams, posts){
          return posts.get($stateParams.id);
        }]
      }
    });

  $urlRouterProvider.otherwise('home');
}]);
