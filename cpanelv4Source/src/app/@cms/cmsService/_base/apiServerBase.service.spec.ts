/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ApiServerBaseService } from './apiServerBase.service';

describe('Service: ApiServerBase', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiServerBaseService]
    });
  });

  it('should ...', inject([ApiServerBaseService], (service: ApiServerBaseService) => {
    expect(service).toBeTruthy();
  }));
});
