/**
 * Created by gustavo on 16/02/2017.
 */
angular.module('iris')
    .directive('ngWebgl', [ 'd3Service', function(d3Service) {
        return {
            restrict: 'A',
            scope: {
                'fillcontainer': '=',
                'scale': '=',
                'materialType': '=',
                'data': '='
            },
            link: function postLink(scope, element, attrs) {


                d3Service.d3().then(function (d3) {

                    var camera, scene, renderer,
                        shadowMesh, icosahedron, light, cube = [],
                        mouseX = 0, mouseY = 0,
                        width = $("#webgl").width(), height = $("#webgl").height(),
                        contW = (scope.fillcontainer) ?
                            element[0].clientWidth : width,
                        contH = height,
                        windowHalfX = contW / 2,
                        windowHalfY = contH / 2,
                        materials = {},
                        color = d3.scale.category10(),
                        firstTime = true;

                    var isHidden = [];

                    // resize event
                    /*window.onresize = function() {
                        scope.$apply();
                    };*/

                    //Watch for resize function
                    /*scope.$watch(function() {
                        return angular.element(window)[0].innerWidth;
                    }, function() {
                        scope.init(scope.data);
                    });*/

                    // watch for data changes and re-render
                    scope.$watch('data', function(newVals, oldVals) {
                        console.log(newVals);
                        return scope.init(newVals);
                    }, true);



                    scope.init = function (data) {

                        if(!data) return;

                        if(scene) {
                            for( var i = scene.children.length - 1; i >= 0; i--) {
                                var object = scene.children[0];
                                scene.remove(object);
                            }
                        } else {
                            // Scene
                            scene = new THREE.Scene();
                        }

                        if(cube) {
                            while(cube.length != 0){
                                cube.pop();
                            }
                        }

                        if(element[0].childNodes.length > 0) {
                            while(element[0].childNodes.length > 0) {
                                element[0].removeChild(element[0].childNodes[0]);
                            }
                        }

                        var categories = [];


                        data.forEach(function(d) {
                            // console.log(d.species);
                            if(categories.indexOf(d["species"]) == -1) {
                                categories.push(d["species"]);
                                if(typeof isHidden[categories.indexOf(d["species"])] === 'undefined') {
                                    isHidden.push(false);
                                }
                            }
                        });

                        categories.forEach(function(d) {
                            color(d);
                        });

                        scope.initRender = function () {

                            // Camera
                            camera = new THREE.PerspectiveCamera(20, contW / contH, 1, 10000);
                            camera.position.z = 1800;


                            // Ligthing
                            scene.add(new THREE.AmbientLight(0xcccccc));
                            light = new THREE.DirectionalLight(0xeeeeee);
                            light.position.x = Math.random() - 0.5;
                            light.position.y = Math.random() - 0.5;
                            light.position.z = Math.random() - 0.5;
                            light.position.normalize();
                            //light.position.set( 0, 0, 1 );
                            scene.add(light);

                            // Shadow
                            /*var canvas = document.createElement( 'canvas' );
                             canvas.width = 128;
                             canvas.height = 128;*/



                            materials.lambert = new THREE.MeshLambertMaterial({
                                color: 0xffffff,
                                shading: THREE.FlatShading,
                                vertexColors: THREE.VertexColors
                            });

                            materials.phong = new THREE.MeshPhongMaterial({
                                ambient: 0x030303,
                                color: 0x0000dd,
                                specular: 0x009900,
                                shininess: 30,
                                shading: THREE.FlatShading,
                                vertexColors: THREE.VertexColors
                            });

                            materials.wireframe = new THREE.MeshBasicMaterial({
                                color: 0x000000,
                                shading: THREE.FlatShading,
                                wireframe: true,
                                transparent: true
                            });


                            categories.forEach(function (d, i) {
                                var newCube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), new THREE.MeshBasicMaterial({color: color(d)}))
                                if(isHidden[i]) {
                                    console.log("setting gray");
                                    newCube.material.color.setHex(0xcccccc);
                                }
                                newCube.position.x = -300 + i*300;
                                scene.add(newCube);
                                cube.push(newCube);

                            });
                            //cube = new THREE.Mesh(new THREE.CubeGeometry(200, 200, 200), materials.phong/*new THREE.MeshBasicMaterial({color: 0xfffff})*/);
                            //cube.position.x = -500;
                            //cube.rotation.x = 0;
                            //scene.add(cube);

                            // Build and add the icosahedron to the scene
                            /*icosahedron = new THREE.Mesh( geometry, materials.lambert );
                             icosahedron.position.x = 0;
                             icosahedron.rotation.x = 0;
                             scene.add( icosahedron );*/

                            renderer = new THREE.WebGLRenderer();
                            renderer.setClearColor(0xffffff);
                            renderer.setSize(contW, contH);
                            element[0].appendChild(renderer.domElement);

                            if(firstTime) {
                                window.addEventListener('resize', scope.onWindowResize, false);

                                document.addEventListener('mousedown', scope.onMouseDown);

                                firstTime = false;
                            }




                        }

                        // -----------------------------------
                        // Event listeners
                        // -----------------------------------
                        scope.onWindowResize = function () {

                            scope.resizeCanvas();

                        };

                        scope.onMouseDown = function (event) {
                            event.preventDefault();
                            /*var mouse3D = new THREE.Vector3( ( event.clientX / window.innerWidth ) * 2 - 1,
                                -( event.clientY / window.innerHeight ) * 2 + 1,
                                0.5 );

                            var raycaster =  new THREE.Raycaster();
                            raycaster.setFromCamera( mouse3D, camera );
                            var intersects = raycaster.intersectObjects( cube );
                            //console.log(intersects);
                            if ( intersects.length > 0 ) {
                                var idx = cube.indexOf(intersects[0].object);
                                console.log(idx);
                                if(idx != -1) {
                                    if (intersects[0].object.material.color.getHex() == 0xcccccc) {
                                        //console.log("entrou no if");
                                        intersects[0].object.material.color = new THREE.Color(color(categories[idx]).toString());
                                    } else {
                                        intersects[0].object.material.color.setHex(0xcccccc);
                                    }
                                    isHidden[idx] = !isHidden[idx];
                                    console.log(isHidden);
                                    scope.toggleSelectedCategory(categories[idx]);

                                }


                            }*/
                        }


                        // -----------------------------------
                        // toggle selected data
                        // -----------------------------------

                        scope.toggleSelectedCategory = function (category) {

                            data.forEach(function (d) {
                                if(d.species == category) {
                                    d.hidden = !d.hidden;

                                }
                            });

                            scope.$apply();


                        }

                        // -----------------------------------
                        // Updates
                        // -----------------------------------
                        scope.resizeCanvas = function () {

                            contW = (scope.fillcontainer) ?
                                element[0].clientWidth : width;
                            contH = height;

                            windowHalfX = contW / 2;
                            windowHalfY = contH / 2;

                            camera.aspect = contW / contH;
                            camera.updateProjectionMatrix();

                            renderer.setSize(contW, contH);

                        };

                        // -----------------------------------
                        // Draw and Animate
                        // -----------------------------------
                        scope.animate = function () {

                            requestAnimationFrame(scope.animate);

                            scope.render();

                        };

                        scope.render = function () {

                            //camera.position.x += ( mouseX - camera.position.x ) * 0.05;
                            // camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

                            //camera.lookAt( scene.position );

                            /*cube.forEach(function (obj) {
                                obj.rotation.x += 0.02;
                                obj.rotation.y += 0.0225;
                                obj.rotation.z += 0.0175;
                            });*/


                            renderer.render(scene, camera);

                        };

                        // Begin
                        scope.initRender();
                        scope.animate();
                    }
                });

            }
        };
    }]);