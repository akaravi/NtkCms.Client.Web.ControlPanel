app.controller("ticketingAnswerController", ["$scope", "$http", "ajax", 'rashaErManage', '$modal', '$modalStack', 'SweetAlert', '$timeout', '$filter', function ($scope, $http, ajax, rashaErManage, $modal, $modalStack, sweetAlert, $timeout, $filter) {
    var ticketingAnswer = this;



    ticketingAnswer.loadingBusyIndicator = {
        isActive: false,
        message: "در حال بارگذاری ..."
    }
    ticketingAnswer.attachedFiles = [];

    ticketingAnswer.filePickerFiles = {
        isActive: true,
        backElement: "filePickerFiles",
        multiSelect: false,
        fileId: null,
        filename: null
      };
      applicationIntro.filePickerMainImage = {
        isActive: true,
        backElement: "filePickerMainImage",
        filename: null,
        fileId: null,
        multiSelect: false
    };

    var date = moment().format();
    // ticketingAnswer.startDate = {
    //     defaultDate: date
    // }
    // ticketingAnswer.endDate = {
    //     defaultDate: date
    // }

    ticketingAnswer.selectedItem = {};

    ticketingAnswer.init = function () {
        ticketingAnswer.loadingBusyIndicator.isActive = true;

        var engine = {};
        try {
            engine = ticketingAnswer.gridOptions.advancedSearchData.engine;
        } catch (error) {
            console.log(error)
        }

        ajax.call(cmsServerConfig.configApiServerPath+"TicketingAnswer/getall", engine, 'POST').success(function (response) {
            console.log(response.ListItems);
            ticketingAnswer.ListItems = response.ListItems;
            ticketingAnswer.gridOptions.fillData(response.ListItems);
            ticketingAnswer.getType();
            ticketingAnswer.loadingBusyIndicator.isActive = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            ticketingAnswer.loadingBusyIndicator.isActive = false;
        });

    }

    ticketingAnswer.getType = function () {
        ajax.call(cmsServerConfig.configApiServerPath+"ticketingDepartemen/getall", {}, 'POST').success(function (response) {
            console.log("asd");
            console.log(response.ListItems);
            ticketingAnswer.TypeList = response.ListItems;
        }).error(function (data, errCode, c, d) {
            console.log(data);
        });
    }

    ticketingAnswer.addNewModel = function () {

        ajax.call(cmsServerConfig.configApiServerPath+'TicketingAnswer/GetViewModel', "", 'GET').success(function (response) {
            //rashaErManage.checkAction(response);
            console.log(response);
            ticketingAnswer.selectedItem = response.Item;
            ticketingAnswer.selectedItem.ActionDate = date;
            console.log(ticketingAnswer.TypeList);
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/TicketingAnswer/add.html',
                scope: $scope
            });


        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });

    };

    ticketingAnswer.editmodel = function () {
        if (!ticketingAnswer.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('please_select_a_row_to_edit'));
            return;
        }
        ticketingAnswer.modalTitle = 'ویرایش';
        ajax.call(cmsServerConfig.configApiServerPath+'TicketingAnswer/GetOne', ticketingAnswer.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {
            rashaErManage.checkAction(response);
            ticketingAnswer.selectedItem = response.Item;
            $modal.open({
                templateUrl: 'cpanelv1/ModuleTicketing/TicketingAnswer/edit.html',
                scope: $scope
            });
        }).error(function (data, errCode, c, d) {
            rashaErManage.checkAction(data, errCode);
        });
    };

    ticketingAnswer.addNew = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ticketingAnswer.selectedItem.LinkCmsPageId = 1;
        console.log((ticketingAnswer.selectedItem));
        ticketingAnswer.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TicketingAnswer/add',  ticketingAnswer.selectedItem , 'POST').success(function (response) {
            rashaErManage.checkAction(response);
            console.log(response);
            if (response.IsSuccess) {
                ticketingAnswer.ListItems.unshift(response.Item);
                ticketingAnswer.gridOptions.fillData(ticketingAnswer.ListItems);
                ticketingAnswer.closeModal();
            }
            ticketingAnswer.addRequested = false;
        }).error(function (data, errCode, c, d) {
            console.log(data);
            rashaErManage.checkAction(data, errCode);
            ticketingAnswer.addRequested = false;
        });
    }


    ticketingAnswer.edit = function (frm) {
        if (frm.$invalid)
        {
            rashaErManage.showMessage($filter('translatentk')('form_values_full_have_not_been_entered'));
            return;
        }
        ticketingAnswer.addRequested = true;
        ajax.call(cmsServerConfig.configApiServerPath+'TicketingAnswer/edit',  ticketingAnswer.selectedItem , 'PUT').success(function (response) {
            ticketingAnswer.addRequested = false;
            rashaErManage.checkAction(response);
            if (response.IsSuccess) {
                ticketingAnswer.replaceItem(ticketingAnswer.selectedItem.Id, response.Item);
                ticketingAnswer.gridOptions.fillData(ticketingAnswer.ListItems);
                ticketingAnswer.closeModal();
            }

        }).error(function (data, errCode, c, d) {
            ticketingAnswer.addRequested = false;
            rashaErManage.checkAction(data, errCode);
        });
    }

    ticketingAnswer.delete = function () {
        if (!ticketingAnswer.gridOptions.selectedRow.item) {
            rashaErManage.showMessage($filter('translatentk')('Please_Select_A_Row_To_Remove'));
            return;
        }
        rashaErManage.showYesNo(($filter('translatentk')('warning')), ($filter('translatentk')('do_you_want_to_delete_this_attribute')), function (isConfirmed) {
            if (isConfirmed) {
                console.log(ticketingAnswer.gridOptions.selectedRow.item);
                ajax.call(cmsServerConfig.configApiServerPath+'TicketingAnswer/GetOne', ticketingAnswer.gridOptions.selectedRow.item.Id , 'GET').success(function (response) {

                    rashaErManage.checkAction(response);
                    ticketingAnswer.selectedItemForDelete = response.Item;
                    console.log(ticketingAnswer.selectedItemForDelete);
                    ajax.call(cmsServerConfig.configApiServerPath+'TicketingAnswer/delete', ticketingAnswer.selectedItemForDelete , 'POST').success(function (res) {
                        rashaErManage.checkAction(res);
                        if (res.IsSuccess) {
                            ticketingAnswer.replaceItem(ticketingAnswer.selectedItemForDelete.Id);
                            ticketingAnswer.gridOptions.fillData(ticketingAnswer.ListItems);
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


    ticketingAnswer.replaceItem = function (oldId, newItem) {
        angular.forEach(ticketingAnswer.ListItems, function (item, key) {
            if (item.Id == oldId) {
                var index = ticketingAnswer.ListItems.indexOf(item);
                ticketingAnswer.ListItems.splice(index, 1);
            }
        });
        if (newItem)
            ticketingAnswer.ListItems.unshift(newItem);
    }

    ticketingAnswer.closeModal = function () {
        $modalStack.dismissAll();
    };

    ticketingAnswer.gridOptions = {
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

    ticketingAnswer.summernoteOptions = {
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