/**
 * Created by gustavo on 01/02/2017.
 */
angular.module('iris')
    .directive('splotm', ['d3Service', function (d3Service) {
        return {
            restrict: 'EA',
            scope: {
                data: '=' // bi-directional data-binding
            },
            link: function(scope, element, attrs){

                d3Service.d3().then(function (d3) {

                    var margin = {top: 30, right: 30, bottom: 30, left: 30};

                    /*var width = 960,
                        size = 230,
                        padding = 20;*/

                    var width = $("#parCoord").width(),
                        size = width / 4,
                        padding = 20;

                    var x = d3.scale.linear()
                        .range([padding / 2, size - padding / 2]);

                    var y = d3.scale.linear()
                        .range([size - padding / 2, padding / 2]);

                    var xAxis = d3.svg.axis()
                        .scale(x)
                        .orient("bottom")
                        .ticks(6);

                    var yAxis = d3.svg.axis()
                        .scale(y)
                        .orient("left")
                        .ticks(6);

                    var svg = d3.select(element[0])
                        .append("svg");

                    console.log(element[0]);
                    var color = d3.scale.category10();

                    // resize event
                    window.onresize = function() {
                        scope.$apply();
                    };

                    //Watch for resize function
                    scope.$watch(function() {
                        return angular.element(window)[0].innerWidth;
                    }, function() {
                        scope.render(scope.data);
                    });

                    // watch for data changes and re-render
                    scope.$watch('data', function(newVals, oldVals) {
                        return scope.render(newVals);
                    }, true);

                    scope.render = function (data) {

                        var categories = [];

                        data.forEach(function(d) {
                            // console.log(d.species);
                            if(categories.indexOf(d["species"]) == -1) {
                                categories.push(d["species"]);
                            }
                        });

                        var domainByTrait = {},
                            traits = d3.keys(data[0]).filter(function(d) { return d !== "species" && d !== "hidden"; }),
                            n = traits.length;

                        traits.forEach(function(trait) {
                            domainByTrait[trait] = d3.extent(data, function(d) { return d[trait]; });
                        });

                        xAxis.tickSize(size * n);
                        yAxis.tickSize(-size * n);

                        var brush = d3.svg.brush()
                            .x(x)
                            .y(y)
                            .on("brushstart", brushstart)
                            .on("brush", brushmove)
                            .on("brushend", brushend);

                        //console.log(data);

                        svg.selectAll('*').remove();

                        // If we don't pass any data, return out of the element
                        if (!data) return;

                        svg.attr("width", size * n + padding + margin.left + margin.right)
                           .attr("height", size * n + padding + margin.top + margin.bottom)
                        .append("g")
                           .attr("transform", "translate(" + padding + margin.left + "," + padding / 2 + ")");

                        svg.selectAll(".x.axisSPLOTM")
                            .data(traits)
                        .enter().append("g")
                            .attr("class", "x axisSPLOTM")
                            .attr("transform", function(d, i) { return "translate(" + ((n - i - 1) * size + margin.left) + ",0)";})
                            .each(function(d) { x.domain(domainByTrait[d]); d3.select(this).call(xAxis); });

                        svg.selectAll(".y.axisSPLOTM")
                            .data(traits)
                        .enter().append("g")
                            .attr("class", "y axisSPLOTM")
                            .attr("transform", function(d, i) { return "translate(" + margin.left + "," + i * size + ")";})
                            .each(function(d) { y.domain(domainByTrait[d]); d3.select(this).call(yAxis); });

                        var cell = svg.selectAll(".cellSPLOTM")
                            .data(cross(traits, traits))
                        .enter().append("g")
                            .attr("class", "cellSPLOTM")
                            .attr("transform", function(d) { return "translate(" + ((n - d.i - 1) * size + margin.left) + "," + d.j * size + ")"; })
                            .each(plot);

                        // Titles for the diagonal.
                        cell.filter(function(d) { return d.i === d.j; }).append("text")
                            .attr("x", padding)
                            .attr("y", padding)
                            .attr("dy", ".71em")
                            .text(function(d) { return d.x; });

                        cell.call(brush);

                        function plot(p) {
                            var cell = d3.select(this);

                            x.domain(domainByTrait[p.x]);
                            y.domain(domainByTrait[p.y]);

                            cell.append("rect")
                                .attr("class", "frameSPLOTM")
                                .attr("x", padding / 2)
                                .attr("y", padding / 2)
                                .attr("width", size - padding)
                                .attr("height", size - padding);

                            cell.selectAll("circle")
                                .data(data)
                            .enter().append("circle")
                                .attr("cx", function(d) { return x(d[p.x]); })
                                .attr("cy", function(d) { return y(d[p.y]); })
                                .attr("r", 4)
                                .style("fill", function(d) { return color(d.species); })
                                .classed("hiddenSPLOTM", function(d) {
                                    return d.hidden;
                                });
                        }

                        var brushCell;

                        // Clear the previously-active brush, if any.
                        function brushstart(p) {
                            if (brushCell !== this) {
                                d3.select(brushCell).call(brush.clear());
                                x.domain(domainByTrait[p.x]);
                                y.domain(domainByTrait[p.y]);
                                brushCell = this;
                            }
                        }

                        // Highlight the selected circles.
                        function brushmove(p) {
                            var e = brush.extent();
                            svg.selectAll("circle").classed("hiddenSPLOTM", function(d) {
                                d.hidden = e[0][0] > d[p.x] || d[p.x] > e[1][0]
                                    || e[0][1] > d[p.y] || d[p.y] > e[1][1];
                                return d.hidden;
                            });
                        }

                        // If the brush is empty, select all circles.
                        function brushend() {
                            if (brush.empty()) svg.selectAll(".hiddenSPLOTM").classed("hiddenSPLOTM", false);
                            console.log("Apply change from splotMatrix");
                            scope.$apply();
                        }

                        function cross(a, b) {
                            var c = [], n = a.length, m = b.length, i, j;
                            for (i = -1; ++i < n;) for (j = -1; ++j < m;) c.push({x: a[i], i: i, y: b[j], j: j});
                            return c;
                        }

                    }

                });
            }
        }
    }]);