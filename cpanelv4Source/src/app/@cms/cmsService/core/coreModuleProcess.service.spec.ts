/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreModuleProcessService } from './coreModuleProcess.service';

describe('Service: CoreModuleProcess', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreModuleProcessService]
    });
  });

  it('should ...', inject([CoreModuleProcessService], (service: CoreModuleProcessService) => {
    expect(service).toBeTruthy();
  }));
});
