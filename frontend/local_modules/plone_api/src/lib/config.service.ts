import { Injectable, Inject } from '@angular/core';
import { Configuration } from './configuration';
import { Http } from '@angular/http';

@Injectable()
export class ConfigurationService {

  config: Configuration;
  timerRefreshToken: any;


  constructor(
      public http: Http,
      @Inject('api.config') private apiConfig: Configuration) {
    let local = localStorage.getItem('plone_config');
    if (local) {
      this.config = JSON.parse(local);
    } else {
      if (apiConfig) {
        this.config = apiConfig;
      } else {
        this.config = new Configuration(false, '127.0.0.1', 'plone', '8080', 'plone.server', 'zodb1');
      }
    }
  }

  getWSURL(config: Configuration, without_site?: boolean) {
    let url = '';
    if (config.https) {
      url = 'wss://';
    } else {
      url = 'ws://';
    }
    url = url + config.ip + ':' + config.port + '/' + config.zodb;
    if (!without_site) {
      url += '/' + config.site;
    }
    return url;
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
