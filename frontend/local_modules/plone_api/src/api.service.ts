import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { ConfigurationService } from './auth.service';

const REGISTRY_ENDPOINT = '@registry';
const TYPES_ENDPOINT = '@types';
const SHARING_ENTRYPOINT = '@sharing';

@Injectable()
export class PloneapiService {

  constructor(public http: Http, public config: ConfigurationService) { }

  base_url() {
    return this.config.getURL(this.config.config);
  }

  base_db_url() {
    return this.config.getURL(this.config.config, true);
  }

  createAuthHeaders(headers: Headers) {
    let auth_header = '';
    if (this.config.auth.type === 'Basic') {
      auth_header = 'Basic ' + this.config.auth.token;
    }
    if (this.config.auth.type === 'Bearer') {
      auth_header = 'Bearer ' + this.config.auth.jwt;
    }
    if (auth_header) {
      headers.append('Authorization', auth_header);
    }
    headers.append('Content-Type', 'application/json');
  }

  get(url) {
    let headers = new Headers();
    this.createAuthHeaders(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  post(url, data) {
    let headers = new Headers();
    this.createAuthHeaders(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }

  getObject(curr_path: string) {
    let url = '';
    if (curr_path.startsWith('http')) {
      url = curr_path;
    } else {
      url = this.base_url() + curr_path;
    }
    return this.get(url);
  }

  getSites() {
    let url = this.base_db_url();
    return this.get(url);
  }

  createSite(name: string, id: string) {
    let url = this.base_db_url();
    let data = JSON.stringify({
      '@type': 'Plone Site',
      'title': name,
      'id': id
    });
    return this.post(url, data);
  }

  createObject(current_path: string, type: string, model: any) {
    let url = '';
    if (current_path.startsWith('http')) {
      url = current_path;
    } else {
      url = this.base_url() + current_path;
    }
    // let data = JSON.stringify({
    //   '@type': type,
    //   'title': name,
    //   'id': id
    // });
    model['@type'] = type;
    let data = JSON.stringify(model);
    return this.post(url, data);
  }

  getSharing(curr_path: string) {
    let url = '';
    if (curr_path.startsWith('http')) {
      url = curr_path;
    } else {
      url = this.base_url() + curr_path;
    }
    url = url + '/' + SHARING_ENTRYPOINT;
    return this.get(url);
  }

  getRegistry() {
    let url = this.base_url() + '/' + REGISTRY_ENDPOINT;
    return this.get(url);
  }

  getTypes() {
    let url = this.base_url() + '/' + TYPES_ENDPOINT;
    return this.get(url);
  }

  getSchema(type) {
    let url = this.base_url() + '/' + TYPES_ENDPOINT + '/' + type;
    return this.get(url);
  }

}
