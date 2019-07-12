import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PostRoutingModule } from './post-routing.module';
import { AddNewPostComponent } from './components/add-new-post/add-new-post.component';
import { AllPostsComponent } from './components/all-posts/all-posts.component';
import {
  MatCardModule, MatFormFieldModule, MatInputModule,
  MatCheckboxModule, MatChipsModule, MatIconModule, MatButtonModule,
  MatExpansionModule, MatTableModule, MatPaginatorModule, MatDialogModule,
  MatSelectModule
} from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddPostCatDialogComponent } from './dialogs/add-post-cat-dialog/add-post-cat-dialog.component';
import { ManagePostCategoryComponent } from './components/manage-post-category/manage-post-category.component';
import { CdkColumnDef } from '@angular/cdk/table';
import { SharedModule } from 'src/app/modules/shared/shared.module';
@NgModule({
  declarations: [
    AddNewPostComponent,
    AllPostsComponent,
    AddPostCatDialogComponent,
    ManagePostCategoryComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    PostRoutingModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    SharedModule
  ],
  entryComponents: [AddPostCatDialogComponent],
  providers: [CdkColumnDef]
})
export class PostModule { }
