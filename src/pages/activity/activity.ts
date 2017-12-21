import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})
export class ActivityPage {

  private responses: Array<any>;
  private userID: number;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private ngZone: NgZone) {
    this.userID = 0;
    this.userProvider.getUser().then(data => {
      this.userID = data.ID;
    });
  }

  ionViewDidEnter () {
    this.userProvider.getActivity().then(data => {
      this.ngZone.run(() => {
        this.responses = data;
      });
    });
  }

  logout () {
    this.navCtrl.push(LogoutPage);
  }

}
