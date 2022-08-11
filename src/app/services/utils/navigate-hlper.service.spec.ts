import { TestBed } from '@angular/core/testing';

import { NavigateHlperService } from './navigate-hlper.service';

describe('NavigateHlperService', () => {
  let service: NavigateHlperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavigateHlperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
