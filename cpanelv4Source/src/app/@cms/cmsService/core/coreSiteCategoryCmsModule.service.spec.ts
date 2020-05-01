/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreSiteCategoryCmsModuleService } from './coreSiteCategoryCmsModule.service';

describe('Service: CoreSiteCategoryCmsModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreSiteCategoryCmsModuleService]
    });
  });

  it('should ...', inject([CoreSiteCategoryCmsModuleService], (service: CoreSiteCategoryCmsModuleService) => {
    expect(service).toBeTruthy();
  }));
});
