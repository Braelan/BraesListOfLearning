app.controller('PostsCtrl', [
  '$scope',
  'post',
  'posts',
  function($scope, post, posts){
   $scope.post = post;

   $scope.addComment = function() {
     if ($scope.body && $scope.body.length > 0){
       posts.addComment(post._id, {
         author: 'Brae',
         body: $scope.body}).success(function(comment) {
           $scope.post.comments.push(comment);
         });
     }
     $scope.body = '';
   };

   $scope.addUpvote = function(comment) {
     posts.upvoteComment(post, comment);
   };
  }]);
