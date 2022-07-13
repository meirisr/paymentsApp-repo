import { TestBed } from '@angular/core/testing';

import { TravelProcessService } from './travel-process.service';

describe('TravelProcessService', () => {
  let service: TravelProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TravelProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
