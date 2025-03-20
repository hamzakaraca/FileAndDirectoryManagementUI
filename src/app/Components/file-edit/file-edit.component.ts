import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileEditModel } from 'src/app/Models/FileEdit';
import { FileService } from 'src/app/Services/file.service';

@Component({
  selector: 'app-file-edit',
  templateUrl: './file-edit.component.html',
  styleUrls: ['./file-edit.component.css']
})
export class FileEditComponent implements OnInit {
  fileEditModel: FileEditModel = new FileEditModel();
  isSaving: boolean = false;

  constructor(
    private fileService: FileService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<FileEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { filePath: string, content: string }
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.fileEditModel.filePath = this.data.filePath;
      this.fileEditModel.content = this.data.content;
    }
  }
  
  writeFile() {
    if (this.fileEditModel.filePath && this.fileEditModel.content) {
      this.isSaving = true;
      this.fileService.writeFile(this.fileEditModel.filePath, this.fileEditModel.content).subscribe({
        next: (response) => {
          this.snackBar.open('Dosya başarıyla kaydedildi', 'Tamam', {
            duration: 3000
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Dosya kaydetme hatası:', error);
          this.snackBar.open('Dosya kaydedilirken bir hata oluştu', 'Tamam', {
            duration: 3000
          });
          this.isSaving = false;
        },
        complete: () => {
          this.isSaving = false;
        }
      });
    }
  }
}
