/**
 * Created by gustavo on 20/01/2017.
 */
angular.
    module('core.iris').
    factory('Iris', ['$resource',
        function($resource) {

            var t0 = performance.now();
            var resource = $resource('http://localhost:8080/api', {}, {
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
            return resource;
            /*return $resource('http://localhost:8080/api', {}, {
            //return $resource('database/iris.json', {}, {
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
            });*/
        }
    ]);