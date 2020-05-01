/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreSiteCategoryService } from './coreSiteCategory.service';

describe('Service: CoreSiteCategory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreSiteCategoryService]
    });
  });

  it('should ...', inject([CoreSiteCategoryService], (service: CoreSiteCategoryService) => {
    expect(service).toBeTruthy();
  }));
});
