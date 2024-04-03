import { Component, OnInit, } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PositionEmployeeTableComponent } from '../position-employee-table/position-employee-table.component';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employees.service';
import { MassageComponent } from '../massage/massage.component';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    PositionEmployeeTableComponent,
    MatIconModule,
    MatToolbarModule
  ],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.scss'
})
export class EditEmployeeComponent implements OnInit {
  editEmployeeForm: FormGroup;
  updateEmployee: Employee
  employeeId: number
  constructor(
    private formBuilder: FormBuilder,
    private _employeeService: EmployeeService,
    private router: Router,
    private dialog: MatDialog, 
    public route: ActivatedRoute
  ) {

  }
  validateBirthDate(control: FormControl) {
    const birthDate = new Date(control.value);
    const currentDate = new Date();
    const maxAllowedDate = new Date(currentDate.getFullYear() - 18, currentDate.getMonth(), currentDate.getDate());
    if (birthDate > maxAllowedDate) {
      return { invalidBirthDate: true };
    }
    return null;
  }
  
  // פונקציה זו מבצעת את התקינות שהתאריך כניסת העובד אינו לפני התאריך הנוכחי
  
  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    this._employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (result) => {
        this.updateEmployee = result;
        this._employeeService.getPositionsOfEmployeeList(this.updateEmployee.employeeId).subscribe(()=>{console.log(this.updateEmployee.employeeId)})
        console.log(this.updateEmployee)
        this.editEmployeeForm = this.formBuilder.group({
          firstName: [this.updateEmployee.firstName, [Validators.required,Validators.minLength(2)]],
          lastName: [this.updateEmployee.lastName, [Validators.required,Validators.minLength(2)]],
          identity: [this.updateEmployee.identity, [Validators.required,Validators.minLength(9),Validators.maxLength(9)]],
          birthDate: [this.updateEmployee.birthDate,[ Validators.required, this.validateBirthDate.bind(this)]],
          gender: [this.updateEmployee.gender, Validators.required],
          entryDate: [this.updateEmployee.entryDate, [Validators.required]],
        });
      },
    });
  }
  




  save(): void {
    if (this.editEmployeeForm.valid) {
     
      const dialogRef = this.dialog.open(MassageComponent, {
        width: '350px',
        data: { message: 'Are you shure you want to save changes?' }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'confirm') {
          const updateEmployee: Employee = {
            firstName: this.editEmployeeForm.get('firstName').value,
            lastName: this.editEmployeeForm.get('lastName').value,
            identity: this.editEmployeeForm.get('identity').value,
            birthDate: this.editEmployeeForm.get('birthDate').value,
            entryDate: this.editEmployeeForm.get('entryDate').value,
            gender: this.editEmployeeForm.get('gender').value
          };
          this._employeeService.updateEmployee(this.employeeId, updateEmployee).subscribe({
            next: (res) => {
              console.log(res)
            },
          })
          this.router.navigate(['/employeesTable'])

           }
      });

    }

  }

  close(): void {
    this.router.navigate(['/employeesTable'])
  }
  return(){
    this.router.navigate(['employeesTable'])
  }
}
