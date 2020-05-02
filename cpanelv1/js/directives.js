/**
 * fullScroll - Directive for slimScroll with 100%
 */

function fullScroll($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            $timeout(function () {
                element.slimscroll({
                    height: '100%',
                    railOpacity: 0.9
                });

            });
        }
    };
}


itemRecordstatus = [];

/**
 * slimScroll - Directive for slimScroll with custom height
 */
function slimScroll($timeout) {
    return {
        restrict: 'A',
        scope: {
            boxHeight: '@'
        },
        link: function (scope, element) {
            $timeout(function () {
                element.slimscroll({
                    height: scope.boxHeight,
                    railOpacity: 0.9
                });

            });
        }
    };
}

/**
 * landingScrollspy - Directive for scrollspy in landing page
 */
function landingScrollspy() {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.scrollspy({
                target: '.navbar-fixed-top',
                offset: 80
            });
        }
    }
}


//- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

function includeReplace($compile) {
    return {
        require: 'ngInclude',
        restrict: 'A',
        /* optional */
        link: function (scope, element, attrs) {
            String.prototype.replaceAll = function (toReplace, replaceWith) {
                return this.toString().split(toReplace).join(replaceWith);
            }
            atr = attrs.includeReplace;
            if (!atr) {
                throw "includeReplace Configuration Not Found";
            }
            var findStr = "";
            var replaceStr = "";
            if (atr.indexOf("|") > 0) {
                var split = atr.split("|");
                findStr = split[0];
                replaceStr = split[1];
            }

            var newValue = element.html().replaceAll(findStr, replaceStr);

            //element.replaceWith(newValue);
            //$compile(element.contents())(scope);
            //-----
            var e = $compile(newValue)(scope);
            element.replaceWith(e);
        }
    };
};
/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function (scope, element) {
            var listener = function (event, toState, toParams, fromState, fromParams) {
                // Default title - load on Dashboard 1
                var title = 'NTK Admin | Cms Admin';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'NTK Admin | ' + toState.data.pageTitle;
                $timeout(function () {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};

function lowerThanDate() {
    return {
        require: 'ngModel',

        link: function (scope, element, attrs, ngModel) {
            element.bind("focusout", function () {
                console.log(scope.$apply(attrs.date));
                console.log(scope.$apply(attrs.comparsionDate));
            });
        }
    }
};
//http://jsfiddle.net/skorp/L7mafc7f/
function resizable($compile) {
    return {
        restrict: 'A',
        //    scope: {
        //        rangeOptions: '='
        //    },
        link: function (scope, element, attrs) {
            scope.offset = function () {
                var rec = document.getElementById(config.mainDrag).getBoundingClientRect(),
                    bodyElt = document.body;
                return {
                    top: rec.top + bodyElt.scrollTop,
                    left: rec.left + bodyElt.scrollLeft
                }
            }
            //@help@ config
            var config = {};
            var atr = '';
            atr = $(element).attr('resizable');
            if (!atr) {
                throw "resizable Configuration Not Found";
            }
            if (atr.indexOf(".") > 0) {
                var split = atr.split(".");
                if (split.length == 2) {
                    var temp = scope[split[0]];
                    config = temp[split[1]];
                } else {
                    var temp = scope[split[0]];
                    var temp2 = temp[split[1]];
                    config = temp2[split[2]];
                }
            } else
                config = scope[atr];

            //config.sourceDrag
            //config.controllerDrag
            //config.mainDrag
            //config.values
            //@help@ config

            //@help@ template
            //            var template = '<li><i style="cursor:pointer;" ng-click=??config??.collapse(x,$event)></i> <span class="btn-tree" ng-click="??config??.select(x,$event)">...</span></li>  <li ng-repeat="x in ??config??.Items" ng-if="x.LinkParentId == null">' +
            //               '<i ng-if="(x.Children.length > 0)" style="cursor:pointer;" ng-class="{' + "'fa fa-folder-open'" + ': (x.Children.length > 0)}" ng-click=??config??.collapse(x,$event)></i> <span class="btn-tree" ng-class="{' + "'btn-tree-active'" + ': ??config??.isEqual(x, ??config??.currentNode)}" ng-click="??config??.select(x,$event)">{{x.??Title??}}</span> <ul tree-node="??Children??" tree-config="??config??" tree-list="x.??Children??"></ul></li>';

            var template = '<div ng-repeat="box in ??config??.values" style="left:{{box.pos_x}}px; top:{{box.pos_y}}px;height:{{box.height}}px;width:{{box.width}}px">{{box.element}}</div>';
            template = template.replaceAll("??config??", atr)
                .replaceAll("??Title??", config.displayMember)
                .replaceAll("??Children??", config.displayChild)
                .replaceAll("??Children??", config.displayChild);
            var el = $compile(template)(scope);
            document.getElementById(config.mainDrag).append(el);




            //@help@ template
            var elementSourceDrag = document.getElementById(config.sourceDrag)
            //elementSourceDrag.on('onclick', function (evt, ui) {
            //    //if (scope.callback) { scope.callback(); }
            //    console.log('click');

            //    //console.log(myconfig.name);
            //    //console.log(myValue.vname);
            //});
            element.resizable({
                handles: " n, e, s, w, ne, se, sw, nw"
            });
            element.on('resizestop', function (evt, ui) {
                //if (scope.callback) { scope.callback(); }
                console.log('resize stop');

                //console.log(myconfig.name);
                //console.log(myValue.vname);
            });
            element.on('resizestart', function (evt, ui) {
                console.log('resize start');
            });
            element.on('resizecreate', function (evt, ui) {
                console.log('resize create');
            });
            element.on('resize', function (evt, ui) {
                console.log('reisze');
            });
            element.on('mouseover', function () {
                console.log('mouseover');
                element.addClass('enter');
            });
            element.on('mouseleave', function () {
                console.log('mouseleft');
                element.removeClass('enter');
            });

            element.on('dblclick', function (el) {
                console.log(el);
            });
            element.on('dragstop', function (event, ui) {
                console.log('####DRAG stop####');
                console.log(ui.position);
                console.log(ui.offset);
                var posOff = scope.offset(),
                    newPosX = ui.offset.left - posOff.left,
                    newPosY = ui.offset.top - posOff.top

                console.log(newPosY);
                console.log(newPosX);
                console.log(config.values);
            });


            element.draggable({
                containment: "#" + config.mainDrag
            });
            //@help@ function 
            scope.valueSet = function (setValue, remove) {
                var idKey = elementLast.id;
                //ntkDragg.valueSet( {  top: top, left: left, height: height, width: width, rotate: rotate });
                for (var i = 0; i < config.values.length; i++) {
                    if (config.values[i] && config.values[i].id === idKey) {
                        if (remove) {
                            config.values.splice(i, 1);
                            console.log(config.values);
                            return;
                        }
                        if (setValue) {
                            if (setValue.type)
                                config.values[i].type = setValue.type;
                            if (setValue.top)
                                config.values[i].top = setValue.top;
                            if (setValue.left)
                                config.values[i].left = setValue.left;
                            if (setValue.height)
                                config.values[i].height = setValue.height;
                            if (setValue.width)
                                config.values[i].width = setValue.width;
                            if (setValue.rotate)
                                config.values[i].rotate = setValue.rotate;
                        }
                        console.log(config.values);
                        return config.values[i];
                    }
                }
                if (setValue) {
                    setValue.id = idKey;
                    config.values.push(setValue);
                }
                console.log(config.values);
            }
            //@help@ function
            //       if (!config) {
            //           throw "Configuration Not Found";
            //       }
            //       config.collapse = function (item, ele) {
            //           if ($(ele.currentTarget).hasClass('fa-folder-open')) {
            //               $(ele.currentTarget).removeClass('fa-folder-open').addClass('fa-folder');
            //               $(ele.currentTarget).next().next().slideToggle();
            //           } else {
            //               $(ele.currentTarget).removeClass('fa-folder').addClass('fa-folder-open');
            //               $(ele.currentTarget).next().next().slideToggle();
            //           }
            //
            //       }
            //
            //       config.select = function (item) {
            //           if (!item) {
            //               //console.log("Root selected");
            //               config.currentNode = null;
            //               config.onNodeSelect(item);
            //           }
            //           else {
            //               config.currentNode = item;
            //               config.onNodeSelect(item);
            //           }
            //       }
            //
            //       config.removeNode = function (item) {
            //       }
            //
            //       config.isEqual = function (item1, item2) {
            //           if (item1 != undefined && item1 != null && item2 != undefined && item2 != null)
            //               return (item1.Id == item2.Id);
            //           return false;
            //
            //       }
            //       //console.log(config);
            //       var template = '<li><i style="cursor:pointer;" ng-click=??config??.collapse(x,$event)></i> <span class="btn-tree" ng-click="??config??.select(x,$event)">...</span></li>  <li ng-repeat="x in ??config??.Items" ng-if="x.LinkParentId == null">' +
            //           '<i ng-if="(x.Children.length > 0)" style="cursor:pointer;" ng-class="{' + "'fa fa-folder-open'" + ': (x.Children.length > 0)}" ng-click=??config??.collapse(x,$event)></i> <span class="btn-tree" ng-class="{' + "'btn-tree-active'" + ': ??config??.isEqual(x, ??config??.currentNode)}" ng-click="??config??.select(x,$event)">{{x.??Title??}}</span> <ul tree-node="??Children??" tree-config="??config??" tree-list="x.??Children??"></ul></li>';
            //       template = template.replaceAll("??config??", atr)
            //           .replaceAll("??Title??", config.displayMember)
            //           .replaceAll("??Children??", config.displayChild)
            //           .replaceAll("??Children??", config.displayChild);
            //           //.replaceAll("??LinkParentId??", config.displayLinkParentId);
            //       var el = $compile(template)(scope);
            //       element.append(el);
        }
    }
}
//http://jsfiddle.net/skorp/L7mafc7f/
function resizableAAAAAAAAAAAAAAAA() {
    //myconfig,myValue
    return {
        restrict: 'A',
        scope: {
            rangeOptions: '='
        },
        link: function postLink(scope, elem, attrs) {
            scope.offset = function () {
                var rec = document.getElementById('mainDrag').getBoundingClientRect(),
                    bodyElt = document.body;
                return {
                    top: rec.top + bodyElt.scrollTop,
                    left: rec.left + bodyElt.scrollLeft
                }
            };
            elem.resizable({
                handles: " n, e, s, w, ne, se, sw, nw"
            });
            elem.on('resizestop', function (evt, ui) {
                //if (scope.callback) { scope.callback(); }
                console.log('resize stop');

                //console.log(myconfig.name);
                //console.log(myValue.vname);
            });
            elem.on('resizestart', function (evt, ui) {
                console.log('resize start');
            });
            elem.on('resizecreate', function (evt, ui) {
                console.log('resize create');
            });
            elem.on('resize', function (evt, ui) {
                console.log('reisze');
            });
            elem.on('mouseover', function () {
                console.log('mouseover');
                elem.addClass('enter');
            });
            elem.on('mouseleave', function () {
                console.log('mouseleft');
                elem.removeClass('enter');
            });

            elem.on('dblclick', function (el) {
                console.log(el);
            });

            elem.on('dragstop', function (event, ui) {
                console.log('####DRAG stop####');
                console.log(ui.position);
                console.log(ui.offset);
                var posOff = scope.offset(),
                    newPosX = ui.offset.left - posOff.left,
                    newPosY = ui.offset.top - posOff.top

                console.log(newPosY);
                console.log(newPosX);
            });
            elem.draggable({
                containment: "#mainDrag"
            });

        }
    }
};


/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */

function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element) {

            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function () {
                element.metisMenu();
            });

            // Enable initial fixed sidebar
            var sidebar = element.parent();
            sidebar.slimScroll({
                height: '100%',
                railOpacity: 0.9
            });
        }
    };
};
//.addHeader("Access-Control-Allow-Origin", "*")
$.ajax({
    type: "GET",
    async: false,
    url: cmsServerConfig.configApiServerPath + "CoreEnum/EnumRecordStatus",
    contentType: "application/json",
    success: function (response) {
        itemRecordStatus = response.ListItems;
    },
    error: function (data) {
        console.log(data);
    }
});

/**
 * iboxTools - Directive for iBox tools elements in right corner of ibox
 */
function iboxTools($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'cpanelv1/ModuleCore/common/ibox_tools.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                    var ibox = $element.closest('div.ibox');
                    var icon = $element.find('i:first');
                    var content = ibox.find('div.ibox-content');
                    content.slideToggle(200);
                    // Toggle icon from up to down
                    icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                    ibox.toggleClass('').toggleClass('border-bottom');
                    $timeout(function () {
                        ibox.resize();
                        ibox.find('[id^=map-]').resize();
                    }, 50);
                },
                // Function for close ibox
                $scope.closebox = function () {
                    var ibox = $element.closest('div.ibox');
                    ibox.remove();
                }
        }
    };
};
/**
 * minimalizaSidebar - Directive for minimalize sidebar
 */
function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function ($scope, $element) {
            $scope.minimalize = function () {
                $("body").toggleClass("mini-navbar");
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    $('#side-menu').hide();
                    // For smoothly turn on menu
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 100);
                } else if ($('body').hasClass('fixed-sidebar')) {
                    $('#side-menu').hide();
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(500);
                        }, 300);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    $('#side-menu').removeAttr('style');
                }
            }
        }
    };
};

function bindValidity($parse) {
    return {
        restrict: 'A',
        scope: false,
        controller: [
            '$scope', '$attrs',
            function ($scope, $attrs) {
                var assign = $parse($attrs.bindValidity).assign;

                if (!angular.isFunction(assign)) {
                    throw new Error('the expression of bindValidity is not settable: ' + $attrs.bindValidity);
                }

                this.setFormController = function (formCtrl) {
                    if (!formCtrl) {
                        throw new Error('bindValidity requires one of <form> or ng-form');
                    }
                    $scope.$watch(
                        function () {
                            return formCtrl.$invalid;
                        },
                        function (newval) {
                            assign($scope, newval);
                        }
                    );
                };
            }
        ],
        require: ['?form', '?ngForm', 'bindValidity'],
        link: function (scope, elem, attrs, ctrls) {
            var formCtrl, bindValidity;
            formCtrl = ctrls[0] || ctrls[1];
            bindValidity = ctrls[2];
            bindValidity.setFormController(formCtrl);
        }
    };
};

function ionRangeSlider() {
    return {
        restrict: 'A',
        scope: {
            rangeOptions: '='
        },
        link: function (scope, elem, attrs) {
            elem.ionRangeSlider(scope.rangeOptions);
        }
    }
};

function numbersOnly() {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
};

function currencyInput($filter, $browser) {
    return {
        require: 'ngModel',
        link: function ($scope, $element, $attrs, ngModelCtrl) {
            $element.addClass('numberInput');
            var separators = {
                'thousands': $filter('number')(1000).substr(1, 1),
                'decimal': $filter('number')(1.1).substr(1, 1)
            }
            var decimalEntered = false;
            var listener = function () {
                var value = $element.val().split(separators.thousands).join('').split(separators.decimal).join('.');
                if (decimalEntered) {
                    decimalEntered = false;
                    return;
                }
                if (value.indexOf('.') > 1 && value.slice(-1) == '0') {
                    $element.val(value);
                    return;
                }
                $element.val($filter('number')(value));
            }

            // This runs when we update the text field
            ngModelCtrl.$parsers.push(function (viewValue) {
                return viewValue.split(separators.thousands).join('').split(separators.decimal).join('.');
            })

            // This runs when the model gets updated on the scope directly and keeps our view in sync
            ngModelCtrl.$render = function () {
                $element.val($filter('number')(ngModelCtrl.$viewValue, false));
            }

            $element.bind('change', listener)
            $element.bind('keypress', function (event) {
                var key = event.which;
                // If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
                // This lets us support copy and paste too
                if (key == 0 || key == 8 || (15 < key && key < 19) || (37 <= key && key <= 40)) {
                    return
                }
                // ignore all other keys which we do not need
                if (
                    String.fromCharCode(key) != separators.thousands &&
                    String.fromCharCode(key) != separators.decimal &&
                    !(48 <= key && key <= 57) &&
                    String.fromCharCode(key) != '-'
                ) {
                    event.preventDefault();
                    return;
                }
                if (String.fromCharCode(key) == separators.decimal) decimalEntered = true;
                $browser.defer(listener) // Have to do this or changes don't get picked up properly
            })

            $element.bind('paste cut', function () {
                $browser.defer(listener)
            })
        }
    }
}

// function rashaGlobaltoken(ajax) {
//     return {
//         restrict: 'A',
//         link: function (scope, element) {
//             ajax.call(cmsServerConfig.configApiServerPath + 'user/getglobaltoken', '', 'POST').success(function (response) {
//                 localStorage.setItem('userGlobaltoken', response);
//                 //console.log('ready');
//             }).error(function (a, b, c, d) {
//                 console.log(a);
//                 console.log(b);
//                 console.log(c);
//                 console.log(d);
//             });
//         }
//     }
// }

