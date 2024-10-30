export interface FileNode {
  name: string;
  isDirectory: boolean;
  size?: number;
  children?: FileNode[];
  filePath:string
}

