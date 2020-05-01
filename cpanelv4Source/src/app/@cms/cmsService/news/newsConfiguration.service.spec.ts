/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewsConfigurationService } from './newsConfiguration.service';

describe('Service: NewsConfiguration', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsConfigurationService]
    });
  });

  it('should ...', inject([NewsConfigurationService], (service: NewsConfigurationService) => {
    expect(service).toBeTruthy();
  }));
});
