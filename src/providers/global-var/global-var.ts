import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVarProvider {

  apiBase: string;

  constructor(public http: HttpClient) {
    this.apiBase = "https://gifting.digital/wp-json/gift/v3/";
  }

  getApiBase () {
    return this.apiBase;
  }

  getAuthURL (username, password) {
    return this.getApiBase() + "auth/" + encodeURI(username) + "/" + encodeURI(password);
  }

}
