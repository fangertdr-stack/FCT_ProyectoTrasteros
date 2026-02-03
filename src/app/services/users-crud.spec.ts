import { TestBed } from '@angular/core/testing';

import { UsersCrud } from './users-crud';

describe('UsersCrud', () => {
  let service: UsersCrud;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersCrud);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
