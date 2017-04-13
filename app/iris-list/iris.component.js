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

        $scope.fancytreeData = [
            {
                title: "Ensemble1",
                children:  [
                    {
                        title: "Sim1",
                        hideCheckbox: true
                    },
                    {
                        title: "Sim2",
                        hideCheckbox: true
                    },
                    {
                        title: "Sim3",
                        hideCheckbox: true
                    }
                ]
            },
            {
                title: "Ensemble2",
                children:  [
                    {
                        title: "Sim4",
                        hideCheckbox: true
                    },
                    {
                        title: "Sim5",
                        hideCheckbox: true
                    },
                    {
                        title: "Sim6",
                        hideCheckbox: true
                    }
                ]
            },
            {
                title: "Ensemble3",
                children:  [
                    {
                        title: "Sim7",
                        hideCheckbox: true
                    },
                    {
                        title: "Sim8",
                        hideCheckbox: true
                    },
                    {
                        title: "Sim9",
                        hideCheckbox: true
                    }
                ]
            }
        ];

        $scope.variablesTree = [
            {
                title: "Mineral",
                hideCheckbox: true,
                children: [
                    {
                        title: "Volume Fraction",
                        children: [
                            {
                                title: "Quartz"
                            },
                            {
                                title: "Calcite"
                            },
                            {
                                title: "Dolomite"
                            }
                        ]
                    },
                    {
                        title: "Saturation",
                        children: [
                            {
                                title: "Quartz"
                            },
                            {
                                title: "Calcite"
                            },
                            {
                                title: "Dolomite"
                            }
                        ]
                    }
                ]
            },
            {
                title: "Solute",
                hideCheckbox: true,
                children: [
                    {
                        title: "Concentration",
                        children: [
                            {
                                title: "Ca++"
                            },
                            {
                                title: "H+"
                            },
                            {
                                title: "CO3--"
                            }
                        ]
                    }
                ]
            },
            {
                title: "Sediment",
                hideCheckbox: true,
                children: [
                    {
                        title: "Temperature"
                    },
                    {
                        title: "Porosity"
                    },
                    {
                        title: "Permeability"
                    },
                    {
                        title: "Tortuosity"
                    }
                ]
            }
        ]

    $scope.selectedVariables = [];

}]);
    /*.component('iris', {
        templateUrl: 'iris-list/iris-list.template.html',
        controller: ['Iris', 'd3',
            function IrisController(Iris) {

                this.irisList = Iris.query();

            }
        ]
})*/