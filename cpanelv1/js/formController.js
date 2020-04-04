app.controller("formCtrl", ['$timeout', 'ajax', function ($timeout, ajax) {
    var frm = this;
    frm.init = function() {
        //$scope.frm.treeInstance.jstree(true).select_node(['4', '2', '1']);
        //alert("fdf");
    }
    frm.selectedCountry = function(selected) {
        console.log(selected);
    }
    frm.single = 50;
    //$scope.Fee = 0;

    frm.InitalValue = JSON.parse('{"Id": 8,"Title": "استان تهران","TitleEn": "Tehran Province","Link": "Tehran_Province","Cities": null}');
    //frm.Fee = 1000000;

    frm.logProv = function () {
        console.log(frm);
        //console.log(frm.RateNews);
    }
    frm.summernoteText = '<h3>Hello Jonathan! </h3>dummy text of the printing and typesetting industry. <strong>Lorem Ipsum has been the industrys</strong> standard dummy text ever since the 1500s,when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronictypesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with<br /><br />';

    frm.NewsDate = new Date();

    frm.signupForm = function (formName) {

        console.log(frm.selectedItem);
        ajax.call(cmsServerConfig.configApiServerPath+'CoreSite/add', frm.selectedItem , 'POST').success(function (response) {
            
        }).error(function (data, errCode, c, d) {
            
        });
        //if (formName.$valid) {
        //    // Submit as normal
        //    alert("Submited Form");
            
        //} else {
        //    //signup_form.submitted = true;
        //    alert("Error Form");
        //}
    }

    frm.openDate = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $timeout(function () {
            frm.focus = true;
        });
    };

    //var frm = this;

    frm.color = '#1bc2c2';
    frm.treeSelected = [];
    frm.ignoreChanges = false;
    //frm.ionSliderOptions1 = {
    //    //type: "single",
    //    min: 0,
    //    max: 100,
    //    prettify: false,
    //    hasGrid: true,
    //    step: 50
    //};
    
    frm.person = {};
    frm.people = [
      { name: 'Adam', email: 'adam@email.com', age: 12, country: 'United States' },
      { name: 'Amalie', email: 'amalie@email.com', age: 12, country: 'Argentina' },
      { name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina' },
      { name: 'Adrian', email: 'adrian@email.com', age: 21, country: 'Ecuador' },
      { name: 'Wladimir', email: 'wladimir@email.com', age: 30, country: 'Ecuador' },
      { name: 'Samantha', email: 'samantha@email.com', age: 30, country: 'United States' },
      { name: 'Nicole', email: 'nicole@email.com', age: 43, country: 'Colombia' },
      { name: 'Natasha', email: 'natasha@email.com', age: 54, country: 'Ecuador' },
      { name: 'Michael', email: 'michael@email.com', age: 15, country: 'Colombia' },
      { name: 'Nicolás', email: 'nicolas@email.com', age: 43, country: 'Colombia' }
    ];
    frm.treeModel = [{
        "id": "1",
        "parent": "#",
        "text": "سیاست"
    }, {
        "id": "2",
        "parent": "#",
        "text": "ورزشی"
    }, {
        "id": "3",
        "parent": "2",
        "text": "فوتبال ایران"
    }, {
        "id": "4",
        "parent": "2",
        "text": "فوتبال جهان"
    }];


    frm.treeConfig = {
        core: {
            multiple: true,
            animation: true,
            error: function (error) {
                //$log.error('treeCtrl: error from js tree - ' + angular.toJson(error));
            },
            check_callback: false,
            worker: true
        },
        plugins: ['wholerow']
    };

    frm.applyModelChanges = function () {
        return !frm.ignoreChanges;
    };

    frm.addLog = function () {
        var selectedNodes = frm.treeInstance.jstree(true).get_selected();
        console.log(selectedNodes);
        
    }

    frm.changedCB = function (e, data) {
        frm.treeSelected = data.selected;
    };

    frm.readyCB = function (e, data) {
        frm.treeInstance.jstree(true).select_node(['4', '2', '1']);
    }

   
    
}]);