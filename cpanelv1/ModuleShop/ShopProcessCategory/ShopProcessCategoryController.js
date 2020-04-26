app.controller("shopProcessCategoryController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$state', '$builder', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $state, $builder, $filter) {
    var shopProcessCategory = this;
    shopProcessCategory.busyIndicator = {
        isActive: true,
        message: "در حال بار گذاری ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
   shopProcessCategory.filePickerMainImage = {
      isActive: true,
      backElement: "filePickerMainImage",
      filename: null,
      fileId: null,
      multiSelect: false
    };
    shopProcessCategory.UninversalMenus = [];
    shopProcessCategory.selectUniversalMenuOnUndetectableKey = true;
    if (itemRecordStatus != undefined) shopProcessCategory.itemRecordStatus = itemRecordStatus;

    shopProcessCategory.init = function () {
        shopProcessCategory.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"ShopProcessCategory/getall", shopProcessCategory.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopProcessCategory.busyIndicator.isActive = false;
            shopProcessCategory.ListItems = response.ListItems;
            shopProcessCategory.gridOptions.fillData(shopProcessCategory.ListItems, response.resultAccess);
            shopProcessCategory.gridOptions.currentPageNumber = response.CurrentPageNumber;
            shopProcessCategory.gridOptions.totalRowCount = response.TotalRowCount;
            shopProcessCategory.gridOptions.rowPerPage = response.RowPerPage;
            shopProcessCategory.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            shopProcessCategory.busyIndicator.isActive = false;
            shopProcessCategory.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    shopProcessCategory.busyIndicator.isActive = true;
    shopProcessCategory.addRequested = false;
 // shopProcessCategory.openAddModal = function () {
 //     if (buttonIsPressed) return;
 //     shopProcessCategory.filePickerMainImage.filename = "";
 //     shopProcessCategory.filePickerMainImage.fileId = null;
 //     shopProcessCategory.modalTitle = 'اضافه';
 //     buttonIsPressed = true;
 //     ajax.call(cmsServerConfig.configApiServerPath+'ShopProcessCategory/GetViewModel', "", 'GET').success(function (response) {
 //         buttonIsPressed = false;
 //         rashaErManage.checkAction(response);
 //         shopProcessCategory.busyIndicator.isActive = false;
 //         shopProcessCategory.selectedItem = response.Item;
 //         $modal.open({
 //             templateUrl: 'cpanelv1/ModuleShop/ShopProcessCategory/add.html',
 //             scope: $scope
 //         });
 //
 //     }).error(function (data, errCode, c, d) {
 //         rashaErManage.checkAction(data, errCode);
 //         shopProcessCategory.busyIndicator.isActive = false;
 //
 //     });
 // }

    // Add New Content
//   shopProcessCategory.addNewRow = function (frm) {
//       if (frm.$invalid)
//       {
//           rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
//           return;
//       }
//       shopProcessCategory.busyIndicator.isActive = true;
//       shopProcessCategory.addRequested = true;
//       ajax.call(cmsServerConfig.configApiServerPath+'ShopProcessCategory/add', shopProcessCategory.selectedItem, 'POST').success(function (response) {
//           shopProcessCategory.addRequested = false;
//           shopProcessCategory.busyIndicator.isActive = false;
//           rashaErManage.checkAction(response);
//           if (response.IsSuccess) {
//               shopProcessCategory.ListItems.unshift(response.Item);
//               shopProcessCategory.gridOptions.fillData(shopProcessCategory.ListItems);
//               shopProcessCategory.closeModal();
//           }
//       }).error(function (data, errCode, c, d) {
//           rashaErManage.checkAction(data, errCode);
//           shopProcessCategory.busyIndicator.isActive = false;
//           shopProcessCategory.addRequested = false;
//       });
//   }

    shopProcessCategory.autoAdd = function () {
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcessCategory/autoadd', '', 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            shopProcessCategory.init();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    shopProcessCategory.openEditModal = function () {
        if (buttonIsPressed) return;
        shopProcessCategory.modalTitle = 'ویرایش';
        if (!shopProcessCategory.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcessCategory/GetOne', shopProcessCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            shopProcessCategory.selectedItem = response.Item;
          shopProcessCategory.filePickerMainImage.filename = null;
          shopProcessCategory.filePickerMainImage.fileId = null;
         if (response.Item.LinkMainImageId != null) {
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                response.Item.LinkMainImageId,
                "GET"
              )
              .success(function(response2) {
                buttonIsPressed = false;
                shopProcessCategory.filePickerMainImage.filename =
                  response2.Item.FileName;
                shopProcessCategory.filePickerMainImage.fileId = response2.Item.Id;
              })
              .error(function(data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
              });
          }

            $modal.open({
                templateUrl: 'cpanelv1/ModuleShop/ShopProcessCategory/edit.html',
                scope: $scope
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Edit a Content
    shopProcessCategory.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        shopProcessCategory.addRequested = true;
        shopProcessCategory.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcessCategory/edit', shopProcessCategory.selectedItem, 'PUT').success(function (response) {
            rashaErManage.checkAction(response);
            shopProcessCategory.busyIndicator.isActive = false;
            if (response.IsSuccess) {
                shopProcessCategory.addRequested = false;
                shopProcessCategory.replaceItem(shopProcessCategory.selectedItem.Id, response.Item);
                shopProcessCategory.gridOptions.fillData(shopProcessCategory.ListItems);
                shopProcessCategory.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopProcessCategory.addRequested = false;
            shopProcessCategory.busyIndicator.isActive = false;
        });
    }

    shopProcessCategory.closeModal = function () {
        $modalStack.dismissAll();
    };

    shopProcessCategory.replaceItem = function (oldId, newItem) {
        angular.forEach(shopProcessCategory.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = shopProcessCategory.ListItems.indexOf(item);
                shopProcessCategory.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            shopProcessCategory.ListItems.unshift(newItem);
    }

    shopProcessCategory.deleteRow = function () {
        if (!shopProcessCategory.gridOptions.selectedRow.item) {
            if (buttonIsPressed) return;
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                shopProcessCategory.busyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'ShopProcessCategory/GetOne', shopProcessCategory.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    shopProcessCategory.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'ShopProcessCategory/delete', shopProcessCategory.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        shopProcessCategory.busyIndicator.isActive = false;
                        if (res.IsSuccess) {
                            shopProcessCategory.replaceItem(shopProcessCategory.selectedItemForDelete.Id);
                            shopProcessCategory.gridOptions.fillData(shopProcessCategory.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                        shopProcessCategory.busyIndicator.isActive = false;
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                    shopProcessCategory.busyIndicator.isActive = false;
                });
            }
        });
    }

    shopProcessCategory.searchData = function () {
        shopProcessCategory.gridOptions.searchData();
    }

    shopProcessCategory.gridOptions = {
        columns: [
            { name: "Id", displayName: "کد سیستمی", sortable: true, type: "integer", visible: true },
            { name: "Title", displayName: "عنوان", sortable: true, type: "string", visible: true },
            { name: "ClassName", displayName: "ClassName", sortable: true, type: "string", visible: true },
            { name: "ActionButton", displayName: "صفحات", sortable: false, displayForce: true, template: "<button class=\"btn btn-warning\" ng-click=\"shopProcessCategory.changeState('shopprocess', x)\" title=\"طراحی به صفحات\" type=\"button\"><i class=\"fa fa-file-text-o\" aria-hidden=\"true\"></i></button>" }
            
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

    shopProcessCategory.gridOptions.reGetAll = function () {
        shopProcessCategory.init();
    }

    shopProcessCategory.gridOptions.onRowSelected = function () {

    }

    shopProcessCategory.columnCheckbox = false;

    shopProcessCategory.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (shopProcessCategory.gridOptions.columnCheckbox) {
            for (var i = 0; i < shopProcessCategory.gridOptions.columns.length; i++) {
                var element = $("#" + shopProcessCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                shopProcessCategory.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = shopProcessCategory.gridOptions.columns;
            for (var i = 0; i < shopProcessCategory.gridOptions.columns.length; i++) {
                shopProcessCategory.gridOptions.columns[i].visible = true;
                var element = $("#" + shopProcessCategory.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + shopProcessCategory.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < shopProcessCategory.gridOptions.columns.length; i++) {
            console.log(shopProcessCategory.gridOptions.columns[i].name.concat(".visible: "), shopProcessCategory.gridOptions.columns[i].visible);
        }
        shopProcessCategory.gridOptions.columnCheckbox = !shopProcessCategory.gridOptions.columnCheckbox;
    }

    shopProcessCategory.changeState = function (state, source) {
        $state.go("index." + state, { sourceid: source.Id });
    }

   
    shopProcessCategory.saveSubmitValues = function () {
        shopProcessCategory.addRequested = true;
        shopProcessCategory.busyIndicator.isActive = true;
        shopProcessCategory.selectedItem[shopProcessCategory.selectedConfig] = $.trim(angular.toJson(shopProcessCategory.submitValue));
        ajax.call(cmsServerConfig.configApiServerPath+'ShopProcessCategory/edit', shopProcessCategory.selectedItem, 'PUT').success(function (response) {
            rashaErManage.checkAction(response);
            shopProcessCategory.addRequested = false;
            shopProcessCategory.busyIndicator.isActive = false;
            shopProcessCategory.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            shopProcessCategory.addRequested = false;
            shopProcessCategory.busyIndicator.isActive = false;

        });
    }

 
//upload file
    shopProcessCategory.uploadFile = function (index, uploadFile) {
      if ($("#save-icon" + index).hasClass("fa-save")) {
          if (shopProcessCategory.fileIsExist(uploadFile.name)) {
          // File already exists
          if (
            confirm(
              'File "' +
                uploadFile.name +
                '" already exists! Do you want to replace the new file?'
            )
          ) {
            //------------ shopProcessCategory.replaceFile(uploadFile.name);
            shopProcessCategory.itemClicked(null, shopProcessCategory.fileIdToDelete, "file");
            shopProcessCategory.fileTypes = 1;
            shopProcessCategory.fileIdToDelete = shopProcessCategory.selectedIndex;
             // replace the file
            ajax
              .call(
                cmsServerConfig.configApiServerPath+"FileContent/GetOne",
                shopProcessCategory.fileIdToDelete,
                "GET"
              )
              .success(function(response1) {
                if (response1.IsSuccess == true) {
                  console.log(response1.Item);
                  ajax.call(cmsServerConfig.configApiServerPath+"FileContent/replace", response1.Item, "POST")
                    .success(function(response2) {
                      if (response2.IsSuccess == true) {
                        shopProcessCategory.FileItem = response2.Item;
                        shopProcessCategory.showSuccessIcon();
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-check");
                        shopProcessCategory.filePickerMainImage.filename =
                          shopProcessCategory.FileItem.FileName;
                        shopProcessCategory.filePickerMainImage.fileId =
                          response2.Item.Id;
                        shopProcessCategory.selectedItem.LinkMainImageId =
                          shopProcessCategory.filePickerMainImage.fileId;
                      } else {
                        $("#save-icon" + index).removeClass("fa-save");
                        $("#save-button" + index).removeClass(
                          "flashing-button"
                        );
                        $("#save-icon" + index).addClass("fa-remove");
                      }
                    })
                    .error(function(data) {
                      shopProcessCategory.showErrorIcon();
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
              shopProcessCategory.FileItem = response.Item;
                shopProcessCategory.FileItem.FileName = uploadFile.name;
                shopProcessCategory.FileItem.uploadName = uploadFile.uploadName;
                shopProcessCategory.FileItem.Extension = uploadFile.name.split(".").pop();
                shopProcessCategory.FileItem.FileSrc = uploadFile.name;
              shopProcessCategory.FileItem.LinkCategoryId = null; //Save the new file in the root
              // ------- shopProcessCategory.saveNewFile()  ----------------------
              var result = 0;
              ajax
                .call(cmsServerConfig.configApiServerPath + "FileContent/add", shopProcessCategory.FileItem, "POST")
                .success(function(response) {
                  if (response.IsSuccess) {
                    shopProcessCategory.FileItem = response.Item;
                    shopProcessCategory.showSuccessIcon();
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-check");
                    shopProcessCategory.filePickerMainImage.filename =
                      shopProcessCategory.FileItem.FileName;
                    shopProcessCategory.filePickerMainImage.fileId = response.Item.Id;
                    shopProcessCategory.selectedItem.LinkMainImageId =
                      shopProcessCategory.filePickerMainImage.fileId;
                  } else {
                    $("#save-icon" + index).removeClass("fa-save");
                    $("#save-button" + index).removeClass("flashing-button");
                    $("#save-icon" + index).addClass("fa-remove");
                  }
                })
                .error(function(data) {
                  shopProcessCategory.showErrorIcon();
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

