(function() {
    'use strict';

    angular
        .module('app.menu')
        .controller('MenuController', MenuController)
        .controller('DialogController', DialogController);

    function DialogController($http, $scope, $rootScope, $mdToast, $cookieStore, $document, $mdDialog, $stateParams) {}

    /** @ngInject */
    function MenuController($http, $scope, $rootScope, $mdToast, $cookieStore, $document, $mdDialog, $stateParams) {

        var vm = this;

        $scope.init = function() {
            $scope.model = {
                MenuId: ''
            }
            $scope.GetAllMenu();
            $scope.GetAllDynamicPages();
            $scope.GetAllCategory();
        }

        $scope.GetAllCategory = function() {
            $http.get($rootScope.RoutePath + "category/GetAllCategory").then(function(data) {
                for (var i = 0; i < data.data.length; i++) {

                    data.data[i].templates = [{
                        type: "item",
                        id: data.data[i].id,
                        Title: data.data[i].Title,
                        ContentType: "Category",
                        Slug: null,
                        Name: "Menu"
                    }, {
                        type: "SubMenu",
                        id: data.data[i].id,
                        Title: data.data[i].Title,
                        ContentType: "Category",
                        Slug: null,
                        Name: "Parent Menu",
                        columns: [
                            []
                        ]
                    }];
                };
                $scope.lstCategories = data.data;
            });
        }



        $scope.showDialog = function($event) {

            var parentEl = angular.element($document.body);
            alert = $mdDialog.alert({
                parent: parentEl,
                targetEvent: $event,
                template: '<md-dialog aria-label="Sample Dialog">' +
                    '<form name="formMenucreate" novalidate>' +
                    '  <md-content layout-padding>' +
                    '     <md-input-container class="md-block">' +
                    '       <label>Menu Name</label>' +
                    '       <input required name="MenuLabel" ng-model="project.MenuLabel">' +
                    '       <div ng-messages="formMenucreate.MenuLabel.$error">' +
                    '       <div ng-message="required">Menu Name is required.</div>' +
                    '       </div>' +
                    '    </md-input-container>' +
                    '  </md-content>' +
                    '  <div class="md-actions">' +
                    '    <md-button class="md-raised md-primary md-button md-ink-ripple" type="submit" ng-click="ctrl.CreateMenu(project,formMenucreate)">' +
                    '      Save' +
                    '    </md-button>' +
                    '    <md-button ng-click="ctrl.closeDialog()">' +
                    '      Cancel' +
                    '    </md-button>' +
                    '  </div>' +
                    '</form>' +
                    '</md-dialog>',
                locals: {
                    items: $scope.items,
                    closeDialog: $scope.closeDialog,
                    CreateMenu: $scope.CreateMenu
                },
                bindToController: true,
                controllerAs: 'ctrl',
                controller: 'DialogController'
            });

            $mdDialog
                .show(alert)
                .finally(function() {
                    alert = undefined;
                });
        }

        $scope.closeDialog = function() {
            $mdDialog.hide();
        };

        $scope.CreateMenu = function(o, form) {
            if (form.$valid) {
                $http.post($rootScope.RoutePath + "menu/CreateMenuMgmt", o).then(function(data) {
                    if (data.data.success == false) {
                        if (data.data.data == 'TOKEN') {

                            $rootScope.logout();
                        }
                    }
                    $mdDialog.hide();
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.lstMenu.push(data.data.data);
                    $scope.model.MenuId = data.data.data.id;
                    $scope.GetMenuStructureByMenu(data.data.data.id)
                });

            };
        };

        $scope.DeleteMenu = function(MenuId, ev) {

            var confirm = $mdDialog.confirm()
                .title('Are you sure to delete this Menu?')
                .textContent('Menu Structure related to this Menu will also delete.')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Yes')
                .cancel('No');
            $mdDialog.show(confirm).then(function() {
                $http.get($rootScope.RoutePath + "menu/DeleteMenuMgmt?MenuId=" + MenuId).then(function(data) {
                    if (data.data.success == false) {
                        if (data.data.data == 'TOKEN') {
                            $rootScope.logout();
                        }
                    }
                    $mdToast.show(
                        $mdToast.simple()
                        .textContent(data.data.message)
                        .position('top right')
                        .hideDelay(3000)
                    );
                    $scope.model.MenuId = '';
                    $scope.GetAllMenu();
                });
            }, function() {

            });

        }


        $scope.GetAllDynamicPages = function() {
            // Data
            var pattern = /^((http|https):\/\/)/;
            $http.get($rootScope.RoutePath + "dynamicpage/GetAllDynamicPage").then(function(data) {

                for (var i = 0; i < data.data.length; i++) {

                    if (data.data[i].isHomePage == true) {
                        data.data[i].Slug = "/#/" + data.data[i].Slug;
                    } else if (!pattern.test(data.data[i].Slug)) {
                        data.data[i].Slug = "/#/ManagePage/" + data.data[i].Slug;
                    };

                    data.data[i].templates = [{
                        type: "item",
                        id: data.data[i].id,
                        Title: data.data[i].Name,
                        ContentType: "Dynamic Page",
                        Slug: data.data[i].Slug,
                        Name: "Menu"
                    }, {
                        type: "SubMenu",
                        id: data.data[i].id,
                        Title: data.data[i].Name,
                        ContentType: "Dynamic Page",
                        Slug: data.data[i].Slug,
                        Name: "Parent Menu",
                        columns: [
                            []
                        ]
                    }];
                };
                $scope.lstDynamicPages = data.data;
            });
        }

        $scope.GetAllMenu = function() {
            // Data
            $http.get($rootScope.RoutePath + "menu/GetAllMenu").then(function(data) {
                $scope.lstMenu = data.data.rows;
            });
        }

        $scope.GetMenuStructureByMenu = function(id) {
            // $rootScope.FlgAddedEditlocal = true;
            if (id != '') {

                $http.get($rootScope.RoutePath + "menu/GetMenuStructureByMenuId?MenuId=" + id).then(function(data) {

                    $scope.lstMenuStructure = data.data.rows;
                    var lstMenudata = [];
                    var Parent = _.where($scope.lstMenuStructure, { idParent: 0 });

                    var NonParent = _.filter($scope.lstMenuStructure, function(res) {
                        if (res.idParent > 0) {
                            return res;
                        };
                    });

                    for (var i = 0; i < Parent.length; i++) {
                        var objParent = [];
                        NonParent = _.filter(NonParent, function(res) {
                            if (res.idParent != Parent[i].id) {
                                return res;
                            } else {
                                objParent.push(res);
                            };
                        });



                        if (objParent != null && objParent != undefined && objParent.length > 0) {
                            var obj = new Object();
                            obj.type = "SubMenu";
                            obj.id = Parent[i].idType;
                            obj.Title = Parent[i].title;
                            obj.ContentType = Parent[i].Type;
                            obj.Slug = Parent[i].NavigationLabel;
                            obj.Name = "Parent Menu";
                            obj.columns = [
                                []
                            ];

                            for (var j = 0; j < objParent.length; j++) {
                                var objSubParent = [];
                                NonParent = _.filter(NonParent, function(res) {
                                    if (res.idParent != objParent[j].id) {
                                        return res;
                                    } else {
                                        objSubParent.push(res);
                                    };
                                });

                                if (objSubParent != null && objSubParent != undefined && objSubParent.length > 0) {
                                    var obj1 = new Object();
                                    obj1.type = "SubMenu";
                                    obj1.id = objParent[j].idType;
                                    obj1.Title = objParent[j].title;
                                    obj1.ContentType = objParent[j].Type;
                                    obj1.Slug = objParent[j].NavigationLabel;
                                    obj1.Name = "Parent Menu";
                                    obj1.columns = [
                                        []
                                    ];

                                    for (var k = 0; k < objSubParent.length; k++) {
                                        var objSubSubParent = [];
                                        NonParent = _.filter(NonParent, function(res) {
                                            if (res.idParent != objSubParent[k].id) {
                                                return res;
                                            } else {
                                                objSubSubParent.push(res);
                                            };
                                        });

                                        if (objSubSubParent != null && objSubSubParent != undefined && objSubSubParent.length > 0) {
                                            var obj2 = new Object();
                                            obj2.type = "SubMenu";
                                            obj2.id = objSubParent[k].idType;
                                            obj2.Title = objSubParent[k].title;
                                            obj2.ContentType = objSubParent[k].Type;
                                            obj2.Slug = objSubParent[k].NavigationLabel;
                                            obj2.Name = "Parent Menu";
                                            obj2.columns = [
                                                []
                                            ];
                                            obj1.columns[0].push(obj2);

                                        } else {
                                            var obj2 = new Object();
                                            obj2.type = "item";
                                            obj2.id = objSubParent[k].idType;
                                            obj2.Title = objSubParent[k].title;
                                            obj2.ContentType = objSubParent[k].Type;
                                            obj2.Slug = objSubParent[k].NavigationLabel;
                                            obj2.Name = "Menu";
                                            obj1.columns[0].push(obj2);

                                        };
                                    };



                                    obj.columns[0].push(obj1);

                                } else {
                                    var obj1 = new Object();
                                    obj1.type = "item";
                                    obj1.id = objParent[j].idType;
                                    obj1.Title = objParent[j].title;
                                    obj1.ContentType = objParent[j].Type;
                                    obj1.Slug = objParent[j].NavigationLabel;
                                    obj1.Name = "Menu";
                                    obj.columns[0].push(obj1);

                                };
                            };

                            lstMenudata.push(obj);

                        } else {
                            var obj = new Object();
                            obj.type = "item";
                            obj.id = Parent[i].idType;
                            obj.Title = Parent[i].title;
                            obj.ContentType = Parent[i].Type;
                            obj.Slug = Parent[i].NavigationLabel;
                            obj.Name = "Menu";
                            lstMenudata.push(obj);

                        };
                    };

                    $scope.models.dropzones.Menu = lstMenudata;

                });
            } else {
                $scope.models = {
                    selected: null,
                    templates: [
                        { type: "item", id: 2 }, {
                            type: "SubMenu",
                            id: 1,
                            columns: [
                                []
                            ]
                        }
                    ],
                    dropzones: {
                        "Menu": []
                    }
                };
            };
        }

        $scope.CheckMenu = function(o) {

            var objMenu = $scope.models.dropzones.Menu;
            var MenuStrudcture = [];

            for (var i = 0; i < objMenu.length; i++) {
                var obj = new Object();

                obj.idMenu = $scope.model.MenuId;
                obj.idType = objMenu[i].id;
                obj.Type = objMenu[i].ContentType;
                obj.ParentType = objMenu[i].ContentType;
                obj.idParent = 0;
                obj.ParentId = 0;
                obj.Depth = 0;
                obj.NavigationLabel = objMenu[i].Slug;
                obj.title = objMenu[i].Title;
                obj.LeftNumber = 0;
                obj.RightNumber = 0;
                MenuStrudcture.push(obj);

                if (objMenu[i].columns) {

                    var objSubMenu = objMenu[i].columns[0];

                    for (var j = 0; j < objSubMenu.length; j++) {
                        obj = new Object();

                        obj.idMenu = $scope.model.MenuId;
                        obj.idType = objSubMenu[j].id;
                        obj.Type = objSubMenu[j].ContentType;
                        obj.ParentType = objMenu[i].ContentType;
                        obj.idParent = 0;
                        obj.ParentId = objMenu[i].id;
                        obj.Depth = 0;
                        obj.NavigationLabel = objSubMenu[j].Slug;
                        obj.title = objSubMenu[j].Title;
                        obj.LeftNumber = 0;
                        obj.RightNumber = 0;
                        MenuStrudcture.push(obj);

                        if (objSubMenu[j].columns) {
                            var objSubMenu1 = objSubMenu[j].columns[0];

                            for (var k = 0; k < objSubMenu1.length; k++) {
                                obj = new Object();

                                obj.idMenu = $scope.model.MenuId;
                                obj.idType = objSubMenu1[k].id;
                                obj.Type = objSubMenu1[k].ContentType;
                                obj.ParentType = objSubMenu[j].ContentType;
                                obj.idParent = 0;
                                obj.ParentId = objSubMenu[j].id;
                                obj.Depth = 0;
                                obj.NavigationLabel = objSubMenu1[k].Slug;
                                obj.title = objSubMenu1[k].Title;
                                obj.LeftNumber = 0;
                                obj.RightNumber = 0;
                                MenuStrudcture.push(obj);
                            };
                        };
                    };
                };
            };

            var objData = _.findWhere(MenuStrudcture, { Type: o.ContentType, idType: o.id });

            if (objData != undefined && objData != null) {
                return true;
            } else {
                return false;
            };
        }

        $scope.RemoveMenu = function(o, id) {
            o.splice(id, 1)
        }

        $scope.models = {
            selected: null,
            templates: [
                { type: "item", id: 2 }, {
                    type: "SubMenu",
                    id: 1,
                    columns: [
                        []
                    ]
                }
            ],
            dropzones: {
                "Menu": []
            }
        };

        $scope.$watch('models.dropzones', function(model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);


        $scope.SaveMenuStructure = function(o) {
            var objMenu = o.dropzones.Menu;

            var MenuStrudcture = [];

            for (var i = 0; i < objMenu.length; i++) {
                var obj = new Object();

                obj.idMenu = $scope.model.MenuId;
                obj.idType = objMenu[i].id;
                obj.Type = objMenu[i].ContentType;
                obj.ParentType = objMenu[i].ContentType;
                obj.idParent = 0;
                obj.ParentId = 0;
                obj.Depth = 0;
                obj.NavigationLabel = objMenu[i].Slug;
                obj.title = objMenu[i].Title;
                obj.LeftNumber = 0;
                obj.RightNumber = 0;
                MenuStrudcture.push(obj);

                if (objMenu[i].columns) {

                    var objSubMenu = objMenu[i].columns[0];

                    for (var j = 0; j < objSubMenu.length; j++) {
                        obj = new Object();

                        obj.idMenu = $scope.model.MenuId;
                        obj.idType = objSubMenu[j].id;
                        obj.Type = objSubMenu[j].ContentType;
                        obj.ParentType = objMenu[i].ContentType;
                        obj.idParent = 0;
                        obj.ParentId = objMenu[i].id;
                        obj.Depth = 0;
                        obj.NavigationLabel = objSubMenu[j].Slug;
                        obj.title = objSubMenu[j].Title;
                        obj.LeftNumber = 0;
                        obj.RightNumber = 0;
                        MenuStrudcture.push(obj);

                        if (objSubMenu[j].columns) {
                            var objSubMenu1 = objSubMenu[j].columns[0];

                            for (var k = 0; k < objSubMenu1.length; k++) {
                                obj = new Object();

                                obj.idMenu = $scope.model.MenuId;
                                obj.idType = objSubMenu1[k].id;
                                obj.Type = objSubMenu1[k].ContentType;
                                obj.ParentType = objSubMenu[j].ContentType;
                                obj.idParent = 0;
                                obj.ParentId = objSubMenu[j].id;
                                obj.Depth = 0;
                                obj.NavigationLabel = objSubMenu1[k].Slug;
                                obj.title = objSubMenu1[k].Title;
                                obj.LeftNumber = 0;
                                obj.RightNumber = 0;
                                MenuStrudcture.push(obj);
                            };
                        };
                    };
                };
            };





            $http.post($rootScope.RoutePath + "menu/CreateBulkMenuStructure", MenuStrudcture).then(function(data) {
                if (data.data.success == false) {
                    if (data.data.data == 'TOKEN') {
                        $rootScope.logout();
                    }
                }
                $rootScope.FlgAddedEditlocal = false;
                $mdToast.show(
                    $mdToast.simple()
                    .textContent(data.data.message)
                    .position('top right')
                    .hideDelay(3000)
                );
            });
        }

        $scope.ResetTab = function() {
            if ($rootScope.FlgAddedAccess == true) {
                if ($rootScope.FlgAddedAccess != true) {
                    $rootScope.FlgAddedEditlocal = false;
                }
            }
        }
        $rootScope.CheckPageRights(($rootScope.state.current.ModuleName), function(response) {
            $scope.init();
        })


    }
})();