/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreCpMainMenuService } from './coreCpMainMenu.service';

describe('Service: CoreCpMainMenu', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreCpMainMenuService]
    });
  });

  it('should ...', inject([CoreCpMainMenuService], (service: CoreCpMainMenuService) => {
    expect(service).toBeTruthy();
  }));
});
