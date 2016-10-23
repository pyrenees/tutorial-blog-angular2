import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { ConfigurationService } from './config.service';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs/observable';

const REGISTRY_ENDPOINT = '@registry';
const TYPES_ENDPOINT = '@types';
const SHARING_ENTRYPOINT = '@sharing';


@Injectable()
export class PloneapiService {

  constructor(public http: Http, public config: ConfigurationService, public auth: AuthService) { }

  base_url() {
    // Get the base url of the plone site we have configuration
    return this.config.getURL(this.config.config);
  }

  base_db_url() {
    // Get the base url of the zodb we have configuration
    return this.config.getURL(this.config.config, true);
  }

  createAuthHeaders(headers: Headers) {
    // Add the auth headers
    let auth_header = '';
    if (this.auth.auth.type === 'Basic') {
      auth_header = 'Basic ' + this.auth.auth.token;
    }
    if (this.auth.auth.type === 'Bearer') {
      auth_header = 'Bearer ' + this.auth.auth.jwt;
    }
    if (auth_header) {
      headers.append('Authorization', auth_header);
    }
    headers.append('Content-Type', 'application/json');
  }

  get(url) {
    // do a get request to plone
    let headers = new Headers();
    this.createAuthHeaders(headers);
    return this.http.get(url, {
      headers: headers
    });
  }

  post(url, data) {
    // do a post request to plone
    let headers = new Headers();
    this.createAuthHeaders(headers);
    return this.http.post(url, data, {
      headers: headers
    });
  }

  head(url) {
    let headers = new Headers();
    this.createAuthHeaders(headers);
    return this.http.head(url, {
      headers: headers
    });
  }

  getObject(curr_path: string): Observable<Response> {
    // get the object with a path that can be relative to site or full
    let url = '';
    if (curr_path.startsWith('http')) {
      url = curr_path;
    } else {
      url = this.base_url() + curr_path;
    }
    return this.get(url);
  }

  getSites() {
    // get all available sites
    let url = this.base_db_url();
    return this.get(url);
  }

  createSite(name: string, id: string) {
    // create a site
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