function rashaAutocomplete($compile, $state, ajax, rashaErManage, $modal) {
    return {
        restrict: 'AE',
        link: function (scope, element) {
            var atr = '';
            atr = $(element).attr('rasha-autocomplete');
            if (!atr) {
                throw "تنظیمات فیلد نمایش مشخص نشده است - grid Option in Tag";
                return;
            }

            var config = {};
            if (atr.indexOf(".") > 0) {
                var split = atr.split(".");
                var temp = scope[split[0]];
                config = temp[split[1]];
            } else
                config = scope[atr];




            if (!config) {
                throw "تنظیمات سلکتور در کنترلر مربوطه را ایجاد کنید";
                return;
            }

            if (!config.url) {
                throw "تنظیمات آدرس مقصد در کنترلر مربوطه را ایجاد کنید";
                return;
            }
            config.customTemplate = '<div style="position:relative;z-index:??z-index??" class="configzindex" >' +
                '<input type="text" ng-disabled="??ngdisable??" ng-model="??textmodel??" ng-change="??atrchange??.textChanged()" ng-keypress="??atr??.keypress($event)" class="form-control">' +
                '<div style="position:absolute;top:5px;left:5px;width:32px;z-index:1000" ng-click="??openPopup??">' +
                '<i class="fa fa-plus pull-right" style="cursor:pointer;margin:3px 5px 2px 2px" ng-click="??openadddialog??" ng-show="??showAddDialog??"  ></i>' +
                '<i class="fa fa-sort-desc pull-right" style="cursor:pointer" ng-show="!??atrdropdown??.dropDownOpened" ></i>' +
                '<i class="fa fa-times pull-right" style="cursor:pointer" ng-show="??atrclose??.dropDownOpened" ></i>' +
                '</div>' +
                '<div style="position:absolute;top:30px;left:0;right:0;background-color:white;border:1px solid black;z-index:1000" ng-show="??showdata??" >' +
                '<div rasha-grid="??gridoption??" showinselector="true" />' +
                '</div>' +
                '</div>';


            if (!config.zIndex)
                config.zIndex = 1000;
            config.dropDownOpened = false;
            config.isDisabledSearch = false;
            var ngmodelpath = atr + ".filterText";
            var openpopuppath = atr + ".openClosePopup()";
            var openDialog = atr + ".openAddNewDialog()";
            var dropdownopenedpath = atr + ".dropDownOpened";
            var gridoptionpath = atr + ".columnOptions";
            var ngdisablepath = atr + ".isDisabledSearch";
            var elname = $(element).attr('type', 'hidden');
            if (!config.selectedItem)
                config.selectedItem = {}
            if (config.showAddDialog == undefined || config.showAddDialog)
                config.showAddDialog = true;
            var att = atr.split('.');



            config.customTemplate = config.customTemplate.replace("??showAddDialog??", atr + ".showAddDialog").replace("??openadddialog??", openDialog).replace("??z-index??", config.zIndex).replace("??mainname??", elname).replace("??mainmodel??", att[0] + ".selectedItem." + config.fId).replace("??textmodel??", ngmodelpath).replace("??gridoption??", gridoptionpath).replace("??openPopup??", openpopuppath).replace("??showdata??", dropdownopenedpath).replace("??atr??", atr).replace("??atrchange??", atr).replace("??atrdropdown??", atr).replace("??atrclose??", atr).replace("??ngdisable??", ngdisablepath);
            var el = $compile(config.customTemplate)(scope);
            var pr = $(element).parent();
            var maxIndex = 1000;
            var curIndex = 0;
            //$(element).remove();//.html(el.innerHTML);
            pr.prepend(el);

            $(".configzindex").each(function (key, item) {
                var context = $(this);
                context.css('z-index', maxIndex - curIndex);
                curIndex = curIndex + 1;
            });


            config.filterText = '';
            config.openClosePopup = function () {
                if (config.openAddNewDialogClicked == true) {
                    config.openAddNewDialogClicked = false;
                    return;
                }
                if (config.dropDownOpened)
                    config.dropDownOpened = false;
                else {
                    config.filterText = "";
                    config.openPopup();
                }
            }

            config.getSelectedRow = function () {
                return config.selectedItem;
            }




            config.onScriptLoaded = function () {
                var deferred = $q.defer();
                scope.$apply(deferred.resolve());
            }
            config.openAddNewDialogClicked = false;
            config.openAddNewDialog = function () {
                config.openAddNewDialogClicked = true;
                var currentState = $state.current.name;
                var obj = $state.get('index.' + config.url.toLowerCase());
                var controllerAddress = obj.templateUrl;
                var res = controllerAddress.split("/");
                var temp = "/";
                for (var i = 0; i < res.length - 1; i++) {
                    if (res[i] != "")
                        temp = temp + res[i] + "/";
                }
                temp = temp + obj.controller + ".js";

                if (window.addRequestData == undefined) {
                    window.addRequestData = {};
                    window.addRequestData.requests = [];
                }
                var request = {};
                request.from = currentState;
                request.to = obj.name.replace('/', ".");
                request.controller = obj.controller;
                var t = new Date();
                request.expireDate = t.getSeconds() + 10;
                request.idChangedOrCanceled = function (id) {
                    $modal.close();
                    if (id != undefined && id != null) {
                        config.scope.selectedItem[config.fId] = id;
                        config.initValue();
                    }
                };

                localStorage.setItem('AddRequest', JSON.stringify(request));

                $modal.open({
                    template: '<div class="modal-content"><div class="modal-body"><div class="row"><div class="col-sm-12 b-r"><iframe src="' + document.location.origin + '/admin.html#' + obj.name.replace('.', '/') + '" class="col-sm-12" style="min-height:600px" /></div></div></div></div>',
                    scope: config.rootScop
                }).result.then(function (result) {
                    var id = localStorage.getItem('AddRequestID');
                    alert(id);
                });




            }
            config.columnOptions.selectionChanged = function () {
                if (config.columnOptions.selectedRow.item) {
                    config.getDataFromSelection(config.columnOptions.selectedRow.item);
                }
            }

            config.getDataFromSelection = function (item) {
                config.closePopup();
                config.selectedItem = item;
                if (config.displayMember.indexOf(',') > 0) {
                    var split = config.displayMember.split(',');
                    var temp = '';
                    for (var i = 0; i < split.length; i++) {
                        if (config.selectedItem[split[i]] != undefined)
                            temp = temp + config.selectedItem[split[i]] + ' ';
                    }
                    config.filterText = temp;
                } else
                    config.filterText = config.selectedItem[config.displayMember];
                if (config.fId)
                    if (config.scope.selectedItem)
                        config.scope.selectedItem[config.fId] = config.selectedItem[config.id];
                if (config.onSelectionChanged != undefined)
                    config.onSelectionChanged(config.selectedItem);

            }
            config.ViewModel = {};
            config.emptyModel = {};
            
            config.initValue = function () {
                var defId = config.scope.selectedItem[config.fId];
                if (!defId)
                    return;
                if (typeof defId === 'object')
                    return;
                config.isDisabledSearch = true;
                config.dropDownOpened = false;
                var data = {
                    id: defId
                };

                ajax.call(cmsServerConfig.configApiServerPath + config.url + '/GetOne', defId, 'GET')
                    .success(function (response) {
                        // Create a ViewModel with null values
                        config.ViewModel = response.Item;
                        config.emptyModel = jQuery.extend({}, config.ViewModel);
                        for (property in config.emptyModel) {
                            config.emptyModel[property] = null;
                        }
                        ///
                        config.isDisabledSearch = false;
                        rashaErManage.checkAction(response);
                        if (response.Item) {
                            config.getDataFromSelection(response.Item);
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                        config.isDisabledSearch = false;
                    });
            }

            config.keypress = function (event) {
                if (event.keyCode == 13) {
                    event.preventDefault();
                    config.openPopup();
                }
                if (event.keyCode == 40 && config.dropDownOpened)
                    config.columnOptions.selectNextRow();
                if (event.keyCode == 38 && config.dropDownOpened)
                    config.columnOptions.selectPrevRow();

                //console.log(event);
            }
            config.textChanged = function () {
                config.columnOptions.filterText = config.filterText;
                if (config.dropDownOpened) {
                    //#help/ اضافه کردن ردیف جدید اطلاعات
                    var findItem = false;
                    if (config.columnOptions.data && config.columnOptions.data.length > 0)
                        $.each(config.columnOptions.data, function (key, item) {
                            if (config.columnOptions.filterSearch(item))
                                findItem = true;
                        });
                    if (!findItem && config.columnOptions.filterText && config.columnOptions.filterText.length > 0)
                        config.openPopup();
                }
            }
            config.closePopup = function () {
                config.dropDownOpened = false;
            }
            config.openPopup = function () {
                var ctxData = config.filterText;
                if (!ctxData)
                    ctxData = '';
                var data = {
                    //content: ctxData
                };
                config.isDisabledSearch = true;
                config.dropDownOpened = false;
                data.RowPerPage = config.rowPerPage;
                data.SortColumn = config.sortColumn;
                data.SortType = config.sortType;
                data.Action = "GetAll";
                if (config.Action && config.Action.length > 0)
                    data.Action = config.Action;

                data.Filters = []
                if (config.defaultFilter != undefined && config.defaultFilter != null) {
                    for (var i = 0; i < config.defaultFilter.length; i++)
                        data.Filters.push(config.defaultFilter[i]);
                }

                var isnum = /^\d+$/.test(config.filterText);
                for (var i = 0; i < config.columnOptions.columns.length; i++) {
                    if (config.columnOptions.columns[i].enableSearch == undefined || config.columnOptions.columns[i].enableSearch == true) {
                        if (isnum) {
                            if (config.columnOptions.columns[i].type == 'integer' || config.columnOptions.columns[i].name == 'Id')
                                data.Filters.push({
                                    PropertyName: config.columnOptions.columns[i].name,
                                    SearchType: 10,
                                    IntValue1: config.filterText,
                                    ClauseType: 1
                                });
                        }
                        if (config.columnOptions.columns[i].type == undefined || config.columnOptions.columns[i].type == 'string')
                            data.Filters.push({
                                PropertyName: config.columnOptions.columns[i].name,
                                SearchType: 5,
                                StringValue1: config.filterText,
                                ClauseType: 1
                            });
                    }
                }

                ajax.call(cmsServerConfig.configApiServerPath + config.url + '/' + data.Action, data, 'POST')
                    .success(function (response) {
                        config.isDisabledSearch = false;
                        rashaErManage.checkAction(response);
                        if (response.ListItems) {
                            config.columnOptions.resultAccess = response.resultAccess;
                            //if (response.ListItems.length == 1) {
                            //    config.getDataFromSelection(response.ListItems[0]);
                            //} else {

                            // ----- Remove excludingIndex from Results ---------
                            if (config.scope.gridOptions != undefined) {
                                if (config.scope.gridOptions.selectedRow == undefined)
                                    config.scope.gridOptions.selectedRow = {};
                                for (var index = 0; index < response.ListItems.length; index++) {
                                    if (config.scope.gridOptions.selectedRow.Item != undefined) {
                                        if (response.ListItems[index].Id == config.scope.gridOptions.selectedRow.item.Id) {
                                            response.ListItems.splice(index, 1);
                                        }
                                    }
                                }
                            }
                            // ----- Add an extra null item on top of items -------  
                            config.emptyModel.Title = " - ";
                            response.ListItems.splice(0, 0, config.emptyModel);

                            config.dropDownOpened = true;
                            config.columnOptions.filterText = config.filterText;
                            config.columnOptions.fillData(response.ListItems, response.resultAccess);
                            //}
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                        config.isDisabledSearch = false;
                    });

            };
            config.initValue();

        }
    }
}


function rashaGrid($compile, $rootScope, ajax) {
    return {
        restrict: 'AE',
        link: function (scope, element) {
            var atr = '';
            atr = $(element).attr('rasha-grid');
            if (!atr) {
                throw "تنظیمات گرید مشخص نشده است - grid Option in Tag";
                return;
            }
            var config = {};
            if (atr.indexOf(".") > 0) {
                var split = atr.split(".");
                if (split.length == 2) {
                    var temp = scope[split[0]];
                    config = temp[split[1]];
                } else {
                    var temp = scope[split[0]];
                    var temp2 = temp[split[1]];
                    config = temp2[split[2]];
                }
            } else
                config = scope[atr];

            if (!config) {
                throw "تنظیمات ستونها در کنترلر مربوطه را ایجاد کنید";
                return;
            }


            if (config.advancedSearchData == undefined || config.advancedSearchData == null)
                config.advancedSearchData = {
                    engine: {}
                };
            if (config.resultAccess == undefined || config.resultAccess == null)
                config.resultAccess = {};
            //config.advancedSearchData.engine = {};
            if (!angular.isDefined(config.advancedSearchData.engine.CurrentPageNumber))
                config.advancedSearchData.engine.CurrentPageNumber = 1;
            if (!angular.isDefined(config.advancedSearchData.engine.SortColumn))
                config.advancedSearchData.engine.SortColumn = "Id";
            if (!angular.isDefined(config.advancedSearchData.engine.SortType))
                config.advancedSearchData.engine.SortType = 0;
            if (!angular.isDefined(config.advancedSearchData.engine.NeedToRunFakePagination))
                config.advancedSearchData.engine.NeedToRunFakePagination = false;
            if (!angular.isDefined(config.advancedSearchData.engine.TotalRowData))
                config.advancedSearchData.engine.TotalRowData = 2000;
            if (!angular.isDefined(config.advancedSearchData.engine.RowPerPage))
                config.advancedSearchData.engine.RowPerPage = 20;
            if (!angular.isDefined(config.advancedSearchData.engine.ContentFullSearch))
                config.advancedSearchData.engine.ContentFullSearch = null;
            if (!angular.isDefined(config.advancedSearchData.engine.Filters))
                config.advancedSearchData.engine.Filters = [];

            var showinselector = $(element).attr('showinselector');
            if (!showinselector) {
                config.showInSelector = false;
                if (config.detailGrid) {
                    config.customTemplate = '<div style="position:relative" >' +
                        '<div>' +
                        '<pagination boundary-links="true" total-items="systemColumnOptions.totalRowCount" ng-model="systemColumnOptions.currentPageNumber" max-size="systemColumnOptions.maxSize" items-per-page="systemColumnOptions.rowPerPage" ng-change="systemColumnOptions.pageChanged()"></pagination>' +
                        '</div>' +
                        '<input type="text" class="form-control input-search" placeholder="جستجوی سریع" data-ng-model="systemColumnOptions.filterText" ng-change="systemColumnOptions.textChanged()" />' +
                        '<div class="table-responsive" >' +
                        "<table id='firstuniqueId' class='table table-striped table-bordered floatThead-table'  >" +
                        '<thead>' +
                        '<tr>' +
                        '<th ng-repeat="x in systemColumnOptions.columns" ng-show="systemColumnOptions.resultAccess.AccessWatchField.indexOf(\'{{x.name}}\')>-1"  style="width:{{x.width}}" >' +
                        '<div style="cursor:pointer;" ng-click="changeSortStyle(x)" >' +
                        '{{x.displayName}}' +
                        '<i class="fa fa-sort-desc pull-right" ng-show="x.sortDescVisible"></i>' +
                        '<i class="fa fa-sort-asc pull-right" ng-show="x.sortAscVisible"></i>' +
                        '</div>' +
                        '</th>' +
                        '</tr>' +
                        '</thead>' +
                        "<tbody ng-repeat='x in systemColumnOptions.data| filter:systemColumnOptions.filterSearch'>" +
                        "<tr  ng-click='systemColumnOptions.selectRow(x.rowOption);' ng-class='{true:infoclass}[(x.rowOption.isSelected)]'   style='cursor:pointer'>" +
                        '<rowTemplates />' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '</div>' +
                        '<table id="uniqueId" class="table table-striped table-bordered floatThead-table" style="position:fixed;top:0px;width:0px !important;display:none" >' +
                        '<thead>' +
                        '<tr style="width:100%">' +
                        '<th ng-repeat="x in systemColumnOptions.columns"  ng-show="systemColumnOptions.resultAccess.AccessWatchField.indexOf(\'{{x.name}}\')>-1" style="width:{{x.width}}" >' +
                        '<div style="cursor:pointer;" ng-click="changeSortStyle(x)">' +
                        '{{x.displayName}}' +
                        '<i class="fa fa-sort-desc pull-right" ng-show="x.sortDescVisible"></i>' +
                        '<i class="fa fa-sort-asc pull-right" ng-show="x.sortAscVisible"></i>' +
                        '</div>' +
                        '</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        "<tr style='width:100%'>" +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '<div>' +
                        '<pagination total-items="systemColumnOptions.totalRowCount" ng-model="systemColumnOptions.currentPageNumber" max-size="systemColumnOptions.maxSize" items-per-page="systemColumnOptions.rowPerPage" ng-change="systemColumnOptions.pageChanged()"></pagination>' +
                        '</div>' +
                        '</div>';
                } else {
                    config.customTemplate = '<div style="position:relative" >' +
                        //part1
                        '<input type="text" class="form-control input-search" placeholder="جستجوی سریع" data-ng-model="systemColumnOptions.filterText" ng-change="systemColumnOptions.textChanged()" />' +
                        '<div class="table-responsive">' +
                        "<table id='firstuniqueId' class='table table-striped table-bordered floatThead-table'  >" +
                        '<thead>' +
                        '<tr>' +
                        '<th style="width:50px;" ng-show="systemColumnOptions.resultAccess.AccessWatchField.indexOf(\'RecordStatus\')>-1">' +
                        '<div style="cursor:pointer;" ng-click="changeSortStyle()" >' +
                        'وضعیت' +
                        '</div>' +
                        '</th>' +
                        '<th ng-repeat="x in systemColumnOptions.columns" ng-show="{{x.visible}}" style="width:{{x.width}}" >' +
                        '<div style="cursor:pointer;" ng-click="changeSortStyle(x)"><input type="checkbox" id="{{x.name.replace(\'.\', \'\') + \'Checkbox\'}}" style="margin-left: 4px;" ng-show="systemColumnOptions.columnCheckbox"/>' +
                        '{{x.displayName}}' +
                        '<i class="fa fa-sort-desc pull-right" ng-show="x.sortDescVisible"></i>' +
                        '<i class="fa fa-sort-asc pull-right" ng-show="x.sortAscVisible"></i>' +
                        '</div>' +
                        '</th>' +
                        '</tr>' +
                        '</thead>' +
                        '<tbody>' +
                        "<tr ng-repeat='x in systemColumnOptions.data| filter:systemColumnOptions.filterSearch' ng-click='systemColumnOptions.selectRow(x.rowOption,$this,$index);' ng-class='{true:infoclass}[(x.rowOption.isSelected)]' style='cursor:pointer'>" +
                        '<td ng-show="systemColumnOptions.resultAccess.AccessWatchField.indexOf(\'RecordStatus\')>-1" ><i class="{{x.RecordStatus|isRecordStatus}}" /></td>' +
                        '<rowTemplates />' +
                        '</tr>' +
                        '</tbody>' +
                        '</table>' +
                        '</div>' +
                        '<div>' +
                        '<pagination boundary-links="true" total-items="systemColumnOptions.totalRowCount" ng-model="systemColumnOptions.currentPageNumber" max-size="systemColumnOptions.maxSize" items-per-page="systemColumnOptions.rowPerPage" ng-change="systemColumnOptions.pageChanged()" rotate="false"></pagination>' +
                        '</div>' +
                        '</div>';
                }
            } else {
                config.showInSelector = true;
                config.customTemplate = "<div style='height:500px;overflow-y:scroll'>" +
                    "<table class='table table-striped table-bordered table-responsive floatThead-table' style='display: table;table-layout: fixed;' >" +
                    '<thead>' +
                    '<tr>' +
                    '<th ng-repeat="x in systemColumnOptions.columns" ng-show="systemColumnOptions.resultAccess.AccessWatchField.indexOf(\'{{x.name}}\')>-1" style="width:{{x.width}}" >' +
                    '<div style="cursor:pointer;"  ng-click="changeSortStyle(x)">' +
                    '{{x.displayName}}' +
                    '<i class="fa fa-sort-desc pull-right" ng-show="x.sortDescVisible"></i>' +
                    '<i class="fa fa-sort-asc pull-right" ng-show="x.sortAscVisible"></i>' +
                    '</div>' +
                    '</th>' +
                    '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                    "<tr ng-repeat='x in systemColumnOptions.data | filter:systemColumnOptions.filterSearch' ng-click='systemColumnOptions.selectRow(x.rowOption);' ng-class='{true:infoclass}[(x.rowOption.isSelected)]' style='cursor:pointer' >" +
                    '<rowTemplates />' +
                    '</tr>' +
                    '</tbody>' +
                    '</table>' +
                    '</div>';
            }
            if (!config.multiSelect)
                config.multiSelect = false;
            config.textChanged = function () {
                if (config.selectedRow.rowData) {
                    config.selectedRow.rowData.isSelected = false;
                    config.selectedRow = {};
                }
            }

            config.pageChanged = function (page) {
                config.advancedSearchData.engine.CurrentPageNumber = config.currentPageNumber;
                config.reGetAll();
            };

            function guid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return s4() + s4() + s4() + s4() + s4();
            }

            config.getUniqueId = guid();
            config.firstuniqueId = guid();

            var template = '';
            config.rowTemplates = '';
            config.totalcolumns = 0;
            angular.forEach(config.columns, function (item, key) {
                if (!item.width) {
                    config.totalcolumns = config.totalcolumns + 1;
                }
            });
            if (!$rootScope.infoDomainAddress)
                $rootScope.infoDomainAddress = "";


            if (config.totalcolumns > 0)
                config.percentWidth = 100 / config.totalcolumns;
            angular.forEach(config.columns, function (item, key) {
                item.srcThumbnail = cmsServerConfig.configRouteThumbnails+'/{{x.' + item.name + '}}?MvcAuthorization=' + encodeURIComponent(localStorage.getItem('userGlobaltoken'));
                if (!item.visible)
                    item.visible = true;
                if (!item.sortable)
                    item.sortable = false;
                if (!item.sortDescVisible)
                    item.sortDescVisible = false;
                if (!item.sortAscVisible)
                    item.sortAscVisible = false;
                if (!item.width && config.percentWidth) {
                    item.width = config.percentWidth + "%";
                } else if (item.width != undefined) {
                    if (item.style == undefined)
                        item.style = '';
                    item.style += ';width:' + item.width + 'px';
                }
                if (!item.excerpt)
                    item.excerpt = false;
                if (item.visible) {
                    item.sortState = 0;
                    if (!item.template) {
                        if (item.isEditable) {
                            template = "<td style='{{x.style}}'><div class='form-group'><input ??cur?? class='form-control' ng-model='x." + item.name + "'>  </div></td>";
                            if (item.editMode && item.editMode == 'C') {
                                template = template.replace("??cur??", "currency-input");
                            } else {
                                template = template.replace("??cur??", "");
                            }
                        } else {
                            if (item.isCheckBox) {
                                template = '<td style="{{x.style}}"><div  ng-show="systemColumnOptions.resultAccess.AccessWatchField.indexOf(\'' + item.name + '\')>-1"><i class="fa fa-check" ng-show="x.' + item.name + '"></i><i class="fa fa-times" ng-show="!x.' + item.name + '"></i></div></td>';
                            } else if (item.isDateTime) {
                                var dateFormat = item.dateTimeFormat;
                                if (!dateFormat)
                                    dateFormat = 'HH:mm jYY/jMM/jDD';
                                template = '<td style="{{x.style}}"><div  ng-show="systemColumnOptions.resultAccess.AccessWatchField.indexOf(\'' + item.name + '\')>-1">{{x.' + item.name + '|jalaliDate:"' + dateFormat + '"}}</div></td>';
                            } else if (item.isDate) {
                                var dateFormat = item.dateTimeFormat;
                                if (!dateFormat)
                                    dateFormat = 'jYY/jMM/jDD';
                                template = '<td style="{{x.style}}"><div  ng-show="systemColumnOptions.resultAccess.AccessWatchField.indexOf(\'' + item.name + '\')>-1">{{x.' + item.name + '|jalaliDate:"' + dateFormat + '"}}</div></td>';
                            } else if (item.excerpt) {
                                template = '<td style="{{x.style}}"><div  ng-show="systemColumnOptions.resultAccess.AccessWatchField.indexOf(\'' + item.name + '\')>-1">{{x.' + item.name + '|excerpt:"' + item.excerptLength + '"}}</div></td>';
                            } else if (item.isRecordStatus) {
                                template = '<td style="{{x.style}}"><div  ng-show="systemColumnOptions.resultAccess.AccessWatchField.indexOf(\'' + item.name + '\')>-1"><i class="{{x.' + item.name + '|isRecordStatus}}"></i></div></td>';
                            } else if (item.isThumbnail) {
                                template = '<td style="{{x.style}}"><div  ng-show="{{' + item.visible + '}}">' +
                                    '<span custom-popover popover-id="{{x.' + item.name + '}}" popover-title="{{x.' + item.name + '}}" popover-placement="top" popover-iconsrc="/CmsFiles/img/default-grid-img.png" data-width="' + item.widthImg + '" data-height="' + item.heightImg + '"></span>' + '</div></td>';
                            } else if (item.isThumbnailByFild) {
                                template = '<td style="{{x.style}}" ><div rasha-thumbnail="' + item.name + ':' + item.imageWidth + ':' + item.imageHeight + '" ng-model="x.' + item.name + '" ></div></td>';
                            } else {
                                if (item.filter != undefined) {
                                    template = '<td style="{{x.style}}" ng-show="{{' + item.visible + '}}"><div>{{x.' + item.name + ' | ' + item.filter + '}}</div></td>';
                                } else {
                                    template = '<td style="{{x.style}}" ng-show="{{' + item.visible + '}}"><div>{{x.' + item.name + '}}</div></td>';
                                }

                            }
                        }
                    } else {

                        template = "<td style='{{x.style}}' ng-show='{{" + item.visible + "}}'><div>" + item.template + "</div></td>";


                    }

                    while (template.indexOf('{{x.style}}') > 0)
                        template = template.replace('{{x.style}}', item.style);


                    config.rowTemplates += template;
                }
            });

            if (config.detailGrid) {
                config.totalcolumns = 0;
                angular.forEach(config.columns, function (item, key) {
                    config.totalcolumns = config.totalcolumns + 1;
                });
                config.rowTemplates += "</tr><tr ng-show='x.rowOption.showDetails'><td colspan='" + config.totalcolumns + "'><div class='animated fadeInRight' id='{{x.rowOption.Id}}'>" + "</div></td>";

                config.detailGrid.loadTemplate = function (row) {
                    $('#' + row.rowOption.Id).empty();
                    $.ajax({
                        url: config.detailGrid.templatePath,
                        context: document.body,
                        success: function (response) {
                            var content = response;
                            var eldata = $compile(content)(scope);
                            angular.forEach(config.data, function (item, key) {
                                if (item != row) {
                                    if (item.rowOption.showDetails) {
                                        $('#' + item.rowOption.Id).empty();
                                        item.rowOption.showDetails = false;
                                    }
                                }
                            });

                            $('#' + row.rowOption.Id).append(eldata);
                            config.detailGrid.reGetAll();
                        }
                    });
                    //var content =$.load(config.detailGrid.templatePath);
                    //var eldata = $compile(content)(scope);
                    //console.log(eldata);
                    //$('#' + row.rowOption.Id).append(eldata);
                }

            }

            while (config.customTemplate.indexOf("systemColumnOptions") > 0) {
                config.customTemplate = config.customTemplate.replace("systemColumnOptions", atr);
            }
            while (config.rowTemplates.indexOf("systemColumnOptions") > 0) {
                config.rowTemplates = config.rowTemplates.replace("systemColumnOptions", atr);
            }
            config.customTemplate = config.customTemplate.replace("firstuniqueId", config.firstuniqueId).replace("<rowTemplates />", config.rowTemplates).replace("<rowTemplates />", config.rowTemplates).replace("<rowTemplates />", config.rowTemplates).replace("<rowTemplates />", config.rowTemplates).replace("undefined", "").replace("infoclass", '"info"').replace("uniqueId", config.getUniqueId).replace("uniqueIdTopMenu", config.getUniqueId + "TopMenu");

            //console.log(config.customTemplate.replace("??rowTemplates??", config.rowTemplates));

            var el = $compile(config.customTemplate.replace("??rowTemplates??", config.rowTemplates))(scope);
            element.append(el);
            if (!config.showInSelector) {
                $(window).bind("scroll", function () {
                    var $fixedHeader = $("#" + config.getUniqueId);
                    var tableOffset = 0;
                    if ($("#" + config.firstuniqueId).offset() != undefined && $("#" + config.firstuniqueId).offset().top != undefined)
                        tableOffset = $("#" + config.firstuniqueId).offset().top; //todo:مشکل داشت
                    var tableWidth = $("#" + config.firstuniqueId).width();
                    //if (config.fixedheaderTop <= 10)

                    var height = $("#" + config.firstuniqueId).height();
                    var offset = $(this).scrollTop();
                    if (offset >= tableOffset) {
                        config.showThead = true;
                        $fixedHeader.show();
                        if (!config.fixedheaderTop)
                            config.fixedheaderTop = tableOffset - 160;
                        $fixedHeader.css('top', offset - config.fixedheaderTop);
                        $fixedHeader.css('width', tableWidth + "px");
                    } else if (offset < tableOffset) {
                        config.showThead = false;
                        $fixedHeader.hide();
                    }
                    if (offset > tableOffset + height) {
                        config.showThead = false;
                        $fixedHeader.hide();
                    }
                });
            }
            config.ResultAccesschanged = function () {
                if (config.resultAccess.AccessWatchField == undefined && 1 == 2) {
                    config.resultAccess.AccessWatchField = [];
                    for (var i = 0; i < config.columns.length; i++)
                        config.resultAccess.AccessWatchField.push(config.columns[i].name);
                }
                for (var i = 0; i < config.columns.length; i++) {
                    if (config.columns[i].displayForce == true && config.resultAccess != undefined && config.resultAccess.AccessWatchField != undefined && config.resultAccess.AccessWatchField.indexOf(config.columns[i].name) < 0) {
                        config.resultAccess.AccessWatchField.push(config.columns[i].name);
                    }
                }
            };
            config.selectNextRow = function () {

            };
            config.selectPrevRow = function () {

            };
            config.changeSortStyle = function (col) {
                angular.foeEach(config.columns, function (key, item) {
                    if (item.name !== col.name) {
                        item.sortState = 0;
                        item.sortDescVisible = false;
                        item.sortAscVisible = false;
                    }
                });
                if (!col.sortState)
                    col.sortState = 0;
                if (col.sortable)
                    col.sortState = col.sortState + 1;
                if (col.sortState > 2)
                    col.sortState = 0;
                if (col.sortState == 0) {
                    col.sortDescVisible = false;
                    col.sortAscVisible = false;
                }
                if (col.sortState == 1) {
                    //scope.busyIndicatorIsBusy = true;
                    col.sortDescVisible = true;
                    col.sortAscVisible = false;
                }
                if (col.sortState == 2) {
                    //scope.busyIndicatorIsBusy = true;
                    col.sortDescVisible = false;
                    col.sortAscVisible = true;
                }

                ////console.log(col);
            };

            config.fillData = function (response, resultAccessSet) {

                if (resultAccessSet != undefined) config.resultAccess = resultAccessSet;
                config.ResultAccesschanged();
                if (!response) {
                    var $fixedHeader = $("#" + config.getUniqueId);
                    $fixedHeader.hide();
                    return;
                }
                if (!config.showInSelector) {
                    var $fixedHeader = $("#" + config.getUniqueId);
                    var tableOffset = $(element).offset().top;
                    //var tableWidth = $(element).width();
                    ////console.log(tableWidth);
                    //$fixedHeader.css('width', tableWidth + "px !important;");
                    $fixedHeader.hide();
                }
                angular.forEach(response, function (item, key) {
                    //for (var key in item) {
                    //    var value = item[key];
                    //    if (typeof value === 'string' && value.length > 50)
                    //        item[key] = config.excerpt(value);
                    //}
                    if (!item.rowOption) {
                        item.rowOption = {
                            isSelected: false,
                            rowIndex: key,
                            rowItem: item,
                            showDetails: false,
                            Id: guid()
                        };
                    }
                });

                config.busyIndicatorIsBusy = false;
                config.rowPerPage = response.length;
                if (!angular.isDefined(config.maxSize))
                    config.maxSize = 5;
                config.data = {};
                config.data = response;
            };

            config.selectedRow = {}
            config.selectionChanged = function () {
                if (config.onRowSelected) config.onRowSelected();
            }
            config.selectRow = function (opt) {
                $.each(config.data, function (key, item) {
                    if (!item.rowOption) {
                        item.rowOption = {
                            isSelected: false,
                            rowIndex: key,
                            rowItem: item
                        };
                    } else {
                        if (!config.multiSelect)
                            item.rowOption.isSelected = false;
                    }
                });
                //alert(opt);
                if (!angular.isDefined(opt))
                    opt = {
                        isSelected: false
                    };
                if (config.multiSelect)
                    opt.isSelected = !opt.isSelected;
                else {
                    opt.isSelected = true;
                    config.selectedRow = {
                        item: opt.rowItem,
                        rowIndex: opt.rowIndex,
                        rowData: opt
                    };
                    config.selectionChanged();

                    //if ($('a[rel=popoverThumbnail]').length > 0) {
                    //    var this_ = $('a[rel=popoverThumbnail]')[opt.rowIndex];
                    //    var imgImg = this_.attributes["data-img"].value;
                    //    var imgWidth = this_.attributes["data-width"].value;
                    //    var imgHeight = this_.attributes["data-height"].value;
                    //    config.previewImage(this_, imgImg, imgWidth, imgHeight);
                    //}
                }

            }
            var columnstoFilter = '';
            $.each(config.columns, function (key, item) {
                columnstoFilter += item.name + ",";
            });

            config.filterSearch = function (row) {
                if (!config.filterText)
                    return row;
                var str = '';

                var seen = [];

                str = JSON.stringify(row, function (key, val) {
                    if (columnstoFilter.indexOf(key) < 0)
                        return;
                    if (val != null && typeof val == "object") {
                        if (seen.indexOf(val) >= 0) {
                            return;
                        }
                        seen.push(val);
                    }
                    return val;
                });
                if (str && str.indexOf(config.filterText) > 0)
                    return row;
            };

            $("#" + config.getUniqueId + "TopMenu").html($("#" + "topMenuSource").html());
        }
    };
}

function rashaRecordStatus($compile) {
    return {
        restrict: 'AE',
        link: function (scope, element) {

            String.prototype.replaceAll = function (toReplace, replaceWith) {
                return this.toString().split(toReplace).join(replaceWith);
            }
            var atr = '';
            atr = $(element).attr('rasha-record-status');
            if (!atr) {
                throw "تنظیمات لودر مشخص نشده است .";
                return;
            }
            var config = {};
            if (atr.indexOf(".") > 0) {
                var split = atr.split(".");
                if (split.length == 2) {
                    var temp = scope[split[0]];
                    config = temp[split[1]];
                } else {
                    var temp = scope[split[0]];
                    var temp2 = temp[split[1]];
                    config = temp2[split[2]];
                }
            } else
                config = scope[atr];

            var template = '  <select class="form-control" ng-model="??config??.selectedItem.RecordStatus" name="RecordStatus">' +
                '<option ng-repeat="x in ??config??.itemRecordStatus" ng-selected="??config??.selectedItem.RecordStatus == x.Value" value={{x.Value}} class="form-control">{{x.Key + ": " + x.Description}}</option>' +
                '</select>';


            template = template.replaceAll("??config??", atr);
            var el = $compile(template)(scope);
            element.append(el);
        }
    };
}

function queryBuilder($compile) {
    return {
        restrict: 'AE',
        link: function (scope, element) {
            var atr = '';
            atr = $(element).attr('query-builder');
            if (!atr) {
                throw "تنظیمات جستجو مشخص نشده است - QueryBuilder tag is not specified";
                return;
            }
            var config = {};
            if (atr.indexOf(".") > 0) {
                var split = atr.split(".");
                if (split.length == 2) {
                    var temp = scope[split[0]];
                    config = temp[split[1]];
                } else {
                    var temp = scope[split[0]];
                    var temp2 = temp[split[1]];
                    config = temp2[split[2]];
                }
            } else
                config = scope[atr];
            if (!config) {
                throw "تنظیمات جستجوی پیشرفته در کنترلر مربوطه را ایجاد کنید";
                return;
            }
            config.showAdvancedSearchPanel = function () {
                //$("#builderPanel").append("<div id='builder' query-builder='blogContent'></div><div class='btn-group' style='float: left;'><button class='btn btn-primary reset' data-target='basic' type='button' id='btn-reset' ng-click='blogContent.getRules()'> {{'look'|lowercase|translate}} </button><button class='btn btn-success set-json' data-target='basic' type='button' id='btn-set' ng-click='blogContent.saveRules()'> {{'save_condition'|lowercase|translate}} </button><button class='btn btn-warning parse-json' data-target='basic' type='button' id='btn-get' ng-click='blogContent.setRules()'> {{'restore_condition'|lowercase|translate}} </button></div>");
                $("#filter-btn-icon").toggleClass('fa-toggle-off fa-toggle-on');
                $('#' + element[0].id + 'Panel').fadeToggle('fast', function () {
                    if (!$('#' + element[0].id + 'Panel').is(":visible")) {
                        config.gridOptions.advancedSearchData.engine.Filters = null;
                        config.gridOptions.advancedSearchData.engine.Filters = [];
                        config.gridOptions.reGetAll();
                    } else
                        config.setFields();
                });
            }
            config.setFields = function () {

                //Dynamically generate filters for QueryBuilder, based on columns of the grid
                var fields = [];
                if (config.gridOptions.resultAccess.FieldsInfo && config.gridOptions.resultAccess.AccessSearchField)
                    $.each(config.gridOptions.resultAccess.FieldsInfo, function (index, column) {
                        if (config.gridOptions.resultAccess.AccessSearchField.indexOf(column.FieldName) < 0)
                            return;
                        if (column.FieldType === 'System.Int32' || column.FieldType === 'System.Int64') {
                            fields.push({
                                id: column.FieldName,
                                label: column.FieldTitle,
                                type: 'integer',
                                operators: ['equal', 'not_equal', 'less', 'greater', 'between', 'less_or_equal', 'greater_or_equal']
                            });
                        } else if (column.FieldType === 'System.String') {
                            fields.push({
                                id: column.FieldName,
                                label: column.FieldTitle,
                                type: 'string',
                                operators: ['equal', 'not_equal', 'contains', 'not_contains', 'begins_with', 'ends_with']
                            });
                        } else if (column.FieldType === 'MongoDB.Bson.ObjectId') {
                            fields.push({
                                id: column.FieldName,
                                label: column.FieldTitle,
                                type: 'string',
                                typeChild: 'ObjectId',
                                operators: ['equal', 'not_equal']
                            });
                        } else if (column.FieldType === 'System.Boolean') {
                            fields.push({
                                id: column.FieldName,
                                label: column.FieldTitle,
                                type: 'boolean',
                                input: 'radio',
                                values: {
                                    'True': 'بله',
                                    'False': 'خیر'
                                },
                                operators: ['equal']
                            });
                        } else if (column.FieldType === 'System.DateTime') {
                            fields.push({
                                id: column.FieldName,
                                label: column.FieldTitle,
                                type: 'date',
                                operators: ['equal', 'not_equal', 'less', 'greater', 'between', 'less_or_equal', 'greater_or_equal'],
                                validation: {
                                    format: 'yyyy/0m/dd'
                                },
                                plugin: 'persianDatepicker',
                                plugin_config: {
                                    formatDate: "YYYY/0M/DD",
                                    theme: "lightorang"
                                }
                            });
                        } else if (column.FieldType === 'link') {
                            fields.push({
                                id: column.FieldName,
                                label: column.FieldTitle,
                                type: 'string',
                                operators: ['equal', 'not_equal', 'contains', 'begins_with', 'ends_with']
                            });
                        } else { //console.log("Error: Type is not defined for columns! Please add 'type' property for each columns in gridOptions.");
                        }
                    });
                // Options for QueryBuilder 
                var options = {
                    plugins: ['bt-tooltip-errors'],
                    filters: fields,
                    lang_code: 'fa-ir'
                };

                $(element).queryBuilder(options);
            }

            var user_rules = null;

            // Call queryBuilder() with options for QueryBuilder plugin

            // Get rules in a Json format and send it to the server side
            config.getRules = function () {
                var result = $(element).queryBuilder("getRules");
                Filters = [];
                var count = $("#count-check").is(':checked'); // Get count نمایش آمار
                if (!$.isEmptyObject(result)) {
                    for (var i = 0; i < result.rules.length; i++) {
                        var propertyName = result.rules[i].field;
                        var searchType = getSearchType(result.rules[i].operator);
                        var value = result.rules[i].value;
                        var clauseType = result.condition == "OR" ? 1 : 2;
                        var Filter = {};

                        if (result.rules[i].type == "integer") {
                            if (searchType == 4) Filter = {
                                PropertyName: propertyName,
                                IntValue1: value[0],
                                IntValue2: value[1],
                                SearchType: searchType,
                                ClauseType: clauseType
                            };
                            else Filter = {
                                PropertyName: propertyName,
                                IntValue1: value,
                                SearchType: searchType,
                                ClauseType: clauseType
                            };
                        } else if (result.rules[i].type == "string" && result.rules[i].input != "radio") {

                            if (result.rules[i].typeChild == "ObjectId") {
                                Filter = {
                                    PropertyName: propertyName,
                                    ObjectIdValue1Set: value,
                                    SearchType: searchType,
                                    ClauseType: clauseType
                                };
                            } else {
                                if (searchType == 4) Filter = {
                                    PropertyName: propertyName,
                                    StringValue1: value,
                                    StringValue2: value,
                                    SearchType: searchType,
                                    ClauseType: clauseType
                                };
                                else Filter = {
                                    PropertyName: propertyName,
                                    StringValue1: value,
                                    SearchType: searchType,
                                    ClauseType: clauseType
                                };
                            }

                        } else if (result.rules[i].type == "boolean") { // Type is boolean
                            if (searchType == 4) Filter = {
                                PropertyName: propertyName,
                                BooleanValue1: value[0],
                                BooleanValue2: value[1],
                                SearchType: searchType,
                                ClauseType: clauseType
                            };
                            else Filter = {
                                PropertyName: propertyName,
                                BooleanValue1: value,
                                SearchType: searchType,
                                ClauseType: clauseType
                            };

                        } else if (result.rules[i].type == "date") {
                            if (searchType == 4) Filter = {
                                PropertyName: propertyName,
                                DateTimeValue1: value[0],
                                DateTimeValue2: value[1],
                                SearchType: searchType,
                                ClauseType: clauseType
                            };
                            else Filter = {
                                PropertyName: propertyName,
                                DateTimeValue1: value,
                                SearchType: searchType,
                                ClauseType: clauseType
                            };
                        }
                        Filters.push(Filter);
                    }
                    config.gridOptions.advancedSearchData.engine.Filters = null;
                    config.gridOptions.advancedSearchData.engine.Filters = [];
                    config.gridOptions.advancedSearchData.engine.Filters = Filters;
                    config.gridOptions.advancedSearchData.engine.Count = count;
                    //console.log("Filters are: ", config.gridOptions.advancedSearchData.engine.Filters);
                    config.gridOptions.reGetAll();
                }

            }

            function getSearchType(operator) {
                switch (operator) {
                    case "equal":
                        return 0;
                    case "not_equal":
                        return 1;
                    case "less":
                        return 2;
                    case "greater":
                        return 3;
                    case "between":
                        return 4;
                    case "contains":
                        return 5;
                    case "not_contains":
                        return 6;
                    case "begins_with":
                        return 7;
                    case "ends_with":
                        return 8;
                    case "less_or_equal":
                        return 9;
                    case "greater_or_equal":
                        return 10;
                }
            }

            // Get rules in a Json format and send it to the server side
            config.setRules = function () {
                if (user_rules != null) {
                    //console.log("setRules called!");
                    $(element).queryBuilder("setRules", user_rules);
                }
            }

            // Get rules in a Json format and send it to the server side
            config.saveRules = function () {
                //console.log("saveRules called!");
                var result = $(element).queryBuilder("getRules");
                if (!$.isEmptyObject(result)) {
                    user_rules = result;
                }
            }

            // Reset the queryBuilder to its initial condition (All the conditions will be removed)
            config.reset = function () {
                var result = $(element).queryBuilder("reset");
            }
            // Establishing an event for QueryBuilder before generating the Json file
            $(element).on("getRules.queryBuilder.filter", function (e, level) {
                for (var i = 0; i < e.value.rules.length; i++) {
                    if (e.value.rules[i].type === "date") {
                        var m = moment(e.value.rules[i].value, 'jYYYY/jM/jD HH:mm:ss');
                        e.value.rules[i].value = m._d;
                    }
                }
                e.preventDefault();
            });
        }
    }
}

//MenuRightListItems
function rashaMenuRight($compile) {

    return {

        restrict: 'A',
        link: function (scope, element) {
            scope.rashaMenuRun = '';
            //scope.fillItem = function ()
            scope.$watch("rashaMenuRun", function (newValue, oldValue) {
                if (scope.rashaMenuRun == '') return;
                scope.customTemplate = '<ul side-navigation class="nav " id="side-menu" style="background-color: rgba(0,0,0,.125);">' +
                    '<li class="nav-header">' +
                    '<div class="dropdown profile-element" dropdown>' +
                    '<a class="dropdown-toggle" dropdown-toggle href>' +
                    '<span class="clear">' +
                    '<span class="block m-t-xs">' +
                    //'<span class="font-noraml">{{main.userName}} خوش آمدید</span>' +
                    '<span class="font-noraml">{{tokenInfo.Item.Name}} خوش آمدید</span>' +
                    '<span class="clear">' +
                    '<span class="font-noraml" dir="ltr" >UserName:({{tokenInfo.Item.Username}})</span>' +
                    '</span>' +
                    //'<span class="text-muted text-xs block" >{{navigationText}}<b class="caret"></b></span>' +
                    //'</span>' +
                    '</a>' +
                    //'<ul class="dropdown-menu animated fadeInRight m-t-xs">' +
                    //'<li><a href=""><i class="fa fa-user"></i> ویرایش پروفایل</a></li>' +
                    //'<li><a href=""><i class="fa fa-user"></i> پیام های مدیریت</a></li>' +
                    //'<li><a href=""><i class="fa fa-gear"></i> تنظیمات کاربری</a></li>' +
                    //'<li><a href=""><i class="fa fa-key"></i> تغییر رمز عبور</a></li>' +
                    //'<li class="divider"></li>' +
                    //'<li><a ng-click="navCtrl.logOut()"><i class="fa fa-sign-out"></i> خروج از سامانه</a></li>' +
                    //'</ul>' +
                    '</div>' +
                    '<div class="logo-element">' +
                    '<i class="fa fa-circle"></i>' +
                    '</div>' +
                    '</li>' +
                    '<li>' +
                    '<a ui-sref="index.main" href="#/index/main" > <span class="nav-label" style="margin-left: 5px; margin-right: 0px; color: #fff !important; "><i class="fa fa-book" aria-hidden="true"></i>&nbsp;&nbsp;داشبورد</span> <span class="fa arrow"></span></a>' +
                    '</li>';
                angular.forEach(scope.MenuRightListItems, function (item, key) {
                    if (item.TitleML)
                        item.Title = item.TitleML;


                    scope.customTemplate = scope.customTemplate + '<li ng-class="{active: $state.includes(' + "'" + item.AddressLink + "'" + ')}" >' +
                        '<a href="" ng-click="navCtrl.OnHeaderMenuClick(' + item.Id + ')"> <span class="nav-label" style="margin-left: 5px; margin-right: 0px; color: #fff !important; "><i class="' + item.Icon + '" aria-hidden="true" style="color:' + item.Color + '"></i>&nbsp;&nbsp;' + item.Title + '</span> <span class="fa arrow"></span></a>' +
                        '<ul class="nav nav-second-level" ng-class="{in: $state.includes(' + "'" + item.AddressLink + "'" + ')}">';
                    angular.forEach(item.Children, function (item2, key2) {
                        if (item2 != null && (item2.MenuPlaceType == 3 || item2.MenuPlaceType == 0)) {
                            if (item2.Children && item2.Children.length > 0) {
                                if (item2.TitleML)
                                    item2.Title = item2.TitleML;
                                var temp = ' <li class="active"><a ui-sref="index.' + item2.AddressLink + '">' + item2.Title + '<span class="fa arrow"></span></a>' +
                                    '<ul class="nav nav-third-level collapse in">' +
                                    chlidmaker(item2.Children) + '</ul></li>';

                                scope.customTemplate = scope.customTemplate + temp;
                            } else {
                                scope.customTemplate = scope.customTemplate + chlidmaker([item2]);
                            }
                        }


                    });
                    scope.customTemplate = scope.customTemplate + '</ul>' + '</li>';


                });
                scope.customTemplate = scope.customTemplate + '</ul>';
                var el = $compile(scope.customTemplate)(scope);
                element.append(el);
            });
        }
    }
}
//
//MenuLeftListItems
function rashaMenuLeft($compile) {

    return {

        restrict: 'A',
        link: function (scope, element) {
            scope.rashaMenuRun = '';
            //scope.fillItem = function ()
            scope.$watch("rashaMenuRun", function (newValue, oldValue) {
                if (scope.rashaMenuRun == '') return;
                scope.customTemplate = '<ul side-navigation class="nav metismenu" id="side-menu">' +
                    '<li class="nav-header">' +
                    '<div class="dropdown profile-element" dropdown>' +
                    '<a class="dropdown-toggle" dropdown-toggle href>' +
                    '<span class="clear">' +
                    '<span class="block m-t-xs">' +
                    //'<span class="font-noraml">{{main.userName}} خوش آمدید</span>' +
                    '<span class="font-noraml">{{tokenInfo.Item.Name}} خوش آمدید</span>' +
                    '<span class="clear">' +
                    '<span class="font-noraml" dir="ltr" >UserName:({{tokenInfo.Item.Username}})</span>' +
                    '</span>' +
                    //'<span class="text-muted text-xs block" >{{navigationText}}<b class="caret"></b></span>' +
                    //'</span>' +
                    '</a>' +
                    //'<ul class="dropdown-menu animated fadeInRight m-t-xs">' +
                    //'<li><a href=""><i class="fa fa-user"></i> ویرایش پروفایل</a></li>' +
                    //'<li><a href=""><i class="fa fa-user"></i> پیام های مدیریت</a></li>' +
                    //'<li><a href=""><i class="fa fa-gear"></i> تنظیمات کاربری</a></li>' +
                    //'<li><a href=""><i class="fa fa-key"></i> تغییر رمز عبور</a></li>' +
                    //'<li class="divider"></li>' +
                    //'<li><a ng-click="navCtrl.logOut()"><i class="fa fa-sign-out"></i> خروج از سامانه</a></li>' +
                    //'</ul>' +
                    '</div>' +
                    '<div class="logo-element">' +
                    '<i class="fa fa-circle"></i>' +
                    '</div>' +
                    '</li>';
                angular.forEach(scope.MenuLeftListItems, function (item, key) {
                    scope.customTemplate = scope.customTemplate + '<li ng-class="{active: $state.includes(' + "'" + item.AddressLink + "'" + ')}" >' +
                        '<a href=""> <span class="nav-label" style="margin-left: 5px; margin-right: 0px; color: #fff !important; "><i class="' + item.Icon + '" aria-hidden="true"></i>&nbsp;&nbsp;' + item.Title + '</span> <span class="fa arrow"></span></a>' +
                        '<ul class="nav nav-second-level" ng-class="{in: $state.includes(' + "'" + item.AddressLink + "'" + ')}">';
                    angular.forEach(item.Children, function (item2, key2) {

                        if (item2.Children && item2.Children.length > 0) {

                            var temp = ' <li class="active"><a ui-sref="index.' + item2.AddressLink + '">' + item2.Title + '<span class="fa arrow"></span></a>' +
                                '<ul class="nav nav-third-level collapse in">' +
                                chlidmaker(item2.Children) + '</ul></li>';

                            scope.customTemplate = scope.customTemplate + temp;
                        } else {
                            scope.customTemplate = scope.customTemplate + chlidmaker([item2]);
                        }


                    });
                    scope.customTemplate = scope.customTemplate + '</ul>' + '</li>';


                });
                scope.customTemplate = scope.customTemplate + '</ul>';
                var el = $compile(scope.customTemplate)(scope);
                element.append(el);
            });
        }
    }
}
//
//MenuUpListItems ,0
function rashaMenuUp($compile) {

    return {

        restrict: 'A',
        link: function (scope, element) {
            scope.rashaMenuRun = '';
            //scope.fillItem = function ()
            scope.$watch("rashaMenuRun", function (newValue, oldValue) {
                if (scope.rashaMenuRun == '') return;
                scope.customTemplate = '<ul side-navigation class="nav navbar-nav" id="side-menu" style="background: #273b4b;">' +
                    '<li>' +
                    //'<div class="dropdown profile-element" dropdown>' +
                    //'<a class="dropdown-toggle" dropdown-toggle href>' +
                    //'<span class="clear">' +
                    //'<span class="block m-t-xs">' +
                    //'<span class="font-noraml">{{tokenInfo.Item.Name}} upupupupupup</span>' +
                    //'<span class="clear">' +
                    //'<span class="font-noraml" dir="ltr" >UserName:({{tokenInfo.Item.Username}})</span>' +
                    //'</span>' +
                    //'</a>' +
                    //'</div>' +
                    //'<div class="logo-element">' +
                    //'<i class="fa fa-circle"></i>' +
                    //'</div>' +
                    '</li>';


                angular.forEach(scope.MenuUpListItems, function (item, key) {
                    scope.customTemplate = scope.customTemplate + '<li class="dropdown" style="color: #fff" ng-class="{active: $state.includes(' + "'" + item.AddressLink + "'" + ')}" >' +
                        '<a class="dropdown-toggle" data-toggle="dropdown" style="color: #fff"  href=""> <span class="nav-label" style=" color: #fff !important; "><i class="' + item.Icon + '" aria-hidden="true"></i>&nbsp;&nbsp;' + item.Title + '</span> <span class="fa arrow"></span></a>' +
                        '<ul class="dropdown-menu" style="background: #273b4b;" ng-class="{in: $state.includes(' + "'" + item.AddressLink + "'" + ')}">';
                    angular.forEach(item.Children, function (item2, key2) {

                        if (item2.Children && item2.Children.length > 0) {

                            var temp = ' <li class="active"><a ui-sref="index.' + item2.AddressLink + '">' + item2.Title + '<span class="fa arrow"></span></a>' +
                                '<ul class="nav nav-third-level collapse in">' +
                                chlidmaker(item2.Children) + '</ul></li>';

                            scope.customTemplate = scope.customTemplate + temp;
                        } else {
                            scope.customTemplate = scope.customTemplate + chlidmaker([item2]);
                        }


                    });
                    scope.customTemplate = scope.customTemplate + '</ul>' + '</li>';


                });
                scope.customTemplate = scope.customTemplate + '</ul>';
                var el = $compile(scope.customTemplate)(scope);
                element.append(el);
            });
        }
    }
}
//
//MenuDownListItems
function rashaMenuDown($compile) {

    return {

        restrict: 'A',
        link: function (scope, element) {
            scope.rashaMenuRun = '';
            //scope.fillItem = function ()
            scope.$watch("rashaMenuRun", function (newValue, oldValue) {
                if (scope.rashaMenuRun == '') return;
                scope.customTemplate = '<ul side-navigation class="nav navbar-nav" id="side-menu" style="background: #273b4b;">' +
                    '<li>' +
                    //'<div class="dropdown profile-element" dropdown>' +
                    //'<a class="dropdown-toggle" dropdown-toggle href>' +
                    //'<span class="clear">' +
                    //'<span class="block m-t-xs">' +
                    //'<span class="font-noraml">{{tokenInfo.Item.Name}} upupupupupup</span>' +
                    //'<span class="clear">' +
                    //'<span class="font-noraml" dir="ltr" >UserName:({{tokenInfo.Item.Username}})</span>' +
                    //'</span>' +
                    //'</a>' +
                    //'</div>' +
                    //'<div class="logo-element">' +
                    //'<i class="fa fa-circle"></i>' +
                    //'</div>' +
                    '</li>';


                angular.forEach(scope.MenuDownListItems, function (item, key) {
                    scope.customTemplate = scope.customTemplate + '<li class="dropdown" style="" ng-class="{active: $state.includes(' + "'" + item.AddressLink + "'" + ')}" >' +
                        '<a class="dropdown-toggle" style="color: #fff" data-toggle="dropdown"  href=""> <span class="nav-label" style=" color: #fff !important; "><i class="' + item.Icon + '" aria-hidden="true"></i>&nbsp;&nbsp;' + item.Title + '</span> <span class="fa arrow"></span></a>' +
                        '<ul class="dropdown-menu" style="background: #273b4b;style="color: #fff"" ng-class="{in: $state.includes(' + "'" + item.AddressLink + "'" + ')}">';
                    angular.forEach(item.Children, function (item2, key2) {

                        if (item2.Children && item2.Children.length > 0) {

                            var temp = ' <li  class="active"><a style="color: #fff" ui-sref="index.' + item2.AddressLink + '">' + item2.Title + '<span class="fa arrow"></span></a>' +
                                '<ul class="nav nav-third-level collapse in">' +
                                chlidmaker(item2.Children) + '</ul></li>';

                            scope.customTemplate = scope.customTemplate + temp;
                        } else {
                            scope.customTemplate = scope.customTemplate + chlidmaker([item2]);
                        }


                    });
                    scope.customTemplate = scope.customTemplate + '</ul>' + '</li>';


                });
                scope.customTemplate = scope.customTemplate + '</ul>';
                var el = $compile(scope.customTemplate)(scope);
                element.append(el);
            });
        }
    }
}
//
chlidmaker = function (obj) {
    var temp = "";
    $.each(obj, function (key, value) {
        //if (value.Title != null && value.Title != undefined) value.Title = value.Title.toLowerCase();
        if (value.AddressLink != null && value.AddressLink != undefined) value.AddressLink = value.AddressLink.toLowerCase();
        temp = temp + ' <li ng-show="' + value.ShowInMenu + '"><a  ui-sref="index.' + value.AddressLink + '">' + value.Title + '</a></li>';
    });
    return temp;
}
var lastErroLogin = Date.now();

function rashaErManage($state, notify, SweetAlert) {
    var template = 'cpanelv1/ModuleCore/common/notify.html';
    this.checkAction = function (response, errCode, c, d) {
        if(response && response.token&& response.token.length>10)
            localStorage.setItem("userGlobaltoken", response.token);
        var ErrorMessage="";
        if (response) {
            //#help# خطا های موجود در درخواست
            if (!response.Status && response.ErrorMessage) {
                console.log(response);
                notify({
                    message: 'Show Log For More Error',
                    classes: 'alert-danger',
                    templateUrl: template
                });
                console.log(response.ErrorMessage)
                return;

                //notify({ message: response, classes: 'alert-danger', templateUrl: template });
            }
            if (response.ErrorType == 15) {
                response.ErrorMessage = "حذف امکان پذیر نیست. این آیتم شامل زیرمجموعه می باشد";
                notify({
                    message: response.ErrorMessage,
                    classes: 'alert-danger',
                    templateUrl: template
                });
                return;
            }
            if (response.Status == 200) {
                if (response.UserTicket) {
                    localStorage.setItem('userGlobaltoken', response.UserTicket);
                }
                if (response.IsSuccess != undefined && response.IsSuccess == false) {
                    var myMessage = "متاسفانه ثبت با خطا مواجه شد! " + response.ErrorMessage;
                    notify({
                        message: myMessage,
                        classes: 'alert-danger',
                        templateUrl: template
                    });
                    //console.log(response.ErrorMessage);
                }
                return;
            } else if (response.Status == 401) {
                localStorage.removeItem('userGlobaltoken');
                if ((Date.now() - lastErroLogin) > 1000)
                    notify({
                        message: 'لطفاَ ابتدا وارد سایت شوید',
                        classes: 'alert-danger',
                        templateUrl: template
                    });
                lastErroLogin = Date.now();
                $state.go('login', {});
            } else if (response.Status == 420) {
                if (response.ErrorMessage != '')
                    notify({
                        message: response.ErrorMessage,
                        classes: 'alert-danger',
                        templateUrl: template
                    });
            } else if (response.Status == 430) {
                if (response.ErrorMessage != '')
                    notify({
                        message: response.ErrorMessage,
                        classes: 'alert-warning',
                        templateUrl: template
                    });
            } else if (response.Status == 440) {
                if (response.ErrorMessage != '')
                    notify({
                        message: response.ErrorMessage,
                        classes: 'alert-danger',
                        templateUrl: template
                    });
            } else if (response.Status == 500) {
                if (response.ErrorMessage != '')
                    notify({
                        message: response.ErrorMessage,
                        classes: 'alert-danger',
                        templateUrl: template
                    });
                //#help# ارسال برای سرور
            } else if (response.Status == 402) {
                localStorage.removeItem('userGlobaltoken');
                $state.go('login', {});
            }else  {
                ErrorMessage = "برروز خطا ." + " errCode: " + errCode;
                notify({
                    message: ErrorMessage,
                    classes: 'alert-danger',
                    templateUrl: template
                });
            }
            //#help# خطا های موجود در درخواست
        } else if (errCode != undefined) {
            var ErrorMessage="برروز خطا ";
     
            //#help# خطا های مستقیم از شبکه
            if (errCode == 401) {
                // localStorage.removeItem('userGlobaltoken');
                if ((Date.now() - lastErroLogin) > 1000)
                    notify({
                        message: 'لطفاَ ابتدا وارد سایت شوید',
                        classes: 'alert-danger',
                        templateUrl: template
                    });
                lastErroLogin = Date.now();
                $state.go('login', {});
            } else if (errCode == 420) {
                notify({
                    message: ErrorMessage,
                    classes: 'alert-danger',
                    templateUrl: template
                });
                console.log(response);
            } else if (errCode == 430) {
                notify({
                    message: ErrorMessage,
                    classes: 'alert-warning',
                    templateUrl: template
                });
                console.log(response);
            } else if (errCode == 440) {
                notify({
                    message: ErrorMessage,
                    classes: 'alert-danger',
                    templateUrl: template
                });
                console.log(response);
            } else if (errCode == 500) {
                notify({
                    message: ErrorMessage,
                    classes: 'alert-danger',
                    templateUrl: template
                });
                console.log(response);
                //#help# ارسال برای سرور
            } else if (errCode == 402) {
                localStorage.removeItem('userGlobaltoken');
                $state.go('login', {});
            } else if (errCode == 302) {
                notify({
                    message: ErrorMessage,
                    classes: 'alert-danger',
                    templateUrl: template
                });
                console.log(response);
            } else {
                notify({
                    message: ErrorMessage,
                    classes: 'alert-danger',
                    templateUrl: template
                });
                console.log(response);
            }
            //#help# خطا های مستقیم از شبکه
        } else {
            notify({
                message: "برروز خطا .لطفا با پشتبانی سیستم تماس بگیرید",
                classes: 'alert-danger',
                templateUrl: template
            });
            console.log(response);
        }
    }

    this.showMessage = function (message) {
        notify({
            message: message,
            classes: 'alert-warning',
            templateUrl: template
        });
    }
    this.showYesNo = function (title, message, onConfirmed) {
        SweetAlert.swal({
            title: title,
            text: message,
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "بلی",
            cancelButtonText: "خیر",
            closeOnConfirm: true,
            closeOnCancel: true
        }, onConfirmed);
    }

    return this;
}

function ajax($http, $state) {
    this.call = function (url, data, method, isasync) {
        if (!method) method = 'POST';
        if (!data) data = '';
        if (isasync == undefined) isasync = true;
        else {
            if (isasync == 'true') isasync = true;
            else isasync = false;
        }
        var userglobaltoken = localStorage.getItem('userGlobaltoken');
        if (method.toUpperCase() == 'GET') {
            url = url + '/' + data;
            data = '';
        }
        //x-www-form-urlencoded
        return $http({
            'method': method,
            'url': url,
            'data': data,
            'async': isasync,
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': userglobaltoken
            }
            
            //'transformRequest': function (obj) {
            //    //return $.param(obj);
            //    return JSON.stringify(obj);
            //}
        });
    }
    this.logOut = function () {
        var data = {};
        var userglobaltoken = localStorage.getItem('userGlobaltoken');
        data.userToken = userglobaltoken;
        $.ajax({
            type: "POST",
            data: data,
            url: cmsServerConfig.configApiServerPath + "CoreUser/UserClearToken",
            contentType: "application/json; charset=utf-8",
            //Send header authorization in request
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", userglobaltoken);
            },
            success: function (response) {
                localStorage.setItem('userGlobaltoken', '');
                $state.go('login', {})
            },
            error: function (data) {
                $state.go('login', {});
                localStorage.setItem('userGlobaltoken', '');
                console.log(data);
            }
        });
    }
    return this;
}

