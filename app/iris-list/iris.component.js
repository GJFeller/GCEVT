/**
 * Created by gustavo on 19/01/2017.
 */

angular.
    module('iris').
    controller('IrisCtrl', ['$scope', 'Iris', 'Ensemble', function ($scope, Iris, Ensemble) {
        $scope.title = 'IrisCtrl';
        $scope.helpers = Utils.helpers;

        $scope.ensembleListJson = [];
        $scope.ensembleTreeData = [];
        $scope.fancytreeEnsemble;

        $scope.ensembleVariables = [];
        $scope.ensembleVariablesTreeData = [];
        $scope.fancytreeEnsembleVariables;


        /*$scope.irisList = [];

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
        }*/

        $scope.canvasWidth = 400;
        $scope.canvasHeight = 400;
        $scope.dofillcontainer = true;
        $scope.scale = 1;
        $scope.materialType = 'lambert';


        Ensemble.listEnsembles.query().$promise.then(function(result) {
           console.log(result);
           angular.forEach(result, function (item, idx) {
               $scope.ensembleListJson.push(result[0]);
               var dict = {};
               dict.title = item.ensembleId;
               var children = [];
               item.simulations.forEach(function (sim) {
                  var childDict = {};
                  childDict.title = sim;
                  childDict.hideCheckbox = true;
                  children.push(childDict);
               });
               dict.children = children;
               if(idx == 0) {
                   dict.selected = true;
               } else {
                   dict.selected = false;
               }
               $scope.ensembleTreeData.push(dict);
           });
            console.log($scope.ensembleTreeData);
            $scope.fancytreeEnsemble.fancytree('option', 'source', $scope.ensembleTreeData);
            if($scope.ensembleTreeData.length > 0) {
                console.log($scope.ensembleListJson[0]);
                $scope.queryVariableList($scope.ensembleListJson[0]);
            }
        });

        $scope.queryVariableList = function (ensembleSelected) {
            while($scope.ensembleVariablesTreeData.length > 0){
                $scope.ensembleVariablesTreeData.pop();
            }
            while($scope.ensembleVariables.length > 0) {
                $scope.ensembleVariables.pop();
            }

            Ensemble.ensembleVariables.query({ensembleId: ensembleSelected._id}).$promise.then(function (varResult) {
                $scope.varListToFancytreeData(varResult);
                $scope.fancytreeEnsembleVariables.fancytree('option', 'source', $scope.ensembleVariablesTreeData);
            });
        };

        $scope.varListToFancytreeData = function (varList) {
            varList.forEach(function (item, idx) {
                //console.log(item);
                var name = item.name;
                var specie = item.specie;
                var type = "";

                switch(item.type.toLowerCase()) {
                    case "solid":
                        type = "Mineral";
                        break;
                    case "solute":
                        type = "Solute";
                        break;
                    case "sediment":
                        type = "Sediment";
                        break;
                    case "element":
                        type = "Element";
                    default:
                        break;
                }

                var wasAddedRootLevel = false;
                $scope.ensembleVariablesTreeData.forEach(function (rootNode, idx) {
                    if(rootNode.title == type) {
                        wasAddedRootLevel = true;
                        var wasAddedVarLevel = false;
                        rootNode.children.forEach(function (varNode, idx) {
                            if(varNode.title == name) {
                                if(type != "Sediment") {
                                    wasAddedVarLevel = true;
                                    varNode.children.push({title: specie});
                                }
                            }
                        });
                        if(!wasAddedVarLevel){
                            if(type != "Sediment") {
                                rootNode.children.push({
                                    title: name,
                                    children: [{title: specie}]
                                });
                            }
                            else {
                                rootNode.children.push({ title: name });
                            }
                        }
                    }
                });
                if(!wasAddedRootLevel) {
                    if(type != "Sediment") {
                        $scope.ensembleVariablesTreeData.push({
                            title: type,
                            children: [
                                {
                                    title: name,
                                    children: [{title: specie}]
                                }
                            ]
                        });
                    } else {
                        $scope.ensembleVariablesTreeData.push({
                            title: type,
                            children: [
                                {
                                    title: name
                                }
                            ]
                        });
                    }
                }
            });
        };

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
    $scope.multivariatecheckboxes = [];
    $scope.spatialcheckboxes = [];
    $scope.temporalcheckboxes = [];

    $scope.multivariateVariables = [];
    $scope.spatialVariables = [];
    $scope.temporalVariables = [];

}]);
    /*.component('iris', {
        templateUrl: 'iris-list/iris-list.template.html',
        controller: ['Iris', 'd3',
            function IrisController(Iris) {

                this.irisList = Iris.query();

            }
        ]
})*/