import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { LogoutPage } from '../logout/logout';
import { NewGiftPage } from '../newgift/newgift';
import { ReviewGiftPage } from '../reviewgift/reviewgift';

import { UserProvider } from '../../providers/user/user'; 
import { FormattingProvider } from '../../providers/formatting/formatting';

@Component({
  selector: 'page-theirgifts',
  templateUrl: 'theirgifts.html',
})
export class TheirGiftsPage {
 
  private gifts: Array<any>;
  private unfinished: boolean = false;
  private unfinishedTitle: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private formattingProvider: FormattingProvider, private ngZone: NgZone, private alertCtrl: AlertController) {}

  ionViewDidEnter () {
    this.userProvider.getTheirGifts().then(data => {
      this.ngZone.run(() => {
        this.gifts = data;
      });
    });

    this.userProvider.getUnfinishedGift().then(existingGift => {
      if (existingGift != null) {
        this.unfinished = true;
        if (!!existingGift.post_title && existingGift.post_title != "Tap to name this gift") {
          this.unfinishedTitle = existingGift.post_title;
        } else {
          this.unfinishedTitle = "Continue making this gift";
        }
      } else {
        this.unfinished = false;
      }
    });
  }

  filterGifts (ev: any) {
    this.userProvider.getTheirGifts().then(data => {
      this.gifts = data;

      let val = ev.target.value; // search bar value
      
      if (val && val.trim() != '') {
        this.gifts = this.gifts.filter((gift) => {
          return gift.recipient.nickname.toLowerCase().indexOf(val.toLowerCase()) > -1;
        })
      }
    });
  }

  startNew () {
    this.navCtrl.push(NewGiftPage);
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
        this.navCtrl.push(ReviewGiftPage, {
          gift: gift
        });
      } else {
        let alert = this.alertCtrl.create({
          title: 'Made for elsewhere',
          message: 'You included exhibits at a different venue (' + intendedVenue.name + ') in this gift. Would you like to review it here?',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel'
            },
            {
              text: 'Review',
              handler: () => {
                this.navCtrl.push(ReviewGiftPage, {
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

  logout () {
    this.navCtrl.push(LogoutPage);
  }

}
