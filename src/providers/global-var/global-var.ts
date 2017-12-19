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

  getRegisterURL (username, password, email, name) {
    return this.getApiBase() + "new/sender/" + encodeURI(username) + "/" + encodeURI(password) + "/" + encodeURI(email) + "/" + encodeURI(name);
  }

  getSentGiftsURL (userId) {
    return this.getApiBase() + "gifts/sent/" + userId;
  }

  getReceivedGiftsURL (userId) {
    return this.getApiBase() + "gifts/received/" + userId;
  }

  getContactsURL (userId) {
    return this.getApiBase() + "contacts/" + userId;
  }

  getObjectsURL (userId) {
    return this.getApiBase() + "objects/" + userId;
  }

  getLocationsURL () {
    return this.getApiBase() + "locations/";
  }

  getActivityURL (userId) {
    return this.getApiBase() + "responses/" + userId;
  }

  getFinaliseGiftURL (userId) {
    return this.getApiBase() + "new/gift/" + userId;
  }

  getUnwrappedURL (giftId, receiverId) {
    return this.getApiBase() + "unwrapped/gift/" + giftId + "/" + receiverId;
  }

  getReceivedURL (giftId, receiverId) {
    return this.getApiBase() + "received/gift/" + giftId + "/" + receiverId;
  }
}
