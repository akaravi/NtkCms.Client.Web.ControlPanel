app.controller("marketingDashboardController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter',function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    $scope.customerList=[];
    $scope.productList=[];
    $scope.reminderList=[];
    $scope.meetingList=[];
    $scope.commentList=[];
    $scope.alertList=[];
    $scope.sessionList=[];
    $scope.communicationList=[];
    $scope.positionList=[];
    $scope.busyIndicatorManagement={};
    $scope.addRequested=false;

    $scope.busyIndicatorManagement.isActive=false;
    $scope.busyIndicatorManagement['reminder']={isActive:false};
    $scope.busyIndicatorManagement['meeting']={isActive:false};
    $scope.busyIndicatorManagement['comment']={isActive:false};
    $scope.busyIndicatorManagement['alert']={isActive:false};
    $scope.busyIndicatorManagement['session']={isActive:false};
    $scope.busyIndicatorManagement['communication']={isActive:false};
    $scope.busyIndicatorManagement['customer']={isActive:false};
    $scope.busyIndicatorManagement['product']={isActive:false};
    $scope.busyIndicatorManagement['position']={isActive:false};
    $scope.busyIndicatorManagement['marketer']={isActive:false};
    $scope.busyIndicatorManagement['settingkind']={isActive:false}; 
    $scope.busyIndicatorManagement['marketergroup']={isActive:false};
    $scope.busyIndicatorManagement['productgroup']={isActive:false};

    var todayDate = moment().format();

    $scope.StartDate = {
        defaultDate: todayDate
    }

$scope.differenceTime=function(date1)
{
   var timeDiff = Math.abs(todayDate - date1);
}


    

//#help# open modal add 

    $scope.addEditCustomer=function()
    {
       $scope.getViewModel("0").success(function(response)
       {
           $scope.selectedItem=response.Item;
           $modal.open({
                templateUrl: 'cpanelv1/ModuleMarketing/MarketingDashboard/customerAdd.html',
                scope: $scope,
                size:'lg'
            });     
       });         
    }
    $scope.addEditMarketer=function()
    {
       $scope.getViewModel("0").success(function(response)
       {
           $scope.selectedItem=response.Item;
           $modal.open({
                templateUrl: 'cpanelv1/ModuleMarketing/MarketingDashboard/MarketerAdd.html',
                scope: $scope
            });     
       });         
    }
$scope.addEditProductGroup=function()
    {
       $scope.getViewModel("0").success(function(response)
       {
           $scope.selectedItem=response.Item;
           $modal.open({
                templateUrl: 'cpanelv1/ModuleMarketing/MarketingDashboard/ProductGroupAdd.html',
                scope: $scope
            });     
       });         
    }
$scope.addEditMarketerGroup=function()
    {
       $scope.getViewModel("0").success(function(response)
       {
           $scope.selectedItem=response.Item;
           $modal.open({
                templateUrl: 'cpanelv1/ModuleMarketing/MarketingDashboard/MarketerGroupAdd.html',
                scope: $scope
            });     
       });         
    }
    $scope.addEditPosition=function()
    {
       $scope.getViewModel("0").success(function(response)
       {
           $scope.selectedItem=response.Item;
           $modal.open({
                templateUrl: 'cpanelv1/ModuleMarketing/MarketingDashboard/PositionAdd.html',
                scope: $scope
            });     
       });         
    }
    $scope.addEditProduct=function()
    {
       $scope.getViewModel("0").success(function(response)
       {
           $scope.selectedItem=response.Item;
           $modal.open({
                templateUrl: 'cpanelv1/ModuleMarketing/MarketingDashboard/ProductAdd.html',
                scope: $scope
            });     
       });         
    }
    $scope.addEditSettingKind=function()
    {
       $scope.getViewModel("0").success(function(response)
       {
           $scope.selectedItem=response.Item;
           $modal.open({
                templateUrl: 'cpanelv1/ModuleMarketing/MarketingDashboard/SettingKindAdd.html',
                scope: $scope
            });     
       });         
    }
//#help#
    $scope.getViewModel=function(viewmodelId)
    {
        var ret=ajax.call(cmsServerConfig.configApiServerPath+'MarketingCustomer/GetOne', viewmodelId, 'GET');
        ret.success(function (response) {
            rashaErManage.checkAction(response);
            if (response.IsSuccess)
                return response;
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            return null;
        });
        return ret;
    }
//#help# list selector
    $scope.LinkMemberIdSelector = {
        displayMember: 'FirstName,LastName',
        id: 'Id',
        fId: 'LinkMemberId',
        url: 'Memberuser',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'LinkMemberId',
        rowPerPage: 200,
        scope: $scope,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'FirstName', displayName: 'FirstName', sortable: true, type: 'string', visible: true },
                { name: 'LastName', displayName: 'LastName', sortable: true, type: 'string', visible: true },
            ]
        }
    }

    $scope.LinkCategoryIdSelector = {
        displayMember: 'Title',
        id: 'Id',
        fId: 'LinkCategoryId',
        url: 'MarketingCustomerCategory',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title',
        rowPerPage: 200,
        scope: $scope,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'Title', sortable: true, type: 'string', visible: true },
                { name: 'Description', displayName: 'Description', sortable: true, type: 'string', visible: true },
            ]
        }
    }

    $scope.LinkProductIdSelector = {
        displayMember: 'Description',
        id: 'Id',
        fId: 'LinkProductId',
        url: 'MarketingProduct',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Description',
        rowPerPage: 200,
        scope: $scope,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
                { name: 'ProductContentObject.Title', displayName: 'نام کالا', sortable: true, type: 'string', visible: true },
            ]
        }
    }

    $scope.LinkCustomerSettingKindIdSelector = {
        displayMember: 'Description',
        id: 'Id',
        fId: 'LinkCustomerSettingKindId',
        url: 'MarketingCustomerSetting',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Title,Description',
        rowPerPage: 200,
        scope: $scope,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
            ]
        }
    }

    $scope.LinkCustomerSettingPositionIdSelector = {
        displayMember: 'Title,Description',
        id: 'Id',
        fId: 'LinkCustomerSettingPositionId',
        url: 'MarketingCustomerSetting',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Description',
        rowPerPage: 200,
        scope: $scope,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
                { name: 'SuccessPercent', displayName: 'درصد موفقیت', sortable: true, type: 'integer', visible: true },
            ]
        }
    }

