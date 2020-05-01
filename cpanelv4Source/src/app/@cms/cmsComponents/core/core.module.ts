import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import { CoreRoutes } from './core.routing';

@NgModule({
  imports: [
    CommonModule,
    CoreRoutes,
  ],
  declarations: [CoreComponent]
})
export class CoreModule { }
