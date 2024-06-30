import { TestBed } from '@angular/core/testing';

import { CommonFacadeService } from './common-facade.service';

describe('CommonFacadeService', () => {
  let service: CommonFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonFacadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
