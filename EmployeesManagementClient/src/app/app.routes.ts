import { Routes } from '@angular/router';
import { EmployeesTableComponent } from './components/employees-table/employees-table.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import { EditPositionEmployeeComponent } from './components/edit-position-employee/edit-position-employee.component';
import { AddEmployeeComponent } from './components/add-employee/add-employee.component';
export const routes: Routes = [
    { path: '', redirectTo: 'employeesTable', pathMatch: 'full' },
    { path: 'employeesTable', component:EmployeesTableComponent },
    { path: 'addEmployee', component:EmployeesTableComponent },
    { path: 'editEmployee/:id', component:EditEmployeeComponent },
    { path: 'addPositionEmployee/:id', component:AddEmployeeComponent },
    { path: 'editPositionEmployee/:id', component:EditPositionEmployeeComponent },
    { path: '**', component:NotFoundComponent },


    
];