import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingPlanComponent } from './billing-plan.component';

describe('BillingPlanComponent', () => {
  let component: BillingPlanComponent;
  let fixture: ComponentFixture<BillingPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingPlanComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
