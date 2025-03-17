import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserrolePermissionsComponent } from './userrole-permissions.component';

describe('UserrolePermissionsComponent', () => {
  let component: UserrolePermissionsComponent;
  let fixture: ComponentFixture<UserrolePermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserrolePermissionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserrolePermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
