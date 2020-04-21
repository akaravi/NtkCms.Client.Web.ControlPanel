/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CmsAuthService } from './auth.service';

describe('Service: Auth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CmsAuthService]
    });
  });

  it('should ...', inject([CmsAuthService], (service: CmsAuthService) => {
    expect(service).toBeTruthy();
  }));
});
