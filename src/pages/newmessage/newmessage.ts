import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, Platform, LoadingController, ToastController, Loading } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';

import { UserProvider } from '../../providers/user/user';
import * as Constants from '../../providers/global-var/global-var';
import { GlobalVarProvider } from '../../providers/global-var/global-var';

import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';

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
  private loading: Loading;
  private audio: MediaObject;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private media: Media, private file: File, public platform: Platform, public toastCtrl: ToastController, private zone: NgZone, private globalVar: GlobalVarProvider, private transfer: FileTransfer, public loadingCtrl: LoadingController) {
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
    if (this.hasRecorded()) {
      this.uploadRecord();
      this.removeRecord();
    }
  }

  startRecord() {
    this.fileName = 'message' + this.part + '.3gp';
    if (this.platform.is('ios')) {
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
    } else if (this.platform.is('android')) {
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
    }
    this.audio = this.media.create(this.filePath);
    this.audio.startRecord();
    this.recording = true;
  }

  stopRecord() {
    this.audio.stopRecord();
    this.recording = false;
  }

  uploadRecord () {
    var url = this.globalVar.getMessageAudioUploadURL();
      
    this.userProvider.getUser().then(data => {
      this.userProvider.getGIFTToken().then(tokenData => {
        var options = {
          fileKey: "file",
          fileName: this.fileName,
          chunkedMode: false,
          mimeType: "multipart/form-data",
          headers: {
            Authorization: 'GiftToken ' + btoa(data.ID + ":" + tokenData)
          }
        };

        const fileTransfer: FileTransferObject = this.transfer.create();
        
        this.loading = this.loadingCtrl.create({
          content: 'Uploading...',
          duration: 10000
        });
        this.loading.present();
      
        // Use the FileTransfer to upload the image
        fileTransfer.upload(this.filePath, url, options).then(data => {
          this.loading.dismissAll();
          let response = JSON.parse(data.response);
          if (response.success) {
            this.userProvider.getUnfinishedGift().then(gift => {
              gift.payloads[this.part].post_content = response.url;
              this.userProvider.setUnfinishedGift(gift).then(data => {
                this.navCtrl.pop();
              });
            });
          } else {
            this.showErrorToast('Error while uploading file');
          }
        }, err => {
          this.loading.dismissAll();
          console.log(err);
          this.showErrorToast('Error while uploading file');
        });
      });
    });
  }

  showErrorToast (text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  removeRecord () {
    if (this.platform.is('ios')) {
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.file.removeFile(this.filePath, this.fileName);
    } else if (this.platform.is('android')) {
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + this.fileName;
      this.file.removeFile(this.filePath, this.fileName);
    }
  }

  playAudio() {
    this.audio = this.media.create(this.filePath);
    this.audio.play();
    this.audio.setVolume(0.8);
  }

  hasRecorded () {
    return !!this.fileName && this.fileName.length > 0;
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
    if (this.isText()) {
      this.userProvider.getUnfinishedGift().then(gift => {
        gift.payloads[this.part].post_content = this.message;
        this.userProvider.setUnfinishedGift(gift).then(data => {
          this.navCtrl.pop();
        });
      });
    } else if (this.isAudio()) {
      this.uploadRecord();
    }
  }

  cancel () {
    this.navCtrl.pop();
  }
}
