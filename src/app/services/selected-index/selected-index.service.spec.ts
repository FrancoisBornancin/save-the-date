import { TestBed } from '@angular/core/testing';

import { SelectedIndexService } from './selected-index.service';

describe('SelectedIndexService', () => {
  let service: SelectedIndexService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectedIndexService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
