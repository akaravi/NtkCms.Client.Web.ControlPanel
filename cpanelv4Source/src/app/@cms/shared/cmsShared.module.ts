import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

//COMPONENTS
import { CmsFooterComponent } from './footer/footer.component';
import { CmsNavbarComponent } from './navbar/navbar.component';
import { CmsSidebarComponent } from './sidebar/sidebar.component';
import { CmsCustomizerComponent } from './customizer/customizer.component';
import { CmsNotificationSidebarComponent } from './notification-sidebar/notification-sidebar.component';


//DIRECTIVES
import { SidebarDirective } from 'app/@cms/shared/directives/sidebar.directive';
import { SidebarLinkDirective } from 'app/@cms/shared/directives/sidebarlink.directive';
import { SidebarListDirective } from 'app/@cms/shared/directives/sidebarlist.directive';
import { SidebarAnchorToggleDirective } from 'app/@cms/shared/directives/sidebaranchortoggle.directive';
import { SidebarToggleDirective } from 'app/@cms/shared/directives/sidebartoggle.directive';
//import { ToggleFullscreenDirective } from './directives/toggle-fullscreen.directive';

@NgModule({
    exports: [
        CommonModule,
        NgbModule,
        TranslateModule,
        CmsFooterComponent,
        CmsNavbarComponent,
        CmsSidebarComponent,
        CmsCustomizerComponent,
        CmsNotificationSidebarComponent,
        //ToggleFullscreenDirective,
        SidebarDirective,

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
        CmsSidebarComponent,
        CmsCustomizerComponent,
        CmsNotificationSidebarComponent,
        //ToggleFullscreenDirective,
        SidebarDirective,
        SidebarLinkDirective,
        SidebarListDirective,
        SidebarAnchorToggleDirective,
        SidebarToggleDirective
    ]
})
export class CmsSharedModule { }
