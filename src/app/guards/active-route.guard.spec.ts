import { TestBed } from '@angular/core/testing';

import { ActiveRouteGuard } from './active-route.guard';

describe('ActiveRouteGuard', () => {
  let guard: ActiveRouteGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ActiveRouteGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
