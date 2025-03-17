import { TestBed } from '@angular/core/testing';

import { SingleProjectService } from './single-project.service';

describe('SingleProjectService', () => {
  let service: SingleProjectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SingleProjectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