$scope.LinkParentIdMarketerSelector = {
        displayMember: 'Title,Description',
        id: 'Id',
        fId: 'LinkParentId',
        url: 'MarketingMarketer',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Description',
        rowPerPage: 200,
        scope: $scope,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
                /*{ name: 'virtual_MarketerGroup.Title', displayName: 'گروه مارکتر', sortable: true, type: 'string', visible: true },*/
            ]
        }
    }
$scope.LinkMarketerGroupIdSelector = {
        displayMember: 'Title,Description',
        id: 'Id',
        fId: 'LinkMarketerGroupId',
        url: 'MarketingMarketerGroup',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Description',
        rowPerPage: 200,
        scope: $scope,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
                
                
            ]
        }
    }
$scope.LinkParentIdGruopProductSelector = {
        displayMember: 'Title,Description',
        id: 'Id',
        fId: 'LinkParentId',
        url: 'MarketingProductGroup',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Description',
        rowPerPage: 200,
        scope: $scope,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
                
                
            ]
        }
    }
$scope.LinkExternalCoreCmsUserIdSelector = {
        displayMember: 'Name,LastName',
        id: 'Id',
        fId: 'LinkCustomerSettingKindId',
        url: 'coreuser',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Name,LastName',
        rowPerPage: 200,
        scope: $scope,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'UserName', displayName: 'نام کاربری', sortable: true, type: 'string', visible: true },
                { name: 'Name', displayName: 'نام', sortable: true, type: 'string', visible: true },
                { name: 'LastName', displayName: 'نام خانوادگی', sortable: true, type: 'string', visible: true },
            ]
        }
    }
