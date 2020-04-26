app.controller("marketingCustomerSettingPositionController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$window', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $window, $filter) {
    var marketingPosition=this;
    marketingPosition.SpecificationsCustomer;
    marketingPosition.positionList=[];
    marketingPosition.CustomerList=[];
    marketingPosition.positionItem=[];
    marketingPosition.addCustomer=function(positionIdC)
    {
        $modal.open({
            templateUrl: 'cpanelv1/ModuleMarketing/MarketingCustomerSettingPosition/add.html',
            scope: $scope
        });
    }

    
    marketingPosition.positionListConfig={
        items:[],
        AddActivity:$scope.AddActivity,
        OpenSettingPosition:$scope.OpenSettingPosition,
        OpenSpecificationsCustomer:$scope.OpenSpecificationsCustomer,
        addCustomer:$scope.addCustomer,
        closeModal:$scope.closeModal,
        selectCustomer:$scope.selectCustomer,
    }

    marketingPosition.init=function() {
        ajax.call(cmsServerConfig.configApiServerPath+"MarketingCustomerSetting/getall", {}, 'POST').success(function (response1) {
            marketingPosition.CustomerList = response1.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
        ajax.call(cmsServerConfig.configApiServerPath+"MarketingCustomerSettingPosition/getall", { RowPerPage: 1000 }, 'POST').success(function (response) {

            marketingPosition.positionListConfig.items.push({
                Id: -1,
                config: 'marketingPosition.positionList[0]',
                title: 'Lost',
                addCustomer: marketingPosition.addCustomer,
                busyIndicatorIsBusy: { isActive: false },
                listItems:[
                          {Title:'Neda',LinkMemberId:'yazdani',src:'http://ntkcms.com/images/77456e3345b24fde821fa2f0a69b45bcThumbnailImage.jpg',LinkCategoryId:'programer',LinkCustomerSettingKindIdSelector:'aa',LinkProductId:'aaa',LinkCustomerSettingPositionIdSelector:'bb',color:'red',Iswatcher:false,Activities:5,tags:[{title:'web'},{title:'C#'},{title:'web'},{title:'C#'},{title:'web'},{title:'C#'}]},
                          {title:'Neda',description:'yazdani',src:'http://ntkcms.com/images/77456e3345b24fde821fa2f0a69b45bcThumbnailImage.jpg',job:'programer',color:'green',Iswatcher:true,Activities:4,tags:[{title:'web'},{title:'C#'},{title:'web'},{title:'C#'},{title:'web'},{title:'C#'}]},
                          {title:'Neda',description:'yazdani',src:'http://ntkcms.com/images/77456e3345b24fde821fa2f0a69b45bcThumbnailImage.jpg',job:'programer',color:'blue',Iswatcher:false,Activities:3}
                           ]
                ,cssStyle:'background-color:orange;color:black',
                cssClass:''
            });

            for (var i = 0; i < response.ListItems.length; i++) {
                for (var j = 0; j < marketingPosition.CustomerList.length; j++) {
                   if (marketingPosition.CustomerList[j].LinkCustomerSettingPositionId == response.ListItems[i].Id) {
                       marketingPosition.positionListConfig.items.listItems.push();
                   }
                }
                marketingPosition.positionListConfig.items.push(
                    {
                        Id: response.ListItems[i].Id,
                        config: 'marketingPosition.positionList[' + (i+1) + ']',
                        title: response.ListItems[i].Title,
                        addCustomer: marketingPosition.addCustomer,
                        busyIndicatorIsBusy: { isActive: false },
                        listItems: [],
                        cssStyle: 'background-color:lightgreen;color:black',
                        cssClass: ''
                    });
            }
            //
            marketingPosition.positionListConfig.items.push({Id:-2,config:'marketingPosition.positionList['+(response.ListItems.length+1)+']',title:'Win',addCustomer:marketingPosition.addCustomer,busyIndicatorIsBusy:{isActive:false},listItems:[],cssStyle:'background-color:green;color:white',cssClass:''});
            marketingPosition.positionList = marketingPosition.positionListConfig.items;
            marketingPosition.positionListConfig.apply();
            
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
       
    }
    $scope.closeModal=function()
    {
         $modalStack.dismissAll();
    }
    
    $scope.OpenSpecificationsCustomer=function(Customer) {
        marketingPosition.SpecificationsCustomer = Customer;
        $modal.open({
            templateUrl: 'cpanelv1/ModuleMarketing/MarketingCustomerSettingPosition/CustomerView.html',
            scope: $scope
        });
    }
    $scope.OpenSettingPosition=function(positionId) {
        
        marketingPosition.init();
        ajax.call(cmsServerConfig.configApiServerPath+"MarketingCustomerSettingPosition/GetOne", positionId, 'GET').success(function (response) {
            
            marketingPosition.positionItem=response.Item;
           $modal.open({
                templateUrl: 'cpanelv1/ModuleMarketing/MarketingCustomerSettingPosition/SettingPosition.html',
                scope: $scope
            });     
        });
    }
   $scope.selectCustomer=function(customerId)
    {
        ajax.call(cmsServerConfig.configApiServerPath+"MarketingCustomer/GetOne", customerId, 'GET').success(function (response) {
            marketingPosition.positionList=response.Item;
           $modal.open({
                templateUrl: 'cpanelv1/ModuleMarketing/MarketingCustomerSettingPosition/selectCustomer.html',
                scope: $scope
            });     
        });
    }
    $scope.AddActivity=function(x)
    {
            $modal.open({
                templateUrl: 'cpanelv1/ModuleMarketing/MarketingCustomerSettingPosition/AddActivity.html',
                scope: $scope
            });
        console.log('test');
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
    //#help#

}]);