/**
 * Created by gustavo on 19/01/2017.
 */
angular.
    module('iris').
    controller('IrisCtrl', ['$scope', 'Iris', function ($scope, Iris) {
        $scope.title = 'IrisCtrl';
        $scope.irisList = [];

        Iris.query().$promise.then(function(result) {
            angular.forEach(result, function(item){
               $scope.irisList.push(item.toJSON());
            });
            $scope.jsonIrisList = JSON.parse(JSON.stringify($scope.irisList));
            //console.log($scope.irisList);
            //console.log($scope.jsonIrisList);
            //$scope.irisList = result.toJSON();
        }, function(error){
            console.log(error);
        });

        $scope.printIrisData = function() {
            console.log($scope.jsonIrisList);
        }

        $scope.canvasWidth = 400;
        $scope.canvasHeight = 400;
        $scope.dofillcontainer = true;
        $scope.scale = 1;
        $scope.materialType = 'lambert';

}]);
    /*.component('iris', {
        templateUrl: 'iris-list/iris-list.template.html',
        controller: ['Iris', 'd3',
            function IrisController(Iris) {

                this.irisList = Iris.query();

            }
        ]
})*/