app.controller("orderAddCtrl", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window','$state','$stateParams', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window,$state,$stateParams, $filter) {
    var orderAdd = this;
    orderAdd.RouteUploadFileContent = cmsServerConfig.configRouteUploadFileContent;
    orderAdd.ListOrderAdd = [];
    var edititem=false;
    //For Grid Options
    orderAdd.DetailSelected=0 ;

    orderAdd.gridOptionsAppDate = {};
    orderAdd.gridOptionsAppDateDetail = {};
    orderAdd.ServiceSelectedIds=[];
    orderAdd.selectedItem = {};
    orderAdd.attachedFiles = [];
    orderAdd.attachedFile = "";
    var todayDate = moment().format();
   
    if (itemRecordStatus != undefined) orderAdd.itemRecordStatus = itemRecordStatus;

    var date = moment().format();
    orderAdd.selectedItem.ToDate = date;
    orderAdd.datePickerConfig = {
        defaultDate: date
    };
    orderAdd.startDate = {
        defaultDate: date
    }
    orderAdd.endDate = {
        defaultDate: date
    }
    orderAdd.count = 0;


    //biography Grid Options
    orderAdd.gridOptionsAppDate = {
        columns: [
            { name: 'LinkMainImageId', displayName: 'عکس', sortable: true, visible: true, isThumbnailByFild: true, imageWidth: '80', imageHeight: '80' },
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: 'true' },
            { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: 'true' },
            { name: 'FromDate', displayName: 'تاریخ آغاز', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ToDate', displayName: 'تاریخ پایان', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'ViewCount', displayName: 'تعداد بازدید', sortable: true, visible: true },
            
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }

    }

    //Comment Grid Options
    orderAdd.gridOptionsAppDateDetail = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkAppointmentDateId', displayName: 'کد سیستمی سرویس', sortable: true, type: 'integer', visible: true },
            { name: 'StartService', displayName: 'StartService', sortable: true, type: 'string', visible: true },
            { name: 'EndService', displayName: 'EndService', sortable: true, type: 'string', visible: true },
            { name: 'CreatedDate', displayName: 'ساخت', sortable: true, isDate: true, type: 'date', visible: 'true' },
            { name: 'UpdatedDate', displayName: 'ویرایش', sortable: true, isDate: true, type: 'date', visible: 'true' },
        ],
        data: {},
        multiSelect: false,
        showUserSearchPanel: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 1,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 20,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }

    orderAdd.gridOptionsAppDate.advancedSearchData.engine.Filters = null;
    orderAdd.gridOptionsAppDate.advancedSearchData.engine.Filters = [];
    orderAdd.gridOptionsAppDateDetail.advancedSearchData.engine.Filters = null;
    orderAdd.gridOptionsAppDateDetail.advancedSearchData.engine.Filters = [];
    //#tagsInput -----
    orderAdd.onTagAdded = function (tag) {
        if (!angular.isDefined(tag.id)) {    //Check if this a new or a existing tag (existing tags comprise with an id)
            var tagObject = jQuery.extend({}, orderAdd.ModuleTag);   //#Clone a Javascript Object
            tagObject.Title = tag.text;
            ajax.call('/api/biographyTag/add', tagObject, 'POST').success(function (response) {
                rashaErManage.checkAction(response);
                if (response.IsSuccess) {
                    orderAdd.tags[orderAdd.tags.length - 1] = { id: response.Item.Id, text: response.Item.Title };  //Replace the newly added tag (last in the array) with a new object including its Id
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }
    }
    orderAdd.onTagRemoved = function (tag) { }
    //End of #tagsInput

    //For Show Category Loading Indicator
    orderAdd.categoryBusyIndicator = {
        isActive: true,
        message: "در حال بارگذاری دسته ها ..."
    }
    //For Show biography Loading Indicator
    orderAdd.contentBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    //Tree Config
    orderAdd.treeConfig = {
        displayMember: 'Title',
        displayId: 'Id',
        displayChild: 'Children'
    };

   
    orderAdd.treeConfig.currentNode = {};
    orderAdd.treeBusyIndicator = false;
    orderAdd.addRequested = false;
    orderAdd.showGridComment = false;
    orderAdd.biographyTitle = "";

    //init Function
    orderAdd.init = function () {
        orderAdd.categoryBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"reservationservice/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {
            orderAdd.treeConfig.Items = response.ListItems;
            orderAdd.categoryBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });

    };

    // For Show Comments
    orderAdd.showDetail = function () {
        if (orderAdd.gridOptions.selectedRow.item) {
            //var id = orderAdd.gridOptions.selectedRow.item.Id;
            var Filter_value = {
                PropertyName: "LinkContentId",
                IntValue1: orderAdd.gridOptions.selectedRow.item.Id,
                SearchType: 0
            }
            orderAdd.gridContentOptions.advancedSearchData.engine.Filters = null;
            orderAdd.gridContentOptions.advancedSearchData.engine.Filters = [];
            orderAdd.gridContentOptions.advancedSearchData.engine.Filters.push(Filter_value);
            ajax.call(cmsServerConfig.configApiServerPath+'biographyComment/getall', orderAdd.gridContentOptions.advancedSearchData.engine, 'POST').success(function (response) {
                orderAdd.listComments = response.ListItems;
                //orderAdd.gridOptions.resultAccess = response.resultAccess; // دسترسی ها نمایش
                orderAdd.gridContentOptions.fillData(orderAdd.listComments, response.resultAccess);
                orderAdd.gridContentOptions.currentPageNumber = response.CurrentPageNumber;
                orderAdd.gridContentOptions.totalRowCount = response.TotalRowCount;
                orderAdd.allowedSearch = response.AllowedSearchField;
                rashaErManage.checkAction(response);
                orderAdd.gridContentOptions.RowPerPage = response.RowPerPage;
                orderAdd.showGridComment = true;
                orderAdd.Title = orderAdd.gridOptions.selectedRow.item.Title;
            });
        }
    }

    orderAdd.gridOptionsAppDate.onRowSelected = function () {
        var item = orderAdd.gridOptionsAppDate.selectedRow.item;
        orderAdd.showDetail(item);
    }

    orderAdd.gridOptionsAppDateDetail.onRowSelected = function () { 

}
    orderAdd.ServiceSelectedIds=[];
    //Tree On Node Select Options
    orderAdd.onNodeSelect = function (currentNode) {
        var node = currentNode;
        orderAdd.showGridComment = false;
        var xxxx=false;
        angular.forEach(orderAdd.ServiceSelectedIds, function (item, key) {
                if(node.Id == item) {
                    xxxx=true;

                }
           
            })
        if(!xxxx)
        {                    
            orderAdd.ServiceSelectedIds.push(currentNode.Id);
        }
        else
        {
            var index = orderAdd.ServiceSelectedIds.indexOf(node.Id);
            orderAdd.ServiceSelectedIds.splice(index,1);
        }
        //orderAdd.ServiceSelectedIds.push(currentNode.Id);
        if(orderAdd.ServiceSelectedIds.length>0)
        {
            orderAdd.selectContent(node);
        }
        else
        {
            orderAdd.ListItemsAppDate=[];
            orderAdd.ListItemsAppDateDetail=[];
        }   
    };

    //Show Content with Category Id
    orderAdd.selectContent = function (node) {
        engine={};
        AppDateListIds=[];
        ajax.call(cmsServerConfig.configApiServerPath+"ReservationAppointmentDate/GetAllAppDate", {model:{},ListServiceIds:orderAdd.ServiceSelectedIds}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            orderAdd.contentBusyIndicator.isActive = false;
            orderAdd.ListItemsAppDate = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"ReservationAppointmentDateDetail/GetAllAppDateDetail",{model:{},ListServiceIds:orderAdd.ServiceSelectedIds,ListAppDateIds:[]}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            orderAdd.contentBusyIndicator.isActive = false;
            orderAdd.ListItemsAppDateDetail = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    orderAdd.AppDateSelectedIds=[];
    //Tree On Node Select Options
    orderAdd.onRowSelect = function (currentNode) {
        var node = currentNode;
        orderAdd.showGridComment = false;
        orderAdd.AppDateSelectedIds.push(currentNode.Id);
        orderAdd.selectContentDetail(node);
    };

    //Show Content with Category Id
    orderAdd.selectContentDetail = function (node) {

        ajax.call(cmsServerConfig.configApiServerPath+"ReservationAppointmentDateDetail/GetAllAppDateDetail",{model:{},ListServiceIds:orderAdd.ServiceSelectedIds,ListAppDateIds:orderAdd.AppDateSelectedIds}, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            orderAdd.contentBusyIndicator.isActive = false;
            orderAdd.ListItemsAppDateDetail = response.ListItems;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };
    orderAdd.searchData = function () {
        orderAdd.contentBusyIndicator.isActive = true;
        ajax.call(cmsServerConfig.configApiServerPath+"biographyContent/getall", orderAdd.gridOptions.advancedSearchData.engine, "POST").success(function (response) {
            rashaErManage.checkAction(response);
            orderAdd.contentBusyIndicator.isActive = false;
            orderAdd.ListItems = response.ListItems;
            orderAdd.gridOptions.fillData(orderAdd.ListItems);
            orderAdd.gridOptions.currentPageNumber = response.CurrentPageNumber;
            orderAdd.gridOptions.totalRowCount = response.TotalRowCount;
            orderAdd.gridOptions.rowPerPage = response.RowPerPage;
            orderAdd.allowedSearch = response.AllowedSearchField;
        }).error(function (data, errCode, c, d) {
            orderAdd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
        });
    }

orderAdd.ShowInvoiceSale = function (Detail,Service) {

        
        orderAdd.ListOrderAdd.push({
            LinkServiceId:Service,
            LinkAppointmentDateDetailId:Detail
        });
       orderAdd.DetailSelected=Detail;
     /*ajax.call(cmsServerConfig.configApiServerPath+"ReservationOrder/AddOrder", orderAdd.ListOrderAdd, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            orderAdd.ListOrderAdd = response.ListItems;
            //orderAdd.gridOptions.fillData(orderAdd.ListItems, response.resultAccess);
            //orderAdd.setPaymentStatusEnum(orderAdd.ListItems, orderAdd.PaymentStatus); // Sending Access as an argument
            //orderAdd.addRequested = false;
            //orderAdd.busyIndicator.isActive = false;
            //orderAdd.gridOptions.currentPageNumber = response.CurrentPageNumber;
            //orderAdd.gridOptions.totalRowCount = response.TotalRowCount;
            //orderAdd.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            //orderAdd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            //orderAdd.busyIndicator.isActive = false;
        });*/
};
orderAdd.ListOrderAddcomplate = function (ListOrderAdd) {
        ajax.call(cmsServerConfig.configApiServerPath+"ReservationOrder/AddOrder", ListOrderAdd, 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            orderAdd.ListOrderAdd = response.ListItems;
           /* if(response.IsSuccess)
            {
                orderAdd.ListOrderAdd = [];
            }*/
            //orderAdd.gridOptions.fillData(orderAdd.ListItems, response.resultAccess);
            //orderAdd.setPaymentStatusEnum(orderAdd.ListItems, orderAdd.PaymentStatus); // Sending Access as an argument
            //orderAdd.addRequested = false;
            //orderAdd.busyIndicator.isActive = false;
            //orderAdd.gridOptions.currentPageNumber = response.CurrentPageNumber;
            //orderAdd.gridOptions.totalRowCount = response.TotalRowCount;
            //orderAdd.gridOptions.rowPerPage = response.RowPerPage;
        }).error(function (data, errCode, c, d) {
            //orderAdd.gridOptions.fillData();
            rashaErManage.checkAction(data, errCode);
            //orderAdd.busyIndicator.isActive = false;
        });
};
     //Shop Grid Options
    orderAdd.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: 'true' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'RegisterDate', displayName: 'تاریخ فاکتور', sortable: true, type: 'string', isDate: true, visible: true },
            { name: 'TotalAmount', displayName: 'مبلغ', sortable: true, type: 'string', visible: true },
            { name: 'LinkCmsUserId', displayName: 'کد سیستمی کاربر', sortable: true, type: 'integer', visible: true },
            { name: 'LinkMemberUserId', displayName: 'کد سیستمی عضو', sortable: true, type: 'integer', visible: true },
            { name: 'InvoiceStatusTitle', displayName: 'وضعیت فاکتور', sortable: true, type: 'string', visible: true },
            { name: 'PaymentStatusTitle', displayName: 'وضعیت پرداخت', sortable: true, type: 'string', visible: true },
            { name: "ActionKey", displayName: "پرداخت آنلاین", displayForce: true, template: '<button ng-if="!x.IsActivated && (x.PaymentStatus==0 )" ng-click="orderAdd.openPaymentModel(x.Id)"class="btn btn-info" style="margin-left: 2px;"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' },
            { name: "ActionKey", displayName: "پرداخت در محل", displayForce: true, template: '<button ng-if="!x.IsActivated && x.PaymentStatus==0" ng-click="orderAdd.openPaymentonlocationModel(x.Id)"class="btn btn-info" style="margin-left: 2px;"><i class="fa fa-pencil-square-o" aria-hidden="true"></i></button>' },
            { name: "ActionKey", displayName: "کد پرداخت", displayForce: true,template: '<button ng-if="x.LinkModelBankPaymentTransactionSuccessfulId!=null && x.LinkModelBankPaymentTransactionSuccessfulId!=0" ng-click="orderAdd.BankPaymentTransactionSuccessfulId(x.LinkModelBankPaymentTransactionSuccessfulId)"class="btn btn-info" style="margin-left: 2px;">{{x.LinkModelBankPaymentTransactionSuccessfulId}}</button>' },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 0,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 5,
                ContentFullSearch: null,
                Filters: []
            }
        }
    }
    //For reInit Categories
    orderAdd.gridOptionsAppDate.reGetAll = function () {
        orderAdd.init();
    };

   
    orderAdd.toggleCategoryButtons = function () {
        $("#categoryButtons").fadeToggle();
    }

    orderAdd.columnCheckbox = false;
    orderAdd.openGridConfigModal = function () {
        $("#gridView-btn").toggleClass("active");
        var prechangeColumns = orderAdd.gridOptions.columns;
        if (orderAdd.gridOptions.columnCheckbox) {
            for (var i = 0; i < orderAdd.gridOptions.columns.length; i++) {
                //orderAdd.gridOptions.columns[i].visible = $("#" + orderAdd.gridOptions.columns[i].Id + "Checkbox").is(":checked");
                var element = $("#" + orderAdd.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                var temp = element[0].checked;
                orderAdd.gridOptions.columns[i].visible = temp;
            }
        }
        else {

            for (var i = 0; i < orderAdd.gridOptions.columns.length; i++) {
                var element = $("#" + orderAdd.gridOptions.columns[i].name.replace('.', '') + "Checkbox");
                $("#" + orderAdd.gridOptions.columns[i].name + "Checkbox").checked = prechangeColumns[i].visible;
            }
        }
        for (var i = 0; i < orderAdd.gridOptions.columns.length; i++) {
            console.log(orderAdd.gridOptions.columns[i].name.concat(".visible: "), orderAdd.gridOptions.columns[i].visible);
        }
        orderAdd.gridOptions.columnCheckbox = !orderAdd.gridOptions.columnCheckbox;
    }
    //TreeControl
    orderAdd.treeOptions = {
        nodeChildren: "Children",
        multiSelection: false,
        isLeaf: function (node) {
            if (node.FileName == undefined || node.Filename == "")
                return false;
            return true;
        },
        isSelectable: function (node) {
            if (orderAdd.treeOptions.dirSelectable)
                if (angular.isDefined(node.FileName))
                    return false;
            return true;
        },
        dirSelectable: false
    }

    orderAdd.onNodeToggle = function (node, expanded) {
        if (expanded) {
            node.Children = [];
            var filterModel = { Filters: [] };
            var originalName = node.Title;
            node.messageText = " در حال بارگذاری...";
            filterModel.Filters.push({ PropertyName: "LinkParentId", SearchType: 0, IntValue1: node.Id });
            ajax.call(cmsServerConfig.configApiServerPath+"FileCategory/GetAll", filterModel, 'POST').success(function (response1) {
                angular.forEach(response1.ListItems, function (value, key) {
                    node.Children.push(value);
                });
                ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetFilesFromCategory", node.Id, 'POST').success(function (response2) {
                    angular.forEach(response2.ListItems, function (value, key) {
                        node.Children.push(value);
                    });
                    node.messageText = "";
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }).error(function (data, errCode, c, d) {
                console.log(data);
            });
        }
    }

    orderAdd.onSelection = function (node, selected) {
        if (!selected) {
            orderAdd.selectedItem.LinkMainImageId = null;
            orderAdd.selectedItem.previewImageSrc = null;
            return;
        }
        orderAdd.selectedItem.LinkMainImageId = node.Id;
        orderAdd.selectedItem.previewImageSrc = cmsServerConfig.configCpanelImages+"loader.gif";
        ajax.call(cmsServerConfig.configApiServerPath+"FileContent/GetOne", node.Id, "GET").success(function (response) {
            orderAdd.selectedItem.previewImageSrc = cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }
    //End of TreeControl
}]);