import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentPage } from './rent-page';

describe('RentPage', () => {
  let component: RentPage;
  let fixture: ComponentFixture<RentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
