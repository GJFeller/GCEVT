/**
 * Created by gustavo on 26/01/2017.
 */
angular.module('iris')
    .directive('parcoord', ['d3Service', function (d3Service) {
        return {
            restrict: 'EA',
            scope: {
                data: '=' // bi-directional data-binding
            },
            link: function(scope, element, attrs){

                d3Service.d3().then(function (d3) {

                    var margin = {top: 30, right: 50, bottom: 30, left: 10};

                    var width = $("#parCoord").width() - margin.left - margin.right,
                        // calculate the height
                        height = $("#first").height() - margin.top - margin.bottom,
                        // Use the category20() scale function for multicolor support
                        color = d3.scale.category10(),
                        //xScale for parallel coord
                        xScale = d3.scale.ordinal().rangePoints([0, width], 1),
                        yScale = {};

                    var line = d3.svg.line(),
                        axis = d3.svg.axis().orient("left"),
                        dragging = {},
                        background,
                        foreground;

                    console.log(element[0]);
                    var svg = d3.select(element[0])
                        .append("svg");
                        /*.style('width', '100%');*/

                    // resize event
                    window.onresize = function() {
                        scope.$apply();
                    };

                    // hard-code data for test
                    /*scope.data = [
                     {name: "Greg", score: 98},
                     {name: "Ari", score: 96},
                     {name: "Q", score: 75},
                     {name: "Loser", score: 48}
                     ];*/

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


                        var categories = [];

                        data.forEach(function(d) {
                           // console.log(d.species);
                           if(categories.indexOf(d["species"]) == -1) {
                               categories.push(d["species"]);
                           }
                        });

                        categories.forEach(function(d) {
                           color(d);
                        });

                        //console.log(color);
                        //console.log(color("setosa"));
                        console.log(data);
                        // remove all previous items before render
                        svg.selectAll('*').remove();

                        // If we don't pass any data, return out of the element
                        if (!data) return;



                        /*var svg = d3.select("body").append("svg").data(data)
                            .attr("width", width + margin.left + margin.right)
                            .attr("height", height + margin.top + margin.bottom)
                            .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");*/

                        svg.data(data)
                            .attr('height', height + margin.top + margin.bottom)
                            .attr('width', width + margin.left + margin.right)
                        .append("g")
                            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

                        xScale.domain(dimensions = d3.keys(data[0]).filter(function (d) {
                            return d != "species" && d != "hidden" && (yScale[d] = d3.scale.linear()
                                    .domain(d3.extent(data, function(p) {return +p[d]; }))
                                    .range([height, 0]));
                        }));
                        //console.log(yScale);
                        // Add grey background lines for context.
                        background = svg.append("g")
                            .attr("class", "backgroundPCP")
                            .selectAll("path")
                            .data(data)
                            .enter().append("path")
                            .attr("transform", function(d) { return "translate(0, "+ margin.top + ")";})
                            .attr("d", path);

                        // Add blue foreground lines for focus.
                        foreground = svg.append("g")
                            .attr("class", "foregroundPCP")
                            .selectAll("path")
                            .data(data)
                            .enter().append("path")
                            .attr("transform", function(d) { return "translate(0, "+ margin.top + ")";})
                            .attr("stroke", function (d) {return color(d.species); })
                            .attr("d", path)
                            .attr("display", function(d) {
                                if(d.hidden) {
                                    return "none";
                                } else {
                                    return null;
                                }
                            });

                        // Add a group element for each dimension.
                        var g = svg.selectAll(".dimensionPCP")
                            .data(dimensions)
                            .enter().append("g")
                            .attr("class", "dimensionPCP")
                            .attr("transform", function(d) { return "translate(" + xScale(d) + ", "+ margin.top + ")"; })
                            .call(d3.behavior.drag()
                                .origin(function(d) { return {x: xScale(d)}; })
                                .on("dragstart", function(d) {
                                    dragging[d] = xScale(d);
                                    background.attr("visibility", "hidden");
                                })
                                .on("drag", function(d) {
                                    dragging[d] = Math.min(width, Math.max(0, d3.event.x));
                                    foreground.attr("d", path);
                                    dimensions.sort(function(a, b) { return position(a) - position(b); });
                                    xScale.domain(dimensions);
                                    g.attr("transform", function(d) { return "translate(" + position(d) + ", " + margin.top + ")"; })
                                })
                                .on("dragend", function(d) {
                                    delete dragging[d];
                                    transition(d3.select(this)).attr("transform", "translate(" + xScale(d) + ", "+ margin.top + ")");
                                    transition(foreground).attr("d", path);
                                    background
                                        .attr("d", path)
                                        .transition()
                                        .delay(500)
                                        .duration(0)
                                        .attr("visibility", null);
                                }));

                        // Add an axis and title.
                        g.append("g")
                            .attr("class", "axisPCP")
                            .each(function(d) { d3.select(this).call(axis.scale(yScale[d])); })
                            .append("text")
                            .style("text-anchor", "middle")
                            .attr("y", -9)
                            .text(function(d) {
                                return d;
                            });

                        // Add and store a brush for each axis.
                        g.append("g")
                            .attr("class", "brushPCP")
                            .each(function(d) {
                                d3.select(this).call(yScale[d].brush = d3.svg.brush().y(yScale[d]).on("brushstart", brushstart).on("brush", brush).on("brushend", brushend));
                            })
                            .selectAll("rect")
                            .attr("x", -8)
                            .attr("width", 16);

                        // Adding legend

                        var legendRectSize = 18;
                        var legendSpacing = 4;

                        var legend = svg.selectAll('.legendPCP')
                            .data(color.domain())
                            .enter()
                            .append('g')
                            .attr('class', 'legendPCP')
                            .attr('transform', function(d, i) {
                               var legendHeight = legendRectSize + legendSpacing;
                               var offset = legendHeight * color.domain().length / 2;
                               var horz = width + margin.left - 2 * legendRectSize;
                               var vert = margin.top + i * offset;
                               return 'translate(' + horz + ',' + vert + ')';
                            });

                        legend.append('rect')
                            .attr('width', legendRectSize)
                            .attr('height', legendRectSize)
                            .style('fill', color)
                            .style('stroke', color);

                        legend.append('text')
                            .attr('x', legendRectSize + legendSpacing)
                            .attr('y', legendRectSize - legendSpacing)
                            .text(function(d) { return d; });

                        function position(d) {
                            var v = dragging[d];
                            return v == null ? xScale(d) : v;
                        }

                        function transition(g) {
                            return g.transition().duration(500);
                        }

                        // Returns the path for a given data point.
                        function path(d) {
                            return line(dimensions.map(function(p) { return [position(p), yScale[p](d[p])]; }));
                        }

                        function brushstart() {
                            d3.event.sourceEvent.stopPropagation();
                        }

                        // Handles a brush event, toggling the display of foreground lines.
                        function brush() {
                            var actives = dimensions.filter(function(p) { return !yScale[p].brush.empty(); }),
                                extents = actives.map(function(p) { return yScale[p].brush.extent(); });

                            foreground.style("display", function(d, i) {
                                var isDisplay = actives.every(function(p, i) {
                                    return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                                });
                                var domText = null;
                                //console.log(i);
                                if(isDisplay) {
                                    domText = null;
                                    scope.data[i].hidden = false;
                                }
                                else {
                                    domText = "none";
                                    scope.data[i].hidden = true;
                                }
                                //console.log(scope.data[i]);
                                return domText;
                                /*return actives.every(function(p, i) {
                                    return extents[i][0] <= d[p] && d[p] <= extents[i][1];
                                }) ? null : "none";*/
                            });

                        }

                        function brushend() {
                             console.log("Apply change from parcoord");
                             scope.$apply();
                        }

                        /* UNCOMMENT TO WORK THE BAR CHART EXAMPLE
                        // setup variables
                        var width = d3.select(element[0]).node().offsetWidth - margin,
                            // calculate the height
                            height = scope.data.length * (barHeight + barPadding),
                            // Use the category20() scale function for multicolor support
                            color = d3.scale.category20(),
                            // our xScale
                            xScale = d3.scale.linear()
                                .domain([0, d3.max(data, function(d) {
                                    return d.score;
                                })])
                                .range([0, width]);


                        // set the height based on the calculations above
                        svg.attr('height', height);

                        //create the rectangles for the bar chart
                        svg.selectAll('rect')
                            .data(data).enter()
                            .append('rect')
                            .attr('height', barHeight)
                            .attr('width', 140)
                            .attr('x', Math.round(margin/2))
                            .attr('y', function(d,i) {
                                return i * (barHeight + barPadding);
                            })
                            .attr('fill', function(d) { return color(d.score); })
                            .transition()
                            .duration(1000)
                            .attr('width', function(d) {
                                return xScale(d.score);
                            });

                        svg.selectAll('text')
                            .data(data)
                            .enter()
                            .append('text')
                            .attr('fill', '#fff')
                            .attr('y', function(d,i) {
                                return i * (barHeight + barPadding) + 15;
                            })
                            .attr('x', 15)
                            .text(function(d) {
                                return d.name + " (scored: " + d.score + ")";
                            });*/
                    };
                });
            }
        }
    }]);