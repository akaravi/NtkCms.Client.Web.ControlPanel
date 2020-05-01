/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreUserGroupService } from './coreUserGroup.service';

describe('Service: CoreUserGroup', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreUserGroupService]
    });
  });

  it('should ...', inject([CoreUserGroupService], (service: CoreUserGroupService) => {
    expect(service).toBeTruthy();
  }));
});
