import { Injectable } from '@angular/core';
import { Configuration } from './configuration';
import { Authentication } from './configuration';
import { Http, Headers } from '@angular/http';
let jwtDecode = require('jwt-decode');
import { Observable } from 'rxjs/Rx';

const OAUTH_REFRESH_URL = '/refresh';
const OAUTH_GETTOKEN_URL = '/get_auth_token';
const PSERVER_AUTHCODE_URL = '/@oauthgetcode';


@Injectable()
export class ConfigurationService {

  config: Configuration;
  auth: Authentication;
  timerRefreshToken: any;


  constructor(public http: Http) {
    let local = localStorage.getItem('plone_manager_config');
    if (local) {
      this.config = JSON.parse(local);
    } else {
      this.config = new Configuration(false, '127.0.0.1', 'zodb1', 'plone', '8080', 'plone.server');
    }
    let local_auth = localStorage.getItem('plone_manager_auth');
    if (local_auth) {
      this.auth = JSON.parse(local_auth);
    } else {
      this.auth = new Authentication();
    }
  }

  getURL(config: Configuration, without_site?: boolean) {
    let url = '';
    if (config.https) {
      url = 'https://';
    } else {
      url = 'http://';
    }
    url = url + config.ip + ':' + config.port + '/' + config.zodb;
    if (!without_site) {
      url += '/' + config.site;
    }
    return url;
  }

  save_config() {
    localStorage.setItem('plone_manager_config', JSON.stringify(this.config));
  }
  save_auth() {
    localStorage.setItem('plone_manager_auth', JSON.stringify(this.auth));
  }

  call_oauth(password) {
    let endpoint = this.getURL(this.config) + PSERVER_AUTHCODE_URL + '?client_id=' + this.auth.client_id + '&scope=' + this.auth.scope;
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
    this.http.post(
      endpoint,
      body,
      {headers: headers}
    ).subscribe(
      res => this.saveUserToken(res),
      err => console.log(err)
    );
  }

  saveUserToken(res) {
    this.auth.jwt = res;
    let decoded = jwtDecode(res._body);
    this.auth.token = decoded.token;
    let now = new Date().getTime();
    let timeout = decoded.exp * 1000 - now - 3600000;
    console.log('Refresh again in ' + timeout);
    this.save_auth();
    this.timerRefreshToken = Observable.timer(timeout - 3600000);
    this.timerRefreshToken.subscribe(
      x => this.refreshToken()
    );
  }

  refreshToken() {
    let endpoint = this.auth.oauth + OAUTH_REFRESH_URL;
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
      res => this.saveUserToken(res),
      err => console.log(err)
    );
  }
}
