import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export const MESSAGE_TYPE_UNDECIDED = -1;
export const MESSAGE_TYPE_TEXT = 0;
export const MESSAGE_TYPE_AUDIO = 1;
export const BASE_PLATFORM = "https://gifting.digital/";
export const BASE_API = BASE_PLATFORM + "wp-json/gift/v3/";

@Injectable()
export class GlobalVarProvider {

  constructor(public http: HttpClient) {}

  getPasswordResetURL () {
    return BASE_PLATFORM + "wp/wp-login.php?action=lostpassword&fromapp=true";
  }

  getAuthURL (username, password) {
    return BASE_API + "auth/" + encodeURI(username) + "/" + encodeURI(password);
  }

  getRegisterURL (username, password, email, name) {
    return BASE_API + "new/sender/" + encodeURI(username) + "/" + encodeURI(password) + "/" + encodeURI(email) + "/" + encodeURI(name);
  }

  getFreeGiftURL (venueId) {
    return BASE_API + "gifts/free/" + venueId;
  }

  getSentGiftsURL (userId) {
    return BASE_API + "gifts/sent/" + userId;
  }

  getReceivedGiftsURL (userId) {
    return BASE_API + "gifts/received/" + userId;
  }

  getContactsURL (userId) {
    return BASE_API + "contacts/" + userId;
  }

  getInviteURL (userId, email, name) {
    return BASE_API + "new/receiver/" + encodeURI(email) + "/" + encodeURI(name) + "/" + userId;
  }

  getObjectsURL (venueId, userId) {
    return BASE_API + "objects/" + venueId + "/" + userId;
  }

  getObjectPhotoUploadURL () {
    return BASE_API + "upload/object/";
  }

  getMessageAudioUploadURL () {
    return BASE_API + "upload/audio/";
  }

  getFinaliseObjectURL (userId) {
    return BASE_API + "new/object/" + userId;
  }

  getVenuesURL () {
    return BASE_API + "venues/";
  }

  getLocationsURL (venueId) {
    return BASE_API + "locations/" + venueId;
  }

  getActivityURL (userId) {
    return BASE_API + "responses/" + userId;
  }

  getFinaliseGiftURL (userId) {
    return BASE_API + "new/gift/" + userId;
  }

  getUnwrappedURL (giftId, receiverId) {
    return BASE_API + "unwrapped/gift/" + giftId + "/" + receiverId;
  }

  getReceivedURL (giftId, receiverId) {
    return BASE_API + "received/gift/" + giftId + "/" + receiverId;
  }

  getResponseURL (giftId) {
    return BASE_API + "respond/gift/" + giftId;
  }
}
