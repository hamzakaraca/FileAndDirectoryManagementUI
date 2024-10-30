import { Component, Injectable, Input, OnInit } from '@angular/core';
import { FlatTreeControl, NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { FileNode } from 'src/app/Models/FileNode';
import { FileTreeService } from 'src/app/Services/file.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, map, merge, Observable } from 'rxjs';
import { CollectionViewer, DataSource, SelectionChange } from '@angular/cdk/collections';

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.css']
})
export class FileTreeComponent implements OnInit {
  @Input() files: FileNode[] = [];

  treeControl = new NestedTreeControl<FileNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FileNode>();

  constructor(private fileService: FileTreeService) {}

  ngOnInit(): void {
    this.GetFileTree();
  }

  GetFileTree() {
    this.fileService.getFileTree().subscribe(value => {
      this.files = value;
      this.dataSource.data = this.files;
      console.log(value);
    });
  }

  hasChild = (_: number, node: FileNode) => !!node.children && node.children.length > 0;

  
}

@Injectable({ providedIn: 'root' })
export class DynamicDatabase {
  constructor(private http: HttpClient) {}

  // API'den veri al
  fetchData(): Observable<any> {
    return this.http.get('API_URL');  // Burada kendi API URL'inizi kullanın
  }

  /** Veriyi düğümler şeklinde hazırlama */
  prepareTreeData(apiResponse: any): DynamicFlatNode[] {
    const rootNodes: any[] = apiResponse;  // API'den gelen kök dizinler (D1, C1)
    return rootNodes.map((node: any) => this.createNode(node, 0));
  }

  // Gelen veriyi DynamicFlatNode yapısına dönüştür
  private createNode(node: any, level: number): DynamicFlatNode {
    const flatNode = new DynamicFlatNode(node.Name, level, node.IsDirectory, node.isLoading=true);
    flatNode.children = node.Children ? node.Children.map((child: any) => this.createNode(child, level + 1)) : [];
    return flatNode;
  }
}

export class DynamicDataSource implements DataSource<DynamicFlatNode> {
  dataChange = new BehaviorSubject<DynamicFlatNode[]>([]);
  data:any
  constructor(
    private _treeControl: FlatTreeControl<DynamicFlatNode>,
    private _database: DynamicDatabase,
  ) {
    this.loadInitialData();
  }

  /** API'den veriyi al ve ağaç yapısına yükle */
  loadInitialData() {
    this._database.fetchData().subscribe(apiResponse => {
      const initialData = this._database.prepareTreeData(apiResponse);
      this.data = initialData;
    });
  }

  connect(collectionViewer: CollectionViewer): Observable<DynamicFlatNode[]> {
    this._treeControl.expansionModel.changed.subscribe(change => {
      if ((change as SelectionChange<DynamicFlatNode>).added || (change as SelectionChange<DynamicFlatNode>).removed) {
        this.handleTreeControl(change as SelectionChange<DynamicFlatNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  disconnect(collectionViewer: CollectionViewer): void {}

  /** Düğüm açma/kapama işlemleri */
  handleTreeControl(change: SelectionChange<DynamicFlatNode>) {
    if (change.added) {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed) {
      change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
    }
  }

  toggleNode(node: DynamicFlatNode, expand: boolean) {
    const children = node.children;
    const index = this.data.indexOf(node);

    if (!children || index < 0) {
      return;
    }

    node.isLoading=true;

    setTimeout(() => {
      if (expand) {
        this.data.splice(index + 1, 0, ...children);
      } else {
        let count = 0;
        for (let i = index + 1; i < this.data.length && this.data[i].level > node.level; i++, count++) {}
        this.data.splice(index + 1, count);
      }

      this.dataChange.next(this.data);
      node.isLoading=false
    }, 500);
  }
}
/** Flat node with expandable and level information */
/** Flat node with expandable and level information */
export class DynamicFlatNode {
  constructor(
    public item: string,
    public level = 1,
    public expandable = false,
    public isLoading: boolean = false,
    public children: DynamicFlatNode[] = []
  ) {}
}


