/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreUserService } from './coreUser.service';

describe('Service: CoreUser', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreUserService]
    });
  });

  it('should ...', inject([CoreUserService], (service: CoreUserService) => {
    expect(service).toBeTruthy();
  }));
});
