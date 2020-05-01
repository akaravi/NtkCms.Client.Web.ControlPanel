/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreEnumService } from './coreEnum.service';

describe('Service: CoreEnum', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreEnumService]
    });
  });

  it('should ...', inject([CoreEnumService], (service: CoreEnumService) => {
    expect(service).toBeTruthy();
  }));
});
