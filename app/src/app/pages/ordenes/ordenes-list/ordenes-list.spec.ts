import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesList } from './ordenes-list';

describe('OrdenesList', () => {
  let component: OrdenesList;
  let fixture: ComponentFixture<OrdenesList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdenesList],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdenesList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