$scope.LinkParentIdGruopMarketerSelector = {
        displayMember: 'Title,Description',
        id: 'Id',
        fId: 'LinkParentId',
        url: 'MarketingMarketerGroup',
        sortColumn: 'Id',
        sortType: 0,
        filterText: 'Description',
        rowPerPage: 200,
        scope: $scope,
        columnOptions: {
            columns: [
                { name: 'Id', displayName: 'کد سیستمی', sortable: true, type: 'integer', visible: true },
                { name: 'Title', displayName: 'عنوان', sortable: true, type: 'string', visible: true },
                { name: 'Description', displayName: 'توضیحات', sortable: true, type: 'string', visible: true },
                
            ]
        }
    }

//#help#

//# add forms
    $scope.addNewCustomerToDb=function(frm)
    {

        if (frm.$invalid || $scope.selectedItem.LinkCustomerSettingPositionId==null || $scope.selectedItem.LinkCustomerSettingPositionId==0 || $scope.selectedItem.LinkCustomerSettingKindId==null || $scope.selectedItem.LinkCustomerSettingKindId==0 || $scope.selectedItem.LinkProductId==null || $scope.selectedItem.LinkProductId==0 || $scope.selectedItem.LinkCategoryId==null || $scope.selectedItem.LinkCategoryId==0 )
        {
           rashaErManage.showMessage($filter('translatentk')('Information_Not_Completed')); 
           return;
        }
        $scope.busyIndicatorManagement['customer'].isActive=true;
        $scope.addRequested = true;
        $scope.selectedItem.CustomerSettings=[];
        $scope.selectedItem.CustomerSettings.push({LinkProductId:$scope.selectedItem.LinkProductId,LinkCustomerSettingKindId:$scope.selectedItem.LinkCustomerSettingKindId,LinkCustomerSettingPositionId:$scope.selectedItem.LinkCustomerSettingPositionId,StartDate:$scope.selectedItem.StartDate});
        ajax.call(cmsServerConfig.configApiServerPath+'MarketingCustomer/add', $scope.selectedItem, 'POST').success(function (response) {
            $scope.addRequested = false;
            $scope.busyIndicatorManagement['customer'].isActive=false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $scope.customerList.unshift(response.Item);
                $scope.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            $scope.busyIndicatorManagement['customer'].isActive=false;
            $scope.addRequested = false;
        });


    }

$scope.addNewMarketerGroupToDb=function(frm)
    {

        if (frm.$invalid )
        {
           rashaErManage.showMessage($filter('translatentk')('Information_Not_Completed')); 
           return;
        }
        $scope.busyIndicatorManagement['marketergroup'].isActive=true;
        $scope.addRequested = true;
        //$scope.selectedItem.CustomerSettings=[];
        //$scope.selectedItem.CustomerSettings.push({LinkProductId:$scope.selectedItem.LinkProductId,LinkCustomerSettingKindId:$scope.selectedItem.LinkCustomerSettingKindId,LinkCustomerSettingPositionId:$scope.selectedItem.LinkCustomerSettingPositionId,StartDate:$scope.selectedItem.StartDate});
        ajax.call(cmsServerConfig.configApiServerPath+'MarketingMarketerGroup/add', $scope.selectedItem, 'POST').success(function (response) {
            $scope.addRequested = false;
            $scope.busyIndicatorManagement['marketergroup'].isActive=false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $scope.customerList.unshift(response.Item);
                $scope.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            $scope.busyIndicatorManagement['marketergroup'].isActive=false;
            $scope.addRequested = false;
        });


    }
$scope.addNewMarketerToDb=function(frm)
    {

        if (frm.$invalid )
        {
           rashaErManage.showMessage($filter('translatentk')('Information_Not_Completed')); 
           return;
        }
        $scope.busyIndicatorManagement['marketer'].isActive=true;
        $scope.addRequested = true;
        //$scope.selectedItem.CustomerSettings=[];
        //$scope.selectedItem.CustomerSettings.push({LinkProductId:$scope.selectedItem.LinkProductId,LinkCustomerSettingKindId:$scope.selectedItem.LinkCustomerSettingKindId,LinkCustomerSettingPositionId:$scope.selectedItem.LinkCustomerSettingPositionId,StartDate:$scope.selectedItem.StartDate});
        ajax.call(cmsServerConfig.configApiServerPath+'MarketingMarketer/add', $scope.selectedItem, 'POST').success(function (response) {
            $scope.addRequested = false;
            $scope.busyIndicatorManagement['marketer'].isActive=false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $scope.customerList.unshift(response.Item);
                $scope.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            $scope.busyIndicatorManagement['marketer'].isActive=false;
            $scope.addRequested = false;
        });


    }
