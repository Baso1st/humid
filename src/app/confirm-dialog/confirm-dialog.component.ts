import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit{

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    const x = 1;
  }

  onNoClick(): void {
    this.data.isOver18 = false;
    this.dialogRef.close(this.data);
  }
  onYesClick(): void {
    this.data.isOver18 = true;
    this.dialogRef.close(this.data);
  }

}
