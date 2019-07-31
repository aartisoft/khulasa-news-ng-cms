import { Component, OnInit } from '@angular/core';
import { MenuService } from 'src/app/service/menu/menu.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuModel, MenuItemModel } from 'src/app/model/menu.model';
import { PostService } from 'src/app/service/post/post.service';
import { PostCategoryModel } from 'src/app/model/post-category.model';
import { PostModel } from 'src/app/model/post.model';
import { MatCheckboxChange, MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MenuItemTypeEnum } from 'src/app/enum/menu-item-type.enum';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-add-menu',
  templateUrl: './add-menu.component.html',
  styleUrls: ['./add-menu.component.scss']
})
export class AddMenuComponent implements OnInit {
  public menuId: number = null;
  public errMsg: string = '';
  public menu: MenuModel = null;
  public menuForm: FormGroup;
  public showLoader: boolean = true;
  // public categoryList: PostCategoryModel[] = [];
  // public postList: PostModel[] = [];

  constructor(
    private menuSerive: MenuService,
    private activatedRoute: ActivatedRoute,
    private postSerive: PostService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.menuId = parseInt(this.activatedRoute.snapshot.paramMap.get("id"));
    if (this.menuId) {
      this.getMenuById();
    }

  }


  drop(event: CdkDragDrop<string[]>) {
    console.log(event.currentIndex, event.previousIndex);
  }

  categorydisplayedColumns: string[] = ['select', 'category-name'];
  categoryList = new MatTableDataSource<PostCategoryModel>();
  categorySelection = new SelectionModel<PostCategoryModel>(true, []);

  postdisplayedColumns: string[] = ['select', 'post-title'];
  postList = new MatTableDataSource<PostModel>();
  postSelection = new SelectionModel<PostModel>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedCategoty() {
    const numSelected = this.categorySelection.selected.length;
    const numRows = this.categoryList.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggleCategory() {
    this.isAllSelectedCategoty() ?
      this.categorySelection.clear() :
      this.categoryList.data.forEach(row => this.categorySelection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabelCategory(row?: PostCategoryModel): string {
    if (!row) {
      return `${this.isAllSelectedCategoty() ? 'select' : 'deselect'} all`;
    }
    return `${this.categorySelection.isSelected(row) ? 'deselect' : 'select'} row ${row.categoryName + 1}`;
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelectedPost() {
    const numSelected = this.postSelection.selected.length;
    const numRows = this.postList.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterTogglePost() {
    this.isAllSelectedPost() ?
      this.postSelection.clear() :
      this.postList.data.forEach(row => this.postSelection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabelPost(row?: PostModel): string {
    if (!row) {
      return `${this.isAllSelectedPost() ? 'select' : 'deselect'} all`;
    }
    return `${this.postSelection.isSelected(row) ? 'deselect' : 'select'} row ${row.title + 1}`;
  }





  public addCategoryToMenu() {
    let categoryName: string[] = this.categorySelection.selected.map(cat => cat.categoryName);
    let categoryId: number[] = this.categorySelection.selected.map(cat => cat.categoryId);
    this.categorySelection.clear();
    let menuItem = this.menuForm.controls.menuItems;
    let menuItemList: MenuItemModel[] = []
    for (let i = 0; i < categoryName.length; i++) {
      let item: MenuItemModel = new MenuItemModel();
      item.itemName = categoryName[i];
      item.itemType = MenuItemTypeEnum.Category;
      item.itemUrl = categoryId[i].toString();
      item.target = "_blank";
      item.position = i;
      menuItemList.push(item)
      this.menu.menuItems.push(item)
    }
    menuItem.setValue(this.menu.menuItems);

    // console.log(this.menuForm.get('menuItemList').value)

  }


  public addPostToMenu() {
    let title: string[] = this.postSelection.selected.map(post => post.title);
    console.log(title)
    this.postSelection.clear();
  }

  public getMenuById() {
    this.menuSerive.getMenu(this.menuId)
      .then(data => {
        this.setMenu(data);
        this.menu = data
      })
      .catch(err => {
        this.errMsg = err
      })
  }

  public getCategory() {
    this.postSerive.getPostCategories()
      .then(cat => {
        this.categoryList = new MatTableDataSource<PostCategoryModel>(cat);
      })
      .catch(err => {
        this.errMsg = err;
      })
  }


  public getPost() {
    this.postSerive.getAllPosts()
      .then(data => {
        this.postList = new MatTableDataSource<PostModel>(data);
      })
      .catch(err => {
        this.errMsg = err;
      })
  }

  private createMenuForm() {
    return this.fb.group({
      menuId: "",
      menuName: ["", Validators.required],
      menuItems: ""
    })
  }

  private setMenu(menu: MenuModel) {
    this.menuForm.patchValue({
      menuId: menu.menuId,
      menuName: menu.menuName
    })

  }



  public onSubmit() {
    if (this.menuForm.valid) {
      if (this.menuId) {
        let item = this.menuForm.get('menuItems').value;
        this.menuSerive.addMenuItemByMenuId(this.menuId, item)
          .then(data => {
            console.log(data)
          })
          .catch(err => this.errMsg = err)
      }
      else {
        alert('hi')
        this.menuSerive.addNewMenu(this.menuForm.get('menuName').value)
          .then(data => {

            this.router.navigateByUrl('/menu/edit' + "/" + data.menuId);
            console.log(data);
          })
          .catch(err => { this.errMsg = err });
      }
    }

    console.log(this.menuForm.value);
  }


  // public setCategory($event: MatCheckboxChange, catg: PostCategoryModel) {

  //   if ($event.checked) {

  //   }
  // }
  // public setPost($event: MatCheckboxChange, post: PostModel) {

  //   if ($event.checked) {
  //   }
  // }



  ngOnInit() {
    this.menuForm = this.createMenuForm();
    this.getCategory();
    this.getPost();
    setTimeout(() => {
      this.showLoader = false;
    }, 1000);
  }



}
