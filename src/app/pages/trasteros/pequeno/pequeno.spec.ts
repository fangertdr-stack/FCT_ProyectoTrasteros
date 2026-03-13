import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pequeno } from './pequeno';

describe('Pequeno', () => {
  let component: Pequeno;
  let fixture: ComponentFixture<Pequeno>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pequeno]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Pequeno);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
