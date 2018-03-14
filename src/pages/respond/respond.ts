import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, Loading } from 'ionic-angular';

import { TabsPage } from '../tabs/tabs';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-respond',
  templateUrl: 'respond.html',
})
export class RespondPage {

  private message: string = "";
  private giftID: number;
  private owner: number;
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.giftID = navParams.get('giftID');
    this.owner = navParams.get('owner');
  }

  sendMessage () {
    this.loading = this.loadingCtrl.create({
      content: 'Sending your response ... ',
      duration: 10000
    });
    this.loading.present();
    this.userProvider.sendResponse(this.giftID, this.message, this.owner).subscribe(complete => {
      if (complete) {
        this.userProvider.updateActivity().subscribe(done => {
          this.navCtrl.setRoot(TabsPage, {
            tab: 2
          });
          this.loading.dismissAll();
        });
      } else {
        this.loading.dismissAll();
        this.showError();
      }
    },
    error => {        
      this.loading.dismissAll();
      this.showError();
    });
  }

  showError() {
    let alert = this.alertCtrl.create({
      title: 'Response unsuccessful',
      subTitle: 'Please try again later',
      buttons: ['OK']
    });
    alert.present();
  }

  cancel () {
    this.navCtrl.setRoot(TabsPage);
  }
}
