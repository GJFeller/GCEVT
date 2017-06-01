/**
 * Created by gustavo on 04/05/2017.
 */


angular.
module('core.ensemble').
factory('Ensemble', ['$resource',
    function($resource) {

        return {
            listEnsembles: $resource('http://localhost:8008/getAllEnsembles', {}, {
                query: {method: 'GET', params: {}, isArray: true}
            }),
             ensembleVariables: $resource('http://localhost:8008/getVariablesEnsemble/:ensembleId', {}, {
                query: {method: 'GET', params: {ensembleId: '@ensembleId'}, isArray: true}
             }),
            variables: $resource('http://localhost:8008/getAllVariables', {}, {
                query: {method: 'GET', params: {ensembleId: '@ensembleId'}, isArray: true}
            }),
            temporalData: $resource('http://localhost:8008/getTemporalVarData/:xIdx/:yIdx/:zIdx/:simulationId/:varId/:ensembleId', {}, {
                query: {method: 'GET', params: {xIdx: '@xIdx', yIdx: '@yIdx', zIdx: '@zIdx', simulationId: '@simulationId', varId: '@varId', ensembleId: '@ensembleId'}, isArray: true}
            }),
            multivariateData: $resource('http://localhost:8008/getMultivariateData/:xIdx/:yIdx/:zIdx/:time/:simulationId/:varIdList', {}, {
                query: {method: 'GET', params: {xIdx: '@xIdx', yIdx: '@yIdx', zIdx: '@zIdx', time: '@time', simulationId: '@simulationId', varIdList: '@varIdList'}, isArray: true}
            })


        };
        /*var t0 = performance.now();
         var resource = $resource('http://localhost:8008/api', {}, {
         query: {
         method: 'GET',
         isArray: true,
         transformResponse: function(data, headers){
         var jsonData = angular.fromJson(data);
         var irisObj = [];

         angular.forEach(jsonData, function (item) {
         item.hidden = false;
         });

         return jsonData;
         }
         }
         });
         var t1 = performance.now();
         console.log("Time: " + (t1 - t0) + "ms");
         return resource;*/
    }
]);