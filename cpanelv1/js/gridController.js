app.controller("gridCtrl", ["$scope", "$http", "ajax", 'rashaErManage', function ($scope, $http, ajax, rashaErManage) {


    $scope.init = function () {
        //$http.get("/bank/getall")
        ajax.call(cmsServerConfig.configApiServerPath+"bank/getall", {}, 'POST').success(function (response) {
            //$scope.gridOptions.data = response;
            rashaErManage.checkAction(response);
            $scope.columnOptions.data = response.ListItems;
            $scope.fillData();
            $scope.currentPageNumber = response.CurrentPageNumber;
            $scope.totalRowCount = response.TotalRowCount;
            $scope.rowPerPage = response.RowPerPage;
            $scope.maxSize = 5;

        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
            //responseErrorManage.checkAction(data);
            //if (errCode == 401) {
                
            //}
            
            //console.log(b);
            //console.log(c);
            //console.log(d);
        });
    }
    //$scope.advancedSearchOption= {
    //    filterRows=
    //    }
    $scope.editRow = function(row) {
        console.log(row);
    };
    $scope.columnOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true,type:'integer' },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'TitleFa', displayName: 'عنوان', type: 'string'},
            { name: 'Province.Title', displayName: 'استان', template: 'x.Privince.Title | Upper', type: 'string'},
            { displayName: 'کلید های عملیاتی' , template :'<button class="btn btn-primary" ng-click="editRow(x)">ویرایش</button>'}
        ],
        data: {},
        multiSelect:false
    }
    //$scope.gridOptions = {
    //    enableCellSelection: true,
    //    enableCellEditOnFocus: true,
    //    rowTemplate: '<div ng-dblclick="onDblClickRow(row)" ng-style="{ \’cursor\’: row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell {{col.cellClass}}"><div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }">&nbsp;</div><div ng-cell></div></div>',
    //    columnDefs: [
    //        {
    //            name: 'Id', displayName: 'کد سیستمی', sortable: false
    //        },
    //      { name: 'TitleFa', displayName: 'عنوان' },
    //      { name: 'Province.Title', displayName: 'استان' }
    //    ]
    //};
    $scope.onDblClickRow = function (rowItem) {
        alert('ok');
    };
    $scope.pagingOptions = {
        pageSizes: [5, 10, 15],
        pageSize: 5,
        totalServerItems: 432,
        currentPage: 1
    }
}]);