function treeNode($compile) {
    return {
        restrict: 'A',
        link: function (scope, element) {
            String.prototype.replaceAll = function (toReplace, replaceWith) {
                return this.toString().split(toReplace).join(replaceWith);
            }

            //var config = {};
            var atrconfig = '';
            atrconfig = $(element).attr('tree-config');
            var atr = '';
            atr = $(element).attr('tree-list');

            function guid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return s4() + s4() + s4() + s4() + s4();
            }

            var id = guid();

            var template = '<li ng-repeat="a' + id + ' in ??config??" >' +
                '<i ng-if="(a' + id + '.Children.length > 0)" style="cursor:pointer;" ng-class="{' + "'fa fa-folder-open'" + ': (a' + id + '.Children.length > 0)}" ng-click=??atrconfig??.collapse(a' + id + ',$event)></i> <span class="btn-tree" ng-class="{' + "'btn-tree-active'" + ': ??atrconfig??.isEqual(a' + id + ' , ??atrconfig??.currentNode)}" ng-click="??atrconfig??.select(a' + id + ',$event)">{{a' + id + '.Title}}</span> <ul tree-config="??atrconfig??" tree-node="Children" tree-list="a' + id + '.Children"></ul></li>';
            template = template.replaceAll("??config??", atr)
                .replaceAll("??atrconfig??", atrconfig);
            var el = $compile(template)(scope);
            element.append(el);
        }
    }
}

