import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { FileNode } from 'src/app/Models/FileNode';
import { FileService } from 'src/app/Services/file.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FileInfoDialogComponent } from '../file-info-dialog/file-info-dialog.component';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-material-file-tree',
  templateUrl: './material-file-tree.component.html',
  styleUrls: ['./material-file-tree.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MaterialFileTreeComponent implements OnInit {
  treeControl = new NestedTreeControl<FileNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FileNode>();
  loadingNodes = new Set<string>();

  constructor(
    private fileService: FileService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadRootNodes();
  }

  private updateTree(): void {
    const currentData = [...this.dataSource.data];
    this.dataSource.data = [];
    requestAnimationFrame(() => {
      this.dataSource.data = currentData;
      this.cdr.markForCheck();
    });
  }

  loadRootNodes(): void {
    console.log('Loading root nodes...');
    this.fileService.getRootDrives().subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.dataSource.data = response.map(node => ({
            ...node,
            children: [],
            childrenLoaded: false
          }));
          this.cdr.markForCheck();
          console.log('Root nodes loaded:', this.dataSource.data);
        }
      },
      error: (error) => console.error('Error loading root nodes:', error)
    });
  }

  loadChildren(node: FileNode): void {
    if (node.childrenLoaded) {
      this.treeControl.toggle(node);
      return;
    }

    if (!this.loadingNodes.has(node.filePath)) {
      console.log('Loading children for:', node.filePath);
      this.loadingNodes.add(node.filePath);
      
      this.fileService.getFiles(node.filePath).subscribe({
        next: (response) => {
          if (response?.result) {
            node.children = response.result.map(child => ({
              ...child,
              children: [],
              childrenLoaded: false
            }));
            node.childrenLoaded = true;
            
            this.updateTree();
            this.treeControl.expand(node);
            
            console.log('Children loaded successfully for:', node.filePath);
          }
          this.loadingNodes.delete(node.filePath);
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Error loading children:', error);
          this.loadingNodes.delete(node.filePath);
          node.childrenLoaded = false;
          this.cdr.markForCheck();
        }
      });
    }
  }

  hasChild = (_: number, node: FileNode): boolean => node.isDirectory;
  
  isLoading = (node: FileNode): boolean => this.loadingNodes.has(node.filePath);

  getNodeIcon(node: FileNode): string {
    if (this.isLoading(node)) return 'sync';
    if (node.isDirectory) return this.treeControl.isExpanded(node) ? 'folder_open' : 'folder';
    return 'insert_drive_file';
  }

  viewFileInfo(node: FileNode) {
    this.dialog.open(FileInfoDialogComponent, {
      width: '400px',
      data: node
    });
  }

  editFileContent(node: FileNode) {
    // Dosya düzenleme işlemi için
    console.log('Edit file:', node);
    // Burada dosya düzenleme component'ini açabilirsiniz
  }

  deleteFile(node: FileNode) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fileService.deleteFile(node.filePath).subscribe({
          next: () => {
            // Remove the node from its parent's children array
            const parent = this.findParentNode(this.dataSource.data, node);
            if (parent && parent.children) {
              parent.children = parent.children.filter(child => child.filePath !== node.filePath);
              this.updateTree();
            } else {
              // If it's a root node or parent has no children
              this.dataSource.data = this.dataSource.data.filter(item => item.filePath !== node.filePath);
            }
            this.cdr.markForCheck();
          },
          error: (error) => {
            console.error('Delete file error:', error);
            console.error('Error details:', {
              status: error.status,
              statusText: error.statusText,
              error: error.error,
              message: error.message
            });
          }
        });
      }
    });
  }

  createNewFile(node: FileNode) {
    const fileName = prompt('Yeni dosya adını giriniz (otomatik .txt eklenecektir):');
    if (fileName) {
      const fileNameWithExtension = fileName.toLowerCase().endsWith('.txt') ? fileName : `${fileName}.txt`;
      const filePath = `${node.filePath}\\${fileNameWithExtension}`;
      
      this.fileService.createFile(filePath).subscribe({
        next: (response) => {
          this.snackBar.open(response, 'Tamam', {
            duration: 3000
          }).afterDismissed().subscribe(() => {
            node.childrenLoaded = false; // Düğümün yükleme durumunu sıfırla
            this.loadChildren(node); // Düğümü yeniden yükle
          });
        },
        error: (error) => {
          this.snackBar.open('Dosya oluşturulurken hata oluştu', 'Tamam', {
            duration: 3000
          });
          console.error('Dosya oluşturma hatası:', error);
        }
      });
    }
  }

  private findParentNode(nodes: FileNode[], targetNode: FileNode): FileNode | null {
    for (const node of nodes) {
      if (node.children?.some(child => child.filePath === targetNode.filePath)) {
        return node;
      }
      if (node.children) {
        const found = this.findParentNode(node.children, targetNode);
        if (found) return found;
      }
    }
    return null;
  }
}
