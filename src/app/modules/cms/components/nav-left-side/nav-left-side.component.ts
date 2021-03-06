import { Component, OnInit } from '@angular/core';
import { AdminMenu, AdminMenuItem } from 'src/app/model/admin-menu.model';

@Component({
  selector: 'app-nav-left-side',
  templateUrl: './nav-left-side.component.html',
  styleUrls: ['./nav-left-side.component.css']
})
export class NavLeftSideComponent implements OnInit {

  public menuList: AdminMenu[] = [];


  constructor() {
    this.insertMenuItems();
  }

  ngOnInit() {
  }

  /**
   * Insert menu items in menu list
   */
  public insertMenuItems(): void {

    const baseFolder = '/';

    this.menuList.push(...[
      new AdminMenu('Post', [
        new AdminMenuItem('Add New Post', baseFolder + 'post/add-new'),
        new AdminMenuItem('All Posts', baseFolder + 'post/all-news'),
        new AdminMenuItem('All Trash Posts', baseFolder + 'post/all-trash'),
        new AdminMenuItem('Manage Post Categories', baseFolder + 'post/manage-categories'),
      ]),
      new AdminMenu('Menu', [
        new AdminMenuItem('Add New Menu', baseFolder + 'menu/add-new-menu'),
        new AdminMenuItem('All Menu', baseFolder + 'menu/all-menu'),

      ]),
      new AdminMenu('Media', [
        new AdminMenuItem('Add new', baseFolder + 'media/add-new'),
        new AdminMenuItem('All Media', baseFolder + 'media/all-media')
      ]),
      new AdminMenu('User Accounts', [
        new AdminMenuItem('Add new', baseFolder + 'user-account/add-new'),
        new AdminMenuItem('All Users', baseFolder + 'user-account')
      ]),
    ]);
  }
}
