(function() {
    'use strict';

    angular
        .module('app.orderservice')
        .controller('OrderPaymentReceiptController', OrderPaymentReceiptController);

    /** @ngInject */
    function OrderPaymentReceiptController($rootScope, $http, $mdDialog, $scope, image, event, OrderVM, $mdToast, objOrder) {
        var vm = this;
        console.log(objOrder)
        $scope.init = function() {
            $scope.ImageUrl = $rootScope.RoutePath + 'MediaUploads/PaymentReceipt/' + image;

        }

        $scope.CallImageload = function() {
            ImageZoom($scope.ImageUrl);
        }

        function ImageZoom(url) {
            //setTimeout(function() {
            var canvas1 = document.getElementById("myCanvas");

            var canvas = document.getElementsByTagName('canvas')[0];
            var img = document.getElementById('PaymentRecipt');
            //or however you get a handle to the IMG
            var width = img.clientWidth;
            var height = img.clientHeight;
            canvas.width = width;
            canvas.height = height;
            var gkhead = new Image;

            // var ball = new Image;
            gkhead.src = url;

            var ctx = canvas.getContext('2d');
            trackTransforms(ctx);

            function redraw() {
                // Clear the entire canvas
                var p1 = ctx.transformedPoint(0, 0);
                var p2 = ctx.transformedPoint(canvas.width, canvas.height);

                ctx.clearRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);

                // Alternatively:
                ctx.save();
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.restore();

                ctx.drawImage(gkhead, 0, 0, width, height);

            }
            redraw();

            canvas.addEventListener("click", function(e) {
                var pt = ctx.transformedPoint(lastX, lastY);
                ctx.translate(pt.x, pt.y);
                ctx.translate(-pt.x, -pt.y);
                redraw();
            }, true);
            canvas.addEventListener('focus', function(e) {}, true);

            var lastX = canvas.width / 2,
                lastY = canvas.height / 2;
            var dragStart, dragged;

            canvas.addEventListener('mousedown', function(evt) {
                document.body.style.mozUserSelect = document.body.style.webkitUserSelect = document.body.style.userSelect = 'none';
                lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
                dragStart = ctx.transformedPoint(lastX, lastY);
                dragged = false;
            }, false);
            canvas.addEventListener('mousemove', function(evt) {
                lastX = evt.offsetX || (evt.pageX - canvas.offsetLeft);
                lastY = evt.offsetY || (evt.pageY - canvas.offsetTop);
                dragged = true;
                if (dragStart) {
                    var pt = ctx.transformedPoint(lastX, lastY);
                    ctx.translate(pt.x - dragStart.x, pt.y - dragStart.y);
                    redraw();
                }
            }, false);
            canvas.addEventListener('mouseup', function(evt) {
                dragStart = null;
                if (!dragged) zoom(evt.shiftKey ? -1 : 1);
            }, false);

            var scaleFactor = 1.1;
            var zoom = function(clicks) {
                var pt = ctx.transformedPoint(lastX, lastY);
                ctx.translate(pt.x, pt.y);
                var factor = Math.pow(scaleFactor, clicks);
                ctx.scale(factor, factor);
                ctx.translate(-pt.x, -pt.y);
                redraw();
            }

            var handleScroll = function(evt) {
                var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
                if (delta) zoom(delta);
                return evt.preventDefault() && false;
            };
            canvas.addEventListener('DOMMouseScroll', handleScroll, false);
            canvas.addEventListener('mousewheel', handleScroll, false);
            // };
            //}, 500);

            // Adds ctx.getTransform() - returns an SVGMatrix
            // Adds ctx.transformedPoint(x,y) - returns an SVGPoint
            function trackTransforms(ctx) {
                var svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
                var xform = svg.createSVGMatrix();
                ctx.getTransform = function() {
                    return xform;
                };

                var savedTransforms = [];
                var save = ctx.save;
                ctx.save = function() {
                    savedTransforms.push(xform.translate(0, 0));
                    return save.call(ctx);
                };
                var restore = ctx.restore;
                ctx.restore = function() {
                    xform = savedTransforms.pop();
                    return restore.call(ctx);
                };

                var scale = ctx.scale;
                ctx.scale = function(sx, sy) {
                    xform = xform.scaleNonUniform(sx, sy);
                    return scale.call(ctx, sx, sy);
                };
                var rotate = ctx.rotate;
                ctx.rotate = function(radians) {
                    xform = xform.rotate(radians * 180 / Math.PI);
                    return rotate.call(ctx, radians);
                };
                var translate = ctx.translate;
                ctx.translate = function(dx, dy) {
                    xform = xform.translate(dx, dy);
                    return translate.call(ctx, dx, dy);
                };
                var transform = ctx.transform;
                ctx.transform = function(a, b, c, d, e, f) {
                    var m2 = svg.createSVGMatrix();
                    m2.a = a;
                    m2.b = b;
                    m2.c = c;
                    m2.d = d;
                    m2.e = e;
                    m2.f = f;
                    xform = xform.multiply(m2);
                    return transform.call(ctx, a, b, c, d, e, f);
                };
                var setTransform = ctx.setTransform;
                ctx.setTransform = function(a, b, c, d, e, f) {
                    xform.a = a;
                    xform.b = b;
                    xform.c = c;
                    xform.d = d;
                    xform.e = e;
                    xform.f = f;
                    return setTransform.call(ctx, a, b, c, d, e, f);
                };
                var pt = svg.createSVGPoint();
                ctx.transformedPoint = function(x, y) {
                    pt.x = x;
                    pt.y = y;
                    return pt.matrixTransform(xform.inverse());
                }
            }
            setTimeout(function() {
                document.querySelector("#myCanvas").click();
            }, 200);

        }

        $scope.DeleteOrderReceipt = function() {
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to Delete Receipt?')
                .ok('Ok')
                .cancel('Cancel')
            $mdDialog.show(confirm).then(function(ISConfirm) {
                var params = {
                    id: objOrder[0].id,
                }
                $http.get($rootScope.RoutePath + "billing/DeleteOrderReceipt", {
                    params: params
                }).then(function(resRenew) {
                    if (resRenew.data.success == true) {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(resRenew.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        OrderVM.GetAllOrderServiceFromModal()
                        $mdDialog.hide();
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                            .textContent(resRenew.data.message)
                            .position('top right')
                            .hideDelay(3000)
                        );
                        OrderVM.GetAllOrderServiceFromModal()
                        $mdDialog.hide();
                    }
                });
            });

        }
        $scope.closeModel = function() {
            $mdDialog.hide();
        }
        $scope.init();
    }
})();