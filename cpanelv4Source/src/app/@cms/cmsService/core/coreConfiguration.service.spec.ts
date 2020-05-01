/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreConfigurationService } from './coreConfiguration.service';

describe('Service: CoreConfiguration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreConfigurationService]
    });
  });

  it('should ...', inject([CoreConfigurationService], (service: CoreConfigurationService) => {
    expect(service).toBeTruthy();
  }));
});
