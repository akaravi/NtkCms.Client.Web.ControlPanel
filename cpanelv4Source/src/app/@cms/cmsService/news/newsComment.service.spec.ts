/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewsCommentService } from './newsComment.service';

describe('Service: NewsComment', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsCommentService]
    });
  });

  it('should ...', inject([NewsCommentService], (service: NewsCommentService) => {
    expect(service).toBeTruthy();
  }));
});
