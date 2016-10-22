import { Component, OnInit } from '@angular/core';
import {MdDialog, MdDialogConfig, MdDialogRef} from '@angular/material';


@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.css']
})
export class CreationComponent implements OnInit {

  public typeDocument: string;
  public schema: any = {};
  private actions: any = {};
  private model: any;

  constructor(public dialogRef: MdDialogRef<CreationComponent>) {
  }

  ngOnInit() {
    this.actions = {
      save: this.onSave.bind(this),
      cancel: this.onCancel.bind(this)
    };
  }

  onCancel(schemaForm) {
    this.dialogRef.close(undefined);
  }

  onSave(schemaForm) {
    // add or remove category
    this.dialogRef.close(schemaForm);
  }
}
