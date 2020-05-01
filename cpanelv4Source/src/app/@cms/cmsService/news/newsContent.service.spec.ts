/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewsContentService } from './newsContent.service';

describe('Service: NewsContent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsContentService]
    });
  });

  it('should ...', inject([NewsContentService], (service: NewsContentService) => {
    expect(service).toBeTruthy();
  }));
});
