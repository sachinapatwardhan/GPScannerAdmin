(function() {
    'use strict';

    angular
        .module('app.AssignDevice')
        .controller('AssignDeviceController', AssignDeviceController);

    /** @ngInject */
    function AssignDeviceController(
		$scope, $rootScope, $http, $document, $cookieStore, $compile,
		$mdDialog, $mdToast,
		DTOptionsBuilder, DTColumnBuilder) {
        var vm = this;

		//////////
		
		// DataTables
		
		$scope.dtOptions = DTOptionsBuilder.newOptions()
			.withOption('processing', true)
			.withOption('serverSide', true)
			.withOption('order', [0, 'asc'])
			.withOption('responsive', true)
			.withOption('autoWidth', true)
			.withOption('scrollY', 'auto')
			.withPaginationType('full_numbers')
			.withDisplayLength(25)
			.withDOM('rt<"bottom"<"left"<"length"l><"info"i>><"right"<"pagination"p>>>')
			.withOption('ajax', {
				url: $rootScope.RoutePath + 'admin/getAllGpsDevices',
				data: function(d) {
					d.search.value = $scope.searchTerm;
					if ($scope.selectedAgent) {
						d.agentId = $scope.selectedAgent.id;
					} else {
						d.agentId = undefined;
					}
					return d;
				},
				type: 'GET',
				dataSrc: function(data) {
					$scope.devices.length = 0;
					// Make sure not null
					if ($scope.selectedAgent) {
						// For page change (selectedAgent stays the same)
						for (var i = 0; i < data.data.length; ++i) {
							var dar = data.data[i].tbldeviceagentretailer;
							data.data[i].isChecked = (dar && dar.agentId === $scope.selectedAgent.id) ? true : false;
							data.data[i].isDisabled = false;
						}
					} else {
						// For on load new page all false (no agent selected)
						for (var i = 0; i < data.data.length; ++i) {
							data.data[i].isChecked = false;
							data.data[i].isDisabled = false;
						}
					}
					$scope.devices.push.apply($scope.devices, data.data);
					return data.data;
				}
			})
			.withOption('createdRow', function(row, data, index) {
				$compile(angular.element(row).contents())($scope);
				if (index === $scope.devices.length - 1) {
					// Quick hack
					$scope.dtInstance.DataTable.columns.adjust();
				}
			});

		// For super admin
		$scope.dtColumns = [
			DTColumnBuilder.newColumn('id').renderWith(function(data, type, row, meta) {
				return meta.row + 1;
			}),
			DTColumnBuilder.newColumn('DeviceId'),
			DTColumnBuilder.newColumn('Type'),
			DTColumnBuilder.newColumn('IMEI'),
			DTColumnBuilder.newColumn('Version'),
			DTColumnBuilder.newColumn(null).notSortable().renderWith(function(data, type, row, meta) {
				if (row.tblsimdetail && row.tblsimdetail.SerialNum) {
					return row.tblsimdetail.SerialNum;
				}
				return 'N/A';
			}),
			DTColumnBuilder.newColumn(null).notSortable().renderWith(function(data, type, row, meta) {
				if (row.tblsimdetail && row.tblsimdetail.PhoneNum) {
					return row.tblsimdetail.PhoneNum;
				}
				return 'N/A';
			}),
			DTColumnBuilder.newColumn(null).notSortable().renderWith(function(data, type, row, meta) {
				if (row.tblsimdetail && row.tblsimdetail.tbltelco && row.tblsimdetail.tbltelco.Name) {
					return row.tblsimdetail.tbltelco.Name;
				}
				return 'N/A';
			}),
			DTColumnBuilder.newColumn('AppName'),
			DTColumnBuilder.newColumn('ExpiryDate').renderWith(function(data, type, row, meta) {
				var parsed = moment(data);
				return parsed.isValid() ? parsed.format('DD-MM-YYYY hh:mm:ss a') : 'N/A';
			}),
			DTColumnBuilder.newColumn('CreatedDate').renderWith(function(data, type, row, meta) {
				var parsed = moment(data);
				return parsed.isValid() ? parsed.format('DD-MM-YYYY hh:mm:ss a') : 'N/A';
			}),
			DTColumnBuilder.newColumn('CreatedBy'),
			DTColumnBuilder.newColumn(null).notSortable().withOption('class', 'text-center').renderWith(function(data, type, row, meta) {
				return data === 1 ?
					'<span style="font-size: 20px; color: green;">&#x2714;</span>' :
					'<span style="font-size: 20px; color: red;">&#x2716;</span>';
			}),
			DTColumnBuilder.newColumn(null).notSortable().renderWith(function(data, type, row, meta) {
				var template =
					'<md-checkbox aria-label="assign" ng-disabled="devices[' + meta.row + '].isDisabled" ng-model="devices[' + meta.row + '].isChecked" ng-change="assignDevice(' + meta.row + ')"></md-checkbox>';

				return template;
			}).withOption('responsivePriority', 1)
		];

		// For normal admin
		$scope.dtColumns2 = [
			DTColumnBuilder.newColumn('id').renderWith(function(data, type, row, meta) {
				return meta.row + 1;
			}),
			DTColumnBuilder.newColumn('DeviceId'),
			DTColumnBuilder.newColumn('Type'),
			DTColumnBuilder.newColumn('IMEI'),
			DTColumnBuilder.newColumn('Version'),
			DTColumnBuilder.newColumn(null).notSortable().renderWith(function(data, type, row, meta) {
				if (row.tblsimdetail && row.tblsimdetail.SerialNum) {
					return row.tblsimdetail.SerialNum;
				}
				return 'N/A';
			}),
			DTColumnBuilder.newColumn(null).notSortable().renderWith(function(data, type, row, meta) {
				if (row.tblsimdetail && row.tblsimdetail.PhoneNum) {
					return row.tblsimdetail.PhoneNum;
				}
				return 'N/A';
			}),
			DTColumnBuilder.newColumn(null).notSortable().renderWith(function(data, type, row, meta) {
				if (row.tblsimdetail && row.tblsimdetail.tbltelco && row.tblsimdetail.tbltelco.Name) {
					return row.tblsimdetail.tbltelco.Name;
				}
				return 'N/A';
			}),
			DTColumnBuilder.newColumn('ExpiryDate').renderWith(function(data, type, row, meta) {
				var parsed = moment(data);
				return parsed.isValid() ? parsed.format('DD-MM-YYYY hh:mm:ss a') : 'N/A';
			}),
			DTColumnBuilder.newColumn('CreatedDate').renderWith(function(data, type, row, meta) {
				var parsed = moment(data);
				return parsed.isValid() ? parsed.format('DD-MM-YYYY hh:mm:ss a') : 'N/A';
			}),
			DTColumnBuilder.newColumn('CreatedBy'),
			DTColumnBuilder.newColumn(null).notSortable().withOption('class', 'text-center').renderWith(function(data, type, row, meta) {
				return data === 1 ?
					'<span style="font-size: 20px; color: green;">&#x2714;</span>' :
					'<span style="font-size: 20px; color: red;">&#x2716;</span>';
			}),
			DTColumnBuilder.newColumn(null).notSortable().renderWith(function(data, type, row, meta) {
				var template =
					'<md-checkbox aria-label="assign" ng-disabled="devices[' + meta.row + '].isDisabled" ng-model="devices[' + meta.row + '].isChecked" ng-change="assignDevice(' + meta.row + ')"></md-checkbox>';

				return template;
			}).withOption('responsivePriority', 1)
		];

		$scope.dtInstance = function(dtInstance) {
			$scope.dtInstance = dtInstance;	
		};

		//////////

		// Variables

		$scope.searchTerm = '';
		$scope.devices = [];

		// Functions
		
        $scope.init = function() {

		};
		
		$scope.onAgentSelected = function() {
			// Make sure not null
			if ($scope.selectedAgent) {
				for (var i = 0; i < $scope.devices.length; ++i) {
					var dar = $scope.devices[i].tbldeviceagentretailer;
					$scope.devices[i].isChecked = (dar && dar.agentId === $scope.selectedAgent.id) ? true : false;
				}
			}

			$scope.dtInstance.reloadData(function() {}, true);
		};

		$scope.GetAutocompleteAgents = function(searchAgent) {
			return $http.get($rootScope.RoutePath + 'admin/getAutocompleteSalesAgent', {
				params: {
					username: searchAgent
				}
			})
			.then(function(res) {
				return res.data.data;
			});
		};

        $scope.onSearch = function(searchTerm) {
			$scope.searchTerm = searchTerm;

			$scope.dtInstance.reloadData(function() {}, true);
		};

		$scope.assignDevice = function(i) {
			if (!$scope.selectedAgent) {
				$scope.devices[i].isChecked = false;
				var dialog = $mdDialog.confirm()
					.title('No Agent')
					.textContent('Please select an agent.')
					.ok('OK');
				
				$mdDialog.show(dialog)
				.then(function(success) {
					if (success) {
						$scope.dtInstance.reloadData(function() {}, true);
					}
				});
				return;
			}

			// Proceed assigning
			// Copy original value
			var isCheckedCopy = !$scope.devices[i].isChecked;

			// Disable rechecking
			$scope.devices[i].isDisabled = true;

			$http.post($rootScope.RoutePath + 'admin/assignDevice', {
				deviceId: $scope.devices[i].DeviceId,
				userId: $scope.selectedAgent.id,
				appName: $rootScope.appName,
				assign: $scope.devices[i].isChecked
			})
			.then(function(res) {
				if (!res.data.success) {
					// Error occurred, reset back to original value
					$scope.devices[i].isChecked = isCheckedCopy;
				}

				$mdToast.show(
					$mdToast.simple()
					.textContent(res.data.message)
					.position('top right')
					.hideDelay(3000)
				);
			})
			.catch(function(err) {
				// Error occurred, reset back to original value
				$scope.devices[i].isChecked = isCheckedCopy;

				$mdToast.show(
					$mdToast.simple()
					.textContent('Unable to assign device. Please try again later.')
					.position('top right')
					.hideDelay(3000)
				);
			})
			.finally(function() {
				// Re-enable checkbox
				$scope.devices[i].isDisabled = false;
			});
		};

		$scope.downloadExcelTemplate = function() {
			window.location = $rootScope.RoutePath + 'admin/downloadAssignDeviceExcelTemplate';
		};

		$scope.showAssignDeviceByExcelModal = function(e) {
			$mdDialog.show({
				controller: 'ImportAssignDeviceController',
				controllerAs: 'vm',
				templateUrl: 'app/main/AssignDevice/dialogs/ImportAssignDevice/ImportAssignDevice.html',
				parent: angular.element($document.body),
				targetEvent: e,
				clickOutsideToClose: true
			});
		};
		
        $scope.Reset = $scope.init;

        $scope.init();
    }
})();