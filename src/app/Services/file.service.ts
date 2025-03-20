import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { FileNode } from '../Models/FileNode';
import { FileEdit } from '../Models/FileEdit';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiUrl = 'http://localhost:5062/api/File';
  
  constructor(private http: HttpClient) {}

  // Mevcut metodlar
  getRootDrives(): Observable<FileNode[]> {
    return this.http.get<FileNode[]>(`${this.apiUrl}/root`);
  }

  getFiles(path: string): Observable<{ result: FileNode[] }> {
    return this.http.get<{ result: FileNode[] }>(
      `${this.apiUrl}/LoadChildren?path=${encodeURIComponent(path)}`
    );
  }

  // Yeni metodlar
  createDirectory(path: string, directoryName: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateDirectory`, {
      path: path,
      directoryName: directoryName
    });
  }

  deleteFile(path: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteFile?filePath=${encodeURIComponent(path)}`, {
      responseType: 'text'
    });
  }

  readFile(path: string): Observable<string> {
    return this.http.get<string>(`${this.apiUrl}/readFile?path=${encodeURIComponent(path)}`);
  }

  writeFile(filePath:string,content:string): Observable<any> {
    const params = new HttpParams()
      .set('filePath', filePath)
      .set('content', content);
    return this.http.post(`${this.apiUrl}/writeFile`, {params});
    
  }

  createFile(path: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateFile?filepath=${encodeURIComponent(path)}`, {}, {
      responseType: 'text'
    });
  }
  

  copyFile(sourcePath: string, destinationPath: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/CopyFile`, {
      sourcePath: sourcePath,
      destinationPath: destinationPath
    });
  }

  searchFiles(searchTerm: string, searchPath: string): Observable<FileNode[]> {
    const params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('searchPath', searchPath);
      
    return this.http.get<FileNode[]>(`${this.apiUrl}/Search`, { params });
  }

  searchFilesByFileName(fileName: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/SearchFilesByFileName?fileName=${encodeURIComponent(fileName)}`);
  }

  searchFilesByType(fileType: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/SearchFilesByFileType?fileType=${encodeURIComponent(fileType)}`);
  }

  searchFilesByDate(date: Date): Observable<string[]> {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;
    console.log('Formatted date:', formattedDate);
    return this.http.get<string[]>(`${this.apiUrl}/SearchFilesByCreationDate?creationDate=${formattedDate}`);
  }
  
}
