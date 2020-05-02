import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

//COMPONENTS
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { CustomizerComponent } from './customizer/customizer.component';
import { NotificationSidebarComponent } from './notification-sidebar/notification-sidebar.component';

//DIRECTIVES
import { SidebarDirective } from 'app/@theme/shared/directives/sidebar.directive';
import { SidebarLinkDirective } from 'app/@theme/shared/directives/sidebarlink.directive';
import { SidebarListDirective } from 'app/@theme/shared/directives/sidebarlist.directive';
import { SidebarAnchorToggleDirective } from 'app/@theme/shared/directives/sidebaranchortoggle.directive';
import { SidebarToggleDirective } from 'app/@theme/shared/directives/sidebartoggle.directive';
//import { ToggleFullscreenDirective } from './directives/toggle-fullscreen.directive';

@NgModule({
    exports: [
        CommonModule,
        NgbModule,
        TranslateModule,
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        CustomizerComponent,
        NotificationSidebarComponent,
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
        FooterComponent,
        NavbarComponent,
        SidebarComponent,
        CustomizerComponent,
        NotificationSidebarComponent,
        //ToggleFullscreenDirective,
        SidebarDirective,
        SidebarLinkDirective,
        SidebarListDirective,
        SidebarAnchorToggleDirective,
        SidebarToggleDirective
    ]
})
export class ThemeSharedModule { }
