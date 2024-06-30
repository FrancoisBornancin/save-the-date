import { TestBed } from '@angular/core/testing';

import { LayoutDaoService } from './layout-dao.service';

describe('LayoutDaoService', () => {
  let service: LayoutDaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutDaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
