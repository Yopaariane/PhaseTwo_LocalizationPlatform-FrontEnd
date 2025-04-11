import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrgContributorsComponent } from './org-contributors.component';

describe('OrgContributorsComponent', () => {
  let component: OrgContributorsComponent;
  let fixture: ComponentFixture<OrgContributorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrgContributorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgContributorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
