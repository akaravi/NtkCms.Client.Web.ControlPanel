app.controller("taskSchedulerProcessCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$state', '$builder', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $state, $builder, $filter) {
    var taskSchedulerProcessCategory = this;
    taskSchedulerProcessCategory.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
   taskSchedulerProcessCategory.filePickerMainImage = {
      isActive: true,
      backElement: "filePickerMainImage",
      filename: null,
      fileId: null,
      multiSelect: false
    };
    taskSchedulerProcessCategory.UninversalMenus = [];
    taskSchedulerProcessCategory.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) taskSchedulerProcessCategory.itemRecordStatus = itemRecordStatus;

    taskSchedulerProcessCategory.init = function () {
        taskSchedulerProcessCategory.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"TaskSchedulerProcessCategory/getall", taskSchedulerProcessCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            taskSchedulerProcessCategory.busyIndicator.isActive = false;
            taskSchedulerProcessCategory.ListItems = response.ListItems;
            taskSchedulerProcessCategory.gridOptions.fillData(taskSchedulerProcessCategory.ListItems, response.resultAccess);
            taskSchedulerProcessCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            taskSchedulerProcessCategory.gridOptions.totalRowCount = response.TotalRowCount;
            taskSchedulerProcessCategory.gridOptions.rowPerPage = response.RowPerPage;
            taskSchedulerProcessCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            taskSchedulerProcessCategory.busyIndicator.isActive = false;
            taskSchedulerProcessCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    taskSchedulerProcessCategory.busyIndicator.isActive = true;
    taskSchedulerProcessCategory.addRequested = false;
 // taskSchedulerProcessCategory.openAddModal = function () {
 //     if (buttonIsPressed) return;
 //     taskSchedulerProcessCategory.filePickerMainImage.filename = "";
 //     taskSchedulerProcessCategory.filePickerMainImage.fileId = null;
 //     taskSchedulerProcessCategory.modalTitle = 'اضافه';
 //     buttonIsPressed = true;
 //     ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcessCategory/GetViewModel', "", 'GET').success(function (response) {
 //         buttonIsPressed = false;
 //         rashaErManage.checkAction(response);
 //         taskSchedulerProcessCategory.busyIndicator.isActive = false;
 //         taskSchedulerProcessCategory.selectedItem = response.Item;
 //         $modal.open({
 //             templateUrl: 'cpanelv1/ModuleTaskScheduler/TaskSchedulerProcessCategory/add.html',
 //             scope: $scope
 //         });
 //
 //     }).error(function (data, errCode, c, d) {
 //         rashaErManage.checkAction(data, errCode);
 //         taskSchedulerProcessCategory.busyIndicator.isActive = false;
 //
 //     });
 // }

    // Add New Content
//   taskSchedulerProcessCategory.addNewRow = function (frm) {
//       if (frm.$invalid)
//       {
//           rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
//           return;
//       }
//       taskSchedulerProcessCategory.busyIndicator.isActive = true;
//       taskSchedulerProcessCategory.addRequested = true;
//       ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcessCategory/add', taskSchedulerProcessCategory.selectedItem, 'POST').success(function (response) {
//           taskSchedulerProcessCategory.addRequested = false;
//           taskSchedulerProcessCategory.busyIndicator.isActive = false;
//           rashaErManage.checkAction(response);
//           if (response.IsSuccess) {
//               taskSchedulerProcessCategory.ListItems.unshift(response.Item);
//               taskSchedulerProcessCategory.gridOptions.fillData(taskSchedulerProcessCategory.ListItems);
//               taskSchedulerProcessCategory.closeModal();
//           }
//       }).error(function (data, errCode, c, d) {
//           rashaErManage.checkAction(data, errCode);
//           taskSchedulerProcessCategory.busyIndicator.isActive = false;
//           taskSchedulerProcessCategory.addRequested = false;
//       });
//   }

    taskSchedulerProcessCategory.autoAdd = function () {
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcessCategory/autoadd', '', 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            taskSchedulerProcessCategory.init();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    taskSchedulerProcessCategory.openEditModal = function () {
        if (buttonIsPressed) return;
        taskSchedulerProcessCategory.modalTitle = 'ویرایش';
        if (!taskSchedulerProcessCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcessCategory/GetOne', taskSchedulerProcessCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            taskSchedulerProcessCategory.selectedItem = response.Item;
          taskSchedulerProcessCategory.filePickerMainImage.filename = null;
          taskSchedulerProcessCategory.filePickerMainImage.fileId = null;
         if (response.Item.LinkMainImageId != null) {
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                response.Item.LinkMainImageId,
                "GET"
              )
              .success(function(response2) {
                buttonIsPressed = false;
                taskSchedulerProcessCategory.filePickerMainImage.filename =
                  response2.Item.FileName;
                taskSchedulerProcessCategory.filePickerMainImage.fileId = response2.Item.Id;
              })
              .error(function(data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
              });
          }

            $modal.open({
                templateUrl: 'cpanelv1/ModuleTaskScheduler/TaskSchedulerProcessCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    taskSchedulerProcessCategory.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        taskSchedulerProcessCategory.addRequested = true;
        taskSchedulerProcessCategory.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcessCategory/edit', taskSchedulerProcessCategory.selectedItem, 'PUT').success(function (response) {
            rashaErManage.checkAction(response);
            taskSchedulerProcessCategory.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                taskSchedulerProcessCategory.addRequested = false;
                taskSchedulerProcessCategory.replaceItem(taskSchedulerProcessCategory.selectedItem.Id, response.Item);
                taskSchedulerProcessCategory.gridOptions.fillData(taskSchedulerProcessCategory.ListItems);
                taskSchedulerProcessCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            taskSchedulerProcessCategory.addRequested = false;
            taskSchedulerProcessCategory.busyIndicator.isActive = false;
        });
    }

    taskSchedulerProcessCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    taskSchedulerProcessCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(taskSchedulerProcessCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = taskSchedulerProcessCategory.ListItems.indexOf(item);
                taskSchedulerProcessCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            taskSchedulerProcessCategory.ListItems.unshift(newItem);
    }

    taskSchedulerProcessCategory.deleteRow = function () {
        if (!taskSchedulerProcessCategory.gridOptions.selectedRow.item) {
            if (buttonIsPressed) return;
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                taskSchedulerProcessCategory.busyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcessCategory/GetOne', taskSchedulerProcessCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    taskSchedulerProcessCategory.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcessCategory/delete', taskSchedulerProcessCategory.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        taskSchedulerProcessCategory.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            taskSchedulerProcessCategory.replaceItem(taskSchedulerProcessCategory.selectedItemForDelete.Id);
                            taskSchedulerProcessCategory.gridOptions.fillData(taskSchedulerProcessCategory.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        taskSchedulerProcessCategory.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    taskSchedulerProcessCategory.busyIndicator.isActive = false;
                });
            }
        });
    }

    taskSchedulerProcessCategory.searchData = function () {
        taskSchedulerProcessCategory.gridOptions.searchData();
    }

    taskSchedulerProcessCategory.gridOptions = {
        columns: [
            { name: "Id", displayName: "کد سیستمی", sortable: true, type: "integer", visible: true },
            { name: "Title", displayName: "عنوان", sortable: true, type: "string", visible: true },
            { name: "ClassName", displayName: "ClassName", sortable: true, type: "string", visible: true },
            { name: "ActionButton", displayName: "صفحات", sortable: false, displayForce: true, template: "<button class=\"btn btn-warning\" ng-click=\"taskSchedulerProcessCategory.changeState('taskschedulerprocess', x)\" title=\"طراحی به صفحات\" type=\"button\"><i class=\"fa fa-file-text-o\" aria-hidden=\"true\"></i></button>" }
            
        ],
        data: {},
        multiSelect: false,
        startDate: moment().format(),
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 0,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }

    taskSchedulerProcessCategory.gridOptions.reGetAll = function () {
        taskSchedulerProcessCategory.init();
    }

    taskSchedulerProcessCategory.gridOptions.onRowSelected = function () {

    }

    taskSchedulerProcessCategory.columnCheckbox = false;

    taskSchedulerProcessCategory.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (taskSchedulerProcessCategory.gridOptions.columnCheckbox) {
            for (var i = 0; i < taskSchedulerProcessCategory.gridOptions.columns.length; i++) {
                var element = $("#" + taskSchedulerProcessCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                taskSchedulerProcessCategory.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = taskSchedulerProcessCategory.gridOptions.columns;
            for (var i = 0; i < taskSchedulerProcessCategory.gridOptions.columns.length; i++) {
                taskSchedulerProcessCategory.gridOptions.columns[i].visible = true;
                var element = $("#" + taskSchedulerProcessCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + taskSchedulerProcessCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < taskSchedulerProcessCategory.gridOptions.columns.length; i++) {
            console.log(taskSchedulerProcessCategory.gridOptions.columns[i].name.concat(".visible: "), taskSchedulerProcessCategory.gridOptions.columns[i].visible);
        }
        taskSchedulerProcessCategory.gridOptions.columnCheckbox = !taskSchedulerProcessCategory.gridOptions.columnCheckbox;
    }

    taskSchedulerProcessCategory.changeState = function (state, source) {
        $state.go("index." + state, { sourceid: source.Id });
    }

   
    taskSchedulerProcessCategory.saveSubmitValues = function () {
        taskSchedulerProcessCategory.addRequested = true;
        taskSchedulerProcessCategory.busyIndicator.isActive = true;
        taskSchedulerProcessCategory.selectedItem[taskSchedulerProcessCategory.selectedConfig] = $.trim(angular.toJson(taskSchedulerProcessCategory.submitValue));
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcessCategory/edit', taskSchedulerProcessCategory.selectedItem, 'PUT').success(function (response) {
            rashaErManage.checkAction(response);
            taskSchedulerProcessCategory.addRequested = false;
            taskSchedulerProcessCategory.busyIndicator.isActive = false;
            taskSchedulerProcessCategory.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            taskSchedulerProcessCategory.addRequested = false;
            taskSchedulerProcessCategory.busyIndicator.isActive = false;

        });
    }

 
//upload file
    taskSchedulerProcessCategory.uploadFile = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
          if (taskSchedulerProcessCategory.fileIsExist(uploadFile.name)) {
          // File already exists
          if (
            confirm(
              'File "' +
                uploadFile.name +
                '" already exists! Do you want to replace the new file?'
            )
          ) {
            //------------ taskSchedulerProcessCategory.replaceFile(uploadFile.name);
            taskSchedulerProcessCategory.itemClicked(null, taskSchedulerProcessCategory.fileIdToDelete, "file");
            taskSchedulerProcessCategory.fileTypes = 1;
            taskSchedulerProcessCategory.fileIdToDelete = taskSchedulerProcessCategory.selectedIndex;
             // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                taskSchedulerProcessCategory.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        taskSchedulerProcessCategory.FileItem = response2.Item;
                        taskSchedulerProcessCategory.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        taskSchedulerProcessCategory.filePickerMainImage.filename =
                          taskSchedulerProcessCategory.FileItem.FileName;
                        taskSchedulerProcessCategory.filePickerMainImage.fileId =
                          response2.Item.Id;
                        taskSchedulerProcessCategory.selectedItem.LinkMainImageId =
                          taskSchedulerProcessCategory.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      taskSchedulerProcessCategory.showErrorIcon();
                      $("#save-icon" + index).removeClass("fa-save");
                      $("#save-button" + index).removeClass("flashing-button");
                      $("#save-icon" + index).addClass("fa-remove");
                    });
                  //-----------------------------------
                }
              })
              .error(function(data) {
                console.log(data);
              });
            //--------------------------------
          } else {
            return;
          }
        } else {
          // File does not exists
          // Save New file
          ajax
            .call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", "GET")
            .success(function(response) {
              taskSchedulerProcessCategory.FileItem = response.Item;
                taskSchedulerProcessCategory.FileItem.FileName = uploadFile.name;
                taskSchedulerProcessCategory.FileItem.uploadName = uploadFile.uploadName;
                taskSchedulerProcessCategory.FileItem.Extension = uploadFile.name.split(".").pop();
                taskSchedulerProcessCategory.FileItem.FileSrc = uploadFile.name;
              taskSchedulerProcessCategory.FileItem.LinkCategoryId = null; //Save the new file in the root
              // ------- taskSchedulerProcessCategory.saveNewFile()  ----------------------
              var result = 0;
              ajax
                .call(cmsServerConfig.configApiServerPath + "FileContent/add", taskSchedulerProcessCategory.FileItem, "POST")
                .success(function(response) {
                  if (response.IsSuccess) {
                    taskSchedulerProcessCategory.FileItem = response.Item;
                    taskSchedulerProcessCategory.showSuccessIcon();
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-check");
                    taskSchedulerProcessCategory.filePickerMainImage.filename =
                      taskSchedulerProcessCategory.FileItem.FileName;
                    taskSchedulerProcessCategory.filePickerMainImage.fileId = response.Item.Id;
                    taskSchedulerProcessCategory.selectedItem.LinkMainImageId =
                      taskSchedulerProcessCategory.filePickerMainImage.fileId;
                  } else {
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-remove");
                  }
                })
                .error(function(data) {
                  taskSchedulerProcessCategory.showErrorIcon();
                  $("#save-icon" + index).removeClass("fa-save");
                  $("#save-button" + index).removeClass("flashing-button");
                  $("#save-icon" + index).addClass("fa-remove");
                });
              //-----------------------------------
            })
            .error(function(data) {
              console.log(data);
              $("#save-icon" + index).removeClass("fa-save");
              $("#save-button" + index).removeClass("flashing-button");
              $("#save-icon" + index).addClass("fa-remove");
            });
        }
      }
    };
    //End of Upload Modal-----------------------------------------
}]);

