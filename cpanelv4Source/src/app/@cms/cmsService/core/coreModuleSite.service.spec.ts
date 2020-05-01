/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreModuleSiteService } from './coreModuleSite.service';

describe('Service: CoreModuleSite', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreModuleSiteService]
    });
  });

  it('should ...', inject([CoreModuleSiteService], (service: CoreModuleSiteService) => {
    expect(service).toBeTruthy();
  }));
});
