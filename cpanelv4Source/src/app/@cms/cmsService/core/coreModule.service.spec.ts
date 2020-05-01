/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreModuleService } from './coreModule.service';

describe('Service: CoreModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreModuleService]
    });
  });

  it('should ...', inject([CoreModuleService], (service: CoreModuleService) => {
    expect(service).toBeTruthy();
  }));
});
