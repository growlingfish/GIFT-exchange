import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';

import { UserProvider } from '../../providers/user/user';
import * as Constants from '../../providers/global-var/global-var';

import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-newmessage',
  templateUrl: 'newmessage.html',
})
export class NewMessagePage {

  private part: number;
  private message: string = "";
  private buttonAction: string = "Add message";
  private type: number = Constants.MESSAGE_TYPE_UNDECIDED;
  private recording: boolean = false;
  private filePath: string;
  private fileName: string;
  private audio: MediaObject;
  private audioList: any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private media: Media, private file: File, public platform: Platform, private zone: NgZone) {
    this.part = navParams.get('part');

    this.platform.ready().then(() => {
      if (!this.platform.is('cordova')) {
        this.zone.run(() => {
          this.type = Constants.MESSAGE_TYPE_TEXT;
        });
      }
    });
  }

  ionViewDidEnter () {
    this.userProvider.getUnfinishedGift().then(gift => {
      if (gift.payloads[this.part].post_content.length > 0) {
        this.message = gift.payloads[this.part].post_content;
        this.buttonAction = "Update message";
      }
    });
  }

  ionViewWillLeave () {
    if (!!this.audio && this.recording) {
      this.stopRecord();
    }
  }

  startRecord() {
    if (this.platform.is('ios')) {
      this.fileName = 'message' + this.part + '.3gp';
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.fileName = 'message' + this.part + '.3gp';
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.audio = this.media.create(this.filePath);
    }
    this.audio.startRecord();
    this.recording = true;
  }

  stopRecord() {
    this.audio.stopRecord();
    let data = { filename: this.fileName };
    this.audioList[this.part] = data;
    this.recording = false;
  }

  playAudio() {
    if (this.platform.is('ios')) {
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.audioList[this.part].filename;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.audioList[this.part].filename;
      this.audio = this.media.create(this.filePath);
    }
    this.audio.play();
    this.audio.setVolume(0.8);
  }

  hasRecorded () {
    return !!this.audioList && !!this.audioList[this.part] && !!this.audioList[this.part].filename;
  }

  isUndecided () {
    return this.type == Constants.MESSAGE_TYPE_UNDECIDED;
  }

  isText () {
    return this.type == Constants.MESSAGE_TYPE_TEXT;
  }

  setText () {
    this.type = Constants.MESSAGE_TYPE_TEXT;
  }

  isAudio () {
    return this.type == Constants.MESSAGE_TYPE_AUDIO;
  }

  setAudio () {
    this.type = Constants.MESSAGE_TYPE_AUDIO;
  }

  logout () {
    this.navCtrl.push(LogoutPage);
  }

  addMessage () {
    this.userProvider.getUnfinishedGift().then(gift => {
      gift.payloads[this.part].post_content = this.message;
      this.userProvider.setUnfinishedGift(gift).then(data => {
        this.navCtrl.pop();
      });
    });
  }

  cancel () {
    this.navCtrl.pop();
  }
}
