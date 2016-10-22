import { Component, OnInit } from '@angular/core';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';
import { CreationComponent } from '../creation/creation.component';
import {ViewContainerRef} from '@angular/core';
import { PloneapiService } from '@plone/api';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  blogPosts: any;
  dialogRef: MdDialogRef<CreationComponent>;
  current_path: string = '/';


  constructor(
      public api: PloneapiService,
      public dialog: MdDialog,
      public viewContainerRef: ViewContainerRef) {
    this.blogPosts = [];
  }

  ngOnInit() {
    this.load(this.current_path);
  }

  createBlog() {
    let content_type = 'Blog';
    this.api.getSchema(content_type)
    .subscribe(
      res => this.callDialog(res.json(), content_type),
      err => console.log(err)
    );

  }


    load(id) {
      this.current_path = id;
      this.api.getObject(this.current_path)
      .subscribe(
        res => this.blogPosts = res.json().items,
        err => console.log(err)
      );
    }

  callDialog(schema, content) {
    let config = new MdDialogConfig();
    config.viewContainerRef = this.viewContainerRef;

    schema.buttons = [
      {
        id: 'save', label: 'Save'
      },
      {
        id: 'cancel', label: 'Cancel'
      }
    ];
    let self = this;
    this.dialogRef = this.dialog.open(CreationComponent, config);
    this.dialogRef.componentInstance.schema = schema;
    this.dialogRef.afterClosed().subscribe(result => {
      self.api.createObject(this.current_path, content, result.value)
      .subscribe(
        res => this.load(this.current_path),
        err => console.log(err)
      );
      self.dialogRef = undefined;
    });

  }

}
