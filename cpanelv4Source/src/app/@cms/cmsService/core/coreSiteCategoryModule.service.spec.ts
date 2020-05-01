/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreSiteCategoryModuleService } from './coreSiteCategoryModule.service';

describe('Service: CoreSiteCategoryModule', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreSiteCategoryModuleService]
    });
  });

  it('should ...', inject([CoreSiteCategoryModuleService], (service: CoreSiteCategoryModuleService) => {
    expect(service).toBeTruthy();
  }));
});
