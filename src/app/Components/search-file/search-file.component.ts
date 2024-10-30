import { Component } from '@angular/core';
import { FileTreeComponent } from '../file-tree/file-tree.component';
import { FileTreeService } from 'src/app/Services/file.service';
import { SearchingMethod } from 'src/app/Models/SearchingMethod';

@Component({
  selector: 'app-search-file',
  templateUrl: './search-file.component.html',
  styleUrls: ['./search-file.component.css']
})
export class SearchFileComponent {
  searchingType:string;
  fileName:string
  filePath:string[]=[];

  /**
   *
   */
  constructor(private fileTreeService:FileTreeService) {  
  }
  checkDurum(searchingType: string) {
    switch (searchingType) {
      case "SearchByFileName":
        this.fileTreeService.searchByFileName(this.fileName)
        console.log(searchingType)
        break;
      case "ikinci":
        console.log("İkinci durum seçildi.");
        break;
      case "üçüncü":
        console.log("Üçüncü durum seçildi.");
        break;
    }
  }
  
  searchingMethods: SearchingMethod[] = [
    { value: 'SearchByFileName', viewValue: 'Search With File Name' },
    { value: '.pdf', viewValue: 'PDF File' }
  ];
}
