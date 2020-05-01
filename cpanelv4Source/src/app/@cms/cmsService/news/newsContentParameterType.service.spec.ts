/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewsContentParameterTypeService } from './newsContentParameterType.service';

describe('Service: NewsContentParameterType', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsContentParameterTypeService]
    });
  });

  it('should ...', inject([NewsContentParameterTypeService], (service: NewsContentParameterTypeService) => {
    expect(service).toBeTruthy();
  }));
});
