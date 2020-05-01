/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewsContentSimilarService } from './newsContentSimilar.service';

describe('Service: NewsContentSimilar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsContentSimilarService]
    });
  });

  it('should ...', inject([NewsContentSimilarService], (service: NewsContentSimilarService) => {
    expect(service).toBeTruthy();
  }));
});
