angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, LoginService, $ionicPopup, $state) {
    $scope.data = {};

    $scope.login = function() {
        LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
            $state.go('tab.dash');
        }).error(function(data) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: 'Please check your credentials!'
            });
        });
    }
})

.controller('NewContactCtrl', function($scope) {

})

.controller('GroupCtrl', function($scope) {

})

.controller('ContactInfoCtrl', function($scope) {

})

.controller('DashCtrl', function($scope, $ionicPopover, Task) {
    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.openPopover = popover;
    });
    $scope.tasks = Task.all();
})

.controller('ContactCtrl', function($scope, $ionicModal, $ionicPopover) {
  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.openPopover = popover;
  });

  $ionicModal.fromTemplateUrl('templates/contact.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
})

.controller('SlideCtrl', function($scope) {
  $scope.contactSlide = 1;
})


.controller('ChatsCtrl', function($scope, Chats,  $ionicPopover) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
  $ionicPopover.fromTemplateUrl('templates/popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.openPopover = popover;
  });
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats, $ionicPopover) {
  $ionicPopover.fromTemplateUrl('templates/popoverchats.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  })
  $scope.chat = Chats.get($stateParams.chatId);
})



.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
