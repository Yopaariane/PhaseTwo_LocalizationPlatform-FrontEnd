import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectLanguageComponent } from './project-language.component';

describe('ProjectLanguageComponent', () => {
  let component: ProjectLanguageComponent;
  let fixture: ComponentFixture<ProjectLanguageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectLanguageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectLanguageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
