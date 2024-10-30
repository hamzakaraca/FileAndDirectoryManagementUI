export interface FlatNode {
  expandable: boolean;
  name: string;
  level: number;
  isDirectory: boolean;
  size?: number;
  filePath:string
}
  