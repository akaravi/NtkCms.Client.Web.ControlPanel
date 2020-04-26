app.controller("taskscheduleTaskController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$builder', '$validator','$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $builder, $validator,$timeout, $window, $filter) {
    var task = this;
    task.schedueDetail={};
    task.SelectedschedueDetail={};
    task.busyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    task.busyIndicatorForDropDownProcess = {
        isActive: false,
        message: "در حال بارگذاری فعالیت ها ..."
    }

    task.busyIndicatorForDropDownProcessCustomize = {
        isActive: false,
        message: "در حال بارگذاری  ..."
    }
    var buttonIsPressed = false; // برای جلوگیری از فشرده شدن چندباره دکمه ها
    task.showonce = false;
    task.showWeekly = false;
    task.showmonthly = false;
    task.showmonthlyYear = false;
    task.showHourly=false;
    task.showDaily=false;
    //task.form = $builder.forms['default'];
    var date = moment().format();

    task.CronOnceDate = {
        defaultDate: date,
        setTime: function (date) { this.defaultDate = date; }
    }
    task.LockIdStartTime = {
        defaultDate: date,
        setTime: function (date) { this.defaultDate = date; }
    }
    task.LockIdExpireTime = {
        defaultDate: date,
        setTime: function (date) { this.defaultDate = date; }
    }
    task.cmsModulesProcessesListItems = [];
    task.cmsModulesProcessesCustomizeListItems = [];
    task.ProcessCategoryListItems = [];
    if (itemRecordStatus != undefined) task.itemRecordStatus = itemRecordStatus;

    //task.cmsProcessesListItems = [];
    task.cmsModuleProcess = {};
//#help/ سلکتور similar
    task.LinkSchedulesIdSelector = {
      displayMember: "Title",
      id: "Id",
      fId: "LinkSchedulesId",
      url: "TaskSchedulerSchedule",
      sortColumn: "Id",
      sortType: 1,
      filterText: "Title",
      showAddDialog: false,
      rowPerPage: 200,
      scope: task,
      columnOptions: {
        columns: [
          {
            name: "Id",
            displayName: "کد سیستمی",
            sortable: true,
            type: "integer"
          },
          {
            name: "Title",
            displayName: "عنوان",
            sortable: true,
            type: "string"
          }
        ]
      }
    };
    task.init = function () {
        task.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"TaskSchedulerTask/getAllActionType", {}, 'POST').success(function (response) {
            task.ActionType = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"TaskSchedulerSchedule/getAllScheduleCronType", {}, 'POST').success(function (response) {
            task.ScheduleCronType = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"TaskSchedulerSchedule/getAllDayOfWeek", {}, 'POST').success(function (response) {
            task.weekdays = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"TaskSchedulerTask/getall", task.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            task.ListItems = response.ListItems;
            task.busyIndicator.isActive = false;
            //cmsModuleSitegrd.gridOptions.resultAccess = response.resultAccess;//دسترسی ها نمایش
            task.gridOptions.fillData(task.ListItems, response.resultAccess); // دسترسی ها نمایش
            task.gridOptions.currentPageNumber = response.CurrentPageNumber;
            task.gridOptions.totalRowCount = response.TotalRowCount;
            task.gridOptions.rowPerPage = response.RowPerPage;
            task.gridOptions.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            task.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            task.busyIndicator.isActive = false;
        });

        // Get All CmsModules
        ajax.call(cmsServerConfig.configApiServerPath+"TaskSchedulerProcessCategory/getall", '', 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            task.ProcessCategoryListItems = response.ListItems;
            task.busyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            task.busyIndicator.isActive = false;
        });

        // Get ViewModel of CmsModuleProcess
        ajax.call(cmsServerConfig.configApiServerPath+'CoreModuleProcess/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            task.cmsModuleProcess = response.Item;

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Open Add Modal
    task.addRequested = false;
    task.openAddModal = function () {
        if (buttonIsPressed) return;
        task.modalTitle = 'اضافه';
        task.busyIndicator.isActive = true;

        
        // Clear previous values
        if (task.selectedItem)
            task.selectedItem.LinkProcessCategoryId = null;
        if (task.selectedItem)
            task.selectedItem.LinkModuleProcessId = null;
        task.cmsModulesProcessesListItems = null;
        task.cmsModulesProcessesListItems = [];
        task.cmsModulesProcessesCustomizeListItems = null;
        task.cmsModulesProcessesCustomizeListItems = [];
        task.valueSubmit = null;
        $builder.removeAllFormObject('default');   // Clear the form builder from previous values
        buttonIsPressed = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerTask/GetViewModel', "", 'GET').success(function (response) {
            buttonIsPressed = false;
            task.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            task.selectedItem = response.Item;

            task.selectedItem.TaskSchedulerProcessValues = [];
            task.selectedItem.TaskSchedulerSchedules = [];
            task.clearPreviousData();
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTaskScheduler/TaskSchedulerTask/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

/////////////////////////////////////////////////////////
task.AddProcessTask = function()
{
        $modal.open({
            templateUrl: 'cpanelv1/ModuleTaskScheduler/TaskSchedulerTask/addProcess.html',
            scope: $scope
        });
}

task.AddScheduleTask = function()
{
        $modal.open({
            templateUrl: 'cpanelv1/ModuleTaskScheduler/TaskSchedulerTask/addSchedule.html',
            scope: $scope
        });
}
//#help Process
    task.clearPreviousData = function() {
      task.selectedItem.TaskSchedulerProcessValues = [];
      $("#to").empty();
    };
 task.moveSelected = function(from, to, calculatePrice) {
      if (from == "Content") {
        //var title = task.ItemListIdSelector.selectedItem.Title;
        // var optionSelectedPrice = task.ItemListIdSelector.selectedItem.Price;
        
          for (var i = 0; i < task.selectedItem.TaskSchedulerProcessValues.length; i++) {
            if ( task.selectedItem.TaskSchedulerProcessValues[i].LinkTaskId == task.selectedItem.LinkProcessCategoryId && 
              task.selectedItem.TaskSchedulerProcessValues[i].LinkProcessId==task.selectedItem.LinkModuleProcessId && 
              task.selectedItem.TaskSchedulerProcessValues[i].JsonFormAdminSiteValues==task.selectedItem.ProcessCustomizationInputValue) {
              rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
              return;
            }
          
          // if (task.selectedItem.Title == null || task.selectedItem.Title.length < 0)
          //     task.selectedItem.Title = title;
         
        }
            task.selectedItem.ProcessCustomizationInputValue = $.trim(angular.toJson(task.valueSubmit));
            task.selectedItem.TaskSchedulerProcessValues.push({
            //Id: 0,
            //Source: from,
            LinkTaskId: task.selectedItem.LinkProcessCategoryId,
            LinkProcessId: task.selectedItem.LinkModuleProcessId,
            JsonFormAdminSiteValues:task.selectedItem.ProcessCustomizationInputValue
          });
      }
    };
   
task.moveSelectedAndEdit = function(from, to, calculatePrice) {
      if (from == "Content") {

            task.newProcess.JsonFormAdminSiteValues=$.trim(angular.toJson(task.valueSubmit));
            ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcessValue/edit', task.newProcess, "PUT").success(function (response1) {
                task.editProcessvalue = response1.Item.Id;
                $builder.removeAllFormObject('default');
               $scope.modalInstance.close();
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });

        }
    };
    task.removeFromCollectionValue = function(listprocess,iddestination,index) {

          for (var i = 0; i < task.selectedItem.TaskSchedulerProcessValues.length; i++) 
           {       
            if(listprocess[i].Id!=null)
            {
                if(listprocess[i].Id==iddestination)
                {
                    task.selectedItem.TaskSchedulerProcessValues.splice(i, 1);
                    return;
                }
            }
            else
            {
                task.selectedItem.TaskSchedulerProcessValues.splice(index, 1);
            }
          
          }
   
  
    };
  
   

    //#help
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////

//#help schedule
    task.clearPreviousData = function() {
      task.selectedItem.TaskSchedulerSchedules = [];
      $("#to").empty();
    };
 task.moveSelectedschedule = function(LinkSchedulesId) {

        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerSchedule/GetOne',LinkSchedulesId, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            for (var i = 0; i < task.selectedItem.TaskSchedulerSchedules.length; i++) {
                if (task.selectedItem.TaskSchedulerSchedules[i].Id==response.Item.Id) {
                  rashaErManage.showMessage($filter('translatentk')('content_is_duplicate'));
                  return;
                }
            }
            task.selectedItem.TaskSchedulerSchedules.push({
                Id:response.Item.Id,
                Title:response.Item.Title,
                Description:response.Item.Description
                //LinkTaskId:
            });            
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });

          
     
    };
   

    task.removeFromCollection = function(listschedule,iddestination) {
      for (var i = 0; i < task.selectedItem.TaskSchedulerSchedules.length; i++) 
       {       
            if(listschedule[i].Id==iddestination)
            {
                task.selectedItem.TaskSchedulerSchedules.splice(i, 1);
                return;
            }
          
      }
      
    };
  
   

    //#help
