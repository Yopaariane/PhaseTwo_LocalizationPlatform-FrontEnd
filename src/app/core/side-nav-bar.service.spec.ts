import { TestBed } from '@angular/core/testing';

import { SideNavBarService } from './side-nav-bar.service';

describe('SideNavBarService', () => {
  let service: SideNavBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SideNavBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
