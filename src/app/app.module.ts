// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { FileTreeComponent } from './Components/file-tree/file-tree.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FileEditComponent } from './Components/file-edit/file-edit.component';
import { DeleteConfirmationDialogComponent } from './Components/delete-confirmation-dialog/delete-confirmation-dialog.component';
import { MatSelectModule } from '@angular/material/select';

import { SearchFileComponent } from './Components/search-file/search-file.component';

@NgModule({
  declarations: [
    AppComponent,
    FileTreeComponent,
    FileEditComponent,
    DeleteConfirmationDialogComponent,
    SearchFileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatTreeModule,
    MatIconModule,
    MatCheckboxModule,
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatProgressSpinnerModule, 
    MatDialogModule, 
    MatButtonModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
