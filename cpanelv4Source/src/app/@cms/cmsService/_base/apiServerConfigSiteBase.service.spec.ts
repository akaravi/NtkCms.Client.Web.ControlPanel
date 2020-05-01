/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ApiServerConfigSiteBaseService } from './apiServerConfigSiteBase.service';

describe('Service: ApiServerConfigSiteBase', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiServerConfigSiteBaseService]
    });
  });

  it('should ...', inject([ApiServerConfigSiteBaseService], (service: ApiServerConfigSiteBaseService) => {
    expect(service).toBeTruthy();
  }));
});
