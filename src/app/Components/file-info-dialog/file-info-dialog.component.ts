import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileNode } from '../../Models/FileNode';

@Component({
  selector: 'app-file-info-dialog',
  templateUrl: './file-info-dialog.component.html',
  styleUrls: ['./file-info-dialog.component.css']
})
export class FileInfoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<FileInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileNode
  ) {}

  formatFileSize(bytes: number | undefined): string {
    if (bytes === undefined || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  onClose(): void {
    this.dialogRef.close();
  }
}