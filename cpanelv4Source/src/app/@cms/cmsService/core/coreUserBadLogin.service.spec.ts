/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreUserBadLoginService } from './coreUserBadLogin.service';

describe('Service: CoreUserBadLogin', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreUserBadLoginService]
    });
  });

  it('should ...', inject([CoreUserBadLoginService], (service: CoreUserBadLoginService) => {
    expect(service).toBeTruthy();
  }));
});
