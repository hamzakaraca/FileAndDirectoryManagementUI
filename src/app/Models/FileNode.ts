export interface FileNode {
  name: string;
  isDirectory: boolean;
  size?: number;
  hasChildren: boolean;
  children?: FileNode[];
  filePath: string;
  level?: number;
  expandable?: boolean;
  childrenLoaded?: boolean;  // Lazy loading kontrolü için eklendi
  
  // Yeni özellikler
  createdDate?: Date;
  modifiedDate?: Date;
  extension?: string;
  permissions?: string;
  isHidden?: boolean;
  parent?: string;
  type?: string;
}

