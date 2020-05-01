import { Component, ViewEncapsulation, Input } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'ngbd-modal-content',
    template: `
    <div class="modal-header">
      <h4 class="modal-title">Hi there!</h4>
      <button type="button" class="close" aria-label="Close" (click)="activeModal.dismiss('Cross click')">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
      <p>Hello, {{name}}!</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary btn-raised" (click)="activeModal.close('Close click')">Close</button>
    </div>
  `
})

export class NgbdModalContent {
    @Input() name;
    constructor(public activeModal: NgbActiveModal) { }
}


@Component({
    selector: 'app-modals',
    templateUrl: './modals.component.html',
    styleUrls: ['./modals.component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class ModalsComponent {

    closeResult: string;

    constructor(private modalService: NgbModal) { }

    // Open default modal
    open(content) {
        this.modalService.open(content).result.then((result) => {
            this.closeResult = `بسته شدن با: ${result}`;
        }, (reason) => {
            this.closeResult = `رها شدن با ${this.getDismissReason(reason)}`;
        });
    }

    // This function is used in open
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'با فشردن ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'با کلیک کردن یک backdrop';
        } else {
            return `با: ${reason}`;
        }
    }

    // Open modal with dark section
    openModal(customContent) {
        this.modalService.open(customContent, { windowClass: 'dark-modal' });
    }

    // Open content with dark section
    openContent() {
        const modalRef = this.modalService.open(NgbdModalContent);
        modalRef.componentInstance.name = 'دنیا';
    }
}

