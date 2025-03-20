import { Component, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { FileNode } from '../../Models/FileNode';
import { FileService } from '../../Services/file.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-file-tree',
  templateUrl: './file-tree.component.html',
  styleUrls: ['./file-tree.component.css']
})
export class FileTreeComponent implements OnInit {
  treeControl = new NestedTreeControl<FileNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FileNode>();

  constructor(private fileTreeService: FileService, private cdr: ChangeDetectorRef) {
    this.treeControl.dataNodes = []
    this.loadRootNodes();
  }
  ngOnInit(): void {
    console.log('FileTreeComponent initialized');
  }

  loadRootNodes() {
    this.fileTreeService.getRootDrives().subscribe(response => {
      this.dataSource.data = response;
    });
  }

  loadChildren(node: FileNode) {
    this.fileTreeService.getFiles(node.filePath).subscribe({
      next: (response) => {
        console.log("📥 Gelen yanıt:", response);
  
        if (!response || !Array.isArray(response.result)) {
          console.error("❌ Geçersiz veri!");
          return;
        }
  
        node.children = response.result.map(child => ({ ...child }));
  
        // 🔥 `hasChildren` ve `isDirectory` güncellenmeli!
        node.hasChildren = node.children.length > 0;
        node.isDirectory = true;
  
        // 📌 Data kaynağını güncelle ve UI'yi yenile
        this.dataSource.data = [...this.dataSource.data];
  
        // 📂 Genişletmeyi zorla!
        this.treeControl.expand(node);
  
        console.log("🌳 Güncellenmiş Node:", node);
        console.log("🆕 Yeni Data Kaynağı:", this.dataSource.data);
      },
      error: (error) => console.error("❌ Hata:", error)
    });
  }
  
  
  toggleNode(node: FileNode) {
    if (!this.treeControl.isExpanded(node)) {
      // 📂 Eğer düğüm kapalıysa önce çocukları yükle
      this.loadChildren(node);
    }
    this.treeControl.toggle(node);
  }
  
  
  
  
  hasChild = (_: number, node: FileNode) => node.isDirectory;


}