/////////////////////////////////////////////////////////
// Add New Row
    task.addNewRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        task.busyIndicator.isActive = true;
        task.addRequested = true;
        task.selectedItem.ProcessCustomizationInputValue = $.trim(angular.toJson(task.valueSubmit));
        
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerTask/add', task.selectedItem, 'POST').success(function (response) {
            task.addRequested = false;
            task.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                task.ListItems.unshift(response.Item);
                task.gridOptions.fillData(task.ListItems);
                task.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            task.busyIndicator.isActive = false;
            task.addRequested = false;
        });
    }

    // Open Edit Modal
    task.openEditModal = function () {
        task.modalTitle = 'ویرایش';

        if (!task.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        task.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerTask/GetOne', task.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            task.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            task.selectedItem = response.Item;
            task.selectedItem.LinkProcessCategoryId = null;
            task.selectedItem.LinkModuleProcessId = null;

            $builder.removeAllFormObject('default');   // فرم بیلدر را از مقادیر پیشین خالی می کند
    
            // Open the modal
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTaskScheduler/TaskSchedulerTask/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });

    }

    task.editRow = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        task.selectedItem.ProcessCustomizationInputValue = $.trim(angular.toJson(task.valueSubmit));
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerTask/edit', task.selectedItem, 'PUT').success(function (response) {
            task.addRequested = true;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                task.addRequested = false;
                task.replaceItem(task.selectedItem.Id, response.Item);
                task.gridOptions.fillData(task.ListItems);
                task.closeModal();
            }
            else {
                if (ErrorMessage = "x.LinkSiteId != userTicket.LinkSiteId" && response.SetAsPublic)
                    rashaErManage.showMessage("این فعالیت عمومی است، امکان ویرایش برای آن وجود ندارد");
            }

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            task.addRequested = false;
        });
    }

    task.closeModal = function () {
        $modalStack.dismissAll();
    };

    task.replaceItem = function (oldId, newItem) {
        angular.forEach(task.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = task.ListItems.indexOf(item);
                task.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            task.ListItems.unshift(newItem);
    }

    task.deleteRow = function () {
        if (!task.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        task.busyIndicator.isActive = true;
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(task.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerTask/GetOne', task.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    task.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerTask/delete', task.selectedItemForDelete, 'POST').success(function (res) {
                        task.busyIndicator.isActive = false;
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            task.replaceItem(task.selectedItemForDelete.Id);
                            task.gridOptions.fillData(task.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        task.busyIndicator.isActive = false;
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });
    }

    task.searchData = function () {
        task.gridOptions.serachData();
    }

    task.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string' },
            { name: "ActionKey", displayName: "لاگ ها", displayForce: true,template:
            '<Button ng-if="!x.IsActivated" ng-click="task.showTaskLog(x.Id)"  class="btn btn-primary" style="margin-left: 2px;"><i class="fa fa-plus-square-o" aria-hidden="true"></i></Button>'
            },
            { name: "ActionKey", displayName: "اجرا", sortable: true, displayForce: true, template: "<button class=\"btn btn-warning\"  ng-click=\"task.RunTaskNow(x.Id)\" title=\"تست اجرا\" type=\"button\"><i class=\"fa fa-paint-brush\" aria-hidden=\"true\"></i></button>" }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

 task.gridOptionsTaskLog = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'IsSuccess', displayName: 'IsSuccess', sortable: true, type: 'string' },
            { name: 'ErrorMessage', displayName: 'ErrorMessage', sortable: true, type: 'string' },
            { name: 'ErrorType', displayName: 'ErrorType', sortable: true, type: 'string' }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }
task.RunTaskNow=function(TaskId)
    {
        ajax.call(cmsServerConfig.configApiServerPath+"TaskSchedulerTask/RunNow", TaskId, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
           
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

 task.showTaskLog = function (LinkTaskId) {
        //task.contentBusyIndicator = true;
        var filterValue = {
            PropertyName: "LinkTaskId",
            IntValue1: parseInt(LinkTaskId),
            SearchType: 0
        }
        task.busyIndicatorForDropDownProcess = true;
        task.advancedSearchData.engine.Filters = null;
        task.advancedSearchData.engine.Filters = [];
        task.advancedSearchData.engine.Filters.push(filterValue);
        ajax.call(cmsServerConfig.configApiServerPath+"TaskSchedulerTaskLog/getall", task.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            task.ListItems = response.ListItems;
            task.gridOptionsTaskLog.fillData(task.ListItems, response.resultAccess); // Sending Access as an argument
            //task.contentBusyIndicator.isActive = false;
            task.gridOptionsTaskLog.currentPageNumber = response.CurrentPageNumber;
            task.gridOptionsTaskLog.totalRowCount = response.TotalRowCount;
            task.gridOptionsTaskLog.rowPerPage = response.RowPerPage;
            task.gridOptionsTaskLog.maxSize = 5;
        }).error(function (data, errCode, c, d) {
            task.gridOptionsTaskLog.fillData();
            rashaErManage.checkAction(data, errCode);
            task.contentBusyIndicator.isActive = false;
        });
    };
    task.advancedSearchData = {};
    task.advancedSearchData.engine = {};
    task.advancedSearchData.engine.CurrentPageNumber = 1;
    task.advancedSearchData.engine.SortColumn = "Id";
    task.advancedSearchData.engine.SortType = 0;
    task.advancedSearchData.engine.NeedToRunFakePagination = false;
    task.advancedSearchData.engine.TotalRowData = 2000;
    task.advancedSearchData.engine.RowPerPage = 20;
    task.advancedSearchData.engine.ContentFullSearch = null;
    task.advancedSearchData.engine.Filters = [];

    task.openDateExpireLockAccount = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            task.focusExpireLockAccount = true;
        });
    };

    task.gridOptions.reGetAll = function () {
        task.init();
    }

    task.gridOptions.onRowSelected = function () { }

    // On Module Change Event
    task.onModuleChange = function (moduleId) {
        //task.PageDependenciesListItems = [];
        var filterValue = {
            PropertyName: "LinkProcessCategoryId",
            IntValue1: parseInt(moduleId),
            SearchType: 0
        }
        task.busyIndicatorForDropDownProcess = true;
        task.advancedSearchData.engine.Filters = null;
        task.advancedSearchData.engine.Filters = [];
        task.advancedSearchData.engine.Filters.push(filterValue);
        task.advancedSearchData.engine.RowPerPage = 200;
        task.isLoading = true;                 // غیرفعال کردن منوی کشویی بعدی
        task.isWaiting = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/getall', task.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            task.cmsModulesProcessesListItems = response.ListItems;
            task.isLoading = false;          // فعال کردن منوی کشویی بعدی
            if (task.cmsModulesProcessesListItems.length == 0) {
                task.selectedItem.LinkModuleProcessId = null;
                task.cmsModulesProcessesCustomizeListItems = [];
                task.selectedItem.LinkModuleProcessCustomizeId = null;
                task.selectedItem.ProcessCustomizationInputValue = null;
                $("#cmsModuleProcesses_comboBox").prop("selectedIndex", -1);
                $("#cmsModuleProcessesCustomize_comboBox").prop("selectedIndex", -1);
            }
        }).error(function (data, errCode, c, d) {
            task.busyIndicator = false;
            rashaErManage.checkAction(data, errCode);
            task.busyIndicatorForDropDownProcess = false;
        });
    }

    // On ModuleProcess Change Event
    task.LoadUniversalMenuProcessOfModuleProcessCustomize = function (moduleProcessId) {

        // Clear the form in case there is no ModuleProcessCustomize
        $builder.removeAllFormObject('default');
        var filterValue = {
            PropertyName: "LinkModuleProcessId",
            IntValue1: parseInt(moduleProcessId),
            SearchType: 0
        }
        task.busyIndicatorForDropDownProcessCustomize = true;
        task.advancedSearchData.engine.Filters = null;
        task.advancedSearchData.engine.Filters = [];
        task.advancedSearchData.engine.Filters.push(filterValue);
        task.isWaiting = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/getall', task.advancedSearchData.engine, "POST").success(function (response) {
            task.isWaiting = false;
            rashaErManage.checkAction(response);
            task.cmsModulesProcessesCustomizeListItems = response.ListItems;
            task.busyIndicatorForDropDownProcessCustomize = false;

            if (task.cmsModulesProcessesCustomizeListItems.length == 0) {
                task.selectedItem.LinkModuleProcessCustomizeId = null;
                task.selectedItem.ProcessCustomizationInputValue = null;
                $("#cmsModuleProcessesCustomize_comboBox").prop("selectedIndex", -1);
            }

        }).error(function (data, errCode, c, d) {
            task.busyIndicator = false;
            rashaErManage.checkAction(data, errCode);
            task.busyIndicatorForDropDownProcessCustomize = false;
        });
    }

    task.gridOptions.reGetAll = function () {
        task.init();
    }

    // On ModuleProcessCustomize Change Event
    task.LoadProcessInputCustomizeValue = function (LinkModuleProcessCustomizeId) {
        $builder.removeAllFormObject('default');
        var length = task.cmsModulesProcessesCustomizeListItems.length;
        for (var i = 0; i < length; i++) {
            if (task.cmsModulesProcessesCustomizeListItems[i].Id == LinkModuleProcessCustomizeId) {
                var component = $.parseJSON(task.cmsModulesProcessesCustomizeListItems[i].ProcessInputValueForm);
                if (component != null && component.length != undefined)
                    $.each(component, function (i, item) {
                        $builder.addFormObject('default', item);
                    });
            }
        }
    }

    task.LoadUniversalMenuProcessOfModuleProcessCustomize = function (LinkProcessId) {
        $builder.removeAllFormObject('default');
        // Get Process
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/GetOne', LinkProcessId, "GET").success(function (response1) {
            task.selectedItem.LinkProcessId = response1.Item.Id;
            // Get CmsModuleProcess 
           
                            var length = task.cmsModulesProcessesListItems.length;
                            for (var j = 0; j < length; j++) {
                                if (task.cmsModulesProcessesListItems[j].Id == LinkProcessId) {
                                    var component = $.parseJSON(task.cmsModulesProcessesListItems[j].JsonFormAdminSiteJsonForm);
                                    if (component != null && component.length != undefined)
                                        $.each(component, function (i, item) {
                                            $builder.addFormObject('default', item);
                                        });
                               

                            // Set values
                            angular.forEach($.parseJSON(task.cmsModulesProcessesListItems[j].JsonFormAdminSiteValuesDefault), function (item, key) {
                                task.defaultValue[item.id] = item.value;
                            }); 
                            }
                            }
                            if (task.cmsModulesProcessesListItems.length == 0) {
                                task.selectedItem.LinkModuleProcessCustomizeId = null;
                                task.selectedItem.ProcessCustomizationInputValue = null;
                                $("#cmsModuleProcessesCustomize_comboBox").prop("selectedIndex", -1);
                            }
                    
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    task.valueSubmit = [];
    task.defaultValue = {};

    // Show InputValue form builder and auto scroll to its position
    task.openCustomizeInputValueModal = function (item) {

        task.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerTask/GetOne', item.Id, 'GET').success(function (response) {
            task.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            task.selectedItem = response.Item;
            //task.defaultValue = $.parseJSON(task.selectedItem.ProcessCustomizationInputValue);
            //$scope.defaultValue = $.parseJSON(task.selectedItem.ProcessCustomizationInputValue);

            // Set values
            angular.forEach($.parseJSON(task.selectedItem.ProcessCustomizationInputValue), function (item, key) {
                task.defaultValue[item.id] = item.value;
            });

            $builder.removeAllFormObject('default');

            var length = task.cmsModulesProcessesCustomizeListItems.length;
            for (var i = 0; i < length; i++) {
                if (task.cmsModulesProcessesCustomizeListItems[i].Id == item.LinkModuleProcessCustomizeId) {
                    var component = $.parseJSON(task.cmsModulesProcessesCustomizeListItems[i].ProcessInputValueForm);
                    if (component != null && component.length != undefined)
                        $.each(component, function (i, item) {
                            $builder.addFormObject('default', item);
                        });
                }
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    // Show Preview form
    task.showSubmitValueForm = function () {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleTaskScheduler/TaskSchedulerTask/submitValueForm.html',
            scope: $scope
        });
    }

    task.submitValues = function (item) {
        task.busyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerTask/GetOne', task.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            task.busyIndicator.isActive = false;
            rashaErManage.checkAction(response);
            task.selectedItem = response.Item;
            task.selectedItem.LinkProcessCategoryId = null;
            task.selectedItem.LinkModuleProcessId = null;
            task.selectedItem.ProcessCustomizationInputValue = $.trim(angular.toJson(task.valueSubmit));
            ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerTask/', task.selectedItem, 'PUT').success(function (response) {
                task.addRequested = true;
                rashaErManage.checkAction(response);
                if (response.IsSuccess) {
                    task.addRequested = false;
                    task.replaceItem(task.selectedItem.Id, response.Item);
                    task.gridOptions.fillData(task.ListItems);
                    task.closeModal();
                }

            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
                task.addRequested = false;
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });

        $("#inputValue_form").css("display", "none");
        $('html, body').animate({
            scrollTop: $("#inputValue_form").offset().top
        }, 850);
    }
    ///////////////////////
    task.columnCheckbox = false;
    task.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (task.gridOptions.columnCheckbox) {
            for (var i = 0; i < task.gridOptions.columns.length; i++) {
                //task.gridOptions.columns[i].visible = $("#" + task.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + task.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                //var temp = element[0].checked;
                task.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = task.gridOptions.columns;
            for (var i = 0; i < task.gridOptions.columns.length; i++) {
                task.gridOptions.columns[i].visible = true;
                var element = $("#" + task.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + task.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < task.gridOptions.columns.length; i++) {
            console.log(task.gridOptions.columns[i].name.concat(".visible: "), task.gridOptions.columns[i].visible);
        }
        task.gridOptions.columnCheckbox = !task.gridOptions.columnCheckbox;
    }

    task.EditFromCollection = function(process) {
        //menuItemCtrl.selectedProcessIndex = index;
        task.newProcess = process;
        loadselectedProcess(process);
        //task.LoadUniversalMenuProcessOfModuleProcessCustomize(y);
    };
function loadselectedProcess(process) {
        $builder.removeAllFormObject('default');
        task.newProcess = process;
        // Load CmsModuleProcess ------------------------------


                var filterValue = {
                    PropertyName: "LinkProcessId",
                    IntValue1: parseInt(task.newProcess.LinkProcessId),
                    SearchType: 0
                }

                engine = {};
                engine.Filters = [];
                engine.RowPerPage = 100;
                engine.Filters.push(filterValue);

                //task.loadingCmsModuleProcessCustomize = true;
                ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerProcess/GetOne', task.newProcess.LinkProcessId, "GET").success(function (response) {
                    //task.loadingCmsModuleProcessCustomize = false;
                    rashaErManage.checkAction(response);
                    task.cmsModulesProcessesCustomizeListItems = response.Item;

                            // Fetch component for formBuilder from CmsModuleProcessCustomize
                            var component = $.parseJSON(task.cmsModulesProcessesCustomizeListItems.JsonFormAdminSiteJsonForm);
                            // Load and set the values from ProcessesJson.newProcess.ProcessCustomizationInputValue
                            try {
                                var values = $.parseJSON(task.newProcess.JsonFormAdminSiteValues);
                            } catch (e) {
                                console.log(e);
                                var values = [];
                            }
                            if (component != null && component.length != undefined)
                                $.each(component, function (i, item) {
                                    $builder.addFormObject('default', item);

                                    if (values != null && values.length != undefined)
                                        $.each(values, function (iValue, itemValue) {
                                            if (item.fieldname == itemValue.fieldname) {
                                                $builder.forms.default[i].id = i;
                                                task.defaultValue[i] = itemValue.value;
                                            }
                                        });
                                });

                        
                         
                    
                }).error(function (data, errCode, c, d) {
                    task.busyIndicator = false;
                    rashaErManage.checkAction(data, errCode);
                });
       $scope.modalInstance =  $modal.open({
            templateUrl: 'cpanelv1/ModuleTaskScheduler/TaskSchedulerTask/editProcess.html',
            scope: $scope
        });
    }
