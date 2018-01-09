import { Component } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';

import { LoginPage } from '../login/login';
import { TheirGiftsPage } from '../theirgifts/theirgifts';
import { MyGiftsPage } from '../mygifts/mygifts';
import { ActivityPage } from '../activity/activity';
import { RolePage } from '../role/role';
import { OpenMyGiftPage } from '../openmygift/openmygift';

import { UserProvider } from '../../providers/user/user';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  makeRoot = TheirGiftsPage;
  unwrapRoot = MyGiftsPage;
  activityRoot = ActivityPage;

  selectedTab: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private alertCtrl: AlertController) {
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
                this.userProvider.setSeenFreeGift(true);
                let alert = this.alertCtrl.create({
                  title: "You've received a gift!",
                  message: 'Would you like to see this gift now?',
                  buttons: [
                    {
                      text: 'Yes',
                      handler: () => {
                        let navTransition = alert.dismiss();
                        navTransition.then(() => {
                          this.navCtrl.push(OpenMyGiftPage, {
                            gift: this.userProvider.getFreeGift()
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
              }
            });
          }
        });
      }
    });
  }
}