function treeOptions($compile) {
    return {
        restrict: 'A',
        link: function (scope, element) {

            String.prototype.replaceAll = function (toReplace, replaceWith) {
                return this.toString().split(toReplace).join(replaceWith);
            }

            var config = {};
            var atr = '';
            atr = $(element).attr('tree-options');
            if (!atr) {
                throw "Tree Configuration Not Found";
            }
            if (atr.indexOf(".") > 0) {
                var split = atr.split(".");
                if (split.length == 2) {
                    var temp = scope[split[0]];
                    config = temp[split[1]];
                } else {
                    var temp = scope[split[0]];
                    var temp2 = temp[split[1]];
                    config = temp2[split[2]];
                }
            } else
                config = scope[atr];

            if (!config) {
                throw "Configuration Not Found";
            }

            config.collapse = function (item, ele) {
                if ($(ele.currentTarget).hasClass('fa-folder-open')) {
                    $(ele.currentTarget).removeClass('fa-folder-open').addClass('fa-folder');
                    $(ele.currentTarget).next().next().slideToggle();
                } else {
                    $(ele.currentTarget).removeClass('fa-folder').addClass('fa-folder-open');
                    $(ele.currentTarget).next().next().slideToggle();
                }

            }

            config.select = function (item) {
                if (!item) {
                    //console.log("Root selected");
                    config.currentNode = null;
                    config.onNodeSelect(item);
                } else {
                    config.currentNode = item;
                    config.onNodeSelect(item);
                }
            }

            config.removeNode = function (item) {}


            config.isEqual = function (item1, item2) {
                if (item1 != undefined && item1 != null && item2 != undefined && item2 != null)
                    return (item1.Id == item2.Id);
                return false;

            }

            //console.log(config);
            var template = '<li><i style="cursor:pointer;" ng-click=??config??.collapse(x,$event)></i> <span class="btn-tree" ng-click="??config??.select(x,$event)">...</span></li>  <li ng-repeat="x in ??config??.Items" ng-if="x.LinkParentId == null">' +
                '<i ng-if="(x.Children.length > 0)" style="cursor:pointer;" ng-class="{' + "'fa fa-folder-open'" + ': (x.Children.length > 0)}" ng-click=??config??.collapse(x,$event)></i> <span class="btn-tree" ng-class="{' + "'btn-tree-active'" + ': ??config??.isEqual(x, ??config??.currentNode)}" ng-click="??config??.select(x,$event)">{{x.??Title??}}</span> <ul tree-node="??Children??" tree-config="??config??" tree-list="x.??Children??"></ul></li>';
            template = template.replaceAll("??config??", atr)
                .replaceAll("??Title??", config.displayMember)
                .replaceAll("??Children??", config.displayChild)
                .replaceAll("??Children??", config.displayChild);
            //.replaceAll("??LinkParentId??", config.displayLinkParentId);
            var el = $compile(template)(scope);
            element.append(el);
        }
    }
}

function progressbar() {

    return {
        restrict: 'A',
        scope: {
            model: '=ngModel'
        },
        require: 'ngModel',
        link: function link(scope, element) {
            var progressBar = new ProgressBar.Path(element[0], {
                strokeWidth: 2
            });
            scope.$watch('model', function () {
                progressBar.animate(scope.model / 100, {
                    duration: 1000
                });
            });
            scope.$on('$dropletSuccess', function onSuccess() {
                progressBar.animate(0);
            });
            scope.$on('$dropletError', function onSuccess() {
                progressBar.animate(0);
            });
        }
    }
}

function dropzone() {
    return {
        restrict: 'C',
        scope: {
            currentFolder: "="
        },
        link: function (scope, element, attrs) {

            var config = {
                url: '/cmsfilecategory/upload',
                maxFilesize: 100,
                paramName: "uploadfile",
                maxThumbnailFilesize: 10,
                parallelUploads: 10,
                autoProcessQueue: false,
                uploadMultiple: true
            };

            //var currentConfig = {};
            //var atr = '';
            //atr = $(element).attr('current-folder');
            //if (!atr) {
            //    throw "Tree Configuration Not Found";
            //}
            //if (atr.indexOf(".") > 0) {
            //    var split = atr.split(".");
            //    if (split.length == 2) {
            //        var temp = scope[split[0]];
            //        currentConfig = temp[split[1]];
            //    } else {
            //        var temp = scope[split[0]];
            //        var temp2 = temp[split[1]];
            //        currentConfig = temp2[split[2]];
            //    }
            //}
            //else
            //    currentConfig = scope[atr];

            //if (!currentConfig) {
            //    throw "Configuration Not Found";
            //}

            var eventHandlers = {
                'addedfile': function (file) {
                    scope.file = file;
                    if (this.files[1] != null) {
                        this.removeFile(this.files[0]);
                    }
                    scope.$apply(function () {
                        scope.fileAdded = true;
                    });
                },

                'success': function (file, response) {},

                'sending': function (file, xhr, formData) {
                    var userglobaltoken = localStorage.getItem('userGlobaltoken');
                    formData.append("userToken", userglobaltoken);
                    formData.append("model", currentFolder.selectedNode);
                }

            };

            dropzone = new Dropzone(element[0], config);

            angular.forEach(eventHandlers, function (handler, event) {
                dropzone.on(event, handler);
            });

            scope.processDropzone = function () {
                dropzone.processQueue();
            };

            scope.resetDropzone = function () {
                dropzone.removeAllFiles();
            }

            //console.log(scope);
        }
    }
}

function xsWizard() {

    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: 'cpanelv1/ModuleCore/siteWizard/xs-wizard-main.html',

        scope: {
            subTitle: '@',
            saveText: '@',
            onPageChange: '&',
            onCancel: '&',
            onSave: '&',
            hideNavButtons: '=',
            hasBreadcrumbs: '=',
            controlsOnTop: '=',
            hasCancel: '=',
            hasSave: '='
        },

        controller: function ($scope) {
            $scope.pages = [];

            // underlying page turner
            var changePage = function (nextIndex) {
                // #TODO: Validation callback to check and allow page change
                $scope.state = {
                    state: {
                        previousPage: $scope.curPageIdx,
                        currentPage: nextIndex
                    }
                };
                $scope.pages[$scope.curPageIdx].activePage = false;
                setCurrentPage(nextIndex);
                if ($scope.onPageChange) $scope.onPageChange($scope.state);
            };
            // pass save to outside controller
            $scope.save = function () {
                if ($scope.onSave) $scope.onSave();
            };
            $scope.cancel = function () {
                if ($scope.onCancel) $scope.onCancel();
            };
            var setCurrentPage = function (index) {
                $scope.curPageIdx = index;
                $scope.pages[$scope.curPageIdx].activePage = true;
            };
            // **************************************
            // controller interface
            //
            this.addPage = function (page) {
                $scope.pages.push(page);
                if ($scope.pages.length === 1) setCurrentPage(0);
            };
            // **************************************
            // $scope interface
            //
            $scope.goToPage = function (index) {
                changePage(index);
            };
            $scope.nextPage = function () {
                changePage($scope.curPageIdx + 1);
            };
            $scope.prevPage = function () {
                changePage($scope.curPageIdx - 1);
            };
            $scope.isLast = function () {
                return $scope.curPageIdx === ($scope.pages.length - 1);
            };
            $scope.isFirst = function () {
                return $scope.curPageIdx === 0;
            };
            $scope.hasNext = function () {
                return !$scope.isLast();
            };
            $scope.hasPrev = function () {
                return !$scope.isFirst();
            };
        } // end controller
    }; // end return
}

function xsWizardPage() {

    return {
        restrict: 'E',
        transclude: true,
        replace: true,
        templateUrl: 'cpanelv1/ModuleCore/siteWizard/xs-wizard-page.html',

        scope: {
            pageTitle: '@',
            pageTag: '@'
        },

        require: '^xsWizard',
        link: function (scope, element, attr, xsWizard) {
            xsWizard.addPage(scope);
        }
    }; // end return

}

function xsWizardControls() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'cpanelv1/ModuleCore/siteWizard/xs-wizard-controls.html'
    }; // end return

}

function customTextInput($compile, $position) {
    return {
        restrict: "EA",
        replace: true,
        link: function (scope, element) {
            var getValue = function (key) {
                if (!key)
                    return "";
                else {
                    return key;
                }
            }

            // Begin functions 
            var getGlyphIconColor = function () {

                var type = $(element).attr("glyph-type");
                switch (type) {
                    case 'danger':
                        return 'red';
                        break;

                    case 'warning':
                        return '#FBAA13'; //yellow
                        break;

                    case 'success':
                        return '#1ab394'; //green
                        break;

                    case 'info':
                        return '#1D97F3'; //blue
                        break;

                    default:
                    case '':
                    case undefined:
                        return '';

                }
            }
            var getGlyphIconFloat = function () {
                var attrValue = $(element).attr("icon-float");
                if (attrValue && attrValue === "right") {
                    return "right";
                }
                if (!attrValue || attrValue === "left") {
                    return "left";
                }
            }
            var getTooltipInfo = function () {
                var attrVal = $(element).attr("tooltip-info");
                return getValue(attrVal);
            }
            var getPlaceholder = function () {
                var attrValue = $(element).attr("placeholder");
                return getValue(attrValue);
            }
            var getDirection = function () {
                var attrValue = $(element).attr("dir");
                var tempDirection = getValue(attrValue);
                if (tempDirection.length === 0 || tempDirection === "rtl")
                    return "rtl";
                return "ltr";
            }
            var getTooltipValue = function () {
                var attrVal = $(element).attr("show-tooltip");
                return getValue(attrVal);
            }
            var getGlyphIconName = function () {
                var attrVal = $(element).attr("glyph-name");
                return getValue(attrVal);
            }
            var setMarginArray = function (right, left) {
                var margin = new Object();
                margin["right"] = right;
                margin["left"] = left;
                return margin;
            }
            var getInputMargin = function () {
                var dir = getDirection();
                var iconFloat = getGlyphIconFloat();
                if (dir === "rtl" && iconFloat === "right") {
                    return setMarginArray("10px", "0px");
                }
                if (dir === "rtl" && iconFloat === "left") {
                    return setMarginArray("5px", "0px");
                }
                if (dir === "ltr" && iconFloat === "right") {
                    return setMarginArray("0px", "5px");
                }
                if (dir === "ltr" && iconFloat === "left") {
                    return setMarginArray("0px", "10px");
                }
                return setMarginArray("5px", "5px");

            }
            var getModelVal = function () {
                var attrVal = $(element).attr("ng-model");
                return getValue(attrVal);
            }
            // End functions

            // Begin Config
            var config = {
                //آیکنی که داخل باکس نمایش می دهد
                icon: getGlyphIconName(),

                //placeholder
                placeholder: getPlaceholder(),

                //آیا آیکن را نمایش دهد
                showInfoTooltip: getTooltipValue(),

                //تولتیپی که با آمدن ماوس روی آیکن نمایش داده می شود
                tooltipInfo: getTooltipInfo(),

                //نوع آیکن نمایش داده شونده : info - danger - warning - success
                glyphType: getGlyphIconColor(),

                //مکایش آیکن در سمت چپ یا راست
                iconFloat: getGlyphIconFloat(),

                //دایرکشن کلی دیرکتیو
                dir: getDirection(),

                //مدلی که از طریق تکست باکس بدست می آید
                model: getModelVal(),

                //فاصله تکست باکس با اطرافش از سمت راست و چپ
                inputMargin: getInputMargin()
            }

            // End Config

            var template = "<div class='row form-control form-group' dir='" + config.dir + "'>" +
                "<span ng-show='" + config.showInfoTooltip + "' class='mntooltip glyphicon glyphicon-" + config.icon +
                "' style='color: " + config.glyphType + "; font-size: 1.2em;float:" + config.iconFloat + "' uib-tooltip=" + config.tooltipInfo + " ></span>" +
                " <input type='text' class='noOutline  element' placeholder='" + config.placeholder +
                "' ng-model=" + config.model + " style='border: none; width: 95%;background: transparent;margin-right:" + config.inputMargin.right + ";margin-left:" + config.inputMargin.left + ";'/> ";

            var elem = $compile(template)(scope);
            element.append(elem);
        }

    }
}
var countError = 0;
//, ajax, rashaErManage
function rashaErrorLog($log, $injector) {
    if (countError < 10) {
        return function myExceptionHandler(exception, cause) {
            $log.error(exception, cause);
            var $rootScope = $injector.get('$rootScope');
            //$rootScope.errors.push({
            //    string: exception.toString(),
            //    message: exception.message,
            //    lineNumber: exception.lineNumber,
            //    stack: exception.stack,
            //    cause: cause
            //});
            countError++;
            var model = {
                Message: "Error in browser : " + exception.message,
                log: exception.message + ' - Line number: ' + exception.lineNumber + ' - stack:' + exception.stack + ' - exception: ' + exception.toString() + ' - cause: ' + cause,
                ErrorType: 205
            };

            //$.ajax({
            //    type: "POST",
            //    data: JSON.stringify(model),
            //    async: false,
            //    url: cmsServerConfig.configApiServerPath + "ErrorApi",
            //    contentType: "application/json",
            //    success: function (response) {
            //        console.log("Error was saved manually!", response);
            //        //countError = 0;
            //    },
            //    error: function (data) {
            //        console.log(data);
            //    }
            //});

            //alert("بروز خطا: " + exception.message);
        };
    }
}

function rashaLoading($compile) {
    return {
        restrict: 'A',
        link: function (scope, element) {

            String.prototype.replaceAll = function (toReplace, replaceWith) {
                return this.toString().split(toReplace).join(replaceWith);
            }

            var atr = '';
            atr = $(element).attr('rasha-loading');
            if (!atr) {
                throw "تنظیمات لودر مشخص نشده است .";
                return;
            }
            var config = {};
            if (atr.indexOf(".") > 0) {
                var split = atr.split(".");
                if (split.length == 2) {
                    var temp = scope[split[0]];
                    config = temp[split[1]];
                } else {
                    var temp = scope[split[0]];
                    var temp2 = temp[split[1]];
                    config = temp2[split[2]];
                }
            } else
                config = scope[atr];
            if (config != undefined)
                config.pictureUrl = "cpanelv1/images/loading.png";
            var template = '<div ng-show="??config??.isActive" id="rashaLoading" style="border: 2px solid #a1a1a1;border-radius:15px;"><img src="{{??config??.pictureUrl}}"><p><br>{{??config??.message}}</p></div>';
            template = template.replaceAll("??config??", atr);
            var el = $compile(template)(scope);
            element.append(el);
        }
    };
}

function ngHtmlCompile($compile) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch(attrs.ngHtmlCompile, function (newValue, oldValue) {
                element.html(newValue);
                $compile(element.contents())(scope);
            });
        }
    }
}