$scope.addNewPositionToDb=function(frm)
    {

        if (frm.$invalid )
        {
           rashaErManage.showMessage($filter('translatentk')('Information_Not_Completed')); 
           return;
        }
        $scope.busyIndicatorManagement['position'].isActive=true;
        $scope.addRequested = true;
        //$scope.selectedItem.CustomerSettings=[];
        //$scope.selectedItem.CustomerSettings.push({LinkProductId:$scope.selectedItem.LinkProductId,LinkCustomerSettingKindId:$scope.selectedItem.LinkCustomerSettingKindId,LinkCustomerSettingPositionId:$scope.selectedItem.LinkCustomerSettingPositionId,StartDate:$scope.selectedItem.StartDate});
        ajax.call(cmsServerConfig.configApiServerPath+'MarketingCustomerSettingPosition/add', $scope.selectedItem, 'POST').success(function (response) {
            $scope.addRequested = false;
            $scope.busyIndicatorManagement['position'].isActive=false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $scope.customerList.unshift(response.Item);
                $scope.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            $scope.busyIndicatorManagement['position'].isActive=false;
            $scope.addRequested = false;
        });


    }
$scope.addNewSettingKindToDb=function(frm)
    {

        if (frm.$invalid )
        {
           rashaErManage.showMessage($filter('translatentk')('Information_Not_Completed')); 
           return;
        }
        $scope.busyIndicatorManagement['settingkind'].isActive=true;
        $scope.addRequested = true;
        //$scope.selectedItem.CustomerSettings=[];
        //$scope.selectedItem.CustomerSettings.push({LinkProductId:$scope.selectedItem.LinkProductId,LinkCustomerSettingKindId:$scope.selectedItem.LinkCustomerSettingKindId,LinkCustomerSettingPositionId:$scope.selectedItem.LinkCustomerSettingPositionId,StartDate:$scope.selectedItem.StartDate});
        ajax.call(cmsServerConfig.configApiServerPath+'MarketingCustomerSettingKind/add', $scope.selectedItem, 'POST').success(function (response) {
            $scope.addRequested = false;
            $scope.busyIndicatorManagement['settingkind'].isActive=false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $scope.customerList.unshift(response.Item);
                $scope.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            $scope.busyIndicatorManagement['settingkind'].isActive=false;
            $scope.addRequested = false;
        });


    }
$scope.addNewProductGroupToDb=function(frm)
    {

        if (frm.$invalid )
        {
           rashaErManage.showMessage($filter('translatentk')('Information_Not_Completed')); 
           return;
        }
        $scope.busyIndicatorManagement['productgroup'].isActive=true;
        $scope.addRequested = true;
        //$scope.selectedItem.CustomerSettings=[];
        //$scope.selectedItem.CustomerSettings.push({LinkProductId:$scope.selectedItem.LinkProductId,LinkCustomerSettingKindId:$scope.selectedItem.LinkCustomerSettingKindId,LinkCustomerSettingPositionId:$scope.selectedItem.LinkCustomerSettingPositionId,StartDate:$scope.selectedItem.StartDate});
        ajax.call(cmsServerConfig.configApiServerPath+'MarketingProductGroup/add', $scope.selectedItem, 'POST').success(function (response) {
            $scope.addRequested = false;
            $scope.busyIndicatorManagement['productgroup'].isActive=false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $scope.customerList.unshift(response.Item);
                $scope.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            $scope.busyIndicatorManagement['productgroup'].isActive=false;
            $scope.addRequested = false;
        });


    }
