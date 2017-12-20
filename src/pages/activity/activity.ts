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
  
    constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private ngZone: NgZone) {
    }
  
    ionViewDidEnter () {
      this.userProvider.getActivity().then(data => {
        this.ngZone.run(() => {
          this.responses = data.received;
        });
      });
    }
  
    logout () {
      this.navCtrl.push(LogoutPage);
    }

}
