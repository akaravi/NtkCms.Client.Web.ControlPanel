app.service("wizardService", function($rootScope) {
    this.userName = "";
    this.password = "";
    this.callNextPage = null;
    this.callPrevPage = null;
    this.login = function (usr, pwd) {

        //از طریق برودکست این رویداد میتوان متد لاگین متعلق به کنترلر لاگین را فراخوانی کرد
        $rootScope.$broadcast("loginEvent", {
            usr: usr,
            pwd: pwd
        });
    }
});