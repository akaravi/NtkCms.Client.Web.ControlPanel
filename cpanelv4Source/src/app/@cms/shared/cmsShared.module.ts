import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

//COMPONENTS
import { CmsFooterComponent } from './footer/footer.component';
import { CmsNavbarComponent } from './navbar/navbar.component';
//import { CmsSidebarComponent } from './sidebar/sidebar.component';
import { CmsCustomizerComponent } from './customizer/customizer.component';
import { CmsNotificationSidebarComponent } from './notification-sidebar/notification-sidebar.component';

//DIRECTIVES
//import { ToggleFullscreenDirective } from './directives/toggle-fullscreen.directive';
//import { SidebarDirective } from './directives/sidebar.directive';
//import { SidebarLinkDirective } from './directives/sidebarlink.directive';
//import { SidebarListDirective } from './directives/sidebarlist.directive';
//import { SidebarAnchorToggleDirective } from './directives/sidebaranchortoggle.directive';
//import { SidebarToggleDirective } from './directives/sidebartoggle.directive';

@NgModule({
    exports: [
        CommonModule,
        NgbModule,
        TranslateModule,
        CmsFooterComponent,
        CmsNavbarComponent,
        //CmsSidebarComponent,
        CmsCustomizerComponent,
        CmsNotificationSidebarComponent,
        //ToggleFullscreenDirective,
        //SidebarDirective,

    ],
    imports: [
        RouterModule,
        CommonModule,
        NgbModule,
        TranslateModule,
        PerfectScrollbarModule
    ],
    declarations: [
        CmsFooterComponent,
        CmsNavbarComponent,
        //CmsSidebarComponent,
        CmsCustomizerComponent,
        CmsNotificationSidebarComponent,
        //ToggleFullscreenDirective,
        //SidebarDirective,
        //SidebarLinkDirective,
        //SidebarListDirective,
        //SidebarAnchorToggleDirective,
        //SidebarToggleDirective
    ]
})
export class CmsSharedModule { }
