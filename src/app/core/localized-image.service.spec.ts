import { TestBed } from '@angular/core/testing';

import { LocalizedImageService } from './localized-image.service';

describe('LocalizedImageService', () => {
  let service: LocalizedImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalizedImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
