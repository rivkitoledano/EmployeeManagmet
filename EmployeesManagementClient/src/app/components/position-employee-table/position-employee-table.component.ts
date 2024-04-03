import { Component, Input, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employees.service';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PositionEmployee } from '../../models/positionEmployee.model';
import { AddPositionEmployeeComponent } from '../add-position-employee/add-position-employee.component';

import { EditPositionEmployeeComponent } from '../edit-position-employee/edit-position-employee.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MassageComponent } from '../massage/massage.component';

@Component({
  selector: 'app-position-employee-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,AddPositionEmployeeComponent,MatToolbarModule
  ],
  templateUrl: './position-employee-table.component.html',
  styleUrl: './position-employee-table.component.scss'
})
export class PositionEmployeeTableComponent implements OnInit{
  @Input() employeeId:number
  displayedColumns: string[] = ['positionName', 'entryDate', 'isManagement','actions'];
  positionsOfEmployees: MatTableDataSource<PositionEmployee>;

  filter!: string;

  constructor(
     private _employeeService: EmployeeService,

     private router: Router, 
     private dialog: MatDialog, 
      ) {this.getPositionsOfEmployee() }

  ngOnInit(): void {
    this.getPositionsOfEmployee();
  }

  getPositionsOfEmployee(): void {
    if(this.employeeId)
    this._employeeService.getPositionsOfEmployeeList(this.employeeId).subscribe({
      next: (result) => {
        this.positionsOfEmployees = new MatTableDataSource<PositionEmployee>(result);
      },
    });
  }

  deletePositionOfEmployee(positionEmployee: PositionEmployee): void {
      const dialogRef = this.dialog.open(MassageComponent, {
        width: '250px',
        data: { message: 'Are you shure you want to delete?' }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'confirm') {
          this._employeeService.deletePositionOfEmployee(this.employeeId,positionEmployee.positionId).subscribe({
            next: () => {
              this.getPositionsOfEmployee();
            }
          });     
           }
      });
    
   
  }

  openEditPositionOfEmployeeDialog(positionEmployee: PositionEmployee): void {
    const dialogRef = this.dialog.open(EditPositionEmployeeComponent, {
      width: '35%',
      height:'50%',
      data: { employeeId: this.employeeId ,positionId: positionEmployee.positionId}

    });

    dialogRef.afterClosed().subscribe(formData => {
      this._employeeService.getPositionsOfEmployeeList(this.employeeId).subscribe(positions => {
        this.positionsOfEmployees = new MatTableDataSource(positions);
      });
     
      if (formData) {
        console.log('Form data:', formData);
      } else {
        console.log('Dialog closed without form data');
      }
  });
  }

  openAddPositionEmployeeDialog(): void {
    const dialogRef = this.dialog.open(AddPositionEmployeeComponent, {
        width: '35%',
        height:'70%',
        data: { employeeId: this.employeeId } // Pass employeeId to the dialog component
      });
  
      dialogRef.afterClosed().subscribe(formData => {
        this._employeeService.getPositionsOfEmployeeList(this.employeeId).subscribe({
          next: (result) => {
            this.positionsOfEmployees = new MatTableDataSource<PositionEmployee>(result);
            this.router.navigate(['editEmployee',this.employeeId])
          },
        });
      
       this.getPositionsOfEmployee()

      });
  }

  applyFilter(event: KeyboardEvent) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.positionsOfEmployees.filter = filterValue;

  }
 
}
