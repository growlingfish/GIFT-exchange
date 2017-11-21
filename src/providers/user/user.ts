import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Platform } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { FCM } from '@ionic-native/fcm';

import { GlobalVarProvider } from '../global-var/global-var';

@Injectable()
export class UserProvider {

  constructor(public http: Http,  private storage: Storage, private globalVar: GlobalVarProvider, private platform: Platform, private fcm: FCM) {}

  public getSeenIntro (): Promise<boolean> {
    return this.storage.ready().then(() => this.storage.get('seenIntro'));
  }

  public setSeenIntro (val: boolean) {
    return this.storage.ready().then(() => this.storage.set('seenIntro', val));
  }

  public getUser (): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('user'));
  }

  public setUser (val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('user', val));
  }

  public getFCMToken (): Promise<string> {
    return this.storage.ready().then(() => this.storage.get('fcmToken'));
  }

  public setFCMToken (val: string) {
    return this.storage.ready().then(() => this.storage.set('fcmToken', val));
  }

  public login (username: string, password: string) {
    if (username === null || password === null) {
      return Observable.throw("Username or password missing");
    } else {
      return Observable.create(observer => {
        this.http.get(this.globalVar.getAuthURL(username, password))
          .map(response => response.json())
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              this.setUser(data.user).then(data => {
                this.initialiseData();
                this.initialiseFCM();
                observer.next(true);
                observer.complete();
              });
            } else {
              observer.next(false);
              observer.complete();
            }
          },
          function (error) {
            observer.next(false);
            observer.complete();
          });
      });
    }
  }

  public initialiseFCM () {
    //https://github.com/fechanique/cordova-plugin-fcm
    //https://console.firebase.google.com/project/gift-eu-1491403324909/notification
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.fcm.getToken().then(token => {
          console.log("New token " + token);
          this.setFCMToken(token);
        }, error => {
          console.log("FCM getToken failed ...");
          console.log(error);
        });

        this.fcm.onTokenRefresh().subscribe(token => {
          console.log("Refreshed token " + token);
          this.setFCMToken(token);
        }, error => {
          console.log("FCM getToken failed ...");
        });
          
        /*this.fcm.subscribeToTopic('giftGlobal');
        console.log("Attempted to subscribe to giftGlobal");

        this.fcm.subscribeToTopic('giftDeliveries');
        console.log("Attempted to subscribe to giftDeliveries");

        this.fcm.subscribeToTopic('giftStatus');
        console.log("Attempted to subscribe to giftStatus");
        
        this.fcm.onNotification().subscribe(data => {
          console.log(data);
          if (data.wasTapped) { //Notification was received in notification tray (app is in background)
            
          } else { //Notification was received when app is in foreground
          
          }
          switch (data.topic) {
            case 'giftGlobal':
              let alert = this.alertCtrl.create({
                title: data.title,
                subTitle: data.body,
                buttons: ['OK']
              });
              alert.present();
              break;
            case 'giftDeliveries':
              this.getUser().then(user => {
                if (user == null) {
                  // not logged in; no deliveries for me
                } else {
                  if (user.ID == data.recipientID) {
                    let alert = this.alertCtrl.create({
                      title: "You've received a gift!",
                      message: 'Would you like to see your gifts now?',
                      buttons: [
                        {
                          text: 'Yes',
                          handler: () => {
                            let navTransition = alert.dismiss();
                            navTransition.then(() => {
                              let loading = this.loadingCtrl.create({
                                content: 'Checking for new gifts ...',
                                duration: 10000
                              });
                              loading.present().then(()=>{
                                this.updateMyGifts().subscribe(done => {
                                  this.appCtrl.getRootNav().setRoot(TabsPage, {
                                    tab: 1
                                  });
                                  loading.dismissAll();
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
                                this.updateMyGifts();
                            });
                            return false;
                          }
                        }
                      ]
                    });
                    alert.present();
                  }
                }
              });
              break;
            case 'giftStatus':
              this.getUser().then(user => {
                if (user == null) {
                  // not logged in; no status updates for me
                } else {
                  if (data.status == "responded" && data.owner == user.ID) {
                    let alert = this.alertCtrl.create({
                      title: data.title,
                      message: 'Would you like to see your messages now?',
                      buttons: [
                        {
                          text: 'Yes',
                          handler: () => {
                            let navTransition = alert.dismiss();
                            navTransition.then(() => {
                              let loading = this.loadingCtrl.create({
                                content: 'Checking for new messages ...',
                                duration: 10000
                              });
                              loading.present().then(()=>{
                                this.updateActivity().subscribe(done => {
                                  this.appCtrl.getRootNav().setRoot(TabsPage, {
                                    tab: 2
                                  });
                                  loading.dismissAll();
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
                                this.updateActivity();
                            });
                            return false;
                          }
                        }
                      ]
                    });
                    alert.present();
                  } else if (data.status != "responded" && data.senderID == user.ID) {
                    let alert = this.alertCtrl.create({
                      title: data.title,
                      message: data.body,
                      buttons: ['OK']
                    });
                    alert.present();
                  }
                }
              });
              break;
            default:
              console.log(data);
              break;
          }
        });*/
      }
    });
  }

}
