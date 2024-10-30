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


import { Component } from '@angular/core';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FileTreeService } from 'src/app/Services/file.service';

interface FileNode {
  name: string;
  isDirectory: boolean;
  size?: number;
  children?: FileNode[];
}

interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  isDirectory: boolean;
  size?: number;
}

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.css']
})
export class FileTreeComponent {
  private _transformer = (node: FileNode, level: number): FlatNode => ({
    expandable: !!node.children && node.children.length > 0,
    name: node.name,
    level: level,
    isDirectory: node.isDirectory,
    size: node.size,
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

  constructor(private fileTreeService:FileTreeService) {
    // Test verileri ile dolduruyoruz
    const data: FileNode[] = [
      {
        name: 'C Klasörü',
        isDirectory: true,
        children: [
          { name: 'Dosya1.txt', isDirectory: false, size: 14 },
          { name: 'Dosya2.txt', isDirectory: false, size: 10 },
          {
            name: 'Alt Klasör',
            isDirectory: true,
            children: [{ name: 'Dosya3.txt', isDirectory: false, size: 5 }]
          }
        ]
      }
    ];
    // this.dataSource.data = data;
    this.getFileTree();
    
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  getFileTree() {
    this.fileTreeService.getFileTree().subscribe(value => {
      console.log("API Çıktısı:", value); // API çıktısını kontrol et
      const cleanedData = this.cleanData(value);
      console.log("Temizlenmiş Veri:", cleanedData); // Dönüştürülen veriyi kontrol et
      this.dataSource.data = cleanedData;
    });
  }
  
  
  // `Children` alanını `children` olarak yeniden adlandıran fonksiyon
  cleanData(nodes: any[]): FileNode[] {
    return nodes.map(node => {
      // `Children` alanını `children` olarak atıyoruz
      return {
        name: node.Name,
        isDirectory: node.IsDirectory,
        size: this.convertBytesToGB(node.Size),
        filePath: node.FilePath,
        children: node.Children ? this.cleanData(node.Children) : [] // `Children` içeriğini `children` alanına atıyoruz
      };
    });
  }
  
  convertBytesToGB(bytes: number): number {
    if (bytes === null || bytes === undefined) {
      return 0; // Null veya undefined kontrolü
    }
    return Math.floor(bytes / (1024 * 1024)); // 1 GB = 1024 * 1024 * 1024 bytes
  }
  
  deleteFile(filePath:string){
    console.log(filePath)
    this.fileTreeService.deleteFile(filePath)
  }
}



