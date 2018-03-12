import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController, Platform } from 'ionic-angular';

import * as Constants from '../../providers/global-var/global-var';

import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Shake } from '@ionic-native/shake';
import { VideoPlayer } from '@ionic-native/video-player';
import { NativeAudio } from '@ionic-native/native-audio';

@Component({
  selector: 'page-openmessage',
  templateUrl: 'openmessage.html',
})
export class OpenMessagePage {

  private message: string;
  private type: number = Constants.MESSAGE_TYPE_UNDECIDED;
  private audio: MediaObject;
  private filePath: string;
  private fileName: string;
  private revealed: boolean;
  private watch;
  private video: string;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private platform: Platform, private shake: Shake, private zone: NgZone, private videoPlayer: VideoPlayer, private nativeAudio: NativeAudio, private media: Media, private file: File) {
    this.message = navParams.get('message');
    this.revealed = false;

    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.zone.run(() => {
          this.nativeAudio.preloadSimple('success', 'assets/audio/ting.mp3');
        });

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
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.watch.unsubscribe();

        if (this.isAudio() && !!this.audio) {
          this.audio.stop();
          this.audio.release();
        }
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
    this.audio = this.media.create(this.filePath);
    this.audio.play();
    this.audio.setVolume(1);
  }

}
