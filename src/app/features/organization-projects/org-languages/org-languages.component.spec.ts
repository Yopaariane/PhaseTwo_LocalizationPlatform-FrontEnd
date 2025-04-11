import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgLanguagesComponent } from './org-languages.component';

describe('OrgLanguagesComponent', () => {
  let component: OrgLanguagesComponent;
  let fixture: ComponentFixture<OrgLanguagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgLanguagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgLanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
