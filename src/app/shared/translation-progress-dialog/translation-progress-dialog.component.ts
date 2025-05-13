import { CommonModule } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-translation-progress-dialog',
  imports: [CommonModule, MatDialogModule, MatProgressBarModule, MatIcon],
  templateUrl: './translation-progress-dialog.component.html',
  styleUrl: './translation-progress-dialog.component.css',
  // encapsulation: ViewEncapsulation.None,
})
export class TranslationProgressDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TranslationProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { progress: number, isCompleted: boolean }
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
