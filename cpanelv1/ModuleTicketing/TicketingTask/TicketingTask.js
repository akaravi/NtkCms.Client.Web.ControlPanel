app.controller("ticketingTaskController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window','$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window,$stateParams, $filter) {
    var ticketingTask = this;
    ticketingTask.attachedFiles = [];
    ticketingTask.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    ticketingTask.selectedTicketUnread = {
        Unread: $stateParams.Unreadticket
    };
    var date = moment().format();
    // ticketingTask.startDate = {
    //     defaultDate: date
    // }
    // ticketingTask.endDate = {
    //     defaultDate: date
    // }
    ticketingTask.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    };

    ticketingTask.showAnswersGrid = false;

    ticketingTask.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'سؤال', sortable: true, type: 'string' },
            { name: 'virtual_TicketingDepartemen.Title', displayName: 'بخش', sortable: true, type: 'integer', displayForce: true },
            { name: 'CreatedDate', displayName: 'تاریخ ثبت', sortable: true, isDate: true, type: 'date' },
            { name: 'LinkUserId', displayName: 'کد سیستمی کاربر', sortable: true, type: 'string' },
            { name: 'TicketStatus', displayName: 'وضعیت', sortable: true, type: 'string', template: '<a title="خوانده نشده"><i ng-if="x.TicketStatus == 1" class="fa fa-envelope-o" aria-hidden="true"></i></a><a title="خوانده شده"><i ng-if="x.TicketStatus == 0" class="fa fa-envelope-open-o" aria-hidden="true"></i></a>' },
            { name: 'IsAssigned', displayName: 'اختصاص یافته است؟', sortable: true, isCheckBox: true, type: 'boolean' },
            { name: 'LinkOperatorId', displayName: 'کد سیستمی اپراتور', sortable: true, type: 'integer' }
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
                RowPerPage: 100,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }

    ticketingTask.answersGridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'LinkTicketId', displayName: 'کد سیستمی تیکت', sortable: true, type: 'string' },
            { name: 'ticketing.Title', displayName: 'عنوان تیکت', sortable: true, type: 'integer', displayForce: true },
            { name: 'CreatedDate', displayName: 'تاریخ ثبت', sortable: true, isDate: true, type: 'string', displayForce: true },
            { name: 'HtmlBody', displayName: 'پاسخ', sortable: true, type: 'string' }
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
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }

    ticketingTask.summernoteOptions = {
        height: 300,
        focus: true,
        airMode: false,
        toolbar: [
                ['edit', ['undo', 'redo']],
                ['headline', ['style']],
                ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
                ['fontface', ['fontname']],
                ['textsize', ['fontsize']],
                ['fontclr', ['color']],
                ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
                ['height', ['height']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video', 'hr']],
                ['view', ['fullscreen', 'codeview']],
                ['help', ['help']]
        ]
    };
    ticketingTask.init = function () {
        ticketingTask.busyIndicator.isActive = true;
         if (ticketingTask.selectedTicketUnread.Unread == true) {
            ticketingTask.gridOptions.advancedSearchData.engine = {
                Filters: [{
                        PropertyName: "TicketStatus",
                        EnumValue1: "Unread",
                        SearchType: 0,
                }]
            };
        }
        ajax.call(cmsServerConfig.configApiServerPath+"TicketingTask/getall", ticketingTask.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            ticketingTask.busyIndicator.isActive = false;
            ticketingTask.ListItems = response.ListItems;
            ticketingTask.gridOptions.fillData(ticketingTask.ListItems, response.resultAccess);
            ticketingTask.gridOptions.currentPageNumber = response.CurrentPageNumber;
            ticketingTask.gridOptions.totalRowCount = response.TotalRowCount;
            ticketingTask.gridOptions.rowPerPage = response.RowPerPage;
            ticketingTask.gridOptions.maxSize = 5;
            ticketingTask.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            ticketingTask.busyIndicator.isActive = false;
        });
    }

    ticketingTask.addNewModel = function () {
        ticketingTask.modalTitle = 'اضافه';
        ticketingTask.filePickerFiles.filename = "";
        ticketingTask.filePickerFiles.fileId = null;
        ajax.call(cmsServerConfig.configApiServerPath+'TicketingTask/GetViewModel', "", 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            console.log(response);
            ticketingTask.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/TicketingTask/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    ticketingTask.openEditModal = function (s) {
        if (!ticketingTask.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک ردیف جهت مشاهده انتخاب کنید");
            return;
        }
        ticketingTask.modalTitle = 'مشاهده تیکت';
        ajax.call(cmsServerConfig.configApiServerPath+'TicketingTask/GetOne', ticketingTask.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            ticketingTask.selectedItem = response.Item;
            ticketingTask.parseFileIds(response.Item.LinkFileIds);
            ticketingTask.filePickerFiles.filename = null;
            ticketingTask.filePickerFiles.fileId = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/TicketingTask/edit.html',
                scope: $scope
            });
            //Set Ticket from Unread to Read
            ajax.call(cmsServerConfig.configApiServerPath+'TicketingTask/isRead', ticketingTask.selectedItem, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    ticketingTask.openEditAnswerModal = function () {
        if (!ticketingTask.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ticketingTask.modalTitle = 'ویرایش';
        ajax.call(cmsServerConfig.configApiServerPath+'TicketingAnswer/GetOne', ticketingTask.answersGridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketingTask.selectedItem = response.Item;
                ticketingTask.parseFileIds(response.Item.LinkFileIds);
                ticketingTask.filePickerFiles.filename = null;
                ticketingTask.filePickerFiles.fileId = null;
                ajax.call(cmsServerConfig.configApiServerPath+'TicketingTask/GetOne', response.Item.LinkTicketId, 'GET').success(function (responseTask) {
                    rashaErManage.checkAction(responseTask);
                    if (responseTask.IsSuccess) {
                        ticketingTask.selectedItem.virtual_ticketing=responseTask.Item;
                   
                    $modal.open({
                        templateUrl: 'cpanelv1/ModuleTicketing/TicketingTask/editAnswer.html',
                        scope: $scope
                    });
                     }
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });


             }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    ticketingTask.addNew = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ticketingTask.selectedItem.LinkCmsPageId = 1;
        ticketingTask.selectedItem.LinkFileIds = "";
        ticketingTask.stringfyLinkFileIds();
        console.log((ticketingTask.selectedItem));
        ticketingTask.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TicketingTask/add', ticketingTask.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            //console.log(response);
            if (response.IsSuccess) {
                ticketingTask.ListItems.unshift(response.Item);
                ticketingTask.gridOptions.fillData(ticketingTask.ListItems);
                ticketingTask.closeModal();
            }
            ticketingTask.addRequested = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            rashaErManage.checkAction(data, errCode);
            ticketingTask.addRequested = false;
        });
    }

    ticketingTask.editAnswer = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ticketingTask.addRequested = true;
        ticketingTask.selectedItem.LinkFileIds = "";
        ticketingTask.stringfyLinkFileIds();
        ajax.call(cmsServerConfig.configApiServerPath+'TicketingAnswer/edit', ticketingTask.selectedItem, 'PUT').success(function (response) {
            ticketingTask.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketingTask.replaceItem(ticketingTask.answersListItems, ticketingTask.selectedItem.Id, response.Item);
                ticketingTask.answersGridOptions.fillData(ticketingTask.answersListItems);
                ticketingTask.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            ticketingTask.addRequested = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    ticketingTask.delete = function () {
        if (!ticketingTask.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(ticketingTask.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'TicketingTask/GetOne', ticketingTask.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    ticketingTask.selectedItemForDelete = response.Item;
                    ajax.call(cmsServerConfig.configApiServerPath+'TicketingTask/delete', ticketingTask.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            ticketingTask.replaceItem(ticketingTask.ListItems,ticketingTask.selectedItemForDelete.Id);
                            ticketingTask.gridOptions.fillData(ticketingTask.ListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });
    }

    ticketingTask.deleteAnswer = function () {
        if (!ticketingTask.answersGridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک پاسخ جهت حذف انتخاب کنید");
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(ticketingTask.answersGridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'TicketingAnswer/GetOne', ticketingTask.answersGridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    ticketingTask.selectedItemForDelete = response.Item;
                    console.log(ticketingTask.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'TicketingAnswer/delete', ticketingTask.selectedItemForDelete, 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            ticketingTask.replaceItem(ticketingTask.answersListItems, ticketingTask.selectedItemForDelete.Id);
                            ticketingTask.answersGridOptions.fillData(ticketingTask.answersListItems);
                        }
                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });
    }

    ticketingTask.replaceItem = function (arr,oldId, newItem) {
        angular.forEach(arr, function (item, key) {
            if (item.Id == oldId) {
                var index = arr.indexOf(item);
                arr.splice(index, 1);
            }
        });
        if (newItem)
            arr.unshift(newItem);
    }

    ticketingTask.closeModal = function () {
        $modalStack.dismissAll();
    }

    ticketingTask.gridOptions.reGetAll = function () {
        ticketingTask.init();
    }

    ticketingTask.gridOptions.onRowSelected = function () {
        var item = ticketingTask.gridOptions.selectedRow.item;
        ticketingTask.showAnswers(item);
    }
    
    ticketingTask.showAnswers = function (item) {
        if (item) {
            //var id = ticketingTask.gridOptions.selectedRow.item.Id;
            ticketingTask.answersbusyIndicator = true;
            var Filter_value = {
                PropertyName: "LinkTicketId",
                IntValue1: item.Id,
                SearchType: 0
            }
            ticketingTask.answersGridOptions.advancedSearchData.engine.Filters = [];
            ticketingTask.answersGridOptions.advancedSearchData.engine.Filters.push(Filter_value);
            ajax.call(cmsServerConfig.configApiServerPath+'TicketingAnswer/getall', ticketingTask.answersGridOptions.advancedSearchData.engine, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                ticketingTask.busyIndicator.isActive = false;
                ticketingTask.answersListItems = response.ListItems;
                if (response.ListItems.length < 1)
                    ticketingTask.answersListItems.push({ Id: 0, LinkTicketId: 0, HtmlBody: "هیچ پاسخی وجود ندارد!" });
                ticketingTask.answersGridOptions.fillData(ticketingTask.answersListItems, response.resultAccess);
                ticketingTask.answersGridOptions.currentPageNumber = response.CurrentPageNumber;
                ticketingTask.answersGridOptions.totalRowCount = response.TotalRowCount;
                ticketingTask.answersGridOptions.RowPerPage = response.RowPerPage;
                ticketingTask.gridOptions.maxSize = 5;
                ticketingTask.allowedSearch = response.AllowedSearchField;
                ticketingTask.showAnswersGrid = true;
            }).error(function (data) {
                rashaErManage.checkAction(data, errCode);
            });
        }
    }

    ticketingTask.columnCheckbox = false;

    ticketingTask.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (ticketingTask.gridOptions.columnCheckbox) {
            for (var i = 0; i < ticketingTask.gridOptions.columns.length; i++) {
                var element = $("#" + ticketingTask.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                ticketingTask.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = ticketingTask.gridOptions.columns;
            for (var i = 0; i < ticketingTask.gridOptions.columns.length; i++) {
                ticketingTask.gridOptions.columns[i].visible = true;
                var element = $("#" + ticketingTask.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + ticketingTask.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < ticketingTask.gridOptions.columns.length; i++) {
            console.log(ticketingTask.gridOptions.columns[i].name.concat(".visible: "), ticketingTask.gridOptions.columns[i].visible);
        }
        ticketingTask.gridOptions.columnCheckbox = !ticketingTask.gridOptions.columnCheckbox;
    }

    ticketingTask.openAddAnswerModal = function () {
        if (!ticketingTask.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک سؤال انتخاب کنید!");
            return;
        }
        ticketingTask.modalTitle = 'پاسخ';
        ticketingTask.attachedFiles = [];
        ticketingTask.attachedFile = "";
        ticketingTask.filePickerFiles.filename = "";
        ticketingTask.filePickerFiles.fileId = null;
        ajax.call(cmsServerConfig.configApiServerPath+'TicketingAnswer/GetViewModel', "", 'GET').success(function (response) {
            //rashaErManage.checkAction(response);
            console.log(response);
            ticketingTask.selectedItem = response.Item;
            //ticketingTask.selectedItem.LinkTicketId = ticketingTask.gridOptions.selectedRow.item.Id;
            //ticketingTask.selectedItem.Ticket = { Title: ticketingTask.gridOptions.selectedRow.item.Title, HtmlBody: ticketingTask.gridOptions.selectedRow.item.HtmlBody };
            ticketingTask.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/TicketingTask/addAnswer.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    ticketingTask.addNewAnswer = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ticketingTask.addRequested = true;
        ticketingTask.busyIndicator.isActive = true;
        ticketingTask.selectedItem.LinkFileIds = "";
        ticketingTask.stringfyLinkFileIds();
        ticketingTask.selectedItem.LinkTicketId    =ticketingTask.gridOptions.selectedRow.item.Id;
        ajax.call(cmsServerConfig.configApiServerPath+'TicketingAnswer/add', ticketingTask.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketingTask.answersListItems.unshift(response.Item);
                ticketingTask.answersGridOptions.fillData(ticketingTask.answersListItems);
                ticketingTask.showAnswersGrid = true;
            }
            ticketingTask.addRequested = false;
            ticketingTask.busyIndicator.isActive = false;
            ticketingTask.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            ticketingTask.addRequested = false;
        });
    }
    ticketingTask.columnCheckbox = false;
    ticketingTask.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = ticketingTask.gridOptions.columns;
        if (ticketingTask.gridOptions.columnCheckbox) {
            for (var i = 0; i < ticketingTask.gridOptions.columns.length; i++) {
                //ticketingTask.gridOptions.columns[i].visible = $("#" + ticketingTask.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + ticketingTask.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                ticketingTask.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < ticketingTask.gridOptions.columns.length; i++) {
                var element = $("#" + ticketingTask.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + ticketingTask.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < ticketingTask.gridOptions.columns.length; i++) {
            console.log(ticketingTask.gridOptions.columns[i].name.concat(".visible: "), ticketingTask.gridOptions.columns[i].visible);
        }
        ticketingTask.gridOptions.columnCheckbox = !ticketingTask.gridOptions.columnCheckbox;
    }

    ticketingTask.filePickerFiles.removeSelectedfile = function (config) {
        ticketingTask.filePickerFiles.fileId = null;
        ticketingTask.filePickerFiles.filename = null;
        ticketingTask.selectedItem.LinkFileIds = null;
    }
    ticketingTask.clearfilePickers = function () {
        ticketingTask.filePickerFiles.fileId = null;
        ticketingTask.filePickerFiles.filename = null;
    }

    ticketingTask.stringfyLinkFileIds = function () {
        $.each(ticketingTask.attachedFiles, function (i, item) {
            if (ticketingTask.selectedItem.LinkFileIds == "")
                ticketingTask.selectedItem.LinkFileIds = item.fileId;
            else
                ticketingTask.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    ticketingTask.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }
    ticketingTask.deleteAttachedFile = function (index) {
        ticketingTask.attachedFiles.splice(index, 1);
    }
    // ----------- FilePicker Codes --------------------------------
    ticketingTask.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        ticketingTask.attachedFiles = [];
        if (fname == "") {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !ticketingTask.alreadyExist(id, ticketingTask.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            ticketingTask.attachedFiles.push(file);
            ticketingTask.clearfilePickers();
        }
    }

    ticketingTask.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translatentk')('This_Item_Has_Already_Been_Added'));
                ticketingTask.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    ticketingTask.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(cmsServerConfig.configApiServerPath+'FileContent/GetOne', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            ticketingTask.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    ticketingTask.clearfilePickers = function () {
        ticketingTask.filePickerFiles.fileId = null;
        ticketingTask.filePickerFiles.filename = null;
    }

    ticketingTask.stringfyLinkFileIds = function () {
        $.each(ticketingTask.attachedFiles, function (i, item) {
            if (ticketingTask.selectedItem.LinkFileIds == "")
                ticketingTask.selectedItem.LinkFileIds = item.fileId;
            else
                ticketingTask.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


  
    // File Manager actions
    ticketingTask.replaceFile = function (name) {
        ticketingTask.itemClicked(null, ticketingTask.fileIdToDelete, "file");
        ticketingTask.fileTypes = 1;
        ticketingTask.fileIdToDelete = ticketingTask.selectedIndex;

        // Delete the file
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", ticketingTask.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(cmsServerConfig.configApiServerPath+'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                    ticketingTask.remove(ticketingTask.FileList, ticketingTask.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetViewModel", "", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                ticketingTask.FileItem = response3.Item;
                                ticketingTask.FileItem.FileName = name;
                                ticketingTask.FileItem.Extension = name.split('.').pop();
                                ticketingTask.FileItem.FileSrc = name;
                                ticketingTask.FileItem.LinkCategoryId = ticketingTask.thisCategory;
                                ticketingTask.saveNewFile();
                            }
                            else {
                                console.log("getting the model was not successfully returned!");
                            }
                        }).error(function (data) {
                            console.log(data);
                        });
                    }
                    else {
                        console.log("Request to api/CmsFileContent/delete was not successfully returned!");
                    }
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }
        }).error(function (data) {
            console.log(data);
        });
    }
    //save new file
    ticketingTask.saveNewFile = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/add", ticketingTask.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                ticketingTask.FileItem = response.Item;
                ticketingTask.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            ticketingTask.showErrorIcon();
            return -1;
        });
    }

    ticketingTask.showSuccessIcon = function () {
    }

    ticketingTask.showErrorIcon = function () {

    }
    //file is exist
    ticketingTask.fileIsExist = function (fileName) {
        for (var i = 0; i < ticketingTask.FileList.length; i++) {
            if (ticketingTask.FileList[i].FileName == fileName) {
                ticketingTask.fileIdToDelete = ticketingTask.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    ticketingTask.getFileItem = function (id) {
        for (var i = 0; i < ticketingTask.FileList.length; i++) {
            if (ticketingTask.FileList[i].Id == id) {
                return ticketingTask.FileList[i];
            }
        }
    }

    //select file or folder
    ticketingTask.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            ticketingTask.fileTypes = 1;
            ticketingTask.selectedFileId = ticketingTask.getFileItem(index).Id;
            ticketingTask.selectedFileName = ticketingTask.getFileItem(index).FileName;
        }
        else {
            ticketingTask.fileTypes = 2;
            ticketingTask.selectedCategoryId = ticketingTask.getCategoryName(index).Id;
            ticketingTask.selectedCategoryTitle = ticketingTask.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        ticketingTask.selectedIndex = index;

    };
  

    //Export Report 
    ticketingTask.exportFile = function () {
        ticketingTask.addRequested = true;
        ticketingTask.gridOptions.advancedSearchData.engine.ExportFile = ticketingTask.ExportFileClass;
        ajax.call(cmsServerConfig.configApiServerPath+'TicketingTask/exportfile', ticketingTask.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            ticketingTask.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketingTask.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //ticketingTask.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    ticketingTask.toggleExportForm = function () {
        ticketingTask.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        ticketingTask.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        ticketingTask.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        ticketingTask.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        ticketingTask.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleTicketing/TicketingTask/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    ticketingTask.rowCountChanged = function () {
        if (!angular.isDefined(ticketingTask.ExportFileClass.RowCount) || ticketingTask.ExportFileClass.RowCount > 5000)
            ticketingTask.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    ticketingTask.getCount = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"TicketingTask/count", ticketingTask.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            ticketingTask.addRequested = false;
            rashaErManage.checkAction(response);
            ticketingTask.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            ticketingTask.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);