//////////////////////////////////////////////////////////////////////////////////////////
//#help اضافه کردن مقادیر زمانبندی برای تسک ها
 task.AddSchedule = function (schedueDetail) {
        switch (schedueDetail.ScheduleCronType) {
            case "5":
                if(task.SelectedschedueDetail.CronMonthlyDay>31 || task.SelectedschedueDetail.CronMonthlyDay<1)
                {
                    rashaErManage.showMessage("روز نامعتبر است");
                    return;
                }
                break;
            case "6":
               if((task.SelectedschedueDetail.CronYearlyMonth>12 || task.SelectedschedueDetail.CronYearlyMonth<1) || (task.SelectedschedueDetail.CronYearlyDay>31 || task.SelectedschedueDetail.CronYearlyDay<1))
                {
                    rashaErManage.showMessage("روز یا ماه نامعتبر است");
                    return;
                }
                break;
           }
        task.schedueDetail=task.SelectedschedueDetail;
        task.schedueDetail.ScheduleUsageType=1;
        task.selectedItem.TaskSchedulerSchedules.push({
        Title:task.SelectedschedueDetail.Title,
        Description:task.SelectedschedueDetail.Description,
        LiveTime:task.SelectedschedueDetail.LiveTime,
        ScheduleUsageType:task.SelectedschedueDetail.ScheduleUsageType,  
        ScheduleCronType:task.SelectedschedueDetail.ScheduleCronType, 
        IntervalSeconds:task.SelectedschedueDetail.IntervalSeconds,
        Frequency:task.SelectedschedueDetail.Frequency,
        FrequencyCounter:task.SelectedschedueDetail.FrequencyCounter,
        CronOnceDate:task.SelectedschedueDetail.CronOnceDate,
        CronHourlyMinute:task.SelectedschedueDetail.CronHourlyMinute,
        CronDailyHour:task.SelectedschedueDetail.CronDailyHour,
        CronDailyMinute:task.SelectedschedueDetail.CronDailyMinute,
        CronMonthlyDay:task.SelectedschedueDetail.CronMonthlyDay,
        CronMonthlyHour:task.SelectedschedueDetail.CronMonthlyHour,
        CronMonthlyMinute:task.SelectedschedueDetail.CronMonthlyMinute,
        CronWeeklyDayOfWeek:task.SelectedschedueDetail.CronWeeklyDayOfWeek,
        CronWeeklyHour:task.SelectedschedueDetail.CronWeeklyHour,
        CronWeeklyMinute:task.SelectedschedueDetail.CronWeeklyMinute,
        CronYearlyMonth:task.SelectedschedueDetail.CronYearlyMonth,
        CronYearlyDay:task.SelectedschedueDetail.CronYearlyDay,
        CronYearlyHour:task.SelectedschedueDetail.CronYearlyHour,
        CronYearlyMinute:task.SelectedschedueDetail.CronYearlyMinute   
        });
//#help خالی کردن فیلدهای مورد نیاز زمانبندی 
        task.SelectedschedueDetail.Title="";
        task.SelectedschedueDetail.Description="";
        task.SelectedschedueDetail.LiveTime="";
        task.SelectedschedueDetail.CronWeeklyDayOfWeek="";
        task.SelectedschedueDetail.CronMonthlyDay="";
        task.SelectedschedueDetail.LiveTime="";
        task.SelectedschedueDetail.ScheduleUsageType=""; 
        task.SelectedschedueDetail.ScheduleCronType="";  
        task.SelectedschedueDetail.IntervalSeconds=0;    
        task.SelectedschedueDetail.Frequency=0;          
        task.SelectedschedueDetail.FrequencyCounter=0;   
        task.SelectedschedueDetail.CronOnceDate=""       
        task.SelectedschedueDetail.CronHourlyMinute=0;   
        task.SelectedschedueDetail.CronDailyHour=0;      
        task.SelectedschedueDetail.CronDailyMinute=0;    
        task.SelectedschedueDetail.CronMonthlyDay=0;     
        task.SelectedschedueDetail.CronMonthlyHour=0;    
        task.SelectedschedueDetail.CronMonthlyMinute=0;  
        task.SelectedschedueDetail.CronWeeklyDayOfWeek=0;
        task.SelectedschedueDetail.CronWeeklyHour=0;     
        task.SelectedschedueDetail.CronWeeklyMinute=0;   
        task.SelectedschedueDetail.CronYearlyMonth=0;    
        task.SelectedschedueDetail.CronYearlyDay=0;     
        task.SelectedschedueDetail.CronYearlyHour=0;     
        task.SelectedschedueDetail.CronYearlyMinute=0;   
}

