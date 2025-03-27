import { TestBed } from '@angular/core/testing';

import { TermResolverService } from './term-resolver.service';

describe('TermResolverService', () => {
  let service: TermResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TermResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
