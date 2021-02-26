import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SzenarioComponent } from './szenario.component';

describe('SzenarioComponent', () => {
  let component: SzenarioComponent;
  let fixture: ComponentFixture<SzenarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SzenarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SzenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
