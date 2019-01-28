/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */
function MainCtrl(rashaErManage, $rootScope) {
    //#help#  می شود در این قسمت مقادری وارد کرد و با مثال زیر استفاده کرد
    //#help# {{main.userName}}
    this.userName = '';
    this.helloText = 'خوش آمدید';
    this.descriptionText = '';
 
};


//angular
//    .module('inspinia')
//    .controller('MainCtrl', MainCtrl)

angular.module('inspinia').controller('MainCtrl', MainCtrl);
