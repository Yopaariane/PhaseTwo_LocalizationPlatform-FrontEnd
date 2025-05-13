import { TestBed } from '@angular/core/testing';

import { ProjectLanguageResolverService } from './project-language-resolver.service';

describe('ProjectLanguageResolverService', () => {
  let service: ProjectLanguageResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectLanguageResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
