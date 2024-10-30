import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FileEditModel } from 'src/app/Models/FileEdit';
import { FileTreeService } from 'src/app/Services/file.service';

@Component({
  selector: 'app-file-edit',
  templateUrl: './file-edit.component.html',
  styleUrls: ['./file-edit.component.css']
})
export class FileEditComponent implements OnInit {
  constructor(public fileTreeService: FileTreeService){

  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  
  readonly dialog = inject(MatDialog);

  writeFile(){
    this.fileTreeService.writeFile().subscribe({
      next: (response) => {
        console.log('Başarılı');
        this.fileTreeService.fileEditModel = new FileEditModel()
      },
      error: (error) => {
        console.error('API hatası oluştu:', error.message);
      },
      complete: () => {
        console.log('Silme isteği tamamlandı');
      }
    });

  }
}
