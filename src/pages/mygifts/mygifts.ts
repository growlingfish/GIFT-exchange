import { Component, NgZone } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';
import { ReviewMyGiftPage } from '../reviewmygift/reviewmygift';
import { OpenMyGiftPage } from '../openmygift/openmygift';

import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-mygifts',
  templateUrl: 'mygifts.html',
})
export class MyGiftsPage {

  private gifts: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private ngZone: NgZone) {}

  ionViewDidEnter () {
    this.userProvider.getMyGifts().then(data => {
      this.ngZone.run(() => {
        this.gifts = data;
      });
    });
  }

  filterGifts (ev: any) {
    this.userProvider.getMyGifts().then(data => {
      this.gifts = data;

      let val = ev.target.value; // search bar value
      
      if (val && val.trim() != '') {
        this.gifts = this.gifts.filter((gift) => {
          return gift.author.nickname.toLowerCase().indexOf(val.toLowerCase()) > -1;
        })
      }
    });
  }

  review (gift) {
    this.navCtrl.push(ReviewMyGiftPage, {
      gift: gift
    })
  }

  open (gift) {
    this.navCtrl.push(OpenMyGiftPage, {
      gift: gift
    })
  }

  logout () {
    this.navCtrl.push(LogoutPage);
  }

  giftsOpened () {
    if (!!this.gifts) {
      return this.gifts.filter((item) => {
        return item.status.unwrapped == true;
      });
    }
    return [];
  }

  giftsUnopened () {
    if (!!this.gifts) {
      return this.gifts.filter((item) => {
        return item.status.unwrapped == false;
      });
    }
    return [];
  }
}
