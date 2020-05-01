/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewsShareReciverCategoryService } from './newsShareReciverCategory.service';

describe('Service: NewsShareReciverCategory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsShareReciverCategoryService]
    });
  });

  it('should ...', inject([NewsShareReciverCategoryService], (service: NewsShareReciverCategoryService) => {
    expect(service).toBeTruthy();
  }));
});
