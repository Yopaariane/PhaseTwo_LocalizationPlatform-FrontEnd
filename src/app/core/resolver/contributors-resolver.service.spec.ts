import { TestBed } from '@angular/core/testing';

import { ContributorsResolverService } from './contributors-resolver.service';

describe('ContributorsResolverService', () => {
  let service: ContributorsResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContributorsResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