function customPopover(ajax, $timeout, $parse) {
    return {
        restrict: 'A',
        template: '<img src="{{src}}" width="50" height="50"/>',
        link: function (scope, el, attrs) {
            scope.src = attrs.popoverIconsrc;
            //#help# برای بستن
            var _hide = function () {
                if (scope.$hide) {
                    scope.$hide();
                    scope.$apply();
                }
            };

            // Stop propagation when clicking inside popover.
            el.on("click", function (event) {
                event.stopPropagation();
            });

            // Hide when clicking outside.
            $timeout(function () {
                angular.element("body").one("click", _hide);
            }, 0);

            // Safe remove.
            scope.$on("$destroy", function () {
                angular.element("body").off("click", _hide);
            });
            //#help# برای بستن
            scope.content = function () {
                ajax.call(cmsServerConfig.configApiServerPath + 'FileContent/GetOne', attrs.popoverId, 'GET').success(function (response) {
                    $("#image" + attrs.popoverId).attr("src", cmsServerConfig.configPathFileByIdAndName + response.Item.Id + "/" + response.Item.FileName);
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
                return '<img id="image' + attrs.popoverId + '" src=cmsServerConfig.configCpanelImages+"loader.gif"  width="' + attrs.width + '" height="' + attrs.height + '"/>';
            };
            $(el).popover({
                trigger: 'click',
                html: true,
                title: attrs.popoverTitle,
                placement: attrs.popoverPlacement,
                toggle: 'popover',
                content: scope.content, // Access the popoverHtml html
            });

            function getImageSize(src) {
                var tmpImg = new Image();
                tmpImg.src = src; //or  document.images[i].src;
                orgWidth = tmpImg.width;
                orgHeight = tmpImg.height;
                return {
                    width: orgWidth,
                    heigth: orgHeight
                };
            }
        }
    }
}

function rashaDatePicker($compile, $filter) {
    return {
        restrict: 'A',
        require: "ngModel",
        ngModel: '=',
        link: function (scope, element, attrs, ngModel) {
            //Function For Replace
            String.prototype.replaceAll = function (toReplace, replaceWith) {
                return this.toString().split(toReplace).join(replaceWith);
            }
            //Function For Convert English Number to Farsi
            String.prototype.toFaDigit = function () {
                return this.toString().replace(/\d+/g, function (digit) {
                    var ret = '';
                    for (var i = 0, len = digit.length; i < len; i++) {
                        ret += String.fromCharCode(digit.charCodeAt(i) + 1728);
                    }

                    return ret;
                });
            };

            //Get Attrebuttes

            var atr = '';
            atr = $(element).attr('rasha-date-picker');
            accessEdit = $(element).attr('access-edit-field');
            if (!atr) {
                throw "تنظیمات تاریخ مشخص نشده است .";
                return;
            }
            var config = {};
            if (atr.indexOf(".") > 0) {
                var split = atr.split(".");
                if (split.length == 2) {
                    var temp = scope[split[0]];
                    config = temp[split[1]];
                } else {
                    var temp = scope[split[0]];
                    var temp2 = temp[split[1]];
                    config = temp2[split[2]];
                }
            } else
                config = scope[atr];

            config.day = 0;
            //config.defaultDate = attrs.ngModel;
            //scope.$watch(
            //         attrs.ngModel,
            //         function (newValue, oldValue) {
            //             config.defaultDate = newValue;
            //         }
            //     );

            //calcute First Time
            config.calcuteFirstDay = function () {
                var m = moment(config.year + " / " + config.monthNumber + " / " + 01, 'jYYYY/jM/jD');
                m.format('jYYYY/jM/jD [is] YYYY/M/D');
                config.weekday = $filter('jalaliDate')(m, 'dddd');

                switch (config.weekday) {
                    case 'شنبه':
                        config.spaceFromFirst = 0;
                        break;
                    case 'یک\u200cشنبه':
                        config.spaceFromFirst = 1;
                        break;
                    case 'دوشنبه':
                        config.spaceFromFirst = 2;
                        break;
                    case 'سه\u200cشنبه':
                        config.spaceFromFirst = 3;
                        break;
                    case 'چهارشنبه':
                        config.spaceFromFirst = 4;
                        break;
                    case 'پنج\u200cشنبه':
                        config.spaceFromFirst = 5;
                        break;
                    case 'آدینه':
                        config.spaceFromFirst = 6;
                        break;
                }


            };

            //Default Arrays
            var persianMonth = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
            var persianNumMonth = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
            config.persianDayes = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
            var persianDays = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
            var persianDaysKabise = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 30];
            var persianKabise = [1391, 1395, 1399, 1403];

            //Default Var
            config.monthName = persianMonth[config.monthNumber - 1];
            config.spaceFromlast = 1;
            config.number = 31;
            config.firstSpace = "";
            config.show = false;
            var first = true;
            var last = true;
            var numberRow = 1;
            var colRow = 1;
            var viewTimePicker = false;
            if (config.viewTimePicker && config.viewTimePicker === true)
                viewTimePicker = config.viewTimePicker;

            var viewDatePicker = false;
            if (config.viewDatePicker && config.viewDatePicker === true)
                viewDatePicker = config.viewDatePicker;


            if (config.defaultDate) {

                toDate = moment(config.defaultDate);
                config.currentDate = $filter('jalaliDate')(config.defaultDate, 'jYYYY/jMM/jDD');

                config.m = config.defaultDate;


                if (config.currentDate.length == 10) {
                    config.day = config.currentDate.substring(8, 10);
                    config.monthNumber = config.currentDate.substring(5, 7);
                    config.year = config.currentDate.substring(0, 4);
                    0
                    ;
                } else if (config.currentDate.length == 8) {
                    config.day = config.currentDate.substring(6, 8);
                    config.monthNumber = config.currentDate.substring(3, 5);
                    config.year = config.currentDate.substring(0, 2);

                } else {
                    throw "تاریخ نا معتبر";
                    return;
                }
                config.myTime = new Date(config.year, config.monthNumber, config.day, $filter('jalaliDate')(config.defaultDate, 'HH'), $filter('jalaliDate')(config.defaultDate, 'mm'), 0); //new Date(2000, 8, 10, 9, 0, 0);


                if (viewTimePicker) {
                    config.m = moment(config.year + " / " + config.monthNumber + " / " + config.day + " " + config.myTime, 'jYYYY/jM/jD HH:mm');
                } else {
                    config.m = moment(config.year + " / " + config.monthNumber + " / " + config.day, 'jYYYY/jM/jD');
                }

                config.m = config.m.utc().format();
                ngModel.$setViewValue(config.m);

                config.monthName = persianMonth[parseInt(config.monthNumber - 1)];
                config.currentDate = config.day + " / " + config.monthNumber + " / " + config.year;
            } else {
                config.monthNumber = 1;
                config.year = 1394;
            }
            //Select Date By User
            config.select = function (colRow) {
                config.day = colRow;
                config.currentDate = config.day + " / " + config.monthNumber + " / " + config.year;
                config.show = false;


                if (viewTimePicker) {
                    config.m = moment(config.year + " / " + config.monthNumber + " / " + config.day + " " + config.myTime, 'jYYYY/jM/jD HH:mm');
                } else {
                    config.m = moment(config.year + " / " + config.monthNumber + " / " + config.day, 'jYYYY/jM/jD');
                }
                //config.m = new Date(parseInt(config.m.toString().replace("/Date(", "").replace(")/", ""), 10));
                config.m = config.m.utc().format();
                //config.m = config.m.toDate();
                //config.model = config.m;
                var test = moment(config.m).valueOf();
                var test2 = moment(config.m).format("ZZ");

                var test1 = "Date(" + test + test2 + ")";

                var aa = config.myTime;
                ngModel.$setViewValue(new Date(config.m));


            };

            //Hide & Show DatePicker
            config.toggle = function () {
                var disabled = false;
                if (accessEdit == "false")
                    disabled = true;
                if (!disabled)
                    config.show = config.show ? false : true;
            };


            //Next Month Functions
            config.prev = function () {
                if (config.monthNumber == 12) {
                    config.monthNumber = 1;
                    config.year++;
                } else {
                    config.monthNumber++;
                }
                //Check For Kabise
                if (persianKabise.indexOf(config.year) != -1) {
                    config.number = persianDaysKabise[config.monthNumber - 1];
                } else {
                    config.number = persianDays[config.monthNumber - 1];

                }

                if (viewTimePicker) {
                    config.m = moment(config.year + " / " + config.monthNumber + " / " + config.day + " " + config.myTime, 'jYYYY/jM/jD HH:mm');
                } else {
                    config.m = moment(config.year + " / " + config.monthNumber + " / " + config.day, 'jYYYY/jM/jD');
                }

                config.calcuteFirstDay();
                config.monthName = persianMonth[config.monthNumber - 1];
                config.init();

            };
            //prev Month Functions
            config.next = function () {
                if (config.monthNumber == 1) {
                    config.monthNumber = 12;
                    config.year--;
                } else {
                    config.monthNumber--;
                }
                //Check For Kabise
                if (persianKabise.indexOf(config.year) != -1) {
                    config.number = persianDaysKabise[config.monthNumber - 1];
                } else {
                    config.number = persianDays[config.monthNumber - 1];

                }
                config.monthName = persianMonth[config.monthNumber - 1];
                config.init();

            };

            //Show Date Picker
            config.init = function () {
                element.empty();
                colRow = 1;
                first = true;
                last = true;
                config.calcuteFirstDay();
                var template = '<div id="rashaDatePicker" ng-click="' + atr + '.toggle()">' +
                    '<i class="fa  fa-calendar-o"></i>&nbsp;&nbsp;   {{(??config??.currentDate).toString().toFaDigit()}}' + '</div>' +
                    '<div ng-show="??config??.show" class="datepicker ll-skin-nigran hasDatepicker" id="dp1448793874705"><div class="ui-datepicker-inline ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" style="display: block;">';
                if (viewTimePicker)
                    template += '</br><input type="time" name="??config??.myTime" id="??config??.myTime"  ng-model="??config??.myTime">';
                //if (viewDatePicker)
                //template += '</br><input  name="??config??.year" id="??config??.year"  ng-model="??config??.year">/<input  name="??config??.monthNumber" id="??config??.monthNumber"  ng-model="??config??.monthNumber">/<input  name="??config??.day" id="??config??.day"  ng-model="??config??.day">';

                template += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all">' +
                    '<a class="ui-datepicker-prev ui-corner-all" ng-click="' + atr + '.prev()"><span class="ui-icon ui-icon-circle-triangle-w"><i class="fa fa-arrow-circle-left fa-lg" style="font-size:16px;color:#fff;"></i></span></a><a class="ui-datepicker-next ui-corner-all" ng-click="' + atr + '.next()">' +
                    '<span class="ui-icon ui-icon-circle-triangle-e"><i  class="fa fa-arrow-circle-right fa-lg"></i></span></a>' +
                    '<div class="ui-datepicker-title"><span class="ui-datepicker-month" style="color: white; font-family: IRANSans">{{??config??.monthName}}</span>' +
                    '&nbsp;<span class="ui-datepicker-year" style="color: white; font-family: IRANSans">{{(??config??.year).toString().toFaDigit()}}</span></div></div>' +
                    '<table class="ui-datepicker-calendar"><thead><tr><th class="ui-datepicker-week-end">' +
                    '<span title="Sunday">{{??config??.persianDayes[0]}}</span></th>' +
                    '<th><span title="Monday">{{??config??.persianDayes[1]}}</span></th>' +
                    '<th><span title="Tuesday">{{??config??.persianDayes[2]}}</span></th>' +
                    '<th><span title="Wednesday">{{??config??.persianDayes[3]}}</span></th>' +
                    '<th><span title="Thursday">{{??config??.persianDayes[4]}}</span></th>' +
                    '<th><span title="Friday">{{??config??.persianDayes[5]}}</span></th>' +
                    '<th class="ui-datepicker-week-end"><span title="Saturday">{{??config??.persianDayes[6]}}</span></th>' +
                    '</tr></thead><tbody><tr>';
                var count = 35;
                if ((config.spaceFromFirst == 5 && config.number == 31) || config.spaceFromFirst == 6) {
                    count = 42;
                }
                for (var i = 1; i <= count; i++) {
                    if (i <= config.spaceFromFirst) {

                        template += '<td><a ng-click="" class="ui-state-disabled">-</a></td>';
                    } else if (i > config.spaceFromFirst && i <= config.number + config.spaceFromFirst) {
                        if (first) {
                            colRow = 1;
                            first = false;
                        }
                        template += '<td><a ng-click="??config??.select(' + colRow + ')" class="ui-state-default">' + colRow.toString().toFaDigit() + '</a></td>';
                    } else {
                        if (last) {
                            colRow = 1;
                            last = false;
                        }
                        template += '<td><a ng-click="" class="ui-state-disabled">-</a></td>';
                    }
                    if (i % 7 == 0) {
                        template += '</tr><tr>';
                        numberRow = 1;
                    }
                    colRow++;

                }

                template += '</tr></tbody></table>';

                template += '</div ></div> ';

                template = template.replaceAll("??config??", atr);
                var el = $compile(template)(scope);
                element.append(el);

            };
            //init For First
            config.init();

        }
    };
}



function contextMenu($compile) {
    contextMenu = {};
    contextMenu.restrict = "AE";
    contextMenu.link = function (scope, element, attrs) {
        element.on("contextmenu", function (e) {
            e.preventDefault(); // default context menu is disabled
            //  The customized context menu is defined in the main controller. To function the ng-click functions the, contextmenu HTML should be compiled.
            element.append($compile(scope[attrs.contextMenu])(scope));
            // The location of the context menu is defined on the click position and the click position is catched by the right click event.
            $("#contextmenu").css("left", e.clientX + 200);
            $("#contextmenu").css("top", e.clientY - 200);
            element.addClass("webix_selected");
        });
        element.on("mouseleave", function (e) {
            //console.log("Leaved the div");
            // on mouse leave, the context menu is removed.
            if ($("#contextmenu")) {
                $("#contextmenu").remove();
                element.removeClass("webix_selected");
            }
        });
    };
    return contextMenu;
};

function rashaFilePickerB($compile, ajax, $http) {
    return {
        restrict: 'AE',
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            //Replace All ProtoType
            String.prototype.replaceAll = function (toReplace, replaceWith) {
                return this.toString().split(toReplace).join(replaceWith);
            }
            //Get Config
            var atr = '';
            atr = $(element).attr('rasha-file-picker-b');
            if (!atr) {
                throw "تنظیمات فایل مشخص نشده است .";
                return;
            }
            var config = {};
            if (atr.indexOf(".") > 0) {
                var split = atr.split(".");
                if (split.length == 2) {
                    var temp = scope[split[0]];
                    config = temp[split[1]];
                } else {
                    var temp = scope[split[0]];
                    var temp2 = temp[split[1]];
                    config = temp2[split[2]];
                }
            } else
                config = scope[atr];
            //Category Tree config
            //First Config init 
            config.pictureId = 1;
            config.pictureUrl = "cpanelv1/images/loading.png";
            //ngModel.$setViewValue(config.pictureId);
            config.topCategory = [];
            config.topCategoryIndex = 0;
            config.pathCross = [];
            config.pathCrossIndex = 0;
            config.pathCrossGo = 0;
            config.selectedIndex = -1;
            //config.extension = null;
            var rootcat = {
                Name: "Root",
                Id: null
            };
            config.Path = [rootcat];
            config.fileTypes = 0;

            //Get ngModel Value
            ngModel.$render = function () {
                var newValue = ngModel.$viewValue;
            };
            //getCategory For Picture
            config.init = function () {
                ajax.call(cmsServerConfig.configApiServerPath + "FileCategory/getall", {
                    RowPerPage: 150
                }, 'POST').success(function (response) {
                    config.categoryList = response.ListItems;
                    config.categoryList.sort(compareCategory);
                    config.OnCategoryChange(null, false);
                    config.topCategory[config.topCategoryIndex] = 0;
                }).error(function (data, errCode, c, d) {
                    console.log(data);
                });
            }

            //get list of file from category id
            config.getCategoryFiles = function (id) {
                var extensions = [];
                if (angular.isDefined(config.extension) && config.extension != "") {
                    extensions = config.extension.split(",");
                }
                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", id, 'POST').success(function (response) {
                    config.FileList = [];
                    angular.forEach(response.ListItems, function (value1, key1) {
                        if (extensions.length > 0)
                            angular.forEach(extensions, function (value2, key2) {
                                if (value1.Extension.toLowerCase() == value2)
                                    config.FileList.push(value1);
                            });
                        else
                            config.FileList = response.ListItems;
                    });
                    //config.FileList = response.ListItems;
                    config.FileList.sort(compare);
                }).error(function (data) {
                    config.msgText = "An error occrued!";
                    config.msgColor = "#ff0000";

                });
            }

            //config for loader 
            config.pictureBusyIndicator = {
                isActive: false,
                message: "در حال برگذاری فایل ها ..."
            }

            //go to up folder
            config.goToUp = function () {
                config.topCategoryIndex--;
                var cid = config.topCategory[config.topCategoryIndex];
                config.pathCross[config.pathCross.length++] = cid;
                if (cid == 0) {
                    config.OnCategoryChange(null, true);
                } else {

                    config.OnCategoryChange(cid, true);
                }
                if (config.Path.length > 1) {
                    config.Path.pop();
                }
            }
            config.itemClicked = function ($event, index, type) {
                if (type == 'file' || type == 1) {
                    config.fileTypes = 1;
                    ngModel.$setViewValue(index);
                    if (!config.multiSelect) {
                        $('#fileSelectorModal').modal('hide');
                    }

                    config.fileId = index;
                    config.filename = getFileName(config.FileList, index);
                    config.filenameView = excerpt(getFileName(config.FileList, index));
                    config.initViews(config.backElement);
                    //config.msgText = "File \"" + config.getFileName(index) + "\" is selected";
                    fdmconfigmsgColor = "#007e1e";
                } else {
                    config.fileTypes = 2;
                    //config.msgText = "Folder \"" + config.getCategoryName(index).Title + "\" is selected";
                    config.msgColor = "#007e1e";
                }
                //if (event.ctrlKey) {
                //    alert("ctrl pressed");
                //}
                config.selectedIndex = index;
            }

            function excerpt(text) {
                excerptLength = 50;
                if (text.length > excerptLength)
                    return text.substring(0, excerptLength).concat("...");
                return text;
            }

            //On Select Listener
            config.selectFile = function (item) {
                ngModel.$setViewValue(item);
                if (!config.multiSelect) {
                    $('#fileSelectorModal').modal('hide');
                }
                config.fileId = item.Id;
                config.initViews(config.backElement);
            }
            config.pictureList = {};
            //On Node Select

            config.OnCategoryChange = function (categoryid, top) {
                config.CurrentCategoryList = [];
                config.count = 0;
                config.thisCategory = categoryid;
                config.FileList = [];
                if (!categoryid) {
                    config.pathCross[config.pathCross.length++] = 0;
                    for (var i = 0; i < config.categoryList.length; i++) {
                        if (config.categoryList[i].LinkParentId == null) {
                            config.CurrentCategoryList[config.count] = config.categoryList[i];
                            config.CurrentCategoryList.sort(compareCategory);
                            config.count++;
                        }
                    }
                } else {
                    if (!top) {
                        config.topCategoryIndex++;
                        config.topCategory[config.topCategoryIndex] = categoryid;
                        config.Path.push(getCategoryName(categoryid));
                    }
                    config.pathCross[config.pathCross.length++] = categoryid;
                    for (var i = 0; i < config.categoryList.length; i++) {
                        if (config.categoryList[i].LinkParentId == categoryid) {
                            config.CurrentCategoryList[config.count] = config.categoryList[i];
                            config.CurrentCategoryList.sort(compareCategory);
                            config.count++;
                        }
                    }
                }
                config.msgText = "Total " + config.CurrentCategoryList.length + " Folder Was Loaded .";
                config.msgColor = "#007e1e";

                config.getCategoryFiles(categoryid);
            }

            config.setFileViewByType = function (filename) {
                var ext = filename.split('.').pop();
                var classCss = "";
                switch (ext) {
                    case "jpg":
                        classCss = "fa-file-image-o";
                        break;
                    case "jpeg":
                        classCss = "fa-file-image-o";
                        break;
                    case "png":
                        classCss = "fa-file-image-o";
                        break;
                    case "bmp":
                        classCss = "fa-file-image-o";
                        break;
                    case "gif":
                        classCss = "fa-file-image-o";
                        break;
                    case "doc":
                        classCss = "fa-file-word-o";
                        break;
                    case "docx":
                        classCss = "fa-file-word-o";
                        break;
                    case "xls":
                        classCss = "fa-file-excel-o";
                        break;
                    case "xlsx":
                        classCss = "fa-file-excel-o";
                        break;
                    case "ppt":
                        classCss = "fa-file-powerpoint-o";
                        break;
                    case "pptx":
                        classCss = "fa-file-powerpoint-o";
                        break;
                    case "ttf":
                        classCss = "fa-font";
                        break;
                    case "mp3":
                        classCss = "fa-file-sound-o";
                        break;
                    case "ogg":
                        classCss = "fa-file-sound-o";
                        break;
                    case "mp4":
                        classCss = "fa-file-movie-o";
                        break;
                    case "avi":
                        classCss = "fa-file-movie-o";
                        break;
                    case "flv":
                        classCss = "fa-file-movie-o";
                        break;
                    case "pdf":
                        classCss = "fa-file-pdf-o";
                        break;
                    case "zip":
                        classCss = "fa-file-archive-o";
                        break;
                    case "rar":
                        classCss = "fa-file-archive-o";
                        break;
                    case "tar":
                        classCss = "fa-file-archive-o";
                        break;
                    case "txt":
                        classCss = "fa-file-text-o";
                        break;
                    case "php":
                        classCss = "fa-file-code-o";
                        break;
                    case "asp":
                        classCss = "fa-file-code-o";
                        break;
                    case "java":
                        classCss = "fa-file-code-o";
                        break;
                    case "py":
                        classCss = "fa-file-code-o";
                        break;
                    case "html":
                        classCss = "fa-internet-explorer";
                        break;
                    case "htm":
                        classCss = "fa-internet-explorer";
                        break;
                    case "conf":
                        classCss = "fa-gears";
                        break;
                    case "ini":
                        classCss = "fa-gears";
                        break;
                    default:
                        classCss = "fa-file";

                }
                return classCss;
            };
            config.number = 10;
            config.initViews = function (backElement) {
                element.empty();
                var category = '<div><div class="col-md-3">' +
                    '<ul class="tree" tree-options="??config??.treeConfig"></ul>' +
                    '</div></div>';

                var pictureGrid = ' <div class="col-md-9" style="min-height:300px"> <div rasha-loading="??config??.pictureBusyIndicator"></div><img class="filePickerImg" ng-repeat="x in ??config??.pictureList | limitTo:??config??.number" src="{{x.thumbnailUrl}}"  class="img-thumbnail"></div>';

                var modal = '<div class="modal fade" id="fileSelectorModal' + backElement + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-backdrop="false" >' +
                    '<div class="modal-dialog" role="document"  style="width: 100%; height: 100%; padding:100px 41px 20px 9px ; z-index:8000;">' +
                    ' <div class="modal-content" >' +
                    '  <div class="modal-header">' +
                    '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                    '<h4 class="modal-title">  ' + backElement + '    انتخاب فایل</h4>' +
                    '</div>' +
                    '<div class="modal-body" ><div class="row" >' +
                    '<ol class="breadcrumb" style="text-align: left; float: left;  font-size: 12px; width: 100%; direction: ltr; padding-top: 5px; padding-bottom: 5px;">' +
                    '<li ng-repeat="x in ??config??.Path" >{{x.Title}}</li>' +
                    ' </ol>' +
                    '<div class="webix_view webix_control webix_el_button webix_fmanager_up" view_id="$button4" style="float: left; display: inline-block; vertical-align: top; border-width: 0px; margin-top: 5px; margin-left: 7px; width: 37px; height: 38px;" ng-click="??config??.goToUp()">' +
                    '<div class="webix_el_box" style="width: 37px; height: 38px">' +
                    '<button type="button" class="webix_img_btn_abs webixtype_base" style="width: 100%;"><span class="webix_icon fa-level-up" style="font-size: 22px;"></span> </button>' +
                    '</div>' +
                    '</div>' +

                    //  '<div class="webix_view webix_control webix_el_button webix_fmanager_up" view_id="$segmented1" style="float: left; display: inline-block; vertical-align: top; border-width: 0px; margin-top: 5px; margin-left: 7px; width: 37px; height: 38px;">' +
                    //    '<div class="webix_el_box" style="width: 37px; height: 38px">' +
                    //        '<div style="width: 66px" class="webix_all_segments">' +
                    //           ' <button type="button" style="width: 32px" class="webix_img_btn_abs webixtype_base" title="آپلود فایل جدید" button_id="files" data-toggle="modal" data-target="#test1"><span class="webix_fmanager_mode_option webix_icon fa-cloud-upload"></span></button>'+
                    //        '</div>' +
                    //    '</div>' +
                    //'</div>' +



                    '<div class="webix_view webix_fmanager_body webix_layout_line" view_id="$layout4" style="white-space: nowrap; border-left-width: 0px; border-right-width: 0px; border-bottom-width: 0px; margin-left: 0px; margin-top: -1px;overflow-y: scroll; width: 100%; height: 390px;">' +
                    '<div class="webix_view webix_multiview" view_id="$multiview1" style="position: relative; display: inline-block; vertical-align: top; border-right-width: 0px; border-bottom-width: 0px; margin-top: 0px; margin-left: -1px;overflow-y: scroll; width: 100%; height: 390px;">' +
                    '<div class="webix_view webix_dataview webix_fmanager_files" view_id="$fileview1" style="border-width: 1px 0px 0px 1px; position: relative; overflow-y: scroll; width: 100%; height: 594px;">' +
                    '<div class="webix_scroll_cont">' +
                    '<div style="height: 110px; width: 100%; ">' +

                    '<div webix_f_id="video3" class="webix_dataview_item webix_fmanager_files " style="width: 150px; height: 110px; float: right; overflow: hidden;" ng-repeat="x in ??config??.CurrentCategoryList" ng-class="{ \'webix_selected\': (x.Id == ??config??.selectedIndex && ??config??.fileTypes ==2)}"  ng-click="??config??.itemClicked($event,x.Id,\'folder\')"  ng-dblClick="??config??.OnCategoryChange(x.Id,false)">' +
                    '<div class="webix_fmanager_file">' +
                    '<div class="webix_fmanager_data_icon"><span class="webix_icon webix_fmanager_icon fa-folder" style="color: #ffc001;"></span></div>{{x.Title}} ' +
                    '</div>' +
                    '</div>' +

                    '<div webix_f_id="video2" class="webix_dataview_item webix_fmanager_files " style="width: 150px;  height: 110px; float: right; overflow: hidden;" ng-repeat="y in ??config??.FileList" ng-class="{ \'webix_selected\': (y.Id == ??config??.selectedIndex && ??config??.fileTypes == 1)}" ng-click="??config??.itemClicked($event,y.Id,\'file\')"  ng-dblClick="??config??.selectFile($event,y.Id,\'file\')">' +
                    '<div class="webix_fmanager_file">' +
                    '<div class="webix_fmanager_data_icon"><span class="webix_icon webix_fmanager_icon {{??config??.setFileViewByType(y.FileName)}}"></span></div>{{y.FileName}}' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    ' </div>' +
                    ' </div>' +
                    '</div>' +
                    '<div class="modal-footer">' +
                    '<button type="button" class="btn btn-default" data-dismiss="modal">انصراف</button>' +
                    '<button type="button" class="btn btn-primary">انتخاب</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';



                var openFileUploadModal = '<div id="test1" class="modal fade" role="dialog" style="z-index: 1400;">' +
                    '<div class="modal-content">' +
                    '<div class="modal-body" style="width : 100%">' +
                    '<div class="row">' +
                    '<div class="col-sm-12">' +
                    '<i class="fa fa-times pull-right" style="cursor:pointer"></i>' +
                    '<h3 class="m-t-none m-b"></h3>' +
                    '<div class="row">' +
                    '<div class="panel panel-primary" style="margin-right: 5px; margin-left: 5px;">' +
                    '<div class="panel-heading">' +
                    '<h5><i class="fa fa-cloud-upload fa"></i>&nbsp;&nbsp; آپلود فایل :</h5>' +
                    '</div>' +
                    '<div class="panel-body">' +
                    '<div class="webix_view webix_control webix_el_segmented webix_fmanager_modes" view_id="$segmented1" style="float: left; display: inline-block; vertical-align: top; border-width: 0px; margin-top: 5px; margin-left: 7px; width: 100%; height: auto;" flow-init="{target: \'' + cmsServerConfig.configRouteUploadFileContent + '\'}"' +
                    'flow-files-submitted="$flow.upload()"' +
                    'flow-name="??config??.flow"' +
                    'flow-file-success="$file.msg = $message">' +
                    '<div class="webix_el_box" style="width: 70px; height: 38px">' +
                    '<div style="width: 66px" class="webix_all_segments">' +
                    '<button type="button" style="width: 32px" class="webix_selected webix_segment_0" title="انتخاب فایل" button_id="files" flow-btn><span class="webix_fmanager_mode_option webix_icon fa-upload"></span></button>' +
                    '</div>' +
                    '</div>' +
                    '<table class="table table-striped">' +
                    '<tr ng-repeat="file in ??config??.flow.files">' +
                    '<td>{{$index}}</td>' +
                    '<td>{{file.name}}</td>' +
                    '<td width="500px">' +
                    '<div class="progress">' +
                    '<div class="progress-bar progress-bar-{{whatcolor(file.progress())}} progress-bar-striped" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: {{calcuteProgress(file.progress())}}%">' +
                    '{{calcuteProgress(file.progress())}} %' +
                    '</div>' +
                    '</div>' +
                    '</td>' +
                    '<td style="width : 2px;">|</td>' +
                    '<td style="width: 50px;"><button type="button" id="save-button{{$index}}" ng-show="canShow(file.progress())" style="width: 32px ; height: 32px;" class="webix_selected webix_segment_0 flashing-button" title="ذخیره" button_id="files" ng-click="uploadFile($index, file.name);"><span id="save-icon{{$index}}" class="webix_fmanager_mode_option webix_icon fa-save save-btn" index="{{$index}}"></span></button></td>' +
                    '<td class="result_icon"><span class="fa fa-check" style="display: none; font-size: 23px;"></span></td>' +
                    '</tr>' +
                    '</table>' +
                    '<!--<ol>' +
                    '<li ng-repeat="file in $flow.files" ng-click="uploadFile(file.name)">{{file.name}}: {{file.msg}}</li>' +
                    '</ol>-->' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';


                var removeSelectedFile_btn = '<button id="??config??_btn" class="btn btn-danger pull-right"  ng-click="??config??.removeSelectedfile(??config??)"><i class="fa fa-remove" aria-hidden="true" title="حذف فایل"></i></button>';
                var template = removeSelectedFile_btn + '<div ng-show="??config??.isActive"  class="rashaFilePicker"><label id="file{{??config??.fileId}}" name="file{{??config??.fileId}}" value="{{??config??.fileId}}" >{{??config??.filename.substring(0,20).concat("...")}}</label><button class="btn  btn-primary "  type="button" data-toggle="modal" data-target="#fileSelectorModal' + backElement + '"><i class="fa fa-file"></i></button></div>' + modal + openFileUploadModal;
                template = template.replaceAll("??config??", atr);
                var el = $compile(template)(scope);
                element.append(el);
                config.init();

            }
            // sort compare
            function compare(a, b) {
                if (a.FileName < b.FileName)
                    return -1;
                else if (a.FileName > b.FileName)
                    return 1;
                else
                    return 0;
            }

            function compareCategory(a, b) {
                if (a.Title < b.Title)
                    return -1;
                else if (a.Title > b.Title)
                    return 1;
                else
                    return 0;
            }

            //for breadcrums
            getCategoryName = function (id) {
                for (var i = 0; i < config.categoryList.length; i++) {
                    if (config.categoryList[i].Id == id) {
                        return config.categoryList[i];
                    }
                }
            }

            getFileName = function (list, id) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].Id == id) {
                        return list[i].FileName;
                    }
                }
            }

            whatcolor = function (progress) {
                wdth = Math.floor(progress * 100);
                if (wdth >= 0 && wdth < 30) {
                    return 'danger';
                } else if (wdth >= 30 && wdth < 50) {
                    return 'warning';
                } else if (wdth >= 50 && wdth < 85) {
                    return 'info';
                } else {
                    return 'success';
                }
            }

            calcuteProgress = function (progress) {
                wdth = Math.floor(progress * 100);
                return wdth;
            }

            canShow = function (pr) {
                if (pr == 1) {
                    return true;
                }
                return false;
            }

            uploadFile = function (index, name) {
                if ($("#save-icon" + index).hasClass("fa-save")) {
                    if (fileIsExist(name)) { // File already exists
                        if (confirm('File "' + name + '" already exists! Do you want to replace the new file?')) {
                            //------------ fdm.replaceFile(name);
                            itemClickedForUpload(null, fileIdToDelete, "file");
                            config.fileTypes = 1;
                            fileIdToDelete = config.selectedIndex;
                            // Delete the file
                            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", fileIdToDelete, 'GET').success(function (response1) {
                                if (response1.IsSuccess == true) {
                                    //console.log(response1.Item);
                                    ajax.call(cmsServerConfig.configApiServerPath + 'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                                        remove(config.FileList, fileIdToDelete);
                                        if (response2.IsSuccess == true) {
                                            // Save New file
                                            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", 'GET').success(function (response3) {
                                                if (response3.IsSuccess == true) {
                                                    FileItem = response3.Item;
                                                    FileItem.FileName = name;
                                                    FileItem.Extension = name.split('.').pop();
                                                    FileItem.FileSrc = name;
                                                    FileItem.LinkCategoryId = config.thisCategory;
                                                    // ------- fdm.saveNewFile()  ----------------------
                                                    var result = 0;
                                                    ajax.call(cmsServerConfig.configApiServerPath + "FileContent/add", FileItem, 'POST').success(function (response) {
                                                        if (response.IsSuccess) {
                                                            FileItem = response.Item;
                                                            showSuccessIcon();
                                                            refreshFolder();

                                                            $("#save-icon" + index).removeClass("fa-save");
                                                            $("#save-button" + index).removeClass("flashing-button");
                                                            $("#save-icon" + index).addClass("fa-check");
                                                        } else {
                                                            msgText = "Saving new file was not successful!";
                                                            msgColor = "#ff0000";
                                                            $("#save-icon" + index).removeClass("fa-save");
                                                            $("#save-button" + index).removeClass("flashing-button");
                                                            $("#save-icon" + index).addClass("fa-remove");

                                                        }
                                                    }).error(function (data) {
                                                        msgText = "An error occured during saving process!";
                                                        msgColor = "#ff0000";
                                                        $("#save-icon" + index).removeClass("fa-save");
                                                        $("#save-button" + index).removeClass("flashing-button");
                                                        $("#save-icon" + index).addClass("fa-remove");
                                                    });
                                                    //-----------------------------------

                                                } else {
                                                    console.log("getting the model was not successfully returned!");
                                                }
                                            }).error(function (data) {
                                                console.log(data);
                                                msgText = "An error occrued during getting the new file!";
                                                msgColor = "#ff0000";
                                                loadingBusyIndicator.isActive = false;
                                            });
                                        } else {
                                            console.log("Request to CmsFileContent/delete was not successfully returned!");
                                        }
                                    }).error(function (data, errCode, c, d) {
                                        console.log(data);
                                        msgText = "An error occrued during deleting the old file!";
                                        msgColor = "#ff0000";

                                    });
                                }
                            }).error(function (data) {
                                console.log(data);
                                msgText = "An error occrued during getting the old file!";
                                msgColor = "#ff0000";

                            });
                            //--------------------------------
                        } else {
                            msgText = "File already exists! New file was not uploaded.";
                            msgColor = "#ff0000";
                            return;
                        }
                    } else { // File does not exists
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", 'GET').success(function (response) {
                            FileItem = response.Item;
                            FileItem.FileName = name;
                            FileItem.Extension = name.split('.').pop();
                            FileItem.FileSrc = name;
                            FileItem.LinkCategoryId = config.thisCategory;
                            // ------- fdm.saveNewFile()  ----------------------
                            var result = 0;
                            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/add", FileItem, 'POST').success(function (response) {

                                if (response.IsSuccess) {
                                    FileItem = response.Item;
                                    refreshFolder();
                                    $("#save-icon" + index).removeClass("fa-save");
                                    $("#save-button" + index).removeClass("flashing-button");
                                    $("#save-icon" + index).addClass("fa-check");
                                } else {
                                    msgText = "Saving new file was not successful!";
                                    msgColor = "#ff0000";
                                    $("#save-icon" + index).removeClass("fa-save");
                                    $("#save-button" + index).removeClass("flashing-button");
                                    $("#save-icon" + index).addClass("fa-remove");

                                }
                            }).error(function (data) {
                                msgText = "An error occured during saving process!";
                                msgColor = "#ff0000";
                                $("#save-icon" + index).removeClass("fa-save");
                                $("#save-button" + index).removeClass("flashing-button");
                                $("#save-icon" + index).addClass("fa-remove");
                            });
                            //-----------------------------------

                        }).error(function (data) {
                            console.log(data);
                            msgText = "An error occrued during getviewmodel!";
                            msgColor = "#ff0000";
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        });
                    }
                }
            }

            fileIsExist = function (fileName) {
                for (var i = 0; i < config.FileList.length; i++) {
                    if (config.FileList[i].FileName == fileName) {
                        fileIdToDelete = config.FileList[i].Id;
                        return true;

                    }
                }
                return false;
            }

            config.itemClickedForUpload = function ($event, index, type) {
                if (type == 'file' || type == 1) {
                    config.fileTypes = 1;
                    selectedFileId = getFileItem(index).Id;
                    selectedFileName = getFileItem(index).FileName;
                    selectedFileSrc = getFileItem(index).FileSrc;
                    msgText = "File \"" + selectedFileName + "\"  File Id: " + selectedFileId + "  File Src: \"" + selectedFileSrc + "\"";
                    msgColor = "#007e1e";
                } else {
                    fileTypes = 2;
                    selectedCategoryId = getCategoryName(index).Id;
                    selectedCategoryTitle = getCategoryName(index).Title;
                    msgText = "Folder \"" + selectedCategoryTitle + "\" is selected .";
                    msgColor = "#007e1e";
                }

                config.selectedIndex = index;
            }

            getFileItem = function (id) {
                for (var i = 0; i < config.FileList.length; i++) {
                    if (config.FileList[i].Id == id) {
                        return config.FileList[i];
                    }
                }
            }

            showSuccessIcon = function () {
                $().toggle
            }

            refreshFolder = function () {
                config.OnCategoryChange(config.thisCategory, true);
            }

            config.initViews(config.backElement);

        }
    }
}

