app.controller("cmsGuideController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $filter) {

    var cmsGuide = this;
    cmsGuide.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
    cmsGuide.busyIndicator = {
        isActive: false,
        message: "در حال بار گذاری ..."
    }

    cmsGuide.contentbusyIndicator = {
        isActive: false,
        message: "در حال بار گذاری ..."
    }

    cmsGuide.gridBusyIndicator = {
        isActive: false,
        message: "در حال بار گذاری ..."
    }
   cmsGuide.filePickerFiles = {
      isActive: true,
      backElement: "filePickerFiles",
      multiSelect: false,
      fileId: null,
      filename: null
    };
      cmsGuide.attachedFiles = null;
      cmsGuide.attachedFiles = [];
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها

    cmsGuide.selectedItem = {};
    cmsGuide.selectUniversalMenuOnUndetectableKey = false;

    //Many To Many
    //MenuItemProcesses  جدول واسط
    //ProcessesId   فیلد جدول دیگر در جدول واسط
    //MenuId  فیلد ما در جدول واسط
    cmsGuide.menueGroups = [];//لیست جدول دیگر
    var otherTabaleFieldKey = 'Id';
    var many2ManythisOtherTabaleFieldKey = 'CmsUserGroup_Id';
    var thisTableFieldICollection = 'CmsGuideCmsUserGroup';


    ajax.call(cmsServerConfig.configApiServerPath+"CoreUserGroup/getall", {}, 'POST').success(function (response) {
        cmsGuide.menueGroups = response.ListItems;
    }).error(function (data, errCode, c, d) {
        console.log(data);
    });
    cmsGuide.hasInMany2Many = function (OtherTable) {
        if (cmsGuide.selectedItem[thisTableFieldICollection] == undefined) return false;
        return objectFindByKey(cmsGuide.selectedItem[thisTableFieldICollection], many2ManythisOtherTabaleFieldKey, OtherTable[otherTabaleFieldKey]);

    };
    cmsGuide.toggleMany2Many = function (role, OtherTable) {
        var obj = {};
        obj[many2ManythisOtherTabaleFieldKey] = OtherTable[otherTabaleFieldKey];
        if (cmsGuide.hasInMany2Many(OtherTable)) {
            //var index = cmsGuide.selectedItem[thisTableFieldICollection].indexOf(obj);
            var index = arrayObjectIndexOf(cmsGuide.selectedItem[thisTableFieldICollection], OtherTable[otherTabaleFieldKey], many2ManythisOtherTabaleFieldKey);
            // get the index of this permission role
            cmsGuide.selectedItem[thisTableFieldICollection].splice(index, 1);
        } else {
            cmsGuide.selectedItem[thisTableFieldICollection].push(obj);
        }
    }
    // array = [{key:value},{key:value}]
    function objectFindByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                var obj = {};
                obj[key] = value;
                array[i] = obj;
                return true;
            }
        }
        return false;
    }

    // Find an object in an array of objects and return its index if object is found, -1 if not 
    function arrayObjectIndexOf(myArray, searchTerm, property) {
        for (var i = 0, len = myArray.length; i < len; i++) {
            if (myArray[i][property] === searchTerm) return i;
        }
        return -1;
    }
    //Many To Many


    //Tree Config
    cmsGuide.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

    cmsGuide.treeConfig.currentNode = {};
    cmsGuide.treeBusyIndicator = false;


    cmsGuide.moduleList = {};
    ajax.call(cmsServerConfig.configApiServerPath+'CoreModule/getall', {}, 'POST').success(function (response) {
        cmsGuide.moduleList = response.ListItems;
    });

    cmsGuide.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, width: '85px', type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'virtual_Parent.Title', displayName: ' والد', sortable: true, type: 'link', displayForce: true }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 0,
                NeedToRunFakePagination: false,
                TotalRowData: 200,
                RowPerPage: 200,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }

    cmsGuide.init = function () {
        cmsGuide.addRequested = true;
        cmsGuide.busyIndicator.isActive = true;
        
        ajax.call(cmsServerConfig.configApiServerPath+"CoreGuide/GetAll", cmsGuide.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            cmsGuide.treeConfig.Items = response.ListItems;
            rashaErManage.checkAction(response);
            cmsGuide.ListItems = response.ListItems;
            cmsGuide.ListParentItems = cmsGuide.selectParents();
            cmsGuide.gridOptions.fillData(cmsGuide.ListParentItems, response.resultAccess);
            cmsGuide.gridOptions.resultAccess = response.resultAccess;//دسترسی ها نمایش
            cmsGuide.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsGuide.gridOptions.totalRowCount = response.TotalRowCount;
            cmsGuide.gridOptions.rowPerPage = response.RowPerPage;
            cmsGuide.gridOptions.maxSize = 5;
            cmsGuide.addRequested = false;
            cmsGuide.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            cmsGuide.gridOptions.fillData();
            console.log(data);
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Tree On Node Select Options
    cmsGuide.treeConfig.onNodeSelect = function () {
        var node = cmsGuide.treeConfig.currentNode;
        cmsGuide.gridOptions.selectedRow.item = cmsGuide.treeConfig.currentNode;
        // cmsGuide.LinkParentIdMemo remembers the real LinkParentId of the selectedRow in order it later when loading open or edit modal
        cmsGuide.LinkParentIdMemo = cmsGuide.selectedItem.LinkParentId;
        if (node != null) { // Root is selected
            cmsGuide.selectedItem.LinkParentId = node.Id;
            cmsGuide.selectContent(node);
        }
        else {
            cmsGuide.selectRoots();
        }
    }

    //Show Content with Category Id
    cmsGuide.selectContent = function (node) {
        cmsGuide.busyIndicator.message = "در حال بارگذاری... " + node.Title;
        cmsGuide.busyIndicator.isActive = true;
        cmsGuide.gridOptions.advancedSearchData.engine.Filters = null;
        cmsGuide.gridOptions.advancedSearchData.engine.Filters = [];
        var s = {
            PropertyName: "LinkParentId",
            IntValue1: node.Id,
            SearchType: 0
        }
        cmsGuide.gridOptions.advancedSearchData.engine.Filters.push(s);
        ajax.call(cmsServerConfig.configApiServerPath+"CoreGuide/GetAll", cmsGuide.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsGuide.busyIndicator.isActive = false;
            cmsGuide.ListItems = response.ListItems;
            cmsGuide.gridOptions.fillData(cmsGuide.ListItems, response.resultAccess);
            cmsGuide.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsGuide.gridOptions.totalRowCount = response.TotalRowCount;
            cmsGuide.gridOptions.rowPerPage = response.RowPerPage;
            cmsGuide.gridOptions.maxSize = 5;

        }).error(function (data, errCode, c, d) {
            cmsGuide.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            cmsGuide.busyIndicator.isActive = false;
        });
    }
   cmsGuide.summernoteOptions = {
      height: 300,
      focus: true,
      airMode: false,
      toolbar: [
        ["edit", ["undo", "redo"]],
        ["headline", ["style"]],
        [
          "style",
          [
            "bold",
            "italic",
            "underline",
            "superscript",
            "subscript",
            "strikethrough",
            "clear"
          ]
        ],
        ["fontface", ["fontname"]],
        ["textsize", ["fontsize"]],
        ["fontclr", ["color"]],
        ["alignment", ["ul", "ol", "paragraph", "lineheight"]],
        ["height", ["height"]],
        ["table", ["table"]],
        ['insert',['ltr','rtl']],
        ["insert", ["link", "picture", "video", "hr"]],
        ["view", ["fullscreen", "codeview"]],
        ["help", ["help"]]
      ]
    };

    // Open Add New Content Modal
    cmsGuide.addRequested = false;
    cmsGuide.openAddContentModal = function () {
        cmsGuide.attachedFiles = [];
        cmsGuide.filePickerFiles.filename = "";
        cmsGuide.filePickerFiles.fileId = null;
        cmsGuide.modalTitle = 'اضافه';
        ajax.call(cmsServerConfig.configApiServerPath+'CoreGuide/getall', {}, 'POST').success(function (response) {
            // To define an array otherwise cmsGuide.selectedItem[thisTableFieldICollection] will be detected as an object
            cmsGuide.selectedItem[thisTableFieldICollection] = [];
            cmsGuide.ListParentItems = response.ListItems;
            cmsGuide.busyIndicator.isActive = false;
        });
        ajax.call(cmsServerConfig.configApiServerPath+'CoreGuide/GetViewModel', '', 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            cmsGuide.selectedItem = response.Item;
            if(cmsGuide.treeConfig !=null && cmsGuide.treeConfig != undefined && cmsGuide.treeConfig.currentNode !=null && cmsGuide.treeConfig.currentNode !=undefined)
            { 
                cmsGuide.selectedItem.LinkParentId=cmsGuide.treeConfig.currentNode.Id;
            }
            cmsGuide.selectedItem.isDependencyModule = false;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/CmsGuide/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    // Add a Content
    cmsGuide.addNewRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsGuide.busyIndicator.isActive = true;
      cmsGuide.selectedItem.LinkFileIds = "";
      cmsGuide.stringfyLinkFileIds();
        cmsGuide.addRequested = true;
        if (cmsGuide.selectedItem.isDependencyModule == false || cmsGuide.selectedItem.isDependencyModule == undefined)
            cmsGuide.selectedItem.LinkModuleId = null;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreGuide/add', cmsGuide.selectedItem, 'POST').success(function (response) {
            cmsGuide.busyIndicator.isActive = false;
            cmsGuide.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                cmsGuide.ListItems.push(response.Item);
                if (response.Item.LinkParentId == null) {
                    // Do nothing یک روت اضافه شده است
                }
                else
                {
                    for (var i = 0; i < cmsGuide.treeConfig.Items.length; i++) {
                        searchAndAddToTree(response.Item, cmsGuide.treeConfig.Items[i]);
                    }
                }
                cmsGuide.closeModal();
            }
         
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsGuide.addRequested = false;
            cmsGuide.busyIndicator.isActive = false;

        });
    }

    function searchTree(element, matchingId) {
        if (element.Id == matchingId) {
            return element;
        } else if (element.Children != undefined || element.Children != null) {
            var i;
            var result = null;
            for (i = 0; result == null && i < element.Children.length; i++) {
                result = searchTree(element.Children[i].Id, matchingId);
            }
            return result;
        }
        return null;
    }

    // Open Edit Content Modal
    cmsGuide.openEditContentModal = function () {
        if (buttonIsPressed) { return };
        cmsGuide.modalTitle = 'ویرایش';
        if (!cmsGuide.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        cmsGuide.CmsUserGroup_Id = [];
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'CoreGuide/GetOne', cmsGuide.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            buttonIsPressed = false;
            rashaErManage.checkAction(response);
            cmsGuide.selectedItem = response.Item;
     
            cmsGuide.parseFileIds(response.Item.LinkFileIds);
            cmsGuide.filePickerFiles.filename = null;
            cmsGuide.filePickerFiles.fileId = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleCore/CmsGuide/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    //Edit a Content
    cmsGuide.editRow = function (frm) {
        if (frm.$invalid)
            return;
        cmsGuide.addRequested = true;
      cmsGuide.selectedItem.LinkFileIds = "";
      cmsGuide.stringfyLinkFileIds();
        ajax.call(cmsServerConfig.configApiServerPath+'CoreGuide/edit', cmsGuide.selectedItem, 'PUT').success(function (response) {
            cmsGuide.addRequested = false;
            cmsGuide.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $.each(cmsGuide.ListItems, function (index, item) {
                    if (item.Id == response.Item.Id) {
                        var index = cmsGuide.ListItems.indexOf(item);
                        cmsGuide.ListItems[index] = response.Item;
                    }
                });
                for (var i = 0; i < cmsGuide.treeConfig.Items.length; i++) {
                    searchAndEditTreeItem(cmsGuide.selectedItem, cmsGuide.treeConfig.Items[i]);
                }
                cmsGuide.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            cmsGuide.addRequested = false;
        });
    }

    cmsGuide.closeModal = function () {
        $modalStack.dismissAll();
    };

    cmsGuide.replaceItem = function (oldId, newItem) {
        angular.forEach(cmsGuide.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = cmsGuide.ListItems.indexOf(item);
                cmsGuide.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            cmsGuide.ListItems.unshift(newItem);
    }

    // Delete a Content
    cmsGuide.deleteContent = function () {
        if (buttonIsPressed) { return };
        if (!cmsGuide.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(cmsGuide.gridOptions.selectedRow.item);
                cmsGuide.busyIndicator.isActive = true;
                buttonIsPressed = true;
                ajax.call(cmsServerConfig.configApiServerPath+'CoreGuide/GetOne', cmsGuide.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    buttonIsPressed = false;
                    rashaErManage.checkAction(response);
                    cmsGuide.selectedItemForDelete = response.Item;
                    console.log(cmsGuide.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'CoreGuide/delete', cmsGuide.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            cmsGuide.replaceItem(cmsGuide.selectedItemForDelete.Id);
                            cmsGuide.gridOptions.fillData(cmsGuide.ListItems);
                            if (cmsGuide.selectedItemForDelete.LinkParentId == null) {
                                var elementPos = cmsGuide.treeConfig.Items.map(function (x) { return x.Id; }).indexOf(cmsGuide.selectedItemForDelete.Id); // find the index of an item in an array
                                cmsGuide.treeConfig.Items.splice(elementPos, 1);
                            } else
                                for (var i = 0; i < cmsGuide.treeConfig.Items.length; i++) {
                                    searchAndDeleteFromTree(cmsGuide.selectedItemForDelete, cmsGuide.treeConfig.Items[i]);
                                }
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
                cmsGuide.busyIndicator.isActive = false;
            }
        });
    }

    cmsGuide.searchData = function () {
        cmsGuide.addRequested = true;
        cmsGuide.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"CoreGuide/getAll", cmsGuide.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            cmsGuide.responseListItems = response.ListItems;
            cmsGuide.gridOptions.fillData(cmsGuide.responseListItems);
            cmsGuide.gridOptions.currentPageNumber = response.CurrentPageNumber;
            cmsGuide.gridOptions.totalRowCount = response.TotalRowCount;
            cmsGuide.gridOptions.rowPerPage = response.RowPerPage;
            cmsGuide.gridOptions.maxSize = 5;
            cmsGuide.addRequested = false;
            cmsGuide.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            cmsGuide.gridOptions.fillData();
            console.log(data);
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Selector directive config
    cmsGuide.LinkParentIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkParentId',
        url: 'CmsGuide',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'CmsGuide',
        rowPerPage: 200,
        scope: cmsGuide,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true,type:'integer' },
                { name: 'Title', displayName: 'عنوان', sortable: true,type:'string' }
            ]
        }
    }

    cmsGuide.gridOptions.reGetAll = function () {
        if (cmsGuide.gridOptions.advancedSearchData.engine.Filters.length == 0)
            cmsGuide.init();
        else
            cmsGuide.searchData();
    }

    cmsGuide.gridOptions.onRowSelected = function () { }

    cmsGuide.columnCheckbox = false;

   

    cmsGuide.selectParents = function () {
        var length = cmsGuide.ListItems.length;
        var prenetListItems = [];
        for (var i = 0; i < length; i++) {
            if (cmsGuide.ListItems[i].LinkParentId == null || cmsGuide.ListItems[i].LinkParentId == undefined)
                prenetListItems.push(cmsGuide.ListItems[i]);
        }
        return prenetListItems;
    }

     // ----------- FilePicker Codes --------------------------------
    cmsGuide.addAttachedFile = function(id) {
      var fname = $("#file" + id).text();
      if (fname == "") {
        rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
        return;
      }
      if (
        id != null &&
        id != undefined &&
        !cmsGuide.alreadyExist(id, cmsGuide.attachedFiles)
      ) {
        var fId = id;
        var file = { fileId: fId, filename: fname };
        cmsGuide.attachedFiles.push(file);
        cmsGuide.clearfilePickers();
      }
    };

    cmsGuide.alreadyExist = function(fieldId, array) {
      for (var i = 0; i < array.length; i++) {
        if (fieldId == array[i].fileId) {
            rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
          cmsGuide.clearfilePickers();
          return true;
        }
      }
      return false;
    };

    cmsGuide.deleteAttachedfieldName = function(index) {
      ajax
        .call(
          cmsServerConfig.configApiServerPath+"CoreGuide/delete",
          cmsGuide.contractsList[index],
          "POST"
        )
        .success(function(res) {
          rashaErManage.checkAction(res);
          if (res.IsSuccess) {
            cmsGuide.contractsList.splice(index, 1);
            rashaErManage.showMessage($filter('translatentk')('Removed_Successfully'));
          }
        })
        .error(function(data2, errCode2, c2, d2) {
          rashaErManage.checkAction(data2);
        });
    };

    cmsGuide.parseFileIds = function(stringOfIds) {
    cmsGuide.attachedFiles = [];
      if (stringOfIds == null || !stringOfIds.trim()) return;
      var fileIds = stringOfIds.split(",");
      if (fileIds.length != undefined) {
        $.each(fileIds, function(index, item) {
          if (item == parseInt(item, 10)) {
            // Check if item is an integer
            ajax
              .call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", parseInt(item), "GET")
              .success(function(response) {
                if (response.IsSuccess) {
                  cmsGuide.attachedFiles.push({
                    fileId: response.Item.Id,
                    filename: response.Item.FileName
                  });
                }
              })
              .error(function(data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
              });
          }
        });
      }
    };

    cmsGuide.clearfilePickers = function() {
      cmsGuide.filePickerFiles.fileId = null;
      cmsGuide.filePickerFiles.filename = null;
    };

    cmsGuide.stringfyLinkFileIds = function() {
      $.each(cmsGuide.attachedFiles, function(i, item) {
        if (cmsGuide.selectedItem.LinkFileIds == "")
          cmsGuide.selectedItem.LinkFileIds = item.fileId;
        else
         cmsGuide.selectedItem.LinkFileIds += "," + item.fileId;
      });
    };
    //--------- End FilePickers Codes -------------------------
    cmsGuide.selectRoots = function () {
        cmsGuide.gridOptions.fillData(cmsGuide.ListParentItems, null);
    }

    //------------------------ Add, edit and delete an Item to and from Tree Menu -------------------------------
    function compare(a, b) {
        if (a.ShowInMenuOrder < b.ShowInMenuOrder)
            return -1;
        if (a.ShowInMenuOrder > b.ShowInMenuOrder)
            return 1;
        return 0;
    }

    function sortChildren(menuListItems) {
        for (var i = 0; i < menuListItems.length; i++) {
            menuListItems[i].Children.sort(compare);
        }
    }

    function searchAndDeleteFromTree(deletedItem, currentNode) {
        var i,
            currentChild,
            result;

        if (deletedItem.LinkParentId == currentNode.Id) {
            var elementPos = currentNode.Children.map(function (x) { return x.Id; }).indexOf(deletedItem.Id); // find the index of an item in an array
            if (elementPos > -1)
                currentNode.Children.splice(elementPos, 1);
            return true;
        } else {
            // Use a for loop instead of forEach to avoid nested functions
            // Otherwise "return" will not work properly
            if (currentNode.Children != undefined)
                for (i = 0; i < currentNode.Children.length; i += 1) {
                    currentChild = currentNode.Children[i];

                    // Search in the current child
                    result = searchAndDeleteFromTree(deletedItem, currentChild);

                    // Return the result if the node has been found
                    if (result !== false) {
                        return result;
                    }
                }
            // The node has not been found and we have no more options
            return false;
        }
    }

    function searchAndEditTreeItem(editedItem, currentNode) {
        var i,
            currentChild,
            result;

        if (editedItem.Id == currentNode.Id) {
            currentNode.Title = editedItem.Title;
            return true;
        } else {
            // Use a for loop instead of forEach to avoid nested functions
            // Otherwise "return" will not work properly
            if (currentNode.Children != undefined)
                for (i = 0; i < currentNode.Children.length; i += 1) {
                    currentChild = currentNode.Children[i];

                    // Search in the current child
                    result = searchAndEditTreeItem(editedItem, currentChild);

                    // Return the result if the node has been found
                    if (result !== false) {
                        return result;
                    }
                }
            // The node has not been found and we have no more options
            return false;
        }
    }

    function searchAndSwapTreeItem(selectedItem, currentNode, dir) {
        var i,
            currentChild,
            result;

        if (selectedItem.LinkParentId == currentNode.Id) {
            //currentNode.Title = selectedItem.Title;
            var elementPos = menuItemCtrl.treeConfig.currentNode.Children.map(function (x) { return x.Id; }).indexOf(item.Id); // find the index of an item in an array
            // Swap two items in the grid ListItems
            if (dir = "down")
                currentNode.Children[elementPos] = currentNode.Children.splice(elementPos + 1, 1, currentNode.Children[elementPos])[0];
            else
                menuItemCtrl.treeConfig.currentNode.Children[elementPos] = menuItemCtrl.treeConfig.currentNode.Children.splice(elementPos + 1, 1, menuItemCtrl.treeConfig.currentNode.Children[elementPos])[0];
            return true;
        } else {
            // Use a for loop instead of forEach to avoid nested functions
            // Otherwise "return" will not work properly
            if (currentNode.Children != undefined)
                for (i = 0; i < currentNode.Children.length; i += 1) {
                    currentChild = currentNode.Children[i];

                    // Search in the current child
                    result = searchAndSwapTreeItem(selectedItem, currentChild);

                    // Return the result if the node has been found
                    if (result !== false) {
                        return result;
                    }
                }
            // The node has not been found and we have no more options
            return false;
        }
    }

    function searchAndAddToTree(newItem, currentNode) {
        var i,
            currentChild,
            result;
        if (newItem.LinkParentId == currentNode.Id) {
            currentNode.Children.push(newItem);
            return true;
        } else {
            //Use a for loop instead of forEach to avoid nested functions
            //Otherwise "return" will not work properly
            if (currentNode.Children != undefined)
                for (i = 0; i < currentNode.Children.length; i += 1) {
                    currentChild = currentNode.Children[i];
                    //Search in the current child
                    result = searchAndAddToTree(newItem, currentChild);
                    //Return the result if the node has been found
                    if (result !== false) {
                        return result;
                    }
                }
            //The node has not been found and we have no more options
            return false;
        }
    }
    //--------

}]);