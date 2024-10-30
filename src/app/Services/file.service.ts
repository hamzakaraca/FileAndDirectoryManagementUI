// file-tree.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileTreeService {
  private apiUrl = 'http://localhost:5062/api/File/'; // Backend API URL'n

  constructor(private http: HttpClient) {}

  getFileTree(): Observable<any> {
    return this.http.get(this.apiUrl+"GetFileTree");
    
  }
  deleteFile(filePath:string){
    return this.http.post(this.apiUrl+"DeleteFile",filePath)
  }
}
