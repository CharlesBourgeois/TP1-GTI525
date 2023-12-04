import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjouterInteretsComponent } from './ajouter-interets.component';

describe('AjouterInteretsComponent', () => {
  let component: AjouterInteretsComponent;
  let fixture: ComponentFixture<AjouterInteretsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AjouterInteretsComponent]
    });
    fixture = TestBed.createComponent(AjouterInteretsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
