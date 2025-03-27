import { TestBed } from '@angular/core/testing';

import { TranslationTaskService } from './translation-task.service';

describe('TranslationTaskService', () => {
  let service: TranslationTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TranslationTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
