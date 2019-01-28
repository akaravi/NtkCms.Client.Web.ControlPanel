app.controller("ticketController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window','$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window,$stateParams, $filter) {
    var ticket = this;
    ticket.attachedFiles = [];
    ticket.busyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    ticket.selectedTicketUnread = {
        Unread: $stateParams.Unreadticket
    };
    var date = moment().format();
    ticket.startDate = {
        defaultDate: date
    }
    ticket.endDate = {
        defaultDate: date
    }
    ticket.filePickerFiles = {
        isActive: true,
        backElement: 'filePickerFiles',
        multiSelect: false,
        fileId: null,
        filename: null
    }
    ticket.showAnswersGrid = false;

    ticket.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'سؤال', sortable: true, type: 'string' },
            { name: 'virtual_TicketType.Title', displayName: 'بخش', sortable: true, type: 'integer', displayForce: true },
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

    ticket.answersGridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'LinkTicketId', displayName: 'کد سیستمی تیکت', sortable: true, type: 'string' },
            { name: 'virtual_Ticket.Title', displayName: 'عنوان تیکت', sortable: true, type: 'integer', displayForce: true },
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

    ticket.summernoteOptions = {
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
    ticket.init = function () {
        ticket.busyIndicator.isActive = true;
         if (ticket.selectedTicketUnread.Unread == true) {
            ticket.gridOptions.advancedSearchData.engine = {
                Filters: [{
                        PropertyName: "TicketStatus",
                        EnumValue1: "Unread",
                        SearchType: 0,
                }]
            };
        }
        ajax.call(mainPathApi+"Ticket/getall", ticket.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            ticket.busyIndicator.isActive = false;
            ticket.ListItems = response.ListItems;
            ticket.gridOptions.fillData(ticket.ListItems, response.resultAccess);
            ticket.gridOptions.currentPageNumber = response.CurrentPageNumber;
            ticket.gridOptions.totalRowCount = response.TotalRowCount;
            ticket.gridOptions.rowPerPage = response.RowPerPage;
            ticket.gridOptions.maxSize = 5;
            ticket.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            ticket.busyIndicator.isActive = false;
        });
    }

    ticket.addNewModel = function () {
        ticket.modalTitle = 'اضافه';
        ticket.filePickerFiles.filename = "";
        ticket.filePickerFiles.fileId = null;
        ajax.call(mainPathApi+'Ticket/getviewmodel', "0", 'GET').success(function (response) {
            //rashaErManage.checkAction(response);
            console.log(response);
            ticket.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicket/Ticket/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    ticket.openEditModal = function (s) {
        if (!ticket.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک ردیف جهت مشاهده انتخاب کنید");
            return;
        }
        ticket.modalTitle = 'مشاهده تیکت';
        ajax.call(mainPathApi+'Ticket/getviewmodel', ticket.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            ticket.selectedItem = response.Item;
            ticket.parseFileIds(response.Item.LinkFileIds);
            ticket.filePickerFiles.filename = null;
            ticket.filePickerFiles.fileId = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/Ticket/edit.html',
                scope: $scope
            });
            //Set Ticket from Unread to Read
            ajax.call(mainPathApi+'Ticket/isRead', ticket.selectedItem, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    ticket.openEditAnswerModal = function () {
        if (!ticket.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ticket.modalTitle = 'ویرایش';
        ajax.call(mainPathApi+'TicketAnswer/getviewmodel', ticket.answersGridOptions.selectedRow.item.Id, 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            ticket.selectedItem = response.Item;
            ticket.parseFileIds(response.Item.LinkFileIds);
            ticket.filePickerFiles.filename = null;
            ticket.filePickerFiles.fileId = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/TicketAnswer/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    ticket.addNew = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        ticket.selectedItem.LinkCmsPageId = 1;
        ticket.selectedItem.LinkFileIds = "";
        ticket.stringfyLinkFileIds();
        console.log((ticket.selectedItem));
        ticket.addRequested = true;
        ajax.call(mainPathApi+'Ticket/add', ticket.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                ticket.ListItems.unshift(response.Item);
                ticket.gridOptions.fillData(ticket.ListItems);
                ticket.closeModal();
            }
            ticket.addRequested = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            rashaErManage.checkAction(data, errCode);
            ticket.addRequested = false;
        });
    }

    ticket.editAnswer = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        ticket.addRequested = true;
        ticket.selectedItem.LinkFileIds = "";
        ticket.stringfyLinkFileIds();
        ajax.call(mainPathApi+'Ticketanswer/edit', ticket.selectedItem, 'PUT').success(function (response) {
            ticket.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticket.replaceItem(ticket.answersListItems, ticket.selectedItem.Id, response.Item);
                ticket.answersGridOptions.fillData(ticket.answersListItems);
                ticket.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            ticket.addRequested = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    ticket.delete = function () {
        if (!ticket.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(ticket.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'Ticket/getviewmodel', ticket.gridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    ticket.selectedItemForDelete = response.Item;
                    ajax.call(mainPathApi+'Ticket/delete', ticket.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            ticket.replaceItem(ticket.ListItems,ticket.selectedItemForDelete.Id);
                            ticket.gridOptions.fillData(ticket.ListItems);
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

    ticket.deleteAnswer = function () {
        if (!ticket.answersGridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک پاسخ جهت حذف انتخاب کنید");
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(ticket.answersGridOptions.selectedRow.item);
                ajax.call(mainPathApi+'ticketanswer/getviewmodel', ticket.answersGridOptions.selectedRow.item.Id, 'GET').success(function (response) {
                    rashaErManage.checkAction(response);
                    ticket.selectedItemForDelete = response.Item;
                    console.log(ticket.selectedItemForDelete);
                    ajax.call(mainPathApi+'ticketanswer/delete', ticket.selectedItemForDelete, 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            ticket.replaceItem(ticket.answersListItems, ticket.selectedItemForDelete.Id);
                            ticket.answersGridOptions.fillData(ticket.answersListItems);
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

    ticket.replaceItem = function (arr,oldId, newItem) {
        angular.forEach(arr, function (item, key) {
            if (item.Id == oldId) {
                var index = arr.indexOf(item);
                arr.splice(index, 1);
            }
        });
        if (newItem)
            arr.unshift(newItem);
    }

    ticket.closeModal = function () {
        $modalStack.dismissAll();
    }

    ticket.gridOptions.reGetAll = function () {
        ticket.init();
    }

    ticket.gridOptions.onRowSelected = function () {
        var item = ticket.gridOptions.selectedRow.item;
        ticket.showAnswers(item);
    }

    ticket.showAnswers = function (item) {
        if (item) {
            //var id = ticket.gridOptions.selectedRow.item.Id;
            ticket.answersbusyIndicator = true;
            var Filter_value = {
                PropertyName: "LinkTicketId",
                IntValue1: item.Id,
                SearchType: 0
            }
            ticket.answersGridOptions.advancedSearchData.engine.Filters = [];
            ticket.answersGridOptions.advancedSearchData.engine.Filters.push(Filter_value);
            ajax.call(mainPathApi+'ticketAnswer/getall', ticket.answersGridOptions.advancedSearchData.engine, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                ticket.busyIndicator.isActive = false;
                ticket.answersListItems = response.ListItems;
                if (response.ListItems.length < 1)
                    ticket.answersListItems.push({ Id: 0, LinkTicketId: 0, HtmlBody: "هیچ پاسخی وجود ندارد!" });
                ticket.answersGridOptions.fillData(ticket.answersListItems, response.resultAccess);
                ticket.answersGridOptions.currentPageNumber = response.CurrentPageNumber;
                ticket.answersGridOptions.totalRowCount = response.TotalRowCount;
                ticket.answersGridOptions.RowPerPage = response.RowPerPage;
                ticket.gridOptions.maxSize = 5;
                ticket.allowedSearch = response.AllowedSearchField;
                ticket.showAnswersGrid = true;
            }).error(function (data) {
                rashaErManage.checkAction(data, errCode);
            });
        }
    }

    ticket.columnCheckbox = false;

    ticket.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        if (ticket.gridOptions.columnCheckbox) {
            for (var i = 0; i < ticket.gridOptions.columns.length; i++) {
                var element = $("#" + ticket.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                ticket.gridOptions.columns[i].visible = element[0].checked;
            }
        }
        else {
            var prechangeColumns = ticket.gridOptions.columns;
            for (var i = 0; i < ticket.gridOptions.columns.length; i++) {
                ticket.gridOptions.columns[i].visible = true;
                var element = $("#" + ticket.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + ticket.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < ticket.gridOptions.columns.length; i++) {
            console.log(ticket.gridOptions.columns[i].name.concat(".visible: "), ticket.gridOptions.columns[i].visible);
        }
        ticket.gridOptions.columnCheckbox = !ticket.gridOptions.columnCheckbox;
    }

    ticket.openAnswerModal = function () {
        if (!ticket.gridOptions.selectedRow.item) {
            rashaErManage.showMessage("لطفاَ یک سؤال انتخاب کنید!");
            return;
        }
        ticket.modalTitle = 'پاسخ';
        ticket.attachedFiles = [];
        ticket.attachedFile = "";
        ticket.filePickerFiles.filename = "";
        ticket.filePickerFiles.fileId = null;
        ajax.call(mainPathApi+'ticketAnswer/getviewmodel', "0", 'GET').success(function (response) {
            //rashaErManage.checkAction(response);
            console.log(response);
            ticket.selectedItem = response.Item;
            ticket.selectedItem.LinkTicketId = ticket.gridOptions.selectedRow.item.Id;
            ticket.selectedItem.Ticket = { Title: ticket.gridOptions.selectedRow.item.Title, HtmlBody: ticket.gridOptions.selectedRow.item.HtmlBody };
            ticket.selectedItem.LinkFileIds = null;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/TicketAnswer/add.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }

    ticket.addNewAnswer = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        ticket.addRequested = true;
        ticket.busyIndicator.isActive = true;
        ticket.selectedItem.LinkFileIds = "";
        ticket.stringfyLinkFileIds();
        ajax.call(mainPathApi+'ticketAnswer/add', ticket.selectedItem, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticket.answersListItems.unshift(response.Item);
                ticket.answersGridOptions.fillData(ticket.answersListItems);
                ticket.showAnswersGrid = true;
            }
            ticket.addRequested = false;
            ticket.busyIndicator.isActive = false;
            ticket.closeModal();
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            ticket.addRequested = false;
        });
    }
    ticket.columnCheckbox = false;
    ticket.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = ticket.gridOptions.columns;
        if (ticket.gridOptions.columnCheckbox) {
            for (var i = 0; i < ticket.gridOptions.columns.length; i++) {
                //ticket.gridOptions.columns[i].visible = $("#" + ticket.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + ticket.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                ticket.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < ticket.gridOptions.columns.length; i++) {
                var element = $("#" + ticket.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + ticket.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < ticket.gridOptions.columns.length; i++) {
            console.log(ticket.gridOptions.columns[i].name.concat(".visible: "), ticket.gridOptions.columns[i].visible);
        }
        ticket.gridOptions.columnCheckbox = !ticket.gridOptions.columnCheckbox;
    }

    ticket.filePickerFiles.removeSelectedfile = function (config) {
        ticket.filePickerFiles.fileId = null;
        ticket.filePickerFiles.filename = null;
        ticket.selectedItem.LinkFileIds = null;
    }
    ticket.clearfilePickers = function () {
        ticket.filePickerFiles.fileId = null;
        ticket.filePickerFiles.filename = null;
    }

    ticket.stringfyLinkFileIds = function () {
        $.each(ticket.attachedFiles, function (i, item) {
            if (ticket.selectedItem.LinkFileIds == "")
                ticket.selectedItem.LinkFileIds = item.fileId;
            else
                ticket.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    ticket.showUpload = function () {
        $("#fastUpload").fadeToggle();
    }
    ticket.deleteAttachedFile = function (index) {
        ticket.attachedFiles.splice(index, 1);
    }
    // ----------- FilePicker Codes --------------------------------
    ticket.addAttachedFile = function (id) {
        var fname = $("#file" + id).text();
        ticket.attachedFiles = [];
        if (fname == "") {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_File_To_Add'));
            return;
        }
        if (id != null && id != undefined && !ticket.alreadyExist(id, ticket.attachedFiles)) {
            var fId = id;
            var file = {
                fileId: fId, filename: fname
            };
            ticket.attachedFiles.push(file);
            ticket.clearfilePickers();
        }
    }

    ticket.alreadyExist = function (fieldId, array) {
        for (var i = 0; i < array.length; i++) {
            if (fieldId == array[i].fileId) {
                rashaErManage.showMessage($filter('translate')('This_Item_Has_Already_Been_Added'));
                ticket.clearfilePickers();
                return true;
            }
        }
        return false;
    }

    ticket.parseFileIds = function (stringOfIds) {
        if (stringOfIds == null || !stringOfIds.trim()) return;   //String is empty or whitespace then return
        var fileIds = stringOfIds.split(",");
        if (fileIds.length != undefined) {
            $.each(fileIds, function (index, item) {
                if (item == parseInt(item, 10)) {  // Check if item is an integer
                    ajax.call(mainPathApi+'CmsFileContent/getviewmodel', parseInt(item), 'GET').success(function (response) {
                        if (response.IsSuccess) {
                            ticket.attachedFiles.push({ fileId: response.Item.Id, filename: response.Item.FileName });
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }
            });
        }
    }

    ticket.clearfilePickers = function () {
        ticket.filePickerFiles.fileId = null;
        ticket.filePickerFiles.filename = null;
    }

    ticket.stringfyLinkFileIds = function () {
        $.each(ticket.attachedFiles, function (i, item) {
            if (ticket.selectedItem.LinkFileIds == "")
                ticket.selectedItem.LinkFileIds = item.fileId;
            else
                ticket.selectedItem.LinkFileIds += ',' + item.fileId;
        });
    }
    //--------- End FilePickers Codes -------------------------


  
    // File Manager actions
    ticket.replaceFile = function (name) {
        ticket.itemClicked(null, ticket.fileIdToDelete, "file");
        ticket.fileTypes = 1;
        ticket.fileIdToDelete = ticket.selectedIndex;

        // Delete the file
        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", ticket.fileIdToDelete, 'GET').success(function (response1) {
            if (response1.IsSuccess == true) {
                console.log(response1.Item);
                ajax.call(mainPathApi+'CmsFileContent/delete', response1.Item, 'DELETE').success(function (response2) {
                    ticket.remove(ticket.FileList, ticket.fileIdToDelete);
                    if (response2.IsSuccess == true) {
                        // Save New file
                        ajax.call(mainPathApi+"CmsFileContent/getviewmodel", "0", 'GET').success(function (response3) {
                            if (response3.IsSuccess == true) {
                                ticket.FileItem = response3.Item;
                                ticket.FileItem.FileName = name;
                                ticket.FileItem.Extension = name.split('.').pop();
                                ticket.FileItem.FileSrc = name;
                                ticket.FileItem.LinkCategoryId = ticket.thisCategory;
                                ticket.saveNewFile();
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
    ticket.saveNewFile = function () {
        ajax.call(mainPathApi+"CmsFileContent/add", ticket.FileItem, 'POST').success(function (response) {
            if (response.IsSuccess) {
                ticket.FileItem = response.Item;
                ticket.showSuccessIcon();
                return 1;
            }
            else {
                return 0;

            }
        }).error(function (data) {
            ticket.showErrorIcon();
            return -1;
        });
    }

    ticket.showSuccessIcon = function () {
    }

    ticket.showErrorIcon = function () {

    }
    //file is exist
    ticket.fileIsExist = function (fileName) {
        for (var i = 0; i < ticket.FileList.length; i++) {
            if (ticket.FileList[i].FileName == fileName) {
                ticket.fileIdToDelete = ticket.FileList[i].Id;
                return true;

            }
        }
        return false;
    }

    ticket.getFileItem = function (id) {
        for (var i = 0; i < ticket.FileList.length; i++) {
            if (ticket.FileList[i].Id == id) {
                return ticket.FileList[i];
            }
        }
    }

    //select file or folder
    ticket.itemClicked = function ($event, index, type) {
        if (type == 'file' || type == 1) {
            ticket.fileTypes = 1;
            ticket.selectedFileId = ticket.getFileItem(index).Id;
            ticket.selectedFileName = ticket.getFileItem(index).FileName;
        }
        else {
            ticket.fileTypes = 2;
            ticket.selectedCategoryId = ticket.getCategoryName(index).Id;
            ticket.selectedCategoryTitle = ticket.getCategoryName(index).Title;
        }
        //if (event.ctrlKey) {
        //    alert("ctrl pressed");
        //}

        ticket.selectedIndex = index;

    };
  

    //Export Report 
    ticket.exportFile = function () {
        ticket.addRequested = true;
        ticket.gridOptions.advancedSearchData.engine.ExportFile = ticket.ExportFileClass;
        ajax.call(mainPathApi+'Ticket/exportfile', ticket.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            ticket.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticket.exportDownloadLink = window.location.origin + response.LinkFile;
                $window.open(response.LinkFile, '_blank');
                //ticket.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
    //Open Export Report Modal
    ticket.toggleExportForm = function () {
        ticket.SortType = [
            { key: 'نزولی', value: 0 },
            { key: 'صعودی', value: 1 },
            { key: 'تصادفی', value: 3 }
        ];
        ticket.EnumExportFileType = [
            { key: 'Excel', value: 1 },
            { key: 'PDF', value: 2 },
            { key: 'Text', value: 3 }
        ];
        ticket.EnumExportReceiveMethod = [
            { key: 'دانلود', value: 0 },
            { key: 'ایمیل', value: 1 },
            { key: 'فایل منیجر', value: 3 }
        ];
        ticket.ExportFileClass = { FileType: 1, RecieveMethod: 0, RowCount: 100 };
        ticket.exportDownloadLink = null;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleTicketing/Ticket/report.html',
            scope: $scope
        });
    }
    //Row Count Export Input Change
    ticket.rowCountChanged = function () {
        if (!angular.isDefined(ticket.ExportFileClass.RowCount) || ticket.ExportFileClass.RowCount > 5000)
            ticket.ExportFileClass.RowCount = 5000;
    }
    //Get TotalRowCount
    ticket.getCount = function () {
        ajax.call(mainPathApi+"Ticket/count", ticket.gridOptions.advancedSearchData.engine, 'POST').success(function (response) {
            ticket.addRequested = false;
            rashaErManage.checkAction(response);
            ticket.ListItemsTotalRowCount = ': ' + response.TotalRowCount;
        }).error(function (data, errCode, c, d) {
            ticket.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }
}]);