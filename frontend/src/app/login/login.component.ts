import { Component, OnInit } from '@angular/core';
import { PloneapiService } from '@plone/api';
import { ConfigurationService } from '@plone/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(
    public config: ConfigurationService,
    public api: PloneapiService) { }

  ngOnInit() {
  }

  login() {
    let refresh = this.config.getURL(this.config.config) + '/@refresh';
    this.api.login(this.username, this.password)
    .subscribe(
      res => this.config.saveUserToken(res, refresh),
      err => console.log(err)
    );
  }

}
