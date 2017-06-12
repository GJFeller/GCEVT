/**
 * Created by gustavo on 04/05/2017.
 */


angular.
module('core.ensemble').
factory('Ensemble', ['$resource',
    function($resource) {

        //var url = 'http://localhost:8008';
        var url = 'http://ensemblemongobackend.azurewebsites.net';
        return {
            listEnsembles: $resource(url + '/getAllEnsembles', {}, {
                query: {method: 'GET', params: {}, isArray: true}
            }),
             ensembleVariables: $resource(url + '/getVariablesEnsemble/:ensembleId', {}, {
                query: {method: 'GET', params: {ensembleId: '@ensembleId'}, isArray: true}
             }),
            variables: $resource(url + '/getAllVariables', {}, {
                query: {method: 'GET', params: {ensembleId: '@ensembleId'}, isArray: true}
            }),
            temporalData: $resource(url + '/getTemporalVarData/:xIdx/:yIdx/:zIdx/:simulationId/:varId/:ensembleId', {}, {
                query: {method: 'GET', params: {xIdx: '@xIdx', yIdx: '@yIdx', zIdx: '@zIdx', simulationId: '@simulationId', varId: '@varId', ensembleId: '@ensembleId'}, isArray: true}
            }),
            multivariateData: $resource(url +'/getMultivariateData/:xIdx/:yIdx/:zIdx/:time/:simulationId/:varIdList', {}, {
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