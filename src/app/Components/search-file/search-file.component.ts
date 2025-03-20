import { Component } from '@angular/core';
import { FileService } from '../../Services/file.service';
import { FileNode } from '../../Models/FileNode';
import { SearchMethod } from '../../Models/SearchingMethod';
import { finalize } from 'rxjs/operators';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { PageEvent } from '@angular/material/paginator';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-search-file',
  templateUrl: './search-file.component.html',
  styleUrls: ['./search-file.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'tr-TR' }
  ]
})
export class SearchFileComponent {
  selectedSearchMethod: string = 'fileName';
  searchText: string = '';
  searchDate: Date | null = null;
  allSearchResults: FileNode[] = [];
  searchResults: FileNode[] = [];
  hasSearched: boolean = false;
  isLoading: boolean = false;

  // Pagination için yeni değişkenler
  pageSize = 10;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 50];
  totalResults = 0;

  constructor(private fileService: FileService) {}

  onSearchMethodChange() {
    this.searchText = '';
    this.searchDate = null;
    this.searchResults = [];
    this.allSearchResults = [];
    this.hasSearched = false;
    this.currentPage = 0;
    this.totalResults = 0;
  }

  private convertToFileNode(filePath: string): FileNode {
    const name = filePath.split('\\').pop() || '';
    return {
      name: name,
      filePath: filePath,
      isDirectory: false,
      hasChildren: false,
      type: name.split('.').pop() || ''
    };
  }

  // Pagination için sayfa değişikliği eventi
  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedResults();
  }

  // Görüntülenen sonuçları güncelle
  private updateDisplayedResults() {
    const startIndex = this.currentPage * this.pageSize;
    this.searchResults = this.allSearchResults.slice(startIndex, startIndex + this.pageSize);
  }

  search() {
    this.hasSearched = true;
    this.isLoading = true;
    this.searchResults = [];
    this.allSearchResults = [];
    this.currentPage = 0;
    
    switch (this.selectedSearchMethod) {
      case 'fileName':
        if (this.searchText) {
          console.log('Searching by filename:', this.searchText);
          this.fileService.searchFilesByFileName(this.searchText)
            .pipe(finalize(() => {
              this.isLoading = false;
              this.updateDisplayedResults();
            }))
            .subscribe(results => {
              console.log('Raw search results:', results);
              if (Array.isArray(results)) {
                this.allSearchResults = results.map(filePath => this.convertToFileNode(filePath));
                this.totalResults = this.allSearchResults.length;
                console.log('Converted results:', this.allSearchResults);
                this.updateDisplayedResults();
              }
            });
        } else {
          this.isLoading = false;
        }
        break;

      case 'fileType':
        if (this.searchText) {
          this.fileService.searchFilesByType(this.searchText)
            .pipe(finalize(() => {
              this.isLoading = false;
              this.updateDisplayedResults();
            }))
            .subscribe(results => {
              if (Array.isArray(results)) {
                this.allSearchResults = results.map(filePath => this.convertToFileNode(filePath));
                this.totalResults = this.allSearchResults.length;
                this.updateDisplayedResults();
              }
            });
        } else {
          this.isLoading = false;
        }
        break;

      case 'date':
        if (this.searchDate) {
          this.fileService.searchFilesByDate(this.searchDate)
            .pipe(finalize(() => {
              this.isLoading = false;
              this.updateDisplayedResults();
            }))
            .subscribe(results => {
              console.log(this.searchDate)
              if (Array.isArray(results)) {
                this.allSearchResults = results.map(filePath => this.convertToFileNode(filePath));
                this.totalResults = this.allSearchResults.length;
                this.updateDisplayedResults();
              }
            });
        } else {
          this.isLoading = false;
        }
        break;
    }
  }
}
