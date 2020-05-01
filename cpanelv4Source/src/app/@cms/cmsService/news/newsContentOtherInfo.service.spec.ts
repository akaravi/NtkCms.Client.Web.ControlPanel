/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NewsContentOtherInfoService } from './newsContentOtherInfo.service';

describe('Service: NewsContentOtherInfo', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewsContentOtherInfoService]
    });
  });

  it('should ...', inject([NewsContentOtherInfoService], (service: NewsContentOtherInfoService) => {
    expect(service).toBeTruthy();
  }));
});
