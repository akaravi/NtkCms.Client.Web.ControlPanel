/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewsContentTagService } from './newsContentTag.service';

describe('Service: NewsContentTag', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsContentTagService]
    });
  });

  it('should ...', inject([NewsContentTagService], (service: NewsContentTagService) => {
    expect(service).toBeTruthy();
  }));
});
