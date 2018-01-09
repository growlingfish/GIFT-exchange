import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVarProvider {

  apiBase: string;
  notificationBase: string;

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

  getFreeGiftURL (venueId) {
    return this.getApiBase() + "gifts/free/" + venueId;
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

  getInviteURL (userId, email, name) {
    return this.getApiBase() + "new/receiver/" + encodeURI(email) + "/" + encodeURI(name) + "/" + userId;
  }

  getObjectsURL (venueId, userId) {
    return this.getApiBase() + "objects/" + venueId + "/" + userId;
  }

  getObjectPhotoUploadURL () {
    return this.getApiBase() + "upload/object/";
  }

  getFinaliseObjectURL (userId) {
    return this.getApiBase() + "new/object/" + userId;
  }

  getVenuesURL () {
    return this.getApiBase() + "venues/";
  }

  getLocationsURL (venueId) {
    return this.getApiBase() + "locations/" + venueId;
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

  getResponseURL (giftId) {
    return this.getApiBase() + "respond/gift/" + giftId;
  }
}
