/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewsShareServerCategoryService } from './newsShareServerCategory.service';

describe('Service: NewsShareServerCategory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsShareServerCategoryService]
    });
  });

  it('should ...', inject([NewsShareServerCategoryService], (service: NewsShareServerCategoryService) => {
    expect(service).toBeTruthy();
  }));
});
