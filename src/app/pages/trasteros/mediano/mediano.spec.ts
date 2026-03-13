import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mediano } from './mediano';

describe('Mediano', () => {
  let component: Mediano;
  let fixture: ComponentFixture<Mediano>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mediano]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mediano);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
