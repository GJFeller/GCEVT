/**
 * Created by gustavo on 05/04/2017.
 */
angular.module('iris')
    .directive('linechart', ['d3Service', function (d3Service) {
        return {
            restrict: 'E',
            scope: {
                data: '=', // bi-directional data-binding
                variables: '='
            },
            link: function(scope, element, attrs){

                d3Service.d3().then(function (d3) {

                    var margin = {top: 30, right: 80, bottom: 30, left: 80};

                    var width = $("#lineChart").width() - margin.left - margin.right,
                        // calculate the height
                        height = $("#lineChart").width() - margin.top - margin.bottom,
                        // Use the category20() scale function for multicolor support
                        color = d3.scale.category10(),
                        //xScale for parallel coord
                        xScale = d3.scale.linear().range([0, width]),
                        yScale = d3.scale.linear().range([height, 0]),
                        zScale = d3.scale.category20();



                    console.log(element[0]);
                    var svg = d3.select(element[0])
                        .append("svg");
                    /*.style('width', '100%');*/

                    // resize event
                    window.onresize = function() {
                        scope.$apply();
                    };

                    // hard-code data for test
                    var fakeData = [
                        {
                            name: "test1",
                            x: [0,  10, 20, 30, 40, 50],
                            y: [10, 30, 70, 70, 70, 70]
                        },
                        {
                            name: "test2",
                            x: [0,  10, 20, 30, 40, 50],
                            y: [70, 50, 30, 10, 10, 10]
                        }
                     ];

                    //Watch for resize function
                    scope.$watch(function() {
                        return angular.element(window)[0].innerWidth;
                    }, function() {
                        scope.render(scope.data);
                    });

                    // watch for data changes and re-render
                    scope.$watch('data', function(newVals, oldVals) {
                        console.log(newVals);
                        return scope.render(newVals);
                    }, true);



                    scope.render = function (data) {


                        //console.log(color);
                        //console.log(color("setosa"));
                        //console.log(scope.variables);
                        //console.log(data);
                        // remove all previous items before render
                        svg.selectAll('*').remove();

                        // If we don't pass any data, return out of the element
                        if (!data) return;

                        /*xScale.domain([ d3.min(fakeData, function (d) { return d3.min(d.x); }),
                                        d3.max(fakeData, function (d) { return d3.max(d.x); })]);
                        yScale.domain([ d3.min(fakeData, function (d) { return d3.min(d.y); }),
                                        d3.max(fakeData, function (d) { return d3.max(d.y); })]);
                        zScale.domain(d3.range(fakeData.length));*/

                        xScale.domain([ d3.min(data, function (d) { return d3.min(d.x); }),
                            d3.max(data, function (d) { return d3.max(d.x); })]);
                        yScale.domain([ d3.min(data, function (d) { return d3.min(d.y); }),
                            d3.max(data, function (d) { return d3.max(d.y); })]);
                        zScale.domain(d3.range(data.length));

                        var x_axis = d3.svg.axis().scale(xScale).orient("bottom"),
                            y_axis = d3.svg.axis().scale(yScale).orient("left"),
                            x_grid = d3.svg.axis().orient("bottom").tickSize(-height).tickFormat(""),
                            y_grid = d3.svg.axis().orient("left").tickSize(-width).tickFormat("")

                        x_grid.scale(xScale);
                        y_grid.scale(yScale);

                        var line = d3.svg.line()
                            .interpolate("basis")
                            .x(function (d, i) {
                                return xScale(d[0]);
                            })
                            .y(function (d, i) {
                                return yScale(d[1]);
                            });

                        svg.attr("width", width + margin.left + margin.right)
                           .attr("height", height + margin.top + margin.bottom);
                        var g = svg.append("g")
                                   .attr("transform", "translate(" + margin.left + ", " + 0 + ")");

                        /*svg.append("g")
                            .attr("class", "x grid")
                            .attr("transform", "translate(0," + height + ")")
                            .call(x_grid);

                        svg.append("g")
                            .attr("class", "y grid")
                            .call(y_grid);*/

                        g.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(" + 0 + "," + height + ")")
                            .call(x_axis)
                        .append("text")
                            .attr("dy", "-.71em")
                            .attr("x", width)
                            .style("text-anchor", "end")
                            .text("x");

                        g.append("g")
                            .attr("class", "y axis")
                            .call(y_axis)
                        .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 6)
                            .attr("dy", "0.71em")
                            .style("text-anchor", "end")
                            .text("y");

                        var data_lines = g.selectAll(".dataLine")
                            .data(data.map(function(d) {return d3.zip(d.x, d.y);}))
                            .enter().append("g")
                            .attr("class", "dataLine");

                        data_lines.append("path")
                            .attr("class", "line")
                            .attr("d", function(d) { /*console.log(d);*/ return line(d); })
                            .attr("stroke", function(_, i) { return zScale(i);});

                        data_lines.append("text")
                            .datum(function(d, i) { return {name: data[i].name, final: d[d.length-1]}; })
                            .attr("transform", function(d) {
                                //console.log(d.final[1]);
                                return ( "translate(" + xScale(d.final[0]) + "," +
                                yScale(d.final[1]) + ")" ) ; })
                            .attr("x", 3)
                            .attr("dy", ".35em")
                            .attr("fill", function(_, i) { return zScale(i); })
                            .text(function(d) { return d.name; });

                    };
                });
            }
        }
    }]);