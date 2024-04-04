import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { EmployeeService } from '../../services/employees.service';
import { Router } from '@angular/router';
import { PositionEmployee } from '../../models/positionEmployee.model';
import { PositionService } from '../../services/position.service';
import { Position } from '../../models/position.model';
import { Employee } from '../../models/employee.model';
import { MassageComponent } from '../massage/massage.component';

@Component({
  selector: 'app-add-position-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
 
  ],
  templateUrl: './add-position-employee.component.html',
  styleUrl: './add-position-employee.component.scss'
})

export class AddPositionEmployeeComponent implements OnInit{
  PositionEmployeeForm: FormGroup;
  positionlist:Position[]
  employeeId:number
  employee:Employee
  validateEntryDate(control: FormControl) {
    const entryDate = new Date(control.value);
    if (this.employee && new Date(entryDate) < new Date(this.employee.entryDate)) {
      return { invalidateEntryDate: true };
    }
    return null;
  }
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddPositionEmployeeComponent>,
    private _employeeService:EmployeeService,
    private router:Router,
    private _positionService:PositionService,
    private dialog: MatDialog, 
    @Inject(MAT_DIALOG_DATA) public data: { employeeId: number },
  ) {

    this.employeeId = data.employeeId;
    this.PositionEmployeeForm = this.formBuilder.group({
      positionId: ['', Validators.required],
      isManagement:['', Validators.required],
      entryDate: ['', [ Validators.required,this.validateEntryDate.bind(this)]],
    });
  }
 
  ngOnInit(): void {
  
    this._employeeService.getEmployeeById(this.employeeId).subscribe(employee => {
      this.employee = employee;
    });
    this._positionService.getEmployeePositionsNotAssigned(this.employeeId).subscribe(positions => {
      this.positionlist = positions;
    });
    // קריאה לפונקציית האימות בזמן שינוי בתאריך
  
  }


  save(): void {
  
    if (this.PositionEmployeeForm.valid) {
      const dialogRef = this.dialog.open(MassageComponent, {
        width: '300px',
        data: { message: 'Are you shure you want to save?' }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'confirm') {
       
      const newPositionEmployee: PositionEmployee = {
        positionId: this.PositionEmployeeForm.get('positionId').value,
        isManagement:  this.PositionEmployeeForm.get('isManagement').value,
        entryDate: this.PositionEmployeeForm.get('entryDate').value,
      };
     
      this._employeeService.addNewPositionToEmployee(this.employeeId,newPositionEmployee).subscribe(()=>{
        this.router.navigate(['/editEmployee',this.employeeId])
      this.dialogRef.close(this.PositionEmployeeForm.value);}

    )

      
  }
});
  }
  }

  close(): void {
    this.dialogRef.close();
  }
  
}
