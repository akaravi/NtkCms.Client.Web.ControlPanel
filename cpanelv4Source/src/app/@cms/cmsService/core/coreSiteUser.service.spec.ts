/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreSiteUserService } from './coreSiteUser.service';

describe('Service: CoreSiteUser', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreSiteUserService]
    });
  });

  it('should ...', inject([CoreSiteUserService], (service: CoreSiteUserService) => {
    expect(service).toBeTruthy();
  }));
});
