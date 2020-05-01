/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewsTagService } from './newsTag.service';

describe('Service: NewsTag', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsTagService]
    });
  });

  it('should ...', inject([NewsTagService], (service: NewsTagService) => {
    expect(service).toBeTruthy();
  }));
});
