/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreGuideService } from './coreGuide.service';

describe('Service: CoreGuide', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreGuideService]
    });
  });

  it('should ...', inject([CoreGuideService], (service: CoreGuideService) => {
    expect(service).toBeTruthy();
  }));
});
