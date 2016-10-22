import { Injectable } from '@angular/core';
import { ConfigurationService } from './config.service';
import { Authentication } from './configuration';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Output, EventEmitter } from '@angular/core';

let jwtDecode = require('jwt-decode');

const OAUTH_REFRESH_URL = '/refresh';
const OAUTH_GETTOKEN_URL = '/get_auth_token';
const PSERVER_AUTHCODE_URL = '/@oauthgetcode';
const PLONE_LOGIN_URL = '@login';
const PLONE_REFRESH_URL = '@refresh';


@Injectable()
export class AuthService {

  timerRefreshToken: any;
  auth: Authentication;
  @Output() loggedin = new EventEmitter();


  constructor(
    public http: Http,
    public config: ConfigurationService) {
      let local_auth = localStorage.getItem('plone_auth');
      if (local_auth) {
        this.auth = JSON.parse(local_auth);
      } else {
        this.auth = new Authentication();
      }
      this.loggedin.subscribe(
        data => this.saveUserToken(data.data, data.refresh)
      );
  }

  save_auth() {
    localStorage.setItem('plone_auth', JSON.stringify(this.auth));
  }

  // Oauth functions for plone.oauth

  call_oauth(password) {
    let endpoint = this.config.getURL(this.config.config) + PSERVER_AUTHCODE_URL +
      '?client_id=' + this.auth.client_id + '&scope=' + this.auth.scope;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.get(
      endpoint,
      {headers: headers}
    ).subscribe(
      res => this.call_real_oauth(res, password),
      err => console.log(err)
    );
  }

  call_real_oauth(response, password) {
    let endpoint = this.auth.oauth + OAUTH_GETTOKEN_URL;
    let body = JSON.stringify(
      {
        'grant_type': 'user',
        'client_id': this.auth.client_id,
        'code': response.json().auth_code,
        'username': this.auth.username,
        'password': password,
        'scopes': [this.auth.scope]
      }
    );
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let refresh = this.auth.oauth + OAUTH_REFRESH_URL;
    this.http.post(
      endpoint,
      body,
      {headers: headers}
    ).subscribe(
      res => this.saveUserToken(res, refresh),
      err => console.log(err)
    );
  }

  // Plone login endpoint
  login(user, pass) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let refresh = this.config.getURL(this.config.config) + '/' + PLONE_REFRESH_URL;
    let url = this.config.getURL(this.config.config) +  '/' + PLONE_LOGIN_URL;
    let model = {
      'username': user,
      'password': pass
    };
    let data = JSON.stringify(model);
    this.http.post(
      url,
      data,
      {headers: headers}
    )
    .subscribe(
      res => this.loggedin.emit({
        'data': res,
        'refresh': refresh}),
      err => console.log(err)
    );
  }

  // User token management

  saveUserToken(res, refresh) {
    this.auth.jwt = res;
    let decoded = jwtDecode(res._body);
    this.auth.token = decoded.token;
    let now = new Date().getTime();
    let timeout = decoded.exp * 1000 - now - 3600000;
    console.log('Refresh again in ' + timeout);
    this.save_auth();
    this.timerRefreshToken = Observable.timer(timeout);
    this.timerRefreshToken.subscribe(
      x => this.refreshToken(refresh)
    );
  }

  refreshToken(endpoint) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    let body = JSON.stringify(
      {
        'token': this.auth.token,
        'user': this.auth.username,
        'cliend_id': this.auth.client_id
      }
    );
    this.http.post(
      endpoint,
      body,
      {headers: headers}
    ).subscribe(
      res => this.saveUserToken(res, endpoint),
      err => console.log(err)
    );
  }

}
