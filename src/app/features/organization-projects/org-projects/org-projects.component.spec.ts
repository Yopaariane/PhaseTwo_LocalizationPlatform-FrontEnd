import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgProjectsComponent } from './org-projects.component';

describe('OrgProjectsComponent', () => {
  let component: OrgProjectsComponent;
  let fixture: ComponentFixture<OrgProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgProjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
