/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewsContentParameterService } from './newsContentParameter.service';

describe('Service: NewsContentParameter', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsContentParameterService]
    });
  });

  it('should ...', inject([NewsContentParameterService], (service: NewsContentParameterService) => {
    expect(service).toBeTruthy();
  }));
});
