import { TestBed } from '@angular/core/testing';

import { PuterAiService } from './puter-ai.service';

describe('PuterAiService', () => {
  let service: PuterAiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuterAiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
