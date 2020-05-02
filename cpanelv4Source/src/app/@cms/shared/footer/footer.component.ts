import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'app-cms-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})

export class CmsFooterComponent{
    //Variables
    currentDate : Date = new Date();
}
