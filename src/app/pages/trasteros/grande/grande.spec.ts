import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Grande } from './grande';

describe('Grande', () => {
  let component: Grande;
  let fixture: ComponentFixture<Grande>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Grande]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Grande);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
