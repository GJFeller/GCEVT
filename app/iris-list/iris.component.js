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
        $scope.selectedEnsembleIdx = 0;


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

        $scope.currentEnsembleId;

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
                  childDict.checkbox = false;
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
                $scope.queryVariableList($scope.ensembleListJson[$scope.selectedEnsembleIdx]);

            }
        });

        $scope.queryVariableList = function (ensembleSelected) {
            while($scope.ensembleVariablesTreeData.length > 0){
                $scope.ensembleVariablesTreeData.pop();
            }
            while($scope.ensembleVariables.length > 0) {
                $scope.ensembleVariables.pop();
            }
            $scope.currentEnsembleId = ensembleSelected._id;
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
                var id = item._id;
                console.log(id);

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
                                    varNode.children.push({title: specie, key: id});
                                }
                            }
                        });
                        if(!wasAddedVarLevel){
                            if(type != "Sediment") {
                                rootNode.children.push({
                                    title: name,
                                    children: [{title: specie, key: id}]
                                });
                            }
                            else {
                                rootNode.children.push({ title: name, key: id });
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
                                    children: [{title: specie, key: id}]
                                }
                            ]
                        });
                    } else {
                        $scope.ensembleVariablesTreeData.push({
                            title: type,
                            children: [
                                {
                                    title: name,
                                    key: id
                                }
                            ]
                        });
                    }
                }
            });
        };

    $scope.queryTemporalData = function (varInfo, simulationList, xIdx, yIdx, zIdx) {
        simulationList.forEach(function (simulation, idx) {
            var simulationId = simulation;
            while($scope.temporalData.length != 0) {
                $scope.temporalData.pop();
            }
            Ensemble.temporalData.query({xIdx: xIdx, yIdx: yIdx, zIdx: zIdx, simulationId: simulationId, varId: varInfo.id, ensembleId: $scope.currentEnsembleId}).$promise.then(function (temporalData) {
                var data = {
                    name: simulationId,
                    x: [],
                    y: []
                };
                temporalData.forEach(function (item) {
                    data.x.push(item.time);
                    data.y.push(item.variables[0].value);
                });
                $scope.temporalData.push(data);
            });
        });


    };

    $scope.queryMultivariateData = function (varListInfo, simulationList, xIdx, yIdx, zIdx, time) {
        var dataList = [];
        simulationList.forEach(function (simulation, idx) {
            var simulationId = simulation;
            var varIdList = [];
            varListInfo.forEach(function (v) {
                varIdList.push(v.id);
            });

            Ensemble.multivariateData.query({xIdx: xIdx, yIdx: yIdx, zIdx: zIdx, time: time, simulationId: simulationId, varIdList: varIdList}).$promise.then(function (multivariateData) {


                var varNameList = [];
                varListInfo.forEach(function (variable, idx) {
                    varNameList[idx] = variable.variable + "-" + variable.specie;
                });


                multivariateData.forEach(function (aData) {
                    var data = {};
                    data.name = simulationId;
                    varListInfo.forEach(function (variable, idx) {
                        for(var i = 0; i < aData.variables.length; i++) {
                            if(variable.id == aData.variables[i].variableId) {
                                data[varNameList[idx]] = aData.variables[i].value;
                            }
                        }
                    });
                    dataList.push(data);

                });
                console.log(dataList);
                //$scope.multivariateData.concat(dataList);
                /*var data = {
                    name: simulationId,
                    xIdx: xIdx,
                    yIdx: yIdx,
                    zIdx: zIdx,
                    time: time,
                    variables: multivariateData[0].variables
                };*/
                /*data.variables.forEach(function (item) {
                   for(var i = 0; i < varListInfo.length; i++) {
                       if(varListInfo[i].id == item.variableId) {
                           item['specie'] = varListInfo[i].specie;
                           item['variable'] = varListInfo[i].variable;
                       }
                   }
                });*/
                //$scope.multivariateData.push(data);
            });
            $scope.multivariateData = dataList;
            //$scope.$apply();
        });
        $scope.multivariateData.concat(dataList);
        $scope.multivariateData.push(1);
        $scope.multivariateData.pop();
        $scope.$apply(function () {
            $scope.multivariateData.push(1);
            $scope.multivariateData.pop();
        });
    };

    $scope.selectedVariables = [];
    $scope.multivariatecheckboxes = [];
    $scope.spatialcheckboxes = [];
    $scope.temporalcheckboxes = [];

    $scope.multivariateVariables = [];
    $scope.spatialVariables = [];
    $scope.temporalVariables = [];
    $scope.temporalData = [];
    $scope.multivariateData = [];

}]);
    /*.component('iris', {
        templateUrl: 'iris-list/iris-list.template.html',
        controller: ['Iris', 'd3',
            function IrisController(Iris) {

                this.irisList = Iris.query();

            }
        ]
})*/