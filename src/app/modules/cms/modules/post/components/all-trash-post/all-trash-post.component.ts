import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { PostService } from 'src/app/service/post/post.service';
import { PostModel } from 'src/app/model/post.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material';
import { PostStatusEnum } from 'src/app/enum/post-status.enum';

@Component({
  selector: 'app-all-trash-post',
  templateUrl: './all-trash-post.component.html',
  styleUrls: ['./all-trash-post.component.scss']
})

export class AllTrashPostComponent implements OnInit {

  public status;
  public showLoader: boolean = true;
  displayedColumns: string[] = ['select', 'title', 'status', 'date', 'author'];
  dataSource: MatTableDataSource<PostModel>;
  selection = new SelectionModel<PostModel>(true, []);

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public tableLength: number;
  public pageSize: number = 10;
  public pageEvent: PageEvent;
  public isFilter: boolean = false;
  public index: number = 0
  constructor(private postService: PostService, private _snackBar: MatSnackBar) {
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PostModel): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.postId}`;
  }


  private getPostCount() {
    this.postService.getPostCount(PostStatusEnum.Trash)
      .then(count => this.tableLength = count)
      .catch(err => console.log(err))
  }

  public getCheckBoxId(): number[] {
    let postId: number[] = this.selection.selected.map(a => a.postId);
    return postId
  }

  public emptyTrash() {
    this.showLoader = true
    let isEmptyTrash = confirm('Are you sure delete all trashed posts ?')
    if (isEmptyTrash) {
      this.postService.deleteTrashPost()
        .then(msg => {
          this._snackBar.open(msg, 'Done', {
            duration: 2000,
          });
          this.getTrashPost()

        })
        .catch(err => console.log(err))
    }
  }

  public getTrashPost() {
    this.postService.getAllPosts(10, 0, null, null, PostStatusEnum.Trash)
      .then(res => {
        this.showLoader = false
        console.log(res)
        this.dataSource = new MatTableDataSource<PostModel>(res);
        this.getPostCount();
      })
      .catch(err => { console.log(err) }
      ).finally(() => { this.showLoader = false })
  }

  public paging(pageEvent) {

    let start = (pageEvent.pageIndex * 10)
    this.postService.getAllPosts(10, start, null, null, PostStatusEnum.Trash)
      .then(res => {
        this.dataSource = null;
        this.dataSource = new MatTableDataSource<PostModel>(res);
      })
      .catch(err => {
        alert(err);
      })
  }

  public applyAction() {
    this.showLoader = true
    if (this.status === 'draft') {
      this.changePostStatus(this.status, this.getCheckBoxId());
    }
    else if (this.status === 'published') {
      this.changePostStatus(this.status, this.getCheckBoxId());
    }
    else if (this.status === 'scheduled') {
      this.changePostStatus(this.status, this.getCheckBoxId());
    }
    else {
      let postId = this.getCheckBoxId()
      this.postService.deleteTrashPost(postId)
        .then(msg => {
          this.showLoader = false
          this._snackBar.open(msg, 'Done', {
            duration: 2000,
          });
          this.selection.clear()
          this.getTrashPost()
        })
        .catch(err => {
          console.log(err)
        })
    }

  }

  public changePostStatus(status, postId) {
    this.postService.changePostStatus(postId, status)
      .then(msg => {
        this.showLoader = false
        this._snackBar.open(msg, 'Done', {
          duration: 2000,
        });
        this.selection.clear()
        this.getTrashPost();
      })
      .catch(err => {
        console.log(err)
      })

  }

  ngOnInit() {
    this.getTrashPost();
  }

}



