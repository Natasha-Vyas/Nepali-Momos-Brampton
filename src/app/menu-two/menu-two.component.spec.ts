import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuTwoComponent } from './menu-two.component';

describe('MenuTwoComponent', () => {
  let component: MenuTwoComponent;
  let fixture: ComponentFixture<MenuTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
