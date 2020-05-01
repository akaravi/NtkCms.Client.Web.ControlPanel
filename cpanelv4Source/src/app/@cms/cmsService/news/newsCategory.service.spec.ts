/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewsCategoryService } from './newsCategory.service';

describe('Service: NewsCategory', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsCategoryService]
    });
  });

  it('should ...', inject([NewsCategoryService], (service: NewsCategoryService) => {
    expect(service).toBeTruthy();
  }));
});
