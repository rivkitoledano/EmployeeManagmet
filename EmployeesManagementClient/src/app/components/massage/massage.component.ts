import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-massage',
  standalone: true,
  imports: [CommonModule,MatDialogModule,MatButtonModule, ],
  templateUrl: './massage.component.html',
  styleUrl: './massage.component.scss'
})
export class MassageComponent {
  message: string; // שינוי שם המשתנה

  constructor(
    public dialogRef: MatDialogRef<MassageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.message = data.message; // השמה של הודעת השגיאה מהנתונים
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onConfirmClick(): void {
    this.dialogRef.close('confirm');
  }
}