$scope.addNewProductToDb=function(frm)
    {

        if (frm.$invalid )
        {
           rashaErManage.showMessage($filter('translatentk')('Information_Not_Completed')); 
           return;
        }
        $scope.busyIndicatorManagement['product'].isActive=true;
        $scope.addRequested = true;
        //$scope.selectedItem.CustomerSettings=[];
        //$scope.selectedItem.CustomerSettings.push({LinkProductId:$scope.selectedItem.LinkProductId,LinkCustomerSettingKindId:$scope.selectedItem.LinkCustomerSettingKindId,LinkCustomerSettingPositionId:$scope.selectedItem.LinkCustomerSettingPositionId,StartDate:$scope.selectedItem.StartDate});
        ajax.call(cmsServerConfig.configApiServerPath+'MarketingProduct/add', $scope.selectedItem, 'POST').success(function (response) {
            $scope.addRequested = false;
            $scope.busyIndicatorManagement['product'].isActive=false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                $scope.customerList.unshift(response.Item);
                $scope.closeModal();
            }
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            $scope.busyIndicatorManagement['product'].isActive=false;
            $scope.addRequested = false;
        });


    }
//#help#

    $scope.init=function()
    {
        $scope.getAllData('position',{});
        $scope.getAllData('customer',{});
        $scope.getAllData('product',{});
        $scope.getAllData('reminder',{Filters:[{PropertyName:'CustomerSettingActivityType',EnumValue1:'Reminder'}]});
    }

    
    $scope.getAllData=function(sender,data)
    {
        var url='';
        if (sender=='customer')
            url = cmsServerConfig.configApiServerPath +'MarketingCustomer/getAll';
        if (sender=='product')
            url = cmsServerConfig.configApiServerPath +'MarketingProduct/getAll';
        if (sender=='position')
            url = cmsServerConfig.configApiServerPath +'MarketingCustomerSettingPosition/getAll';
        if (sender=='reminder')
            url = cmsServerConfig.configApiServerPath +'MarketingCustomerSettingActivity/getAll';
        if (sender=='meeting')
            url = cmsServerConfig.configApiServerPath +'MarketingCustomerSettingActivity/getAll';
        if (sender=='comment')
            url = cmsServerConfig.configApiServerPath +'MarketingCustomerSettingActivity/getAll';
        if (sender=='alert')
            url = cmsServerConfig.configApiServerPath +'MarketingCustomerSettingActivity/getAll';
        if (sender=='session')
            url = cmsServerConfig.configApiServerPath +'MarketingCustomerSettingActivity/getAll';
        if (sender=='communication')
            url = cmsServerConfig.configApiServerPath +'MarketingCustomerSettingActivity/getAll';

        $scope.busyIndicatorManagement[sender].isActive=true;
        ajax.call(url, data, "POST").success(function (response) 
        {
           $scope.busyIndicatorManagement[sender].isActive=false;
           rashaErManage.checkAction(response);
           if (response.IsSuccess)
           {  
               if (sender=='customer')
                    $scope.customerList=response.ListItems;
               if (sender=='product')
                    $scope.productList=response.ListItems;
               if (sender=='position')
                    $scope.positionList=response.ListItems;
               if (sender=='reminder')
                    $scope.reminderList=response.ListItems;
                    //$scope.reminderList.push({Title:'aaaa',Description:'bbbbb',ReminderDate:todayDate});
               if (sender=='meeting')
                    $scope.meetingList=response.ListItems;
                    //$scope.meetingList.push({Title:'aaaa',Description:'bbbbb'});
               if (sender=='comment')
                    $scope.commentList=response.ListItems;  
                   //$scope.commentList.push({Title:'aaaa',Description:'bbbbb'}); 
               if (sender=='alert')
                    $scope.alertList=response.ListItems;
                   // $scope.alertList.push({Title:'aaaa',Description:'bbbbb'});
               if (sender=='session')
                    $scope.sessionList=response.ListItems;
                  //  $scope.sessionList.push({Title:'aaaa',Description:'bbbbb'});
               if (sender=='communication')
                    $scope.communicationList=response.ListItems;
                   // $scope.communicationList.push({Title:'aaaa',Description:'bbbbb'});
           }        
        }).error(function (data, errCode, c, d) {
            $scope.busyIndicatorManagement[sender].isActive=false;
        });
    }


    $scope.closeModal=function()
    {
         $modalStack.dismissAll();
    }
}]);