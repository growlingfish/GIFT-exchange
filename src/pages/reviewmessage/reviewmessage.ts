import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';

import * as Constants from '../../providers/global-var/global-var';

import { Media, MediaObject } from '@ionic-native/media';

@Component({
  selector: 'page-reviewmessage',
  templateUrl: 'reviewmessage.html',
})
export class ReviewMessagePage {

  private message: string;
  private type: number = Constants.MESSAGE_TYPE_UNDECIDED;
  private audio: MediaObject;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public platform: Platform, private zone: NgZone, private media: Media) {
    this.message = navParams.get('message');

    this.platform.ready().then(() => {
      if (!this.platform.is('cordova')) {
        this.zone.run(() => {
          this.setText();
        });
      } else {
        if (this.message.replace(/(<([^>]+)>)|(&lt;([^>]+)&gt;)/g, '').trim().match(/\.([0-9a-z]+)(?:[\?#]|$)/i)) { // was this an audio message?
          var matches = this.message.match(/\/([^\/?#]+)[^\/]*$/);
          if (matches.length > 1) {
            this.message = this.message.replace(/(<([^>]+)>)|(&lt;([^>]+)&gt;)/g, '').trim();
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
    this.zone.run(() => {
      this.audio = this.media.create(this.message);
      this.audio.play();
      this.audio.setVolume(1);
    });
  }

  dismiss () {
    if (this.isAudio() && !!this.audio) {
      this.audio.stop();
      this.audio.release();
    }
    this.viewCtrl.dismiss();
  }

}
