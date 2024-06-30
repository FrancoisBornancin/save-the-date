import { TestBed } from '@angular/core/testing';

import { ImageDaoService } from './image-dao.service';

describe('ImageDaoService', () => {
  let service: ImageDaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageDaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