function rashaUpload($compile, ajax, $http) {
    return {
        restrict: 'AE',
        require: "ngModel",
        link: function (scope, element, attrs, ngModel) {
            //Replace All ProtoType
            String.prototype.replaceAll = function (toReplace, replaceWith) {
                return this.toString().split(toReplace).join(replaceWith);
            }
            //Get Config
            var atr = '';
            atr = $(element).attr('rasha-upload');
            if (!atr) {
                throw "تنظیمات فایل مشخص نشده است .";
                return;
            }
            var config = {};
            if (atr.indexOf(".") > 0) {
                var split = atr.split(".");
                if (split.length == 2) {
                    var temp = scope[split[0]];
                    config = temp[split[1]];
                } else {
                    var temp = scope[split[0]];
                    var temp2 = temp[split[1]];
                    config = temp2[split[2]];
                }
            } else
                config = scope[atr];
            //Category Tree config
            //First Config init 
            config.pictureId = 1;
            config.pictureUrl = "cpanelv1/images/loading.png";
            //ngModel.$setViewValue(config.pictureId);
            config.topCategory = [];
            config.topCategoryIndex = 0;
            config.pathCross = [];
            config.pathCrossIndex = 0;
            config.pathCrossGo = 0;
            config.selectedIndex = -1;
            var rootcat = {
                Name: "Root",
                Id: null
            };
            config.Path = [rootcat];
            config.fileTypes = 0;

            //Get ngModel Value
            ngModel.$render = function () {
                var newValue = ngModel.$viewValue;
                console.log(newValue);
            };


            config.pictureList = {};
            //On Node Select

            config.number = 10;
            config.initViews = function (backElement) {
                element.empty();
                var template =
                    '<div class="panel panel-primary" style="margin-right: 5px; margin-left: 5px;">' +
                    '<div class="panel-heading">' +
                    '<h5><i class="fa fa-cloud-upload fa"></i>&nbsp;&nbsp;آپلود</h5>' +
                    '</div>' +
                    '<div class="panel-body">' +
                    '<div class="webix_view webix_control webix_el_segmented webix_fmanager_modes" view_id="$segmented1" style="float: left; display: inline-block; vertical-align: top; border-width: 0px; margin-top: 5px; margin-left: 7px; width: 100%; height: auto;" flow-init="{target: \'' + cmsServerConfig.configRouteUploadFileContent + '\'}"' +
                    'flow-files-submitted="$flow.upload()"' +
                    'flow-name="??config??.flow"' +
                    'flow-file-success="$file.msg = $message">' +
                    '<div class="webix_el_box" style="width: 70px; height: 38px">' +
                    '<div style="width: 66px" class="webix_all_segments">' +
                    '<button type="button" style="width: 32px" class="webix_selected webix_segment_0" title="انتخاب فایل" button_id="files" flow-btn><span class="webix_fmanager_mode_option webix_icon fa-upload"></span></button>' +
                    '</div>' +
                    '</div>' +
                    '<table class="table table-striped">' +
                    '<tr ng-repeat="file in ??config??.flow.files">' +
                    '<td>{{$index}}</td>' +
                    '<td>{{file.name}}</td>' +
                    '<td width="500px">' +
                    '<div class="progress">' +
                    '<div class="progress-bar progress-bar-{{??config??.whatcolor(file.progress())}} progress-bar-striped" role="progressbar" aria-valuenow="40" aria-valuemin="0" aria-valuemax="100" style="width: {{??config??.calcuteProgress(file.progress())}}%">' +
                    '{{??config??.calcuteProgress(file.progress())}} %' +
                    '</div>' +
                    '</div>' +
                    '</td>' +
                    '<td style="width : 2px;">|</td>' +
                    '<td style="width: 50px;"><button type="button" id="save-button{{$index}}" ng-show="??config??.canShow(file.progress())" style="width: 32px ; height: 32px;" class="webix_selected webix_segment_0 flashing-button" title="{{\'CLICK_FOR_SAVE\'|lowercase|translate}}" button_id="files" ng-click="??config??.uploadFile($index, file.name);"><span id="save-icon{{$index}}" class="webix_fmanager_mode_option webix_icon fa-save save-btn" index="{{$index}}"></span></button></td>' +
                    '<td class="result_icon"><span class="fa fa-check" style="display: none; font-size: 23px;"></span></td>' +
                    '</tr>' +
                    '</table>' +
                    '</div>' +
                    '</div>' +
                    '</div>';

                template = template.replaceAll("??config??", atr);
                var el = $compile(template)(scope);
                element.append(el);
                config.init();
            }

            // sort compare
            vehicleProperty.openUploadModal = function () {
                $modal.open({
                    templateUrl: 'cpanelv1/ModuleVehicle/VehicleProperty/upload_modal.html',
                    size: 'lg',
                    scope: $scope
                });

                vehicleProperty.FileList = [];
                //get list of file from category id
                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetFilesFromCategory", {}, 'POST').success(function (response) {
                    vehicleProperty.FileList = response.ListItems;
                }).error(function (data) {
                    console.log(data);
                });

            }

            vehicleProperty.calcuteProgress = function (progress) {
                wdth = Math.floor(progress * 100);
                return wdth;
            }

            vehicleProperty.whatcolor = function (progress) {
                wdth = Math.floor(progress * 100);
                if (wdth >= 0 && wdth < 30) {
                    return 'danger';
                } else if (wdth >= 30 && wdth < 50) {
                    return 'warning';
                } else if (wdth >= 50 && wdth < 85) {
                    return 'info';
                } else {
                    return 'success';
                }
            }

            config.canShow = function (pr) {
                if (pr == 1) {
                    return true;
                }
                return false;
            }
            // File Manager actions
            config.replaceFile = function (name) {
                config.itemClicked(null, config.fileIdToDelete, "file");
                config.fileTypes = 1;
                config.fileIdToDelete = config.selectedIndex;

                // Delete the file
                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetOne", config.fileIdToDelete, 'GET').success(function (response1) {
                    if (response1.IsSuccess == true) {
                        //console.log(response1.Item);
                        ajax.call(cmsServerConfig.configApiServerPath + 'FileContent/delete', response1.Item, 'POST').success(function (response2) {
                            config.remove(config.FileList, config.fileIdToDelete);
                            if (response2.IsSuccess == true) {
                                // Save New file
                                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", 'GET').success(function (response3) {
                                    if (response3.IsSuccess == true) {
                                        config.FileItem = response3.Item;
                                        config.FileItem.FileName = name;
                                        config.FileItem.Extension = name.split('.').pop();
                                        config.FileItem.FileSrc = name;
                                        config.FileItem.LinkCategoryId = config.thisCategory;
                                        config.saveNewFile();
                                    } else {
                                        console.log("getting the model was not successfully returned!");
                                    }
                                }).error(function (data) {
                                    console.log(data);
                                });
                            } else {
                                console.log("Request to CmsFileContent/delete was not successfully returned!");
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
            config.saveNewFile = function () {
                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/add", config.FileItem, 'POST').success(function (response) {
                    if (response.IsSuccess) {
                        config.FileItem = response.Item;
                        config.showSuccessIcon();
                        return 1;
                    } else {
                        return 0;

                    }
                }).error(function (data) {
                    config.showErrorIcon();
                    return -1;
                });
            }

            config.showSuccessIcon = function () {}

            config.showErrorIcon = function () {

            }
            //file is exist
            config.fileIsExist = function (fileName) {
                for (var i = 0; i < config.FileList.length; i++) {
                    if (config.FileList[i].FileName == fileName) {
                        config.fileIdToDelete = config.FileList[i].Id;
                        return true;

                    }
                }
                return false;
            }

            config.getFileItem = function (id) {
                for (var i = 0; i < config.FileList.length; i++) {
                    if (config.FileList[i].Id == id) {
                        return config.FileList[i];
                    }
                }
            }

            //select file or folder
            config.itemClicked = function ($event, index, type) {
                if (type == 'file' || type == 1) {
                    config.fileTypes = 1;
                    config.selectedFileId = config.getFileItem(index).Id;
                    config.selectedFileName = config.getFileItem(index).FileName;
                } else {
                    config.fileTypes = 2;
                    config.selectedCategoryId = config.getCategoryName(index).Id;
                    config.selectedCategoryTitle = config.getCategoryName(index).Title;
                }

                config.selectedIndex = index;

            }

            config.showContractDetails = function (contract) {
                config.selectedContract = contract;
            }
            //upload file
            config.uploadFile = function (index, name) {
                if ($("#save-icon" + index).hasClass("fa-save")) {
                    if (config.fileIsExist(name)) { // File already exists
                        if (confirm('File "' + name + '" already exists! Do you want to replace the new file?')) {
                            //------------ config.replaceFile(name);
                            config.itemClicked(null, config.fileIdToDelete, "file");
                            config.fileTypes = 1;
                            config.fileIdToDelete = config.selectedIndex;
                            // replace the file
                            ajax
                                .call(
                                    cmsServerConfig.configApiServerPath + "FileContent/GetOne",
                                    config.fileIdToDelete,
                                    "GET"
                                )
                                .success(function (response1) {
                                    if (response1.IsSuccess == true) {
                                        //console.log(response1.Item);
                                        ajax.call(cmsServerConfig.configApiServerPath + "FileContent/replace", response1.Item, "POST")
                                            .success(function (response2) {
                                                if (response2.IsSuccess == true) {
                                                    config.FileItem = response2.Item;
                                                    config.showSuccessIcon();
                                                    $("#save-icon" + index).removeClass("fa-save");
                                                    $("#save-button" + index).removeClass(
                                                        "flashing-button"
                                                    );
                                                    $("#save-icon" + index).addClass("fa-check");
                                                    config.filePickerMainImage.filename =
                                                        config.FileItem.FileName;
                                                    config.filePickerMainImage.fileId =
                                                        response2.Item.Id;
                                                    config.selectedItem.LinkMainImageId =
                                                        config.filePickerMainImage.fileId;
                                                } else {
                                                    $("#save-icon" + index).removeClass("fa-save");
                                                    $("#save-button" + index).removeClass(
                                                        "flashing-button"
                                                    );
                                                    $("#save-icon" + index).addClass("fa-remove");
                                                }
                                            })
                                            .error(function (data) {
                                                config.showErrorIcon();
                                                $("#save-icon" + index).removeClass("fa-save");
                                                $("#save-button" + index).removeClass("flashing-button");
                                                $("#save-icon" + index).addClass("fa-remove");
                                            });
                                        //-----------------------------------
                                    }
                                })
                                .error(function (data) {
                                    console.log(data);
                                });
                            //--------------------------------
                        } else {
                            return;
                        }
                    } else { // File does not exists
                        // Save New file
                        ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetViewModel", "", 'GET').success(function (response) {
                            config.FileItem = response.Item;
                            config.FileItem.FileName = name;
                            config.FileItem.Extension = name.split('.').pop();
                            config.FileItem.FileSrc = name;
                            config.FileItem.LinkCategoryId = null; //Save the new file in the root
                            // ------- config.saveNewFile()  ----------------------
                            var result = 0;
                            ajax.call(cmsServerConfig.configApiServerPath + "FileContent/add", config.FileItem, 'POST').success(function (response) {
                                if (response.IsSuccess) {
                                    config.FileItem = response.Item;
                                    config.showSuccessIcon();
                                    $("#save-icon" + index).removeClass("fa-save");
                                    $("#save-button" + index).removeClass("flashing-button");
                                    $("#save-icon" + index).addClass("fa-check");
                                    config.filePickerMainImage.filename = config.FileItem.FileName;
                                    config.filePickerMainImage.fileId = response.Item.Id;
                                    config.selectedItem.LinkMainImageId = response.Item.Id;
                                    config.selectedItem.LinkMainImageId = config.filePickerMainImage.fileId;
                                } else {
                                    $("#save-icon" + index).removeClass("fa-save");
                                    $("#save-button" + index).removeClass("flashing-button");
                                    $("#save-icon" + index).addClass("fa-remove");
                                }
                            }).error(function (data) {
                                config.showErrorIcon();
                                $("#save-icon" + index).removeClass("fa-save");
                                $("#save-button" + index).removeClass("flashing-button");
                                $("#save-icon" + index).addClass("fa-remove");
                            });
                            //-----------------------------------
                        }).error(function (data) {
                            console.log(data);
                            $("#save-icon" + index).removeClass("fa-save");
                            $("#save-button" + index).removeClass("flashing-button");
                            $("#save-icon" + index).addClass("fa-remove");
                        });
                    }
                }
            }

            config.initViews(config.backElement);

        }
    }
}

function rashaAddMenu($compile, ajax, rashaErManage) {
    return {
        restrict: 'EA',
        scope: {
            title: "@title",
            config: "=config",
            setting: "@setting"
        },
        link: function (scope, element) {

            var listItems = {};
            scope.menuItem = "x";
            ajax.call(cmsServerConfig.configApiServerPath + "WebDesignerMainMenu/getall", "", 'POST').success(function (response) {
                scope.menuDrop = response.ListItems;
                listItems = scope.menuDrop;
            }).error(function (data, errCode, c, d) {
                rashaErManage.checkAction(data, errCode);
            });
            var objectId = "";
            scope.$watch('menuItem', function () {
                scope.successMsg = "";
                scope.showDesign = "x";
                if ((scope.menuItem == "x")) {
                    scope.data = {};
                } else {
                    scope.data = {};
                    for (i = 0; i < listItems.length; i++) {
                        if (listItems[i]["Id"] == scope.menuItem) {
                            scope.data = JSON.parse(listItems[i]["JsonValues"]);
                            objectId = i;
                            return;
                        }
                    }

                }
            });
            scope.addToMenu = function () {
                if (scope.menuItem == "x") {
                    scope.successMsg = "لطفا ابتدا منو را انتخاب نمایید";
                } else {
                    scope.successMsg = "";
                    var info = scope.data;
                    info.push({
                        id: 1,
                        title: scope.title,
                        nodes: []
                    });
                    var info2 = scope.data;
                    info2.push({
                        setting: scope.setting,
                    });
                    scope.showSubmit = "x";
                }
            }
            scope.submitMenu = function () {
                if (scope.menuItem == "x") {
                    scope.successMsg = "";
                    scope.successMsg = "منو انتخاب نشده است";
                } else {

                    scope.menuDrop[objectId].JsonValues = JSON.stringify(scope.data);

                    ajax.call(cmsServerConfig.configApiServerPath + 'WebDesignerMainMenu/edit', scope.menuDrop[objectId], 'PUT').success(function (response) {
                        rashaErManage.checkAction(response);
                        if (response.IsSuccess) {
                            //console.log("Add Succseeded!");
                            scope.successMsg = "";
                            scope.successMsg = "تنظیمات با موفقیت ذخیره گردید";
                        }
                    }).error(function (data, errCode, c, d) {
                        rashaErManage.checkAction(data, errCode);
                        scope.successMsg = "";
                        scope.successMsg = "خطایی در ذخیره منو رخ داده است";
                    });
                    scope.showSubmit = {};
                }
            }
            template = '<i class="fa fa-times pull-right m-b" style="cursor:pointer" ng-click="config.closeModal()"></i>' +
                '<h3 class="m-t-none m-b"> </h3>' +
                ' <form method="post" class="form-horizontal" name="frmMenuAdd" novalidate >' +
                '<div class="form-group">' +
                ' <label class="col-sm-2 control-label">عنوان منو</label><div class="col-sm-8"><input class="form-control" ng-model="title" />' +
                '</div>' +
                '</div>' +
                '<div class="form-group"><label class="col-sm-2 control-label">انتخاب منو</label>' +
                '<div class="col-sm-8"><select class="form-control"  ng-model="menuItem" >' +
                '<option  value="x" selected="selected">لطفا انتخاب نمایید</option>' +
                '<option ng-repeat="menuItem in  menuDrop" value="{{menuItem.Id}}">{{menuItem.Title}}</option>' +
                '</select></div><button class="btn btn-info btn-xs col-sm-2 m-t-sm" ng-disabled=" menuItem==\'x\'" ng-click="addToMenu()">افزودن به منو</button></div>' +
                '<div class="form-group" ng-class="{\'has-error\' : frmnewsContentAdd.Description.$invalid && ' +
                '!frmnewsContentAdd.Description.$pristine,\'has-success\' : frmnewsContentAdd.Description.$valid}">' +
                '<label class="col-sm-2 control-label" ng-show=" showDesign ==\'x\' && menuItem !==\'x\'">چیدمان </label><div class="col-sm-10">' +
                '<div ui-tree id="tree-root" ><ol ui-tree-nodes ng-model="data"><li ng-repeat="node in data" ' +
                ' ui-tree-node ng-include="\'cpanelv1/ModuleCore/common/templateMenu.html\'"></li></ol></div></div></div>' +
                '{{setting}}<div class="form-group">' +
                '<button class="btn btn-default pull-right  " type="button" ng-click="config.closeModal()" >{{\'CANCEL\'|lowercase|translate}}</button>' +
                '<button class="btn btn-primary pull-right m-l-sm"  type="submit" ng-click="submitMenu()" ng-disabled=" showSubmit !==\'x\' ">{{\'SAVE\'|lowercase|translate}}</button>' +
                '<span class=" alert-info " style="padding:5px" ng-show="successMsg">{{successMsg}}</span>' +
                +'</div></form>';
            // template = template.replaceAll("??config??", scope.config);
            var el = $compile(template)(scope);
            element.append(el);
        }
    };
}

//function rashaPositionCustomer($compile, ajax, rashaErManage){
//    return {
//        restrict: 'AE',
//        //scope: { content: "=content" },
//        link: function (scope, element,attrs) {
//            var template='<div class="btn btn-default btn-outline" style="float:right">'+                         '<';
//        }
//    };
//}

function rashaPositionCustomer($compile, ajax, rashaErManage) {
    return {
        restrict: 'AE',
        //scope: { content: "=content" },
        link: function (scope, element, attrs) {
            var tableId = "tbl" + Math.random();
            tableId = tableId.replace(".", "");
        }
    };
}


function rashaPosition($compile, ajax, rashaErManage, $stateParams) {
    return {
        restrict: 'AE',
        //scope: { content: "=content" },
        link: function (scope, element, attrs) {
            var tableId = "tbl" + Math.random();
            tableId = tableId.replace(".", "");
            var template = '<table class="table table-striped table-bordered table-responsive" style="margin-bottom:2px" id="' + tableId + '">' +
                '<tbody>' +
                '<tr>' +
                '<td ng-repeat="x in ??atr??.ItemsLocal" ng-show="x.visible" style="margin:0;padding:0" ng-mouseleave="??atr??.contentMouseLeave(null,x)" ng-mouseenter="??atr??.contentMouseEnter(null,x)">' +
                '<div style="overflow-x:hidden;width:{{x.headerWidth}}px;display:inline-block;border:1px solid gray;min-height:500px;max-height:900px" >' +
                '<div class="ibox-title {{x.cssClass}}" style="direction:ltr;border-width:0px;position:relative;{{x.cssStyle}}">' +
                '<div style="z-index:1" rasha-random-boxes=' + "'" + '{"Id":{{x.Id}},"maxOpacity":0.5,"minOpacity":0.2,"maxCount":10,"animate":false,"animateMillisecond":10,"leftStep":1,"topStep":1,"style":"{{x.cssStyle}}","borderColor":"white","borderSize":2,"maxRotate":0}' + "'></div>" +
                '<h4 style="display:inline-block;z-index:2">{{x.title|lowercase|translate}}</h4>' +
                '<span class="label label-primary" style="z-index:2" ng-show="x.listItems.length>0">{{x.listItems.length}}</span>' +
                '<div class="ibox-tools" style="color:white;float:right;z-index:2">' +
                '<li class="dropdown" dropdown="" style="display: initial;">' +
                '<a aria-expanded="false" aria-haspopup="true" class="dropdown-toggle count-info" href="" dropdown-toggle="">' +
                '<i class="fa fa-plus" style="{{x.cssStyle}}"></i>' +
                '</a>' +
                '<ul class="dropdown-menu animated fadeInRight m-t-xs" style="left:-100px;">' +
                '<li><a ng-click="??atr??.addCustomer(x.Id)" style="color:black">addCustomer</a></li>' +
                '<li><a ng-click="??atr??.selectCustomer(x.Id)" style="color:black">selectCustomer</a></li>' +
                '</ul>' +
                '</li>' +
                '<a ng-click="??atr??.OpenSettingPosition(x.Id)">' +
                '<i class="fa fa-cog" style="{{x.cssStyle}}"></i>' +
                '</a>' +
                '<a ng-click="??atr??.maximizeMinimize(x)">' +
                '<i class="fa {{x.maximizeminimizeData}}" style="{{x.cssStyle}}"></i>' +
                '</a>' +
                '<a ng-click="??atr??.changePositionView(x)">' +
                '<i class="fa {{x.changePositionViewData}}" style="{{x.cssStyle}}" ng-show="x.isMouseEnter"></i>' +
                '</div>' +
                '</div>' +
                '<div class="ibox-content" style="height:70vh;text-align:left;padding:3px;overflow-x:{{x.overflowShow}};overflow-y:{{x.overflowShow}};position:relative;" >' +
                '<div style="z-index:1" rasha-random-boxes=' + "'" + '{"Id":"Sub{{x.Id}}","maxOpacity":0.6,"minOpacity":0.4,"maxCount":20,"animate":false,"animateMillisecond":10,"leftStep":1,"topStep":1,"style":"{{x.cssStyle}}","borderColor":"lightgray","borderSize":2,"maxRotate":30}' + "'></div>" +
                '<div ng-show="!x.buttonPreview" class="feed-activity-list">' +
                '<div class="feed-element" ng-repeat="y in x.listItems">' +
                '<a href="profile.html" class="pull-left">' +
                '<img alt="image" class="img-circle" src="{{y.src}}"    style="margin-top: 20px;margin-right: 10px;">' +
                '</a>' +
                '<div class="media-body ">' +
                '<div class="pull-right text-navy" style="border: 1px solid;">Activity<i class="fa fa-cog"></i></div>' +
                '<strong style="float:right;text-align: right;">{{y.title}}</strong><br>' +
                '<small class="text-muted" style="float:right;text-align: right;">{{y.description}}</small><br>' +
                '<small class="text-muted" style="float:right;text-align: right;">{{y.job}}</small>' +
                '<div class="actions">' +
                '<a ng-repeat="z in y.tags" class="btn btn-xs btn-white"><i class="fa fa-tag"></i> {{z.title}} </a>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div ondrop="drop(event)" ondragover="allowDrop(event)" style="position:absolute;left:0;top:0;bottom:0;width:{{x.width}}px;height:{{x.height}}px" ng-show="x.buttonPreview">' +
                '<div id="drag1" draggable="true" ondragstart="drag(event)" ng-repeat="y in x.listItems" style="width: 280px;height:93px;position:absolute;left:{{y.left}}px;top:{{y.top}}px;box-sizing: border-box;background-color:{{y.backgroundcolor}};padding: 5px 1px;border-radius: 2px;border: 1px solid #e2e2e2;border-left: 3px solid {{y.color}};box-shadow: 2px 2px 3px #ddd;margin: 10px;">' +
                '<div style="height:40px">' +
                '<img src="{{y.src}}" style="width: 30px;height: 28px;float: right;margin: 5px;"/>' +
                '<strong style="display: block;border: none;float: right">{{y.title}}</strong>' +
                '<button ng-click="??atr??.OpenSpecificationsCustomer(y)" style="float: left;margin-left: 4px;">></button>' +
                '<br/>' +
                '<span style="display: block;border: none;float: right;overflow:hidden;max-width: 200px;max-height: 20px;">{{y.description}}</span>' +
                '<br/>' +
                '<span style="float: right;overflow:hidden;max-width: 200px;max-height: 20px;">{{y.job}}</span>' +
                '</div>' +
                '<hr style="clear:both;border-top:1px solid #aeaeae;margin-top: 5px;margin-bottom: 5px;"/>' +
                '<div style="height:30px">' +
                '<i class="glyphicon glyphicon-plus" ng-click="??atr??.AddActivity(y)" style="float: right;margin-left: 4px;"></i>' +
                '<span class="label label-primary" style="z-index:2;float:right" ng-show="x.listItems.length>0">{{y.Activities}}</span>' +
                '<div ng-repeat="z in y.tags">' +
                '<span style="margin: 0 2px 0 0;background: #eee;overflow: hidden;background: rgba(0,0,0,.08);padding: 0 3px;border-radius: 2px;">{{z.title}}</span>' +
                '<div>' +
                '</div>' +
                '</div>' +
                '<div ng-repeat="y in x.customers" rasha-position-customer=' + "'{" + '"option":??atr??,"headerId":{{x.Id}},"detailId":y.Id}' + "' />" +
                '</div> ' +

                '</div>' +
                '</div>' +
                '</td>' +
                '</tr>' +
                '</tbody>' +
                '</table>';
            var atr = '';
            atr = attrs["rashaPosition"];
            if (!atr) {
                throw "تنظیمات مشخص نشده است - Option in Tag";
                return;
            }
            var config = {};
            if (atr.indexOf(".") > 0) {
                var split = atr.split(".");
                config = scope;
                for (var i = 0; i < split.length; i++) {
                    if (split[i].includes('[')) {
                        var split2 = split[i].split('[');
                        config = config[split2[0]];
                        var index = parseInt(split2[1].replace('[', '').replace(']', ''));
                        config = config[index];
                    } else
                        config = config[split[i]];
                }
            } else
                config = scope[atr];

            if (!config) {
                throw "تنظیمات ستونها در کنترلر مربوطه را ایجاد کنید";
                return;
            }
            allowDrop = function (ev) {
                ev.preventDefault();
            }

            drag = function (ev) {
                ev.dataTransfer.setData("text", ev.target.id);
            }

            drop = function (ev) {
                ev.preventDefault();
                var data = ev.dataTransfer.getData("text");
                ev.target.appendChild(document.getElementById(data));
            }
            config.ItemsLocal = [];
            config.contentMouseEnter = function (e, item) {
                item.isMouseEnter = true;
                item.overflowShow = 'auto';
            }
            config.contentMouseLeave = function (e, item) {
                item.isMouseEnter = false;
                item.overflowShow = 'hidden';
            }
            config.changePositionView = function (item) {
                if (item.buttonPreview) {
                    item.changePositionViewData = 'fa-bars';
                    item.buttonPreview = false;
                } else {
                    item.changePositionViewData = 'fa-align-center';
                    item.buttonPreview = true;
                }
            }
            config.apply = function () {
                config.fillData();
            }

            /* config.openSettingPosition=function(positionId)
             {
                 
                        $modal.open({
                             templateUrl: 'cpanelv1/ModuleMarketing/MarketingCustomerSettingPosition/SettingPosition.html',
                             scope: $scope
                         });     
                 
             }*/
            config.maximizeMinimize = function (item) {
                if (item.ismiximized == undefined)
                    item.ismiximized = false;

                if (item.ismiximized == false) {
                    var mytable = document.getElementById(tableId).parentElement;
                    var width = mytable.offsetWidth;

                    for (var i = 0; i < config.items.length; i++) {
                        if (item != config.items[i]) {
                            config.items[i].visible = false;
                            config.items[i].headerWidth = 300;
                            config.items[i].maximizeminimizeData = 'fa-toggle-off';
                            config.items[i].childColSize = 'col-lg-12 col-md-12 col-sm-12 col-xs-12';

                            if (config.items[i].ismiximized == true) {
                                for (var j = 0; j < config.items[i].listItems.length; j++) {
                                    config.items[i].listItems[j].left = 5;
                                    config.items[i].listItems[j].top = (j * 100) + 5;
                                }
                            }


                        }
                    }
                    item.visible = true;
                    item.headerWidth = width - 3;
                    item.maximizeminimizeData = 'fa-toggle-on';
                    item.childColSize = 'col-lg-3 col-md-3 col-sm-3 col-xs-3';
                    var leftStep = 5;
                    var topStep = 5;
                    for (var j = 0; j < item.listItems.length; j++) {
                        item.listItems[j].left = leftStep;
                        item.listItems[j].top = topStep;
                        if (leftStep >= width - 3) {
                            leftStep = 5;
                            topStep += 100;
                        } else
                            leftStep += 300;
                    }


                } else {
                    for (var i = 0; i < config.items.length; i++) {
                        config.items[i].visible = true;
                        config.items[i].headerWidth = 300;
                        config.items[i].maximizeminimizeData = 'fa-toggle-off';
                        config.items[i].childColSize = 'col-lg-12 col-md-12 col-sm-12 col-xs-12';

                        if (config.items[i].ismiximized == true) {
                            for (var j = 0; j < config.items[i].listItems.length; j++) {
                                config.items[i].listItems[j].left = 5;
                                config.items[i].listItems[j].top = (j * 100) + 5;
                            }
                        }

                    }

                }
                item.ismiximized = !item.ismiximized;
            }

            config.fillData = function () {
                config.ItemsLocal = [];
                for (var i = 0; i < config.items.length; i++) {
                    config.items[i].maximizeminimizeData = 'fa-toggle-off';
                    config.items[i].visible = true;
                    if (config.items[i].listItems == undefined)
                        config.items[i].listItems = [];

                    for (var j = 0; j < config.items[i].listItems.length; j++) {
                        if (config.items[i].listItems[j].Iswatcher == true) {
                            config.items[i].listItems[j].backgroundcolor = '#e6e3e3';
                        } else {
                            config.items[i].listItems[j].backgroundcolor = '#ffffff';
                        }
                        config.items[i].listItems[j].left = 5;
                        config.items[i].listItems[j].top = (j * 100) + 5;
                    }
                    config.items[i].width = 298;
                    config.items[i].height = (config.items[i].listItems.length + 1) * 100;
                    config.items[i].headerWidth = 300;
                    config.items[i].changePositionViewData = 'fa-align-center';
                    config.items[i].isMouseEnter = false;
                    config.items[i].buttonPreview = true;
                    config.items[i].overflowShow = 'hidden';
                    config.items[i].childColSize = 'col-lg-12 col-md-12 col-sm-12 col-xs-12';
                    config.ItemsLocal.push(config.items[i]);
                }
                if ($stateParams.id != undefined && $stateParams.id != -3) {
                    for (var i = 0; i < config.ItemsLocal.length; i++) {
                        if (config.ItemsLocal[i].Id == $stateParams.id) {
                            config.maximizeMinimize(config.ItemsLocal[i]);
                        }
                    }
                }
            }

            config.replaceString = function (str, tag, replacement) {
                var temp = str;
                while (temp.includes(tag))
                    temp = temp.replace(tag, replacement);
                return temp;
            };

            template = config.replaceString(template, "??atr??", atr);
            var el = $compile(template)(scope);

            element.replaceWith(el);

            config.fillData();

        }
    };
}

