/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreLocationService } from './coreLocation.service';

describe('Service: CoreLocation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreLocationService]
    });
  });

  it('should ...', inject([CoreLocationService], (service: CoreLocationService) => {
    expect(service).toBeTruthy();
  }));
});
