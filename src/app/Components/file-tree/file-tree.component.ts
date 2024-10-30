// import { Component, OnInit } from '@angular/core';
// import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
// import { FlatTreeControl } from '@angular/cdk/tree';
// import { FileNode } from 'src/app/Models/FileNode';
// import { FileTreeService } from 'src/app/Services/file.service';


// interface FlatNode {
//   expandable: boolean;
//   name: string;
//   level: number;
// }



// @Component({
//   selector: 'app-file-tree',
//   templateUrl: './file-tree.component.html',
//   styleUrls: ['./file-tree.component.css']
// })
// export class FileTreeComponent implements OnInit {
  
//   private _transformer = (node: FileNode, level: number) => {
//     return {
//       expandable: !!node.children && node.children.length > 0,
//       name: node.name,
//       level: level,
//     };
//   };

//   treeControl = new FlatTreeControl<FlatNode>(
//     node => node.level,
//     node => node.expandable
//   );

//   treeFlattener = new MatTreeFlattener(
//     this._transformer,
//     node => node.level,
//     node => node.expandable,
//     node => node.children
//   );
  
//   dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  
//   constructor(private fileTreeService:FileTreeService) {
    
    
//   }
//   ngOnInit(): void {
//     this.getFileTree();
//   }

//   hasChild = (_: number, node: FileNode) => !!node.children && node.children.length > 0;

//   getFileTree(){
//     this.fileTreeService.getFileTree().subscribe(value=>{
//       this.dataSource.data=value
//       console.log(this.dataSource.data)
//       console.log(value)
//     })
//   }
// }


import { Component, inject } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FileTreeService } from 'src/app/Services/file.service';
import { FileNode } from 'src/app/Models/FileNode';
import { FlatNode } from 'src/app/Models/FlatNode';
import { MatDialog } from '@angular/material/dialog';
import { FileEditComponent } from '../file-edit/file-edit.component';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';
import { FileType } from 'src/app/Models/FileType';

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.css']
})
export class FileTreeComponent {
  selectDirectory: boolean = false;
  dataLoaded: boolean = false;
  newFileName: string = ''; // Dosya adı için input
  newFileContent: string = ''; // Dosya içeriği için input
  selectedNode: any = null;isDeleting = false; // Spinner kontrolü için yeni değişken
  selectedFileType:string

  private _transformer = (node: FileNode, level: number): FlatNode => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level: level,
    isDirectory: node.isDirectory,
    size: node.size,
    filePath: node.filePath
  });

  treeControl = new FlatTreeControl<FlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  constructor(private fileTreeService: FileTreeService) {
    this.getFileTree();
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  getFileTree() {
    this.fileTreeService.getFileTree().subscribe(value => {
      const cleanedData = this.cleanData(value);
      this.dataSource.data = cleanedData;
      this.dataLoaded = true;
    });
  }

  // Gelen veriyi dönüştürme fonksiyonu
  cleanData(nodes: any[]): FileNode[] {
    return nodes.map(node => {
      return {
        name: node.Name,
        isDirectory: node.IsDirectory,
        size: this.convertBytesToGB(node.Size),
        filePath: node.FilePath || '',
        children: node.Children ? this.cleanData(node.Children) : []
      };
    });
  }

  // Dosya oluşturma metodu
  createFile(filePath: string) {
    // Input alanları boşsa işlem yapılmıyor
    if (this.newFileName && this.newFileContent) {
      const fullFilePath = `${filePath}/${this.newFileName+this.selectedFileType}`; // Dosya yolu ve dosya adını birleştir
      const content = this.newFileContent;
      console.log(fullFilePath + " " + content)
  
      // Servis çağrısı
      this.fileTreeService.createFile(fullFilePath, content).subscribe(
        (response) => {
          console.log(response);
          this.getFileTree(); // Dosya oluşturulduktan sonra ağacı güncelle
          this.newFileName = ''; // Input alanlarını temizle
          this.newFileContent = '';
          this.selectedNode = null; // Formu gizle
        },
        (error) => {
          console.error("Dosya oluşturma hatası:", error);
          if (error.error && error.error.errors) {
            // Validasyon hatalarını göster
            console.log("Validasyon hataları:", error.error.errors);
          }
        }
      );
    } else {
      console.error("File name or content boş olamaz.");
    }
  }
  

  convertBytesToGB(bytes: number): number {
    if (bytes === null || bytes === undefined) {
      return 0; // Null veya undefined kontrolü
    }
    return Math.floor(bytes / (1024 * 1024)); // 1 GB = 1024 * 1024 bytes
  }

  deleteFile(filePath: string) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Kullanıcı "Evet" butonuna bastı
        this.fileTreeService.deleteFile(filePath).subscribe(() => {
          
          this.getFileTree(); // Dosya silindikten sonra ağacı güncelle
          
        });
      }
    });
  }

  setSelectDirectory(node: any) {
    this.selectedNode = this.selectedNode === node ? null : node;
  }
  readonly dialog = inject(MatDialog);

  openDialog(filePath:string) {
    this.fileTreeService.readFile(filePath).subscribe({
      next: (response) => {
        this.fileTreeService.fileEditModel.fileContent=response
        this.fileTreeService.fileEditModel.filePath=filePath
        const dialogRef = this.dialog.open(FileEditComponent);
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
        });

      },
      error: (error) => {
        console.error('API hatası oluştu:', error.message);
      },
      complete: () => {
        console.log('Silme isteği tamamlandı');
      }
    });

  }

  
  fileTypes: FileType[] = [
    { value: '.txt', viewValue: 'Text File' },
    { value: '.pdf', viewValue: 'PDF File' }
  ];


}