function rashaRandomBoxes($compile, ajax, rashaErManage) {
    return {
        restrict: 'AE',
        //scope: { content: "=content" },
        link: function (scope, element, attrs) {
            var frameId = "dataMove" + Math.random();
            frameId = frameId.replace(".", "");
            var template = '<div style="position:absolute;left:0;top:0;right:0;bottom:0;opacity:{{' + frameId + '.option.maxOpacity}};overflow:hidden"></div>';
            var el = $compile(template)(scope);
            if (element[0].parentNode.style == undefined)
                element[0].parentNode.style = {};

            var atr = JSON.parse(attrs['rashaRandomBoxes']);
            atr.TId = 'TRandom' + atr.Id;
            atr.TId = atr.TId.replace('-', 'Zero');
            scope[frameId] = {};
            scope[frameId].option = atr;
            scope[frameId].drawingItems = [];
            scope[frameId].draw = function (elem) {
                var bodywidth = document.body.scrollWidth;
                var itemHeight = elem.height();
                var spliceWidth = bodywidth / scope[frameId].option.maxCount;
                for (var i = 0; i < scope[frameId].option.maxCount; i++) {
                    var divId = frameId + "_D" + Math.random();
                    divId = divId.replace(".", "");
                    var left = Math.random() * 100 + (spliceWidth * i);
                    left = parseInt(left, 10);
                    var top = ((Math.random() * 60) * itemHeight) / 100;
                    top = parseInt(top, 10);
                    var width = spliceWidth * Math.random();
                    width = parseInt(width, 10);
                    if (width < 5)
                        width = 10;
                    var height = Math.random() * 60;
                    height = parseInt(height, 10);
                    if (height < 5)
                        height = 15;
                    var rotate = (Math.random() * scope[frameId].option.maxRotate);
                    rotate = parseInt(rotate, 10);

                    if (rotate > scope[frameId].option.maxRotate)
                        rotate = scope[frameId].option.maxRotate;
                    var cornerRadios = Math.random() * width;
                    cornerRadios = parseInt(cornerRadios, 10);
                    var opacity = Math.random();
                    if (opacity > 1)
                        opacity = 1;
                    opacity = scope[frameId].option.maxOpacity * opacity;
                    opacity = Math.round(opacity * 100) / 100;
                    if (opacity < scope[frameId].option.minOpacity)
                        opacity = scope[frameId].option.minOpacity
                    var divContent = '<div id="' + divId + '" style="opacity:' + opacity + ';border:' + scope[frameId].option.borderSize + 'px solid ' + scope[frameId].option.borderColor + ';border-radius:' + cornerRadios + ';width:' + width + 'px;height:' + height + 'px;position:absolute;left:' + left + 'px;top:' + top + 'px;-ms-transform: rotate(' + rotate + 'deg);-webkit-transform: rotate(' + rotate + 'deg);transform: rotate(' + rotate + 'deg);border-radius:' + cornerRadios + 'px;" ></div>';
                    var x = $compile(divContent)(scope);
                    elem.append(x);
                    scope[frameId].drawingItems.push({
                        Id: divId,
                        firstleft: left,
                        left: left,
                        top: top,
                        firsttop: top,
                        firstwidth: width,
                        firstheight: height
                    });
                }
            }

            scope[frameId].moveItems = function () {
                var elemwidth = scope[frameId].element.width();
                var elemheight = scope[frameId].element.height();
                for (var i = 0; i < scope[frameId].drawingItems.length; i++) {
                    var elem = document.getElementById(scope[frameId].drawingItems[i].Id);
                    elem.style.left = scope[frameId].drawingItems[i].left + 'px';
                    elem.style.top = scope[frameId].drawingItems[i].top + 'px';
                    scope[frameId].drawingItems[i].left = scope[frameId].drawingItems[i].left + scope[frameId].option.leftStep;
                    scope[frameId].drawingItems[i].top = scope[frameId].drawingItems[i].top + scope[frameId].option.topStep;
                    if (scope[frameId].drawingItems[i].left > elemwidth + 5)
                        scope[frameId].drawingItems[i].left = -1 * scope[frameId].drawingItems[i].firstleft;
                    if (scope[frameId].drawingItems[i].top > elemheight + 5)
                        scope[frameId].drawingItems[i].top = -1 * scope[frameId].drawingItems[i].firsttop;
                }
            }

            //el.height(element.height);
            element[0].parentNode.style['position'] = "relative";
            element.replaceWith(el);
            scope[frameId].draw(el);
            scope[frameId].element = el;
            if (atr.animate == true && atr.animateMillisecond > 0) {
                var id = setInterval(scope[frameId].moveItems, scope[frameId].option.animateMillisecond);
            }

        }
    };
}

function rashaFileUploaderDraggable($compile, $http, ajax, $modal, rashaErManage) {
    return {
        restrict: 'AE',
        link: function (scope, element) {
            var atr = '';
            var id = 'file' + Math.random();
            id = id.replace('.', '');
            atr = $(element).attr("rasha-file-uploader-draggable");
            if (!atr) {
                throw "تنظیمات مشخص نشده است - grid Option in Tag";
                return;
            }
            var config = {};
            if (atr.indexOf(".") > 0) {
                var split = atr.split(".");
                if (split.length == 2) {
                    var temp = scope[split[0]];
                    config = temp[split[1]];
                } else {
                    var temp = scope[split[0]];
                    var temp2 = temp[split[1]];
                    config = temp2[split[2]];
                }
            } else
                config = scope[atr];

            if (config.uploader_cssStyle == undefined)
                config.uploader_cssStyle = 'opacity:0.4;'
            if (config.files_selectedToUpload == undefined)
                config.files_selectedToUpload = []
            config.uploader_dragenter = function (event) {
                //console.log(event)
                config.uploader_cssStyle = 'opacity:1;'
                scope.$apply()
            }
            config.uploader_dragleave = function (event) {
                //console.log(event)
                config.uploader_cssStyle = 'opacity:0.4;'
                scope.$apply()
            }


            config.uploader_dragend = function (event) {
                //console.log('dragend') 
                //console.log(event)
                //event.stopPropagation()
                //event.preventDefault();
            }

            config.uploader_drop = function (event) {
                event.stopPropagation()
                event.preventDefault();
                files = []

                var dt = event.dataTransfer;
                if (dt.items) {
                    // Use DataTransferItemList interface to access the file(s)
                    for (var i = 0; i < dt.items.length; i++) {
                        if (dt.items[i].kind == "file") {
                            var f = dt.items[i].getAsFile();
                            files.push(f);
                        }
                    }
                } else {
                    // Use DataTransfer interface to access the file(s)
                    for (var i = 0; i < dt.files.length; i++) {
                        files.push(dt.files[i]);
                    }
                }
                if (files.length > 0)
                    config.uploader_filesSelected(files);
            }
            config.uploader_filesSelected = function (files) {
                for (var i = 0; i < files.length; i++) {
                    config.files_selectedToUpload.push({
                        file: files[i],
                        name: files[i].name,
                        hasChecked: true,
                        progress_total: files[i].size,
                        progress_value: 0
                    })
                }
                scope.$apply();
            }


            config.whatcolor = function (wdth) {
                if (wdth >= 0 && wdth < 30) {
                    return 'danger';
                } else if (wdth >= 30 && wdth < 50) {
                    return 'warning';
                } else if (wdth >= 50 && wdth < 85) {
                    return 'info';
                } else {
                    return 'success';
                }
            }
            config.uploadFiles = function () {
                console.log('uploadFileStart1');
            }
            config.loadTheme = function () {
                $http.get("cpanelv1/js/directiveTemplate/rashaFileManagerUploaderDragableTheme.html")
                    .then(function (response) {
                        if (response.Status != 200) {
                            rashaErManage.showMessage('Theme Not Found');
                            return;
                        }
                        var id = 'I' + (Math.random() * 10).toString().replace(".", "");
                        var str = response.data;
                        while (str.indexOf('??atr') > 0)
                            str = str.replace('??atr??', atr);
                        while (str.indexOf('??id') > 0)
                            str = str.replace('??id??', id);
                        var el = $compile(str)(scope);
                        element.append(el);
                        window.setuploaderconfig(id, config)

                    })
            }

            config.loadTheme()

        }
    }
}

function rashaFileManager($compile, $http, ajax, $modal, rashaErManage) {
    return {
        restrict: 'AE',
        link: function (scope, element) {
            var atr = '';
            var id = 'file' + Math.random();
            id = id.replace('.', '');
            atr = $(element).attr("rasha-file-manager");
            if (!atr) {
                throw "تنظیمات مشخص نشده است - grid Option in Tag";
                return;
            }
            var config = {};
            if (atr.indexOf(".") > 0) {
                var split = atr.split(".");
                if (split.length == 2) {
                    var temp = scope[split[0]];
                    config = temp[split[1]];
                } else {
                    var temp = scope[split[0]];
                    var temp2 = temp[split[1]];
                    config = temp2[split[2]];
                }
            } else
                config = scope[atr];

            config.fileListLocal = [];
            config.categoryListLocal = [];
            config.searchCssClass = '';

            config.isFileSelected = false;
            config.isFileSelectedImage = false;
            config.isFileCutted = false;
            config.folderFileSelected = [];

            if (config.canSelect == undefined)
                config.canSelect = false;

            if (config.selectMultipleFile == undefined)
                config.selectMultipleFile = false;

            if (config.selectMultipleFolder == undefined)
                config.selectMultipleFolder = false;

            if (config.inSelectionMode == undefined)
                config.inSelectionMode = false;
            if (config.files_selectedToUpload == undefined)
                config.files_selectedToUpload = []


            if (config.BusyIndicator == undefined)
                config.BusyIndicator = {
                    isActive: false
                };

            if (config.currentPosition == undefined)
                config.currentPosition = [];

            if (config.sortMode == undefined)
                config.sortMode = 'ByName';
            if (config.defaultFilter == undefined)
                config.defaultFilter = {
                    RowPerPage: 500,
                    PageNumber: 0
                };

            if (config.allowedFileType == undefined)
                config.allowedFileType = '';
            if (config.canRename == undefined)
                config.canRename = false;
            if (config.isInIconView == undefined)
                config.isInIconView = true;
            if (config.canCopyCut == undefined)
                config.canCopyCut = false;
            if (config.allowCopyCut == undefined)
                config.allowCopyCut = true;
            if (config.allowDelete == undefined)
                config.allowDelete = true;

            config.selectedFilesToCopyCut = [];

            config.onTextChanged = function () {
                config.selectCompleted();
            }

            config.deleteFileFolder = function () {
                var isFolder = false;
                if (config.folderFileSelected.length == 0)
                    return;
                if (config.folderFileSelected[0].isFolder)
                    isFolder = true;
                var prompMessage = "آیا می خواهید این فایل را حذف کنید؟";
                var urlViewModel = cmsServerConfig.configApiServerPath + 'FileContent/GetOne';
                var urlDelete = cmsServerConfig.configApiServerPath + 'FileContent/delete';
                if (isFolder) {
                    prompMessage = "آیا می خواهید این پوشه و تمامی محتوایات آن حذف شود؟";
                    urlViewModel = cmsServerConfig.configApiServerPath + 'FileCategory/GetOne';
                    urlDelete = cmsServerConfig.configApiServerPath + 'FileCategory/delete';
                }
                rashaErManage.showYesNo("اخطار!!!", prompMessage, function (isConfirmed) {
                    if (isConfirmed) {
                        ajax.call(urlViewModel, config.folderFileSelected[0].Id, 'GET')
                            .success(function (response) {
                                ajax.call(urlDelete, response.Item, 'POST')
                                    .success(function (response) {
                                        rashaErManage.checkAction(response);
                                        if (response.IsSuccess)
                                            config.refresh();
                                    }).error(function (data, errCode, c, d) {
                                        console.log(data);
                                    });
                            }).error(function (data, errCode, c, d) {
                                console.log(data);
                            });
                    }
                });

            }

            config.getCategoryList = function (filterModel, id) {
                config.canCopyCut = false;
                config.folderFileSelected = [];
                if (filterModel == undefined)
                    filterModel = {
                        RowPerPage: 500,
                    };
                config.lastCategoryId = id;

                var parentId = null;
                var node = null;
                if (id != undefined) {
                    for (var i = 0; i < config.categoryList.length; i++) {
                        if (config.categoryList[i].Id == id) {
                            parentId = config.categoryList[i].LinkParentId;
                            node = config.categoryList[i];
                        }
                    }
                    if (filterModel.Filters == undefined && filterModel != undefined)
                        filterModel.Filters = [];
                    filterModel.Filters.push({
                        PropertyName: 'LinkParentId',
                        SearchType: 0,
                        IntValue1: id
                    });
                } else {
                    if (filterModel.Filters == undefined && filterModel != undefined)
                        filterModel.Filters = [];
                    filterModel.Filters.push({
                        PropertyName: 'LinkParentId',
                        IntValueForceNullSearch: true
                    });
                }
                if (config.patternSearch == undefined)
                    config.patternSearch = '';
                config.currentPosition = [];
                config.currentPosition.push({
                    Id: null,
                    Title: 'Home'
                });
                var parentList = [];
                while (node != null && node != undefined) {
                    parentList.push({
                        Id: node.Id,
                        Title: node.Title
                    });
                    node = node.virtual_Category;
                }
                for (var i = parentList.length - 1; i >= 0; i--)
                    config.currentPosition.push({
                        Id: parentList[i].Id,
                        Title: parentList[i].Title
                    });


                config.BusyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath + "FileCategory/getall", filterModel, 'Post').success(function (response) {
                    config.categoryList = [];
                    config.FileList = []
                    if (id != undefined) {
                        config.categoryList.push({
                            Title: '',
                            Id: parentId,
                            isParent: true
                        });
                    }
                    for (var i = 0; i < response.ListItems.length; i++) {
                        config.addNecessaryObjectsToFolder(response.ListItems[i]);
                        config.categoryList.push(response.ListItems[i]);
                    }
                    config.categoryList.sort(config.compareCategory);

                    config.getFileList(id);

                }).error(function (data) {
                    console.log(data);
                    config.currentPosition = [];
                    config.currentPosition.push({
                        Id: -1,
                        Title: data.ErrorMessage,
                        isRetry: true
                    });
                    config.BusyIndicator.isActive = false;
                });
            }

            config.Token = encodeURIComponent(localStorage.getItem('userGlobaltoken'));
            config.selectCompleted = function () {
                var listOfFiles = [];
                var listOfFolders = [];
                for (var i = 0; i < config.categoryList.length; i++) {
                    var mostAdd = false;
                    if (config.categoryList[i].isParent)
                        mostAdd = true;
                    else if (config.patternSearch != null && config.patternSearch != undefined && config.patternSearch != '') {
                        if (config.categoryList[i].Title.toLowerCase().includes(config.patternSearch.toLowerCase()))
                            mostAdd = true;
                    } else
                        mostAdd = true;
                    if (mostAdd)
                        listOfFolders.push(config.categoryList[i]);
                }
                for (var i = 0; i < config.FileList.length; i++) {
                    var mostAdd = false;
                    var mostAddByType = false;
                    if (config.allowedFileType != null && config.allowedFileType != undefined && config.allowedFileType != '') {
                        mostAddByType = true;
                        if (config.allowedFileType.includes('Image') && config.FileList[i].isImage)
                            mostAdd = true;
                        if (config.allowedFileType.includes('Word') && config.FileList[i].isWord)
                            mostAdd = true;
                        if (config.allowedFileType.includes('Excel') && config.FileList[i].isExcel)
                            mostAdd = true;
                        if (config.allowedFileType.includes('PowerPoint') && config.FileList[i].isPowerPoint)
                            mostAdd = true;
                        if (config.allowedFileType.includes('Font') && config.FileList[i].isFont)
                            mostAdd = true;
                        if (config.allowedFileType.includes('Voice') && config.FileList[i].isVoice)
                            mostAdd = true;
                        if (config.allowedFileType.includes('Video') && config.FileList[i].isVideo)
                            mostAdd = true;
                        if (config.allowedFileType.includes('Pdf') && config.FileList[i].isPdf)
                            mostAdd = true;
                        if (config.allowedFileType.includes('Zip') && config.FileList[i].isZip)
                            mostAdd = true;
                        if (config.allowedFileType.includes('Text') && config.FileList[i].isText)
                            mostAdd = true;
                        if (config.allowedFileType.includes('Code') && config.FileList[i].isCode)
                            mostAdd = true;
                        if (config.allowedFileType.includes('Html') && config.FileList[i].isHtml)
                            mostAdd = true;
                        if (config.allowedFileType.includes('File') && config.FileList[i].isFile)
                            mostAdd = true;
                    }
                    if (config.patternSearch != null && config.patternSearch != undefined && config.patternSearch != '') {
                        if (config.FileList[i].Title.toLowerCase().includes(config.patternSearch.toLowerCase())) {
                            if (mostAddByType == false)
                                mostAdd = true;
                        } else {
                            if (mostAddByType == true)
                                mostAdd = false;
                        }
                    } else {
                        if (mostAddByType == false)
                            mostAdd = true;
                    }
                    if (mostAdd)
                        listOfFiles.push(config.FileList[i]);
                }
                config.fileListLocal = listOfFiles;
                config.categoryListLocal = listOfFolders;
            }
            config.getFileList = function (categoryid) {
                config.BusyIndicator.isActive = true;
                var engine = {};
                engine.Filters = [];
                if (categoryid == undefined || categoryid == null)
                    engine.Filters.push({
                        PropertyName: 'LinkCategoryId',
                        IntValueForceNullSearch: true
                    });
                else
                    engine.Filters.push({
                        PropertyName: 'LinkCategoryId',
                        IntValue1: categoryid
                    });

                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/GetAll", engine, 'POST').success(function (response) {
                    if (categoryid == null || categoryid == undefined)
                        config.FileList = response.ListItems;
                    else {
                        config.FileList = [];
                        for (var i = 0; i < response.ListItems.length; i++)
                            if (response.ListItems[i].LinkCategoryId == categoryid)
                                config.FileList.push(response.ListItems[i]);
                    }
                    config.FileList.sort(config.compareFile);
                    for (var i = 0; i < config.FileList.length; i++) {
                        config.addNecessaryObjectsToFile(config.FileList[i]);
                    }
                    config.selectCompleted();
                    config.BusyIndicator.isActive = false;
                }).error(function (data) {
                    console.log(data);
                    config.currentPosition = [];
                    config.currentPosition.push({
                        Id: -1,
                        Title: data.ErrorMessage,
                        isRetry: true
                    });
                    config.BusyIndicator.isActive = false;
                });
            };

            config.addNecessaryObjectsToFolder = function (folder) {
                folder.cssStyle = '';
                folder.errorMessage = '';
                folder.isSelected = false;
                folder.newTitle = folder.Title;
                folder.isInRenameMode = false;
                folder.isFolder = true;
                folder.isParent = false;
                folder.busyIndicator = {
                    isActive: false
                };
            }

            config.addNecessaryObjectsToFile = function (file) {
                file.busyIndicator = {
                    isActive: false
                };
                file.isSelected = false;
                file.errorMessage = '';
                file.newTitle = config.getFileNameWithoutExtenssion(file.Title);
                file.newFileName = file.newTitle;
                file.isInRenameMode = false;
                file.extension = config.checkFileExtension(file);
            }

            config.downloadFile = function () {

                var model = {
                    FileIds: [],
                    FolderIds: []
                };
                for (var i = 0; i < config.folderFileSelected.length; i++) {
                    if (config.folderFileSelected[i].isFolder)
                        model.FolderIds.push(config.folderFileSelected[i].Id);
                    else
                        model.FileIds.push(config.folderFileSelected[i].Id);
                }



                config.BusyIndicator.isActive = true;
                ajax.call("mvc/FileContent/DownloadAllFiles", model, 'POST').success(function (response) {
                    //console.log(response);      
                    window.open('/mvc/FileContent/WhenDownloadCompleted?fileName=' + response.FileName + "&ticket=" + config.Token, '_blank', '');

                    config.BusyIndicator.isActive = false;
                }).error(function (data) {
                    console.log(data);
                    config.BusyIndicator.isActive = false;
                });

            }

            config.deSelectFolder = function () {
                config.canCopyCut = false;
                config.selectedFilesToCopyCut = [];
                for (var i = 0; i < config.folderFileSelected.length; i++) {
                    if (config.folderFileSelected[i].isFolder) {
                        config.folderFileSelected[i].cssStyle = '';
                        config.folderFileSelected[i].isSelected = false;
                        config.folderFileSelected.pop(config.folderFileSelected[i]);
                    } else if (config.folderFileSelected[i].isFolder == undefined || config.folderFileSelected[i].isFolder == false) {
                        config.folderFileSelected[i].cssStyle = '';
                        config.folderFileSelected[i].isSelected = false;
                        config.folderFileSelected.pop(config.folderFileSelected[i]);
                    }
                }

            }

            config.selectFolder = function (folder) {
                folder.isSelected = !folder.isSelected;
                if (folder.isSelected) {
                    if (config.selectMultipleFolder == false) {
                        for (var i = 0; i < config.folderFileSelected.length; i++) {
                            if (config.folderFileSelected[i].isFolder) {
                                config.folderFileSelected[i].cssStyle = '';
                                config.folderFileSelected[i].isSelected = false;
                                config.folderFileSelected.pop(config.folderFileSelected[i]);
                            }
                        }
                    }
                    if (config.selectMultipleFile == false) {
                        for (var i = 0; i < config.folderFileSelected.length; i++) {
                            if (config.folderFileSelected[i].isFolder == undefined || config.folderFileSelected[i].isFolder == false) {
                                config.folderFileSelected[i].cssStyle = '';
                                config.folderFileSelected[i].isSelected = false;
                                config.folderFileSelected.pop(config.folderFileSelected[i]);
                            }
                        }
                    }
                    config.folderFileSelected.push(folder);
                    folder.cssStyle = 'background-color:green;color:white';
                } else {
                    config.folderFileSelected.pop(folder);
                    folder.cssStyle = '';
                }
                if (config.folderFileSelected.length > 0) {
                    config.isFileSelected = true;
                    if (config.folderFileSelected.length == 1)
                        config.canRename = true;
                    else
                        config.canRename = false;
                    if (config.allowSelectFolder) {
                        for (var i = 0; i < config.folderFileSelected.length; i++)
                            if (config.folderFileSelected[i].isFolder) {
                                config.canSelect = true;
                                break;
                            }
                    }

                    if (config.allowSelectFile && config.canSelect == false) {
                        for (var i = 0; i < config.folderFileSelected.length; i++)
                            if (config.folderFileSelected[i].isFolder == undefined || config.folderFileSelected[i].isFolder == false) {
                                config.canSelect = true;
                                break;
                            }
                    }

                } else {
                    config.isFileSelected = false;
                    config.canRename = false;
                    config.canSelect = false;
                }
                if (config.folderFileSelected.length > 0)
                    config.canCopyCut = true;
                else
                    config.canCopyCut = false;
                for (var i = 0; i < config.folderFileSelected.length; i++) {
                    if (config.folderFileSelected[i].isFolder) {
                        config.canCopyCut = false;
                        break;
                    }
                }
            }

            config.pasteFile = function () {
                var model = {
                    FileIds: [],
                    IsCut: false,
                    LinkCategoryIdTarget: config.lastCategoryId
                };

                for (var i = 0; i < config.selectedFilesToCopyCut.length; i++) {
                    for (var j = 0; j < config.FileList.length; j++) {
                        if (config.selectedFilesToCopyCut[i].FileName == config.FileList[j].FileName) {
                            rashaErManage.showMessage('This Item Already Exists');
                            return;
                        }
                    }
                }
                for (var i = 0; i < config.selectedFilesToCopyCut.length; i++) {
                    if (config.selectedFilesToCopyCut[i].isCut)
                        model.IsCut = true;
                    model.FileIds.push(config.selectedFilesToCopyCut[i].file.Id);
                }
                config.BusyIndicator.isActive = true;
                ajax.call(cmsServerConfig.configApiServerPath + "FileContent/CopyCutFile", model, 'POST').success(function (response) {
                    if (!response.IsSuccess)
                        rashaErManage.showMessage(response.ErrorMessage);
                    config.BusyIndicator.isActive = false;
                    config.refresh();
                }).error(function (data) {
                    console.log(data);
                    config.BusyIndicator.isActive = false;
                });


            }

            config.selectFilesToCopy = function (isCut) {
                if (config.selectedFilesToCopyCut == undefined)
                    config.selectedFilesToCopyCut = [];
                config.selectedFilesToCopyCut = [];
                for (var i = 0; i < config.folderFileSelected.length; i++) {
                    if (config.folderFileSelected[i].isSelected) {
                        config.selectedFilesToCopyCut.push({
                            file: config.folderFileSelected[i],
                            isCut: isCut
                        });
                    }
                }
            }

            config.whenSelectionChanged = function () {
                var folders = [];
                var files = [];
                for (var i = 0; i < config.folderFileSelected.length; i++) {
                    if (config.folderFileSelected[i].isFolder) {
                        if (config.allowSelectFolder)
                            folders.push(config.folderFileSelected[i]);
                    } else if (config.allowSelectFile)
                        files.push(config.folderFileSelected[i]);
                }
                if (config.selectionChanged != null && config.selectionChanged != undefined)
                    config.selectionChanged(files, folders);
            }
            config.fileExstsWithName = function (name) {
                var n = name.toLowerCase();
                for (var i = 0; i < config.FileList.length; i++)
                    if (config.FileList[i].Title.toLowerCase() == n)
                        return true;
                for (var i = 0; i < config.categoryList.length; i++)
                    if (!config.categoryList[i].isParent)
                        if (config.categoryList[i].Title.toLowerCase() == n)
                            return true;
                return false;
            }
            config.gotoToHome = function () {
                config.getCategoryList();

            }

            config.gotoToFolder = function (cat) {
                config.getCategoryList(null, cat.Id);
            }

            config.refresh = function () {

                config.getCategoryList(null, config.lastCategoryId);
            }

            config.closeModal = function () {
                config.modalStack.close();
            }
            //config.uploadFiles = function () {
            //    console.log('uploadFileStart');
            //}
            config.changeViewType = function () {
                config.isInIconView = !config.isInIconView;
            }

            config.renameCompleted = function (fileFolder) {
                fileFolder.errorMessage = '';
                if (fileFolder.isInRenameMode == false)
                    return;
                if (fileFolder.Title == fileFolder.newTitle) {
                    fileFolder.isInRenameMode = false;
                    return;
                }
                if (fileFolder.newFileName == fileFolder.newTitle) {
                    fileFolder.isInRenameMode = false;
                    return;
                }
                var newName = fileFolder.newTitle;
                var urlViewModel = cmsServerConfig.configApiServerPath + 'FileCategory/GetOne';
                var urlEdit = cmsServerConfig.configApiServerPath + 'FileCategory/edit';
                if (!fileFolder.isFolder) {
                    urlViewModel = cmsServerConfig.configApiServerPath + 'FileContent/GetOne';
                    urlEdit = cmsServerConfig.configApiServerPath + 'FileContent/edit';
                    newName = newName + "." + fileFolder.extension;
                }
                if (config.fileExstsWithName(newName)) {
                    fileFolder.errorMessage = 'This Item Already Exists.';
                    return;
                }
                fileFolder.busyIndicator.isActive = true;
                ajax.call(urlViewModel, fileFolder.Id, 'GET').success(function (response) {
                    if (response.IsSuccess == true) {
                        if (fileFolder.isFolder)
                            response.Item.Title = newName;
                        else
                            response.Item.FileName = newName;
                        ajax.call(urlEdit, response.Item, 'PUT').success(function (response2) {
                            if (response2.IsSuccess == true)
                                config.refresh();
                            else
                                fileFolder.errorMessage = response2.ErrorMessage;
                            fileFolder.busyIndicator.isActive = false;
                        }).error(function (data, errCode, c, d) {
                            fileFolder.busyIndicator.isActive = false;
                        });
                    } else {
                        fileFolder.busyIndicator.isActive = false;
                        fileFolder.errorMessage = response.ErrorMessage;
                    }
                }).error(function (data, errCode, c, d) {
                    fileFolder.busyIndicator.isActive = false;
                });
                fileFolder.isInRenameMode = false;
            }

            config.renameKeyPress = function (fileFolder, event) {
                if (event.charCode == 13)
                    config.renameCompleted(fileFolder);
            }

            config.startRename = function (scroll) {
                if (!config.canRename)
                    return;
                var selected = config.folderFileSelected[0];
                var id = '';
                if (selected.isFolder) {
                    if (config.isInIconView)
                        id = 'boxF' + selected.Id;
                    else
                        id = 'boxListF' + selected.Id;
                }
                if (scroll) {
                    $('html, body').scrollTop($("#" + id).offset().top - 30);
                }
                selected.isInRenameMode = true;

                if (selected.isFolder) {
                    if (config.isInIconView)
                        id = 'txtF' + selected.Id;
                    else
                        id = 'txtListF' + selected.Id;
                }
                setTimeout(function () {
                    $("#" + id).focus();
                    $("#" + id).select();
                }, 300);

                //isInRenameMode
            }

            config.openFile = function (file) {
                if (!(file.isImage || file.isVideo || file.isText || file.isHtml || file.isVoice))
                    return;

                if (config.fileText == undefined)
                    config.fileText = '';
                config.fileSrc = cmsServerConfig.configPathFileByIdAndName + file.Id + '/' + file.Title;
                config.fileTitle = file.Title;

                if (file.isImage)
                    temp = "Image";
                if (file.isVideo) {
                    config.fileSrc = cmsServerConfig.configPathFileByIdAndName + file.Id + '/' + file.Title;
                    config.fileTitle = file.Title;
                    temp = "Video";
                }
                if (file.isText || file.isHtml) {
                    config.fileSrc = cmsServerConfig.configPathFileByIdAndName+ file.Id + '/' + file.Title;
                    config.fileTitle = file.Title;
                    temp = "Text";
                }
                if (file.isVoice) {
                    config.fileSrc =cmsServerConfig.configPathFileByIdAndName + file.Id + '/' + file.Title;
                    config.fileTitle = file.Title;
                    temp = "Voice";
                }

                $http.get("cpanelv1/js/directiveTemplate/rashaFileManagerView" + temp + ".html")
                    .then(function (response) {
                        if (response.Status != 200) {
                            rashaErManage.showMessage('Theme Not Found');
                            return;
                        }
                        var str = response.data;
                        while (str.indexOf('??atr') > 0)
                            str = str.replace('??atr??', atr);

                        if (file.isText || file.isHtml) {
                            $http.get(cmsServerConfig.configPathFileByIdAndName + file.Id + '/' + file.Title).then(function (responseText) {
                                if (responseText.Status == 200) {
                                    config.fileText = responseText.data;
                                    config.modalStack = $modal.open({
                                        template: str,
                                        scope: scope
                                    });
                                } else {
                                    rashaErManage.showMessage('File Not Found');
                                    return;
                                }
                            });
                        } else {
                            config.modalStack = $modal.open({
                                template: str,
                                scope: scope
                            });
                        }
                    });

            }

            config.openUploaderDialog = function () {
                $http.get("cpanelv1/js/directiveTemplate/rashaFileManagerUploaderDialog.html")
                    .then(function (response) {
                        if (response.Status != 200) {
                            rashaErManage.showMessage('Theme Not Found');
                            return;
                        }
                        var id = 'I' + (Math.random() * 10).toString().replace(".", "");
                        var str = response.data;
                        while (str.indexOf('??atr') > 0)
                            str = str.replace('??atr??', atr);
                        while (str.indexOf('??id') > 0)
                            str = str.replace('??id??', id);
                        config.modalStack = $modal.open({
                            template: str,
                            scope: scope
                        });
                    })
            }


            config.getNextFolderName = function () {
                var count = 0;
                var notFound = true;
                while (notFound) {
                    for (i = 0; i < config.categoryList.length; i++) {
                        if (config.categoryList[i].Title == "New Folder (" + count + ")") {
                            count++;
                            i = 0;
                            continue;
                        }

                    }
                    notFound = false;
                }
                return "New Folder (" + count + ")";
            }

            config.makeNewFolder = function () {
                var folderName = config.getNextFolderName();
                ajax.call(cmsServerConfig.configApiServerPath + "FileCategory/GetViewModel", "", 'GET').success(function (response) {
                    if (response.IsSuccess) {
                        //config.BusyIndicator.isActive=true;
                        response.Item.Title = folderName;
                        response.Item.LinkParentId = config.lastCategoryId;
                        ajax.call(cmsServerConfig.configApiServerPath + "FileCategory/add", response.Item, 'Post').success(function (response2) {
                            if (response2.IsSuccess == true) {
                                //config.BusyIndicator.isActive=false;
                                config.lastnewFolderInserted = response2.Item;
                                setTimeout(function () {
                                    config.addNecessaryObjectsToFolder(config.lastnewFolderInserted);
                                    var f = config.lastnewFolderInserted;
                                    var indexInsert = 0;
                                    if (config.lastCategoryId != null)
                                        indexInsert = 1;
                                    config.categoryList.push(f);
                                    config.categoryListLocal.splice(indexInsert, 0, f);
                                    scope.$apply();
                                    setTimeout(function () {
                                        config.deSelectFolder();
                                        scope.$apply();
                                        setTimeout(function () {
                                            config.selectFolder(config.lastnewFolderInserted);
                                            scope.$apply();
                                            setTimeout(function () {
                                                config.startRename(false);
                                                scope.$apply();
                                            }, 200);
                                        }, 200);
                                    }, 200);
                                }, 200);
                            }
                        }).error(function (data) {
                            config.BusyIndicator.isActive = false;
                        });

                    }
                }).error(function (data) {
                    console.log(data);
                });
                config.lastCategoryId
            }

            config.getFileNameWithoutExtenssion = function (title) {
                if (title == undefined)
                    return '';
                var ext = title.split('.').pop();
                var temp = title;
                if (ext.length > 0) {
                    temp = title.substring(0, title.length - ext.length)
                }
                return temp;
            }
            config.checkFileExtension = function (file) {
                var ext = file.FileName.split('.').pop();
                ext = ext.toLowerCase();
                file.isFile = true;
                file.Title = file.FileName;
                switch (ext) {
                    case "jpg":
                        file.isImage = true;
                        break;
                    case "jpeg":
                        file.isImage = true;
                        break;
                    case "png":
                        file.isImage = true;
                        break;
                    case "bmp":
                        file.isImage = true;
                        break;
                    case "gif":
                        file.isImage = true;
                        break;
                    case "doc":
                        file.isWord = true;
                        break;
                    case "docx":
                        file.isWord = true;
                        break;
                    case "xls":
                        file.isExcel = true;
                        break;
                    case "xlsx":
                        file.isExcel = true;
                        break;
                    case "ppt":
                        file.isPowerPoint = true;
                        break;
                    case "pptx":
                        file.isPowerPoint = true;
                        break;
                    case "ttf":
                        file.isFont = true;
                        break;
                    case "mp3":
                        file.isVoice = true;
                        break;
                    case "ogg":
                        file.isVoice = true;
                        break;
                    case "mp4":
                        file.isVideo = true;
                        break;
                    case "avi":
                        file.isVideo = true;
                        break;
                    case "flv":
                        file.isVideo = true;
                        break;
                    case "pdf":
                        file.isPdf = true;
                        break;
                    case "zip":
                        file.isZip = true;
                        break;
                    case "rar":
                        file.isZip = true;
                        break;
                    case "tar":
                        file.isZip = true;
                        break;
                    case "txt":
                        file.isText = true;
                        break;
                    case "php":
                        file.isCode = true;
                        break;
                    case "asp":
                        file.isCode = true;
                        break;
                    case "java":
                        file.isCode = true;
                        break;
                    case "py":
                        file.isCode = true;
                        break;
                    case "html":
                        file.isHtml = true;
                        break;
                    case "htm":
                        file.isHtml = true;
                        break;
                    case "conf":
                        file.isText = true;
                        break;
                    case "ini":
                        file.isText = true;
                        break;
                    default:
                        file.isFile = true;

                }
                return ext;

            };

            config.compareFile = function (a, b) {
                if (config.sortMode == 'ByName') {
                    if (a.FileName < b.FileName)
                        return -1;
                    else if (a.FileName > b.FileName)
                        return 1;
                    else
                        return 0;
                } else if (config.sortMode == 'BySize') {
                    if (a.UsedSize < b.UsedSize)
                        return -1;
                    else if (a.FileSize > b.FileSize)
                        return 1;
                    else
                        return 0;
                } else if (config.sortMode == 'ByCreateDate') {
                    if (a.Id < b.Id)
                        return -1;
                    else if (a.Id > b.Id)
                        return 1;
                    else
                        return 0;
                }

            }


            config.compareCategory = function (a, b) {
                if (config.sortMode == 'ByName') {
                    if (a.Title < b.Title)
                        return -1;
                    else if (a.Title > b.Title)
                        return 1;
                    else
                        return 0;
                } else if (config.sortMode == 'BySize') {
                    if (a.UsedSize < b.UsedSize)
                        return -1;
                    else if (a.UsedSize > b.UsedSize)
                        return 1;
                    else
                        return 0;
                } else if (config.sortMode == 'ByCreateDate') {
                    if (a.Id < b.Id)
                        return -1;
                    else if (a.Id > b.Id)
                        return 1;
                    else
                        return 0;
                }

            }



            $http.get("cpanelv1/js/directiveTemplate/rashaFileManager.html")
                .then(function (response) {
                    var str = response.data;
                    while (str.indexOf('??atr') > 0)
                        str = str.replace('??atr??', atr);
                    //console.log(str);
                    var el = $compile(str)(scope);
                    element.append(el);
                    config.getCategoryList();
                });
        }
    }
}


