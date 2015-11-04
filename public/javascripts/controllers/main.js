app.controller('MainCtrl', [
'$scope',
'posts',
function($scope, posts){
   $scope.posts = posts.posts;

  $scope.addPost = function() {
    if ($scope.title === '' || !$scope.title) {return;}
    //posts here refers to the factory above (90% sure)
    posts.create({
      title: $scope.title,
      link: $scope.link,
    });
    $scope.title = '';
    $scope.link = '';
  };

  $scope.addUpvote = function(post) {
  posts.upvote(post);
 };

}]);
