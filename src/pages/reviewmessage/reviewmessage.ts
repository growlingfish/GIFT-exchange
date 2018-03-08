import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';

import * as Constants from '../../providers/global-var/global-var';

import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';

@Component({
  selector: 'page-reviewmessage',
  templateUrl: 'reviewmessage.html',
})
export class ReviewMessagePage {

  private message: string;
  private type: number = Constants.MESSAGE_TYPE_UNDECIDED;
  private audio: MediaObject;
  private filePath: string;
  private fileName: string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public platform: Platform, private zone: NgZone, private media: Media, private file: File) {
    this.message = navParams.get('message');

    this.platform.ready().then(() => {
      if (!this.platform.is('cordova')) {
        this.zone.run(() => {
          this.setText();
        });
      } else {
        if (this.message.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)) { // was this an audio message?
          var matches = this.message.match(/\/([^\/?#]+)[^\/]*$/);
          if (matches.length > 1) {
            this.fileName = matches[1];
            if (this.platform.is('ios')) {
              this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
            } else if (this.platform.is('android')) {
              this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
            }
            this.audio = this.media.create(this.filePath);
            this.setAudio();
          } else {
            this.setText();
          }
        } else {
          this.setText();
        }
      }
    });
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

  playAudio() {
    this.audio = this.media.create(this.filePath);
    this.audio.play();
    this.audio.setVolume(1);
  }

  dismiss () {
    this.viewCtrl.dismiss();
  }

}