function rashaMap($compile, ajax, rashaErManage) {
    return {
        restrict: 'AE',
        //scope: { content: "=content" },
        link: function (scope, element) {
            var atr = '';
            atr = $(element).attr("rasha-map");
            var mapId = 'map' + Math.random();
            mapId = mapId.replace(".", "");
            var template = '<div style="position:relative;" rasha-loading="??BusyIndicator??" >' +
                '<input type="hidden" id="text' + mapId + '" ng-model="??textmodel??" class="form-control" " >' +
                '<script>' +
                '      function initMap' + mapId + '() {' +
                '         window.map' + mapId + 'loaded();' +
                '         var getLocation=??getcurrentLocation??;' +
                '         var centerOfMap = {lat: ??lat??, lng: ??lng??};' +
                '         window.map' + mapId + ' = new google.maps.Map(document.getElementById("' + mapId + '"), {' +
                '           zoom: ??zoom??,' +
                '           center: centerOfMap,' +
                '           disableDoubleClickZoom: true,' +
                '           panControl: false,' +
                '        });' +
                '        window.marker' + mapId + ' = new google.maps.Marker({' +
                '           position: {lat:??lat??,lng:??lng??},' +
                '           title: "{{' + "'SELECTED_POINT'|lowercase|translate}}" + '"' +
                '        });' +
                '        if (getLocation)' +
                '           getcurrentLocation' + mapId + '(window.map' + mapId + ');' +
                '        window.map' + mapId + '.addListener("dblclick", function(event) { ' +
                '               setLatLang' + mapId + '(event.latLng.lat()+" "+event.latLng.lng(),event.latLng.lat(),event.latLng.lng());' +
                '         });' +
                '      }' +
                '      function getcurrentLocation' + mapId + '(map){' +
                '            var prevItem=window.mapEvent' + mapId + '.getPosition();' +
                '            if (prevItem!=null && prevItem!=undefined){' +
                '               map.setCenter(prevItem);' +
                '               map.setZoom(??useCurrentLocationZoom??);' +
                '               window.marker' + mapId + '.setMap(null);' +
                '               window.marker' + mapId + '= new google.maps.Marker({position:prevItem,title:"",map:map});' +
                '               return;' +
                '             }' +
                '            if (navigator.geolocation) {' +
                '              navigator.geolocation.getCurrentPosition(function(position) {' +
                '                var pos = {' +
                '                  lat: position.coords.latitude,' +
                '                  lng: position.coords.longitude' +
                '                };' +
                '                map.setCenter(pos);' +
                '                map.setZoom(??useCurrentLocationZoom??);' +
                '              }, function() {' +
                '              });' +
                '            } else ' +
                '               console.log("Browser doesnot support Geolocation");' +
                '      }' +

                '      function setLatLang' + mapId + '(latlangData,lat,lang){' +
                '         $("#text' + mapId + '").text(latlangData);' +
                '          window.mapEvent' + mapId + '.positionChanged(latlangData,lat,lang);' +
                '          var prevItem={lat:lat,lng:lang};' +
                '          var map=window.map' + mapId + ';' +
                '          window.marker' + mapId + '.setMap(null);' +
                '          window.marker' + mapId + '= new google.maps.Marker({position:prevItem,title:"",map:map});' +
                '}' +
                '    </script>' +
                '<div style="height:300px;width:100%" id="' + mapId + '" />' +
                '<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBt8w2ut3DYJIwj3bo9C24H7p7ZSJ-L9gs&callback=initMap' + mapId + '">   </script>' +
                '</div>';
            if (!atr) {
                throw "تنظیمات گرید مشخص نشده است - grid Option in Tag";
                return;
            }
            var config = {};
            if (atr.indexOf(".") > 0) {
                var split = atr.split(".");
                if (split.length == 2) {
                    var temp = scope[split[0]];
                    config = temp[split[1]];
                } else {
                    var temp = scope[split[0]];
                    var temp2 = temp[split[1]];
                    config = temp2[split[2]];
                }
            } else
                config = scope[atr];

            if (config.location == undefined)
                config.location = '123';
            if (config.center == undefined)
                config.center = {
                    lat: 32.658066,
                    lng: 51.6693815
                };
            if (config.center.lat == undefined)
                config.center.lat = 33;
            if (config.center.lng == undefined)
                config.center.lng = 53;
            if (config.zoom == undefined)
                config.zoom = 4;
            if (config.useCurrentLocation == undefined)
                config.useCurrentLocation = false;
            if (config.useCurrentLocationZoom == undefined)
                config.useCurrentLocationZoom = 8;
            if (config.busyIndicator == undefined)
                config.busyIndicator = {
                    isActive: false
                };

            if (window['mapEvent' + mapId] == undefined)
                window['mapEvent' + mapId] = {};
            if (window['mapEvent' + mapId].positionChanged == undefined)
                window['mapEvent' + mapId].positionChanged = function (latlang, lat, lng) {
                    if (config.scope.selectedItem != undefined && config.latitude != undefined && config.longitude != undefined) {
                        config.scope.selectedItem[config.latitude] = lat;
                        config.scope.selectedItem[config.longitude] = lng;
                    }
                    if (config.onlocationChanged != undefined)
                        config.onlocationChanged(lat, lng);
                };
            if (window['map' + mapId + 'loaded'] == undefined)
                window['map' + mapId + 'loaded'] = function () {
                    config.busyIndicator.isActive = false;
                }

            if (window['mapEvent' + mapId].getPosition == undefined)
                window['mapEvent' + mapId].getPosition = function () {
                    if (config.scope.selectedItem != undefined && config.latitude != undefined && config.longitude != undefined) {
                        if (config.scope.selectedItem[config.latitude] == undefined || config.scope.selectedItem[config.latitude] == "")
                            config.scope.selectedItem[config.latitude] = config.center.lat;
                        if (config.scope.selectedItem[config.longitude] == undefined || config.scope.selectedItem[config.longitude] == "")
                            config.scope.selectedItem[config.longitude] = config.center.lng;
                        return {
                            lat: parseFloat(config.scope.selectedItem[config.latitude]),
                            lng: parseFloat(config.scope.selectedItem[config.longitude])
                        };
                    }
                    return null;
                };


            template = template.replace("??textmodel??", atr + ".location");
            template = template.replace("??BusyIndicator??", atr + ".busyIndicator");
            template = template.replace("??textChanged??", atr + ".textChanged");
            template = template.replace("??lat??", config.center.lat);
            template = template.replace("??lng??", config.center.lng);
            template = template.replace("??lat??", config.center.lat); //این تکرار حذف نشود
            template = template.replace("??lng??", config.center.lng); //این تکرار حذف نشود
            template = template.replace("??zoom??", config.zoom);
            template = template.replace("??useCurrentLocationZoom??", config.useCurrentLocationZoom);
            template = template.replace("??useCurrentLocationZoom??", config.useCurrentLocationZoom);; //این تکرار حذف نشود
            template = template.replace("??useCurrentLocationZoom??", config.useCurrentLocationZoom);; //این تکرار حذف نشود
            template = template.replace("??getcurrentLocation??", config.useCurrentLocation);

            config.busyIndicator.isActive = true;
            var el = $compile(template)(scope);
            element.append(el);

        }
    };

}

function rashaThumbnail($compile, rashaErManage) {
    return {
        restrict: 'AE',
        //require: 'ngModel',
        //scope: {ngModel: "="},
        link: function (scope, element, attrs, ngModel) {
            var atr = '';
            atr = $(element).attr("rasha-thumbnail");
            if (!atr) {
                throw "تنظیمات گرید مشخص نشده است - grid Option in Tag";
                return;
            }
            var config = {};

            if (atr.indexOf(":") > 0) {
                var split = atr.split(":");
                if (split.length == 3) {
                    config.name = split[0];
                    config.width = split[1];
                    config.height = split[2];
                }
            } else
                config = scope[atr];
            if (config.height == undefined)
                config.height = '30';
            if (config.width == undefined)
                config.width = '30';
            if (config.name == undefined)
                return;

            var imageId = '';
            if (scope.x && scope.x[config.name])
                imageId = scope.x[config.name]; //scope.x.LinkMainImageId;// '255879';// scope[attrs.ngModel];// ngModel.$viewValue;
            if (!imageId || imageId.length == 0)
                if (scope.x && scope[config.name])
                    imageId = scope[config.name];
            if (!imageId || imageId.length == 0)
                return;

            var srcThumbnail = cmsServerConfig.configRouteThumbnails + imageId + '?MvcAuthorization=' + encodeURIComponent(localStorage.getItem('userGlobaltoken'));

            var template = '<img style="width:' + config.width + 'px;height:' + config.height + 'px" src="' + srcThumbnail + '" >';

            var el = $compile(template)(scope);
            element.append(el);

        }
    };

}

function rashaUiTree($compile, ajax, rashaErManage) {
    return {
        restrict: 'E',
        //scope: { content: "=content" },
        link: function (scope, element) {
            var atr = '';
            atr = $(element).attr("content");
            if (!atr) {
                throw "تنظیمات گرید مشخص نشده است - grid Option in Tag";
                return;
            }
            var config = {};
            if (atr.indexOf(".") > 0) {
                var split = atr.split(".");
                if (split.length == 2) {
                    var temp = scope[split[0]];
                    config = temp[split[1]];
                } else {
                    var temp = scope[split[0]];
                    var temp2 = temp[split[1]];
                    config = temp2[split[2]];
                }
            } else
                config = scope[atr];

            if (!config) {
                throw "تنظیمات ستونها در کنترلر مربوطه را ایجاد کنید";
                return;
            }
            scope.treeOptions = {
                accept: function (sourceNodeScope, destNodesScope, destIndex) {
                    return true;
                },
            };
            scope.remove = function (scope) {
                scope.remove();
            };
            scope.toggle = function (scope) {
                scope.toggle();
            };
            scope.onLinkClick = function (node) {
                config.onSetLink(node);
            };
            scope.moveLastToTheBeginning = function () {
                var a = scope.data.pop();
                scope.data.splice(0, 0, a);
            };
            scope.newSubItem = function (scope) {
                var nodeData = scope.$modelValue;
                nodeData.nodes.push({
                    id: nodeData.id * 10 + nodeData.nodes.length,
                    title: nodeData.title,
                    linkType: "",
                    module: "",
                    pageDependency: "",
                    pageId: 0,
                    pageTitle: "",
                    parameter: "",
                    AddressLink: "",
                    nodes: []
                });
            };
            scope.collapseAll = function () {
                scope.$broadcast('angular-ui-tree:collapse-all');
            };
            scope.expandAll = function () {
                scope.$broadcast('angular-ui-tree:expand-all');
            };
            //scope.data = scope.content;
            scope.data = config.treeMenuContent;
            scope.content = config.treeMenuContent;
            // scope.content = "111";
            template = '<div ui-tree id="tree-root" class="angular-ui-tree"><ol ui-tree-nodes ng-model="content" class="ng-pristine ng-untouched ng-valid angular-ui-tree-nodes"><li ng-repeat="node in content" ' +
                ' ui-tree-node ng-include="\'cpanelv1/ModuleCore/common/directiveTemplateMenu.html\'" class="angular-ui-tree-node" colllapsed="false"></li></ol></div>';
            var el = $compile(template)(scope);
            element.append(el);
        }
    };
}

/**
 *
 * Pass all functions into module
 */
angular.module('inspinia')
    .directive('rashaAddMenu', rashaAddMenu)
    .directive('rashaUiTree', rashaUiTree)
    .directive('fullScroll', fullScroll)
    .directive('slimScroll', slimScroll)
    .directive('landingScrollspy', landingScrollspy)
    .directive('pageTitle', pageTitle)
    .directive('includeReplace', includeReplace)
    .directive('bindValidity', bindValidity)
    .directive('sideNavigation', sideNavigation)
    .directive('iboxTools', iboxTools)
    .directive('ionRangeSlider', ionRangeSlider)
    .directive('numbersOnly', numbersOnly)
    .directive('currencyInput', currencyInput)
    .directive('lowerThanDate', lowerThanDate)
    .directive('rashaRecordStatus', rashaRecordStatus)
    .directive('rashaGrid', rashaGrid)
    .directive('rashaMenuRight', rashaMenuRight)
    .directive('rashaMenuLeft', rashaMenuLeft)
    .directive('rashaMenuUp', rashaMenuUp)
    .directive('rashaMenuDown', rashaMenuDown)
    .directive('progressbar', progressbar)
    .directive('rashaAutocomplete', rashaAutocomplete)
    .directive('treeNode', treeNode)
    .directive('treeOptions', treeOptions)
    .directive('dropzone', dropzone)
    .directive('xsWizard', xsWizard)
    .directive('rashaMap', rashaMap)
    .directive('rashaThumbnail', rashaThumbnail)
    .directive('rashaPosition', rashaPosition)
    .directive('rashaRandomBoxes', rashaRandomBoxes)
    .directive('rashaPositionCustomer', rashaPositionCustomer)
    .directive('resizable', resizable)
    .filter('jalaliDate', function () {
        return function (inputDate, format) {
            if (inputDate == null)
                return "";
            if (!format)
                format = 'jYY/jMM/jDD';
            else if (inputDate == "9999-12-31T23:59:59.997") //MaxValue
                return "بدون محدودیت";
            else if (inputDate == "0001-01-01T00:00:00")
                return "مشخّص نشده است";
            else if (format == "HH:mm jYY/jMM/jDD") //format isDateTime
                var date = moment.utc(inputDate).local();
            else if (!inputDate)
                return '';
            else
                var date = moment(inputDate);
            try {
                return date.format(format);
            } catch (err) {
                return '';
            }

        }
    })
    .filter('isRecordStatus', function () {
        return function (inputDate) {
            var ret = "";
            switch (inputDate) {
                case 1:
                    return ret = 'fa fa-check';
                    break;
                case 2:
                    return ret = 'fa fa-times';
                    break;
                case 3:
                    return ret = "fa fa-hourglass-half";
                    break;
                case 4:
                    return ret = 'fa fa-thumbs-up';
                    break;
                case 5:
                    return ret = 'fa fa-thumbs-down';
                    break;
                case 6:
                    return ret = 'fa fa-archive';
                    break;
                default:
                    return ret = 'fa fa-check';
            }
        }
    })
    .filter('excerpt', function () {
        return function (inputDate, excerptLength) {
            if (!angular.isDefined(excerptLength) && !$.isNumeric(excerptLength) && excerptLength == '0')
                excerptLength = 50; //Set default excerpt length 
            if (inputDate != null && inputDate.length > parseInt(excerptLength)) {
                var lastIndex = inputDate.indexOf(' ', excerptLength);
                if (lastIndex < 0)
                    lastIndex = parseInt(excerptLength);
                return inputDate.substring(0, lastIndex).concat("...");
            }
            return inputDate;
        }
    })
    .filter('translatentk', ['$filter', function ($filter) {
        return function (text) {
            text = $filter('lowercase')(text);
            return $filter('translate')(text);
        };
    }])
    .filter('html', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }])
    .filter('allowedWatchField', function () {
        //AccessAddField: Array[16]
        //AccessEditField:   Array[16]
        //AccessSearchField:   Array[16]
        //AccessWatchField: Array[16]

        //AccessAddRow: true
        //AccessEditRow: true
        //AccessDeleteRow:  true
        //AccessWatchRow: true
        return function (inputDate, inputFieldName) {
            if (config
                .resultAccess ==
                undefined ||
                config.resultAccess.AccessWatchField[inputFieldName]) return inputDate;
            return "****";
        }
    })
    .directive("trumbowygNg", function () {
        "use strict";
        return {
            transclude: true,
            restrict: "EA",
            require: "?ngModel",
            link: function (scope, element, attrs, ngModelCtrl) {

                var options = angular.extend({
                    fullscreenable: true,
                    semantic: false,
                    closable: false,
                    btns: []
                }, scope.$eval(attrs.editorConfig));

                ngModelCtrl.$render = function () {
                    angular.element(element).trumbowyg("html", ngModelCtrl.$viewValue);
                };

                angular.element(element).trumbowyg(options).on("tbwchange", function () {
                    ngModelCtrl.$setViewValue(angular.element(element).trumbowyg("html"));
                }).on("tbwpaste", function () {
                    ngModelCtrl.$setViewValue(angular.element(element).trumbowyg("html"));
                });
            }
        };
    })
    .directive('xsWizardPage', xsWizardPage)
    .directive('xsWizardControls', xsWizardControls)
    .directive('customTextInput', customTextInput)
    //.directive('rashaGlobaltoken', rashaGlobaltoken)
    .directive('minimalizaSidebar', minimalizaSidebar)
    .directive("customPopover", customPopover)
    .directive("rashaDatePicker", rashaDatePicker)
    .directive("rashaFilePickerB", rashaFilePickerB)
    .directive("rashaUpload", rashaUpload)
    .directive("queryBuilder", queryBuilder)
    .directive("contextMenu", contextMenu)
    .directive("rashaFileUploaderDraggable", rashaFileUploaderDraggable)
    .directive("ngHtmlCompile", ngHtmlCompile)
    .directive("rashaLoading", rashaLoading)
    .directive("rashaFileManager", rashaFileManager)
    .factory('ajax', ajax)
    .factory('rashaErManage', rashaErManage)
    .factory('$exceptionHandler', rashaErrorLog);