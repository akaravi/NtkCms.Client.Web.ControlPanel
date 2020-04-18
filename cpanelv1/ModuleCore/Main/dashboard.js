app.controller("dashbCtrl", ["$scope", "$state", "ajax", "rashaErManage", "$translate", "$rootScope", "$filter", function ($scope, $state, ajax, rashaErManage, $translate, $rootScope, $filter) {
    var dashb = this;

    dashb.addNewItemNotRequested = true;

    dashb.gridOptions = {
        columns: [{
                name: 'Id',
                displayName: 'کد سیستمی',
                sortable: true
            },
            {
                name: 'CurrentSiteId',
                displayName: 'کد سیستمی سایت',
                sortable: true
            },
            {
                name: 'DeviceId',
                displayName: 'کد سیستمی دستگاه',
                sortable: true
            },
            {
                name: 'TicketDate',
                displayName: 'تاریخ',
                sortable: true,
                isDate: true
            },
            {
                name: 'UserId',
                displayName: 'کد سیستمی کاربر',
                sortable: true
            },
            {
                name: 'UserTypeValue',
                displayName: 'نوع کاربر',
                sortable: true
            }
            //{ name: 'LinkLinkUserTypeId.LinkUserType', displayName: 'نوع کاربر', sortable: true },
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {
                CurrentPageNumber: 1,
                SortColumn: "Id",
                SortType: 1,
                NeedToRunFakePagination: false,
                TotalRowData: 2000,
                RowPerPage: 10,
                ContentFullSearch: null,
                Filters: [],
            }
        }
    }
    dashb.gridOptions.advancedSearchData = {};
    dashb.gridOptions.advancedSearchData.engine = {};
    dashb.gridOptions.advancedSearchData.engine.CurrentPageNumber = 1;
    dashb.gridOptions.advancedSearchData.engine.SortColumn = "Id";
    dashb.gridOptions.advancedSearchData.engine.SortType = 1;
    dashb.gridOptions.advancedSearchData.engine.NeedToRunFakePagination = false;
    dashb.gridOptions.advancedSearchData.engine.TotalRowData = 2000;
    dashb.gridOptions.advancedSearchData.engine.RowPerPage = 10;
    dashb.gridOptions.advancedSearchData.engine.ContentFullSearch = null;
    dashb.gridOptions.advancedSearchData.engine.Filters = [];


    dashb.goToTicket = function () {
        $state.go("index.ticket", {
            Unreadticket: true
        });
    }
    dashb.goToShop = function () {
        $state.go("index.shopinvoicesale", {
            PaymentInvoseSale: false
        });
    }
    //#help//
    dashb.gridOptionsLog = {
        columns: [{
                name: 'Id',
                displayName: 'کد سیستمی',
                sortable: true
            },
            {
                name: 'CurrentSiteId',
                displayName: 'کد سیستمی سایت',
                sortable: true
            },
            {
                name: 'LogDescription',
                displayName: 'توضیح',
                sortable: true
            },
            {
                name: 'ErrorMessage',
                displayName: 'پیام خطا',
                sortable: true,
                isDate: true
            },
            {
                name: 'ErrorType',
                displayName: 'نوع خطا',
                sortable: true
            },
            {
                name: 'Module',
                displayName: 'ماژول',
                sortable: true
            }
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    dashb.gridOptionsLog.advancedSearchData = {};
    dashb.gridOptionsLog.advancedSearchData.engine = {};
    dashb.gridOptionsLog.advancedSearchData.engine.CurrentPageNumber = 1;
    dashb.gridOptionsLog.advancedSearchData.engine.SortColumn = "Id";
    dashb.gridOptionsLog.advancedSearchData.engine.SortType = 1;
    dashb.gridOptionsLog.advancedSearchData.engine.NeedToRunFakePagination = false;
    dashb.gridOptionsLog.advancedSearchData.engine.TotalRowData = 2000;
    dashb.gridOptionsLog.advancedSearchData.engine.RowPerPage = 20;
    dashb.gridOptionsLog.advancedSearchData.engine.ContentFullSearch = null;
    dashb.gridOptionsLog.advancedSearchData.engine.Filters = [];
    //#help

    dashb.init = function () {

        var item = localStorage.getItem('AddRequest');
        if (!(item == undefined || item == null || item == '')) {
            var request = JSON.parse(item);
            if (!(request == undefined || request == null)) {
                var t = new Date();
                if (request.expireDate < t.getSeconds()) {
                    localStorage.removeItem('AddRequest');
                } else
                    dashb.addNewItemNotRequested = false;
            }
        }


if($rootScope.tokenInfo)
{
        ajax.call(cmsServerConfig.configApiServerPath + "FileConfiguration/SiteAccess/"+$rootScope.tokenInfo.Item.SiteId, "", "GET").success(function (responseSiteAccess) {
            rashaErManage.checkAction(responseSiteAccess);
            ajax.call(cmsServerConfig.configApiServerPath + "FileConfiguration/SiteStorage/"+$rootScope.tokenInfo.Item.SiteId, "", "GET").success(function (responseSiteStorage) {
                try {
                    rashaErManage.checkAction(responseSiteStorage);
                    dashb.totalSite = responseSiteAccess.Item.AllCateSizeUploadMB;
                    dashb.usedSpace = (responseSiteStorage.Item.SumSizeUploadMB / responseSiteAccess.Item.AllCateSizeUploadMB) * 100;
                    dashb.freeSpace = 100 - dashb.usedSpace;
                } catch (e) {
                    console.log(e);
                }
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    }
        var filterModelCmsLog = {
            rowPerPage: 10
        };

      

        ajax.call(cmsServerConfig.configApiServerPath + "articlecontent/count", {}, "POST").success(function (response1) {
            dashb.articleContentCount = response1.TotalRowCount
            ajax.call(cmsServerConfig.configApiServerPath + "newscontent/count", {}, "POST").success(function (response2) {
                dashb.newsContentCount = response2.TotalRowCount
                ajax.call(cmsServerConfig.configApiServerPath + "CoreSite/count", {}, "POST").success(function (response3) {
                    rashaErManage.checkAction(response3);
                    dashb.cmsSiteCount = response3.TotalRowCount;
                    ajax.call(cmsServerConfig.configApiServerPath + "CoreUser/count", {}, "POST").success(function (response4) {
                        rashaErManage.checkAction(response4);
                        dashb.cmsUserCount = response4.TotalRowCount;
                        ajax.call(cmsServerConfig.configApiServerPath + "applicationapp/count", {}, "POST").success(function (response5) {
                            rashaErManage.checkAction(response5);
                            dashb.applicationCount = response5.TotalRowCount;
                        }).error(function (data, errCode, c, d) {
                            rashaErManage.checkAction(data, errCode);
                        });
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
            ajax.call(cmsServerConfig.configApiServerPath + "memberUser/count", {}, "POST").success(function (response6) {
                rashaErManage.checkAction(response6);
                dashb.memberCount = response6.TotalRowCount;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
            var filterModelTicket = {
                Filters: [{
                    PropertyName: "TicketStatus",
                    EnumValue1: "Unread",
                    SearchType: 0,
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath + "TicketingTask/count", filterModelTicket, "POST").success(function (response7) {
                rashaErManage.checkAction(response7);
                dashb.ticketCount = response7.TotalRowCount;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
            var filterModelShop = {
                Filters: [{
                    PropertyName: "PaymentStatus",
                    EnumValue1: "WithoutPayment",
                    SearchType: 0,
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath + "shopinvoicesale/count", filterModelShop, "POST").success(function (response8) {
                rashaErManage.checkAction(response8);
                dashb.shopinvoicesaleCount = response8.TotalRowCount;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
            var filterModelChart = {
                Filters: [{
                    PropertyName: "RecordStatus",
                    EnumValue1: "Pending",
                    SearchType: 0,
                }]
            };
            ajax.call(cmsServerConfig.configApiServerPath + "chartContent/count", filterModelChart, "POST").success(function (response9) {
                rashaErManage.checkAction(response9);
                dashb.chartContentCount = response9.TotalRowCount;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });


        $scope.$watch($rootScope.tokenInfo, function (newVal, oldVal) {
            if ($rootScope.tokenInfo == undefined)
                return;
            var filterModelTicket = {
                Filters: [{
                    PropertyName: "LinkSiteId",
                    IntValue1: $rootScope.tokenInfo.Item.SiteId,
                    SearchType: 0,
                }],
                rowPerPage: 10
            };
            /*ajax.call(cmsServerConfig.configApiServerPath+"CoreTokenUser/getall", filterModelTicket, "POST").success(function (response7) {
                rashaErManage.checkAction(response7);
                dashb.onlineUsersCount = response7.TotalRowCount;
                dashb.UserTicketList=response7.ListItems;
                dashb.gridOptions.fillData(dashb.UserTicketList , response7.resultAccess);
                dashb.gridOptions.currentPageNumber = response7.CurrentPageNumber;
                dashb.gridOptions.totalRowCount = response7.TotalRowCount;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });*/
        });
    }
}]);