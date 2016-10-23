
import {Component, ViewContainerRef, OnInit} from '@angular/core';
import {MdSnackBar, MdSnackBarConfig} from '@angular/material';
import {$WebSocket} from '@plone/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
      public snackBar: MdSnackBar,
      public viewContainerRef: ViewContainerRef,
      public ws: $WebSocket
  ) {}

  ngOnInit() {
    this.ws.getDataStream()
    .subscribe({
      next: (v) => this.announceText(v)
    });
  }
    announceText(message: string) {
      let config = new MdSnackBarConfig(this.viewContainerRef);
      this.snackBar.open(message, null, config);
    }
}
