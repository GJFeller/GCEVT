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

        $scope.treeData = [
            {
                text: "Ensemble1",
                nodes:  [
                            {
                                text: "Sim1"
                            },
                            {
                                text: "Sim2"
                            },
                            {
                                text: "Sim3"
                            }
                        ]
            },
            {
                text: "Ensemble2",
                nodes:  [
                    {
                        text: "Sim4"
                    },
                    {
                        text: "Sim5"
                    },
                    {
                        text: "Sim6"
                    }
                ]
            },
            {
                text: "Ensemble3",
                nodes:  [
                    {
                        text: "Sim7"
                    },
                    {
                        text: "Sim8"
                    },
                    {
                        text: "Sim9"
                    }
                ]
            }
        ];

}]);
    /*.component('iris', {
        templateUrl: 'iris-list/iris-list.template.html',
        controller: ['Iris', 'd3',
            function IrisController(Iris) {

                this.irisList = Iris.query();

            }
        ]
})*/