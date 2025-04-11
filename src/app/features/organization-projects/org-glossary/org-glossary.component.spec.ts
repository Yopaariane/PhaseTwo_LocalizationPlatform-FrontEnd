import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgGlossaryComponent } from './org-glossary.component';

describe('OrgGlossaryComponent', () => {
  let component: OrgGlossaryComponent;
  let fixture: ComponentFixture<OrgGlossaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgGlossaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgGlossaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
