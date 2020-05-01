/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreModuleProcessCustomizeService } from './coreModuleProcessCustomize.service';

describe('Service: CoreModuleProcessCustomize', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreModuleProcessCustomizeService]
    });
  });

  it('should ...', inject([CoreModuleProcessCustomizeService], (service: CoreModuleProcessCustomizeService) => {
    expect(service).toBeTruthy();
  }));
});
