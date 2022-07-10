import { TestBed } from '@angular/core/testing';

import { TemporaryStorageService } from './temporary-storage.service';

describe('TemporaryStorageService', () => {
  let service: TemporaryStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemporaryStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
