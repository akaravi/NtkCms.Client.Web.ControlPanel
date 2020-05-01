/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewsContentAndParameterValueService } from './newsContentAndParameterValue.service';

describe('Service: NewsContentAndParameterValue', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsContentAndParameterValueService]
    });
  });

  it('should ...', inject([NewsContentAndParameterValueService], (service: NewsContentAndParameterValueService) => {
    expect(service).toBeTruthy();
  }));
});
