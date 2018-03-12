import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';

import * as Constants from '../../providers/global-var/global-var';

import { Shake } from '@ionic-native/shake';
import { VideoPlayer } from '@ionic-native/video-player';
import { NativeAudio } from '@ionic-native/native-audio';
import { Media, MediaObject } from '@ionic-native/media';

@Component({
  selector: 'page-openmessage',
  templateUrl: 'openmessage.html',
})
export class OpenMessagePage {

  private message: string;
  private type: number = Constants.MESSAGE_TYPE_UNDECIDED;
  private revealed: boolean;
  private watch;
  private video: string;
  private audio: MediaObject;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private platform: Platform, private shake: Shake, private zone: NgZone, private videoPlayer: VideoPlayer, private nativeAudio: NativeAudio, private media: Media) {
    this.message = navParams.get('message');
    this.revealed = false;

    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.zone.run(() => {
          this.nativeAudio.preloadSimple('success', 'assets/audio/ting.mp3');
        });

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
      } else {
        this.zone.run(() => {
          this.setText();
        });
      }
    });
  }

  private videos = [
    'shake1_looped.mp4',
    'shake2_looped.mp4',
    'shake3_looped.mp4',
    'shake4_looped.mp4'
  ];

  playVideo () {
    if (!this.revealed) {
      console.log("Playing video " + this.video);
      this.videoPlayer.play(this.video).then(() => {
        console.log("Finished video");
        if (!this.revealed) {
          console.log("Looping video");
          this.playVideo();
        }
      }).catch(err => {
        console.log(err);
        this.revealed = true;
      });
    }
  }

  ionViewDidEnter () {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        if (this.platform.is('android')) {
          this.video = 'file:///android_asset/www/assets/video/' + this.videos[Math.floor(Math.random() * this.videos.length)];
          this.playVideo();
        }
        this.watch = this.shake.startWatch().subscribe(() => {
          this.zone.run(() => {
            this.videoPlayer.close();
            this.nativeAudio.play('success');
            this.revealed = true;
          });
        });
      } else {
        this.revealed = true;
      }
    });
  }

  back () {
    if (this.isAudio() && !!this.audio) {
      this.audio.stop();
      this.audio.release();
    }
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.watch.unsubscribe();
      }
    });
    this.viewCtrl.dismiss();
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

}
