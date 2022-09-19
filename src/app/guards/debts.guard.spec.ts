import { TestBed } from '@angular/core/testing';

import { DebtsGuard } from './debts.guard';

describe('DebtsGuard', () => {
  let guard: DebtsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DebtsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
