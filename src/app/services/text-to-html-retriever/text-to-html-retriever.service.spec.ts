import { TestBed } from '@angular/core/testing';

import { TextToHtmlRetrieverService } from './text-to-html-retriever.service';

describe('TextToHtmlRetrieverService', () => {
  let service: TextToHtmlRetrieverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextToHtmlRetrieverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
