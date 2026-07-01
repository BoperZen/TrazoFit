import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideojuegosList } from './videojuegos-list';

describe('VideojuegosList', () => {
  let component: VideojuegosList;
  let fixture: ComponentFixture<VideojuegosList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideojuegosList],
    }).compileComponents();

    fixture = TestBed.createComponent(VideojuegosList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
