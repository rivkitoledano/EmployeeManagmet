import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPositionEmployeeComponent } from './edit-position-employee.component';

describe('EditPositionEmployeeComponent', () => {
  let component: EditPositionEmployeeComponent;
  let fixture: ComponentFixture<EditPositionEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPositionEmployeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPositionEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
