import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCheckComponent } from './form-check.component';

describe('FormCheckComponent', () => {
  let component: FormCheckComponent;
  let fixture: ComponentFixture<FormCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
