app.controller("ticketAnswerController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $filter) {
    var ticketAnswer = this;


    ticketAnswer.loadingBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }

    var date = moment().format();
    ticketAnswer.startDate = {
        defaultDate: date
    }
    ticketAnswer.endDate = {
        defaultDate: date
    }

    ticketAnswer.selectedItem = {};

    ticketAnswer.init = function () {
        ticketAnswer.loadingBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = ticketAnswer.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(mainPathApi+"ticketanswer/getall", engine, 'POST').success(function (response) {
            console.log(response.ListItems);
            ticketAnswer.ListItems = response.ListItems;
            ticketAnswer.gridOptions.fillData(response.ListItems);
            ticketAnswer.getType();
            ticketAnswer.loadingBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            ticketAnswer.loadingBusyIndicator.isActive = false;
        });

    }

    ticketAnswer.getType = function () {
        ajax.call(mainPathApi+"ticketanswerType/getall", {}, 'POST').success(function (response) {
            console.log("asd");
            console.log(response.ListItems);
            ticketAnswer.TypeList = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }

    ticketAnswer.addNewModel = function () {

        ajax.call(mainPathApi+'ticketanswer/getviewmodel', "0", 'GET').success(function (response) {
            //rashaErManage.checkAction(response);
            console.log(response);
            ticketAnswer.selectedItem = response.Item;
            ticketAnswer.selectedItem.ActionDate = date;
            console.log(ticketAnswer.TypeList);
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/TicketAnswer/add.html',
                scope: $scope
            });


        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });

    };

    ticketAnswer.editmodel = function () {
        if (!ticketAnswer.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Edit'));
            return;
        }
        ticketAnswer.modalTitle = 'ویرایش';
        ajax.call(mainPathApi+'ticketanswer/getviewmodel', ticketAnswer.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            ticketAnswer.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/TicketAnswer/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    ticketAnswer.addNew = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        ticketAnswer.selectedItem.LinkCmsPageId = 1;
        console.log((ticketAnswer.selectedItem));
        ticketAnswer.addRequested = true;
        ajax.call(mainPathApi+'ticketanswer/add',  ticketAnswer.selectedItem , 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                ticketAnswer.ListItems.unshift(response.Item);
                ticketAnswer.gridOptions.fillData(ticketAnswer.ListItems);
                ticketAnswer.closeModal();
            }
            ticketAnswer.addRequested = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            rashaErManage.checkAction(data, errCode);
            ticketAnswer.addRequested = false;
        });
    }


    ticketAnswer.edit = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translate')('form_values_full_have_not_been_entered'));
            return;
        }
        ticketAnswer.addRequested = true;
        ajax.call(mainPathApi+'ticketanswer/edit',  ticketAnswer.selectedItem , 'PUT').success(function (response) {
            ticketAnswer.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketAnswer.replaceItem(ticketAnswer.selectedItem.Id, response.Item);
                ticketAnswer.gridOptions.fillData(ticketAnswer.ListItems);
                ticketAnswer.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            ticketAnswer.addRequested = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    ticketAnswer.delete = function () {
        if (!ticketAnswer.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translate')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translate')('Warning')), ($filter('translate')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(ticketAnswer.gridOptions.selectedRow.item);
                ajax.call(mainPathApi+'ticketAnswer/getviewmodel', ticketAnswer.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {

                    rashaErManage.checkAction(response);
                    ticketAnswer.selectedItemForDelete = response.Item;
                    console.log(ticketAnswer.selectedItemForDelete);
                    ajax.call(mainPathApi+'ticketAnswer/delete', ticketAnswer.selectedItemForDelete , 'DELETE').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            ticketAnswer.replaceItem(ticketAnswer.selectedItemForDelete.Id);
                            ticketAnswer.gridOptions.fillData(ticketAnswer.ListItems);
                        }

                    }).error(function (data2, errCode2, c2, d2) {
                        rashaErManage.checkAction(data2);
                    });
                }).error(function (data, errCode, c, d) {
                    rashaErManage.checkAction(data, errCode);
                });
            }
        });
    };


    ticketAnswer.replaceItem = function (oldId, newItem) {
        angular.forEach(ticketAnswer.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = ticketAnswer.ListItems.indexOf(item);
                ticketAnswer.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            ticketAnswer.ListItems.unshift(newItem);
    }

    ticketAnswer.closeModal = function () {
        $modalStack.dismissAll();
    };

    ticketAnswer.gridOptions = {
        columns: [
            { name: 'Id', displayName: 'کد سیستمی', sortable: true },
            { name: 'LinkSiteId', displayName: 'کد سیستمی سایت', sortable: true, type: 'integer', visible: true },
            { name: 'LinkTicketId', displayName: 'شناسه سایت', sortable: true, isDate: true },
            { name: 'HtmlResult', displayName: 'جواب', sortable: true },
           
        ],
        data: {},
        multiSelect: false,
        advancedSearchData: {
            engine: {}
        }
    }

    ticketAnswer.summernoteOptions = {
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






}]);