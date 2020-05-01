import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CmsDashboardRoutes } from './dashboard.routing';
import { ChartistModule } from 'ng-chartist';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatchHeightModule } from '../../shared/directives/match-height.directive';

import { Dashboard1Component } from './dashboard1/dashboard1.component';
import { Dashboard2Component } from './dashboard2/dashboard2.component';


@NgModule({
    imports: [
        CommonModule,
        CmsDashboardRoutes,
        ChartistModule,
        NgbModule,
        MatchHeightModule
    ],
    exports: [],
    declarations: [
        Dashboard1Component,
        Dashboard2Component
    ],
    providers: [],
})
export class CmsDashboardModule { }
