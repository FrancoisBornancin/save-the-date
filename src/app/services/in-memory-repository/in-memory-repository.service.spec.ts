import { TestBed } from '@angular/core/testing';

import { InMemoryRepositoryService } from './in-memory-repository.service';

describe('InMemoryRepositoryService', () => {
  let service: InMemoryRepositoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InMemoryRepositoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
