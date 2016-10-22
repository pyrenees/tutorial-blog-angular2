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
  timerRefreshToken: any;


  constructor(public http: Http) {
    let local = localStorage.getItem('plone_config');
    if (local) {
      this.config = JSON.parse(local);
    } else {
      this.config = new Configuration(false, '127.0.0.1', 'zodb1', 'plone', '8080', 'plone.server');
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
    localStorage.setItem('plone_config', JSON.stringify(this.config));
  }

}