//# help تابعی برای نمایش و عدم نمایش فیلدهای زمانبندی نسبت به نوع زمانبندی
    task.onScheduleTypeChange = function (scheduleType) {
        switch (scheduleType) {
            case "1":
                task.showWeekly = false;
                task.showmonthly = false;
                task.showonce = true;
                task.showmonthlyYear = false;
                task.showHourly=false;
                task.showDaily=false;
                break;
            case "2":
                task.showWeekly = false;
                task.showmonthly = false;
                task.showonce = false;
                task.showmonthlyYear = false;
                task.showHourly=true;
                task.showDaily=false;
                break;
            case "3":
                task.showmonthly = false;
                task.showonce = false;
                task.showWeekly = false;
                task.showmonthlyYear = false;
                task.showHourly=false;
                task.showDaily=true;
                break;
            case "4":
                task.showmonthly = false;
                task.showonce = false;
                task.showWeekly = true;
                task.showmonthlyYear = false;
                task.showHourly=false;
                task.showDaily=false;
                break;
            case "5":
                task.showmonthly = true;
                task.showonce = false;
                task.showWeekly = false;
                task.showmonthlyYear = false;
                task.showHourly=false;
                task.showDaily=false;
                break;
            case "6":
                task.showonce = false;
                task.showWeekly = false;
                task.showmonthly = false;
                task.showmonthlyYear = true;
                task.showHourly=false;
                task.showDaily=false;
                break;
        }
    };
