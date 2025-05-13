import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslationProgressDialogComponent } from './translation-progress-dialog.component';

describe('TranslationProgressDialogComponent', () => {
  let component: TranslationProgressDialogComponent;
  let fixture: ComponentFixture<TranslationProgressDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslationProgressDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TranslationProgressDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
