import { TestBed } from '@angular/core/testing';

import { ThreadPoolExecutorService } from './thread-pool-executor.service';

describe('ThreadPoolExecutorService', () => {
  let service: ThreadPoolExecutorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreadPoolExecutorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
