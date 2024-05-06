import { TestBed } from '@angular/core/testing';

import { GitManagerService } from './git-manager.service';

describe('GitManagerService', () => {
  let service: GitManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GitManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
