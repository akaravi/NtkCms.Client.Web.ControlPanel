/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CoreSiteDomainAliasService } from './coreSiteDomainAlias.service';

describe('Service: CoreSiteDomainAlias', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreSiteDomainAliasService]
    });
  });

  it('should ...', inject([CoreSiteDomainAliasService], (service: CoreSiteDomainAliasService) => {
    expect(service).toBeTruthy();
  }));
});