//#help حذف زمانبندی ها بر اساس ردیف یا آیدی 
    task.removeFromCollectionSchedule = function(listTaskScheduler,iddestination,index) {
        for (var i = 0; i < task.selectedItem.TaskSchedulerSchedules.length; i++) 
                   {       
                    if(listTaskScheduler[i].Id!=null)
                    {
                        if(listTaskScheduler[i].Id==iddestination)
                        {
                            task.selectedItem.TaskSchedulerSchedules.splice(i, 1);
                            return;
                        }
                    }
                    else
                    {
                        task.selectedItem.TaskSchedulerSchedules.splice(index, 1);
                    }
          
                  }
          };
//////////////////////////////////////////////////////////////////////////////////////////
    //Export Report 
    task.exportFile = function () {
        task.addRequested = true;
        task.gridOptions.advancedSearchData.engine.ExportFile = task.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'TaskSchedulerTask/exportfile', task.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            task.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                task.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //task.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    task.toggleExportForm = function () {
        task.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        task.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        task.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        task.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        $modal.open({
            templateUrl: 'cpanelv1/ModuleTaskScheduler/TaskSchedulerTask/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    task.rowCountChanged = function () {
        if (!angular.isDefined(task.ExportFileClass.RowCount) || task.ExportFileClass.RowCount > 5000)
            task.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    task.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"TaskSchedulerTask/count", task.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            task.addRequested = false;
            rashaErManage.checkAction(response);
            task.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            task.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);