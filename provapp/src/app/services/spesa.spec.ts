import { TestBed } from '@angular/core/testing';

import { Spesa } from './spesa';

describe('Spesa', () => {
  let service: Spesa;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Spesa);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
