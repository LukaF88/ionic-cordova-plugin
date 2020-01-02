import { TestBed } from '@angular/core/testing';

import { InstructionServiceService } from './instruction-service.service';

describe('InstructionServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InstructionServiceService = TestBed.get(InstructionServiceService);
    expect(service).toBeTruthy();
  });
});
