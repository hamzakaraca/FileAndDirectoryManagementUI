// file-tree.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { FileEditModel } from '../Models/FileEdit';

@Injectable({
  providedIn: 'root'
})
export class FileTreeService {
  private apiUrl = 'http://localhost:5062/api/File/'; // Backend API URL'n

  fileEditModel:FileEditModel = new FileEditModel()

  constructor(private http: HttpClient) {}

  getFileTree(): Observable<any> {
    return this.http.get(this.apiUrl+"GetFileTree");
    
  }
  deleteFile(filePath: string): Observable<any> {
  if (!filePath) {
    console.error('Dosya yolu bulunamadı');
    return throwError('Dosya yolu bulunamadı'); // Hata fırlat
  }
  
  return this.http.delete<any>(`${this.apiUrl}DeleteFile`, { params: { filePath: filePath } });
}

  
  createFile(filePath: string, content: string): Observable<any> {
    let body = {}
    return this.http.post(`${this.apiUrl}CreateFile`,body, {params :{filePath:filePath,content:content}});
  }
  
  readFile(filePath: string) {
    return this.http.get(this.apiUrl + "ReadFile", {
      responseType: 'text', 
      params: { filePath: filePath }
    });
  }
  writeFile(){
    let body={}
   return this.http.post(this.apiUrl+"WriteFile",body,{params:{filepath:this.fileEditModel.filePath,content:this.fileEditModel.fileContent}})
  }
  
  searchByFileName(fileName:string){
    
    return this.http.post(this.apiUrl+"SearchByFileName",{},{params:{fileName:fileName}})
  }
}
