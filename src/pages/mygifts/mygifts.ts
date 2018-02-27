import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';
import { ReviewMyGiftPage } from '../reviewmygift/reviewmygift';
import { OpenMyGiftPage } from '../openmygift/openmygift';

import { UserProvider } from '../../providers/user/user';
import { FormattingProvider } from '../../providers/formatting/formatting';

@Component({
  selector: 'page-mygifts',
  templateUrl: 'mygifts.html',
})
export class MyGiftsPage {

  private gifts: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private formattingProvider: FormattingProvider, private ngZone: NgZone, private alertCtrl: AlertController) {}

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
    this.userProvider.getVenue().then(venue => {
      var here = false;
      var intendedVenue = <any>{}; // only one venue per gift?
      for (var i in gift.wraps) {
        if (
          !!gift.wraps[i].unwrap_object && !!gift.wraps[i].unwrap_object.location && !!gift.wraps[i].unwrap_object.location.venue
        ) {
          intendedVenue = gift.wraps[i].unwrap_object.location.venue;
          if (gift.wraps[i].unwrap_object.location.venue.ID == venue.ID) {
            here = true;
          }
          break;
        }
      }
      if (here) {
        this.navCtrl.push(ReviewMyGiftPage, {
          gift: gift
        });
      } else {
        let alert = this.alertCtrl.create({
          title: 'Made for elsewhere',
          message: 'This gift was intended to be opened near exhibits at a different venue (' + intendedVenue.name + '). Would you still like to re-open it here?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Review',
              handler: () => {
                this.navCtrl.push(ReviewMyGiftPage, {
                  gift: gift
                });
              }
            }
          ]
        });
        alert.present();
      }
    });
  }

  open (gift) {
    this.userProvider.getVenue().then(venue => {
      var here = false;
      var intendedVenue = <any>{}; // only one venue per gift?
      for (var i in gift.wraps) {
        if (
          !!gift.wraps[i].unwrap_object && !!gift.wraps[i].unwrap_object.location && !!gift.wraps[i].unwrap_object.location.venue
        ) {
          intendedVenue = gift.wraps[i].unwrap_object.location.venue;
          if (gift.wraps[i].unwrap_object.location.venue.ID == venue.ID) {
            here = true;
          }
          break;
        }
      }
      if (here) {
        this.navCtrl.push(OpenMyGiftPage, {
          gift: gift
        });
      } else {
        let alert = this.alertCtrl.create({
          title: 'Made for elsewhere',
          subTitle: gift.author.nickname + ' would like you to open this gift when you have found exhibits at ' + intendedVenue.name + '. You must visit that venue to open it.',
          buttons: ['Dismiss']
        });
        alert.present();
      }
    });
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
