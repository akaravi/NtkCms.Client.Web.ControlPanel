/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewsCategoryTagService } from './newsCategoryTag.service';

describe('Service: NewsCategoryTag', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsCategoryTagService]
    });
  });

  it('should ...', inject([NewsCategoryTagService], (service: NewsCategoryTagService) => {
    expect(service).toBeTruthy();
  }));
});
