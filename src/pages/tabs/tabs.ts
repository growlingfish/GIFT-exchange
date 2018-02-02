import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, PopoverController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { TheirGiftsPage } from '../theirgifts/theirgifts';
import { MyGiftsPage } from '../mygifts/mygifts';
import { ActivityPage } from '../activity/activity';
import { RolePage } from '../role/role';
import { OpenMyGiftPage } from '../openmygift/openmygift';
import { VenueIntroPage } from '../venueintro/venueintro';

import { UserProvider } from '../../providers/user/user';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  makeRoot = TheirGiftsPage;
  unwrapRoot = MyGiftsPage;
  activityRoot = ActivityPage;

  selectedTab: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private alertCtrl: AlertController, public popoverCtrl: PopoverController) {
    this.selectedTab = navParams.get('tab') || 0;
  }

  ionViewWillEnter () {
    var user = this.userProvider.getUser();
    user.then(data => {
      if (data == null) {
        this.navCtrl.setRoot(LoginPage);
      } else {
        this.userProvider.getSeenFreeGift().then(hasSeenGift => {
          if(hasSeenGift){
            this.userProvider.getSeenRoles().then(hasSeenRoles => {
              if (!hasSeenRoles) {
                this.navCtrl.setRoot(RolePage);
              }
            });
          } else {
            this.userProvider.getFreeGift().then(freeGift => {
              if (freeGift == null) { // no free gift, go to roles instead
                this.userProvider.getSeenRoles().then(hasSeenRoles => {
                  if (!hasSeenRoles) {
                    this.navCtrl.setRoot(RolePage);
                  }
                }); 
              } else {
                this.userProvider.getVenue().then(venue => {
                  let popover = this.popoverCtrl.create(VenueIntroPage, {
                    venue: venue
                  });
                  popover.present();
                  popover.onDidDismiss(() => {
                    let alert = this.alertCtrl.create({
                      title: "You've received a gift!",
                      message: 'Would you like to see this gift now?',
                      buttons: [
                        {
                          text: 'Yes',
                          handler: () => {
                            this.userProvider.setSeenFreeGift(true).then(success => {
                              let navTransition = alert.dismiss();
                              navTransition.then(() => {
                                this.navCtrl.push(OpenMyGiftPage, {
                                  gift: freeGift
                                });
                              });
                            });
                            return false;
                          }
                        },
                        {
                          text: 'No, thanks',
                          role: 'cancel',
                          handler: () => {
                            let navTransition = alert.dismiss();
                            navTransition.then(() => {
                              this.userProvider.getSeenRoles().then(hasSeenRoles => {
                                if (!hasSeenRoles) {
                                  this.navCtrl.setRoot(RolePage);
                                }
                              });
                            });
                            return false;
                          }
                        }
                      ]
                    });
                    alert.present();
                  });
                });
              }
            });
          }
        });
      }
    });
  }
}
