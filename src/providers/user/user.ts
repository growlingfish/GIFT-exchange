import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { App, Platform } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { FCM } from '@ionic-native/fcm';

import { LogoutPage } from '../../pages/logout/logout';
import { KickoutPage } from '../../pages/kickout/kickout';

import { GlobalVarProvider } from '../global-var/global-var';

interface LoginResponse {
  user: Object;
  token: string;
  success: boolean;
}

interface RegisterResponse {
  success: boolean;
  user: Object;
}

interface UpdateTheirGiftsResponse {
  success: boolean;
  gifts: Array<Object>;
}

interface UpdateMyGiftsResponse {
  success: boolean;
  gifts: Array<Object>;
}

interface UpdateActivityResponse {
  success: boolean;
  responses: Array<Object>;
}

interface UpdateContactsResponse {
  success: boolean;
  contacts: Array<Object>;
}

interface UpdateObjectsResponse {
  success: boolean;
  objects: Array<Object>;
}

interface UpdateLocationsResponse {
  success: boolean;
  locations: Array<Object>;
}

interface FinaliseGiftResponse {
  success: boolean;
}

interface UnwrappedGiftResponse {
  success: boolean;
}

interface ReceivedGiftResponse {
  success: boolean;
}

@Injectable()
export class UserProvider {

  constructor(public app: App, public http: HttpClient,  private storage: Storage, private globalVar: GlobalVarProvider, private platform: Platform, private fcm: FCM) {}

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

  public getGIFTToken (): Promise<string> {
    return this.storage.ready().then(() => this.storage.get('giftToken'));
  }

  public setGIFTToken (val: string) {
    return this.storage.ready().then(() => this.storage.set('giftToken', val));
  }

  public getFCMToken (): Promise<string> {
    return this.storage.ready().then(() => this.storage.get('fcmToken'));
  }

  public setFCMToken (val: string) {
    return this.storage.ready().then(() => this.storage.set('fcmToken', val));
  }

  public getTheirGifts (): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('theirGifts'));
  }

  public setTheirGifts (val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('theirGifts', val));
  }

  public getMyGifts (): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('myGifts'));
  }

  public setMyGifts (val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('myGifts', val));
  }

  public getContacts (): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('contacts'));
  }

  public setContacts (val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('contacts', val));
  }

  public getObjects (): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('objects'));
  }

  public setObjects (val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('objects', val));
  }

  public getLocations (): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('locations'));
  }

  public setLocations (val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('locations', val));
  }

  public getActivity (): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('activity'));
  }

  public setActivity (val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('activity', val));
  }

  public getUnfinishedGift (): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('unfinishedGift'));
  }

  public setUnfinishedGift (val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('unfinishedGift', val));
  }

  public clearUnfinishedGift (): Promise<any> {
    return this.storage.ready().then(() => this.storage.remove('unfinishedGift'));
  }

  public getUnopenedGift (giftId: number): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('unopenedGift' + giftId));
  }

  public setUnopenedGift (giftId: number, val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('unopenedGift' + giftId, val));
  }

  public clearUnopenedGift (giftId: number): Promise<any> {
    return this.storage.ready().then(() => this.storage.remove('unopenedGift' + giftId));
  }

  public login (username: string, password: string) {
    if (username === null || password === null) {
      return Observable.throw("Username or password missing");
    } else {
      return Observable.create(observer => {
        this.http.get<LoginResponse>(this.globalVar.getAuthURL(username, password))
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              this.setUser(data.user).then(result => {
                this.setGIFTToken(data.token).then(result => {
                  this.initialiseData().subscribe(success => {
                    if (!success) {
                      this.logout().then(data => {
                        observer.next(false);
                        observer.complete();
                        this.app.getRootNav().setRoot(KickoutPage);
                      });
                    }
                  }, error => {
                    observer.next(false);
                    observer.complete();
                  }, () => {
                    console.log("done?");
                    this.initialiseFCM();
                    this.app.getRootNav().setRoot(LogoutPage);
                    observer.next(true);
                    observer.complete();
                  });
                });
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

  public logout (): Promise<void> {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.fcm.unsubscribeFromTopic('giftGlobal');
        this.fcm.unsubscribeFromTopic('giftDeliveries');
        this.fcm.unsubscribeFromTopic('giftStatus');
      }
    });

    return this.storage.ready().then(() => this.storage.clear());
  }

  public register (username: string, password: string, email: string, name: string): Observable<any> {
    if (email === null || password === null || name === null || username === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return Observable.create(observer => {
        this.http.get<RegisterResponse>(this.globalVar.getRegisterURL(username, password, email, name))
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              observer.next(true);
              observer.complete();
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

  public initialiseData (): Observable<any> {
    return Observable.create(observer => {
      this.updateTheirGifts().subscribe(complete => {
        if (complete) {
          console.log("Succeeded getting sent gifts");
          observer.next(true);

          this.updateMyGifts().subscribe(complete => {
            if (complete) {
              console.log("Succeeded getting received gifts");
              observer.next(true);

              this.updateContacts().subscribe(complete => {
                if (complete) {
                  console.log("Succeeded getting contacts");
                  observer.next(true);

                  this.updateObjects().subscribe(complete => {
                    if (complete) {
                      console.log("Succeeded getting objects");
                      observer.next(true);

                      this.updateLocations().subscribe(complete => {
                        if (complete) {
                          console.log("Succeeded getting locations");
                          observer.next(true);

                          this.updateActivity().subscribe(complete => {
                            if (complete) {
                              console.log("Succeeded getting activity");
                              observer.next(true);
                              observer.complete();
                            } else {
                              console.log("Failed getting activity ... kicking out");
                              observer.next(false);
                              observer.complete();
                            }
                          },
                          error => {
                            console.log("Failed getting activity");
                            observer.next(false);
                            observer.complete();
                          });
                        } else {
                          console.log("Failed getting locations ... kicking out");
                          observer.next(false);
                          observer.complete();
                        }
                      },
                      error => {
                        console.log("Failed getting locations");
                        observer.next(false);
                        observer.complete();
                      });
                    } else {
                      console.log("Failed getting objects ... kicking out");
                      observer.next(false);
                      observer.complete();
                    }
                  },
                  error => {
                    console.log("Failed getting objects");
                    observer.next(false);
                    observer.complete();
                  });
                } else {
                  console.log("Failed getting contacts ... kicking out");
                  observer.next(false);
                  observer.complete();
                }
              },
              error => {
                console.log("Failed getting contacts");
                observer.next(false);
                observer.complete();
              });
            } else {
              console.log("Failed getting received gifts ... kicking out");
              observer.next(false);
              observer.complete();
            }
          },
          error => {
            console.log("Failed getting received gifts");
            observer.next(false);
            observer.complete();
          });
        } else {
          console.log("Failed getting sent gifts ... kicking out");
          observer.next(false);
          observer.complete();
        }
      },
      error => {
        console.log("Failed getting sent gifts");
        observer.next(false);
        observer.complete();
      });
    });
  }

  updateTheirGifts (): Observable<any> {
    return Observable.create(observer => {
      this.getUser().then(data => {
        this.getGIFTToken().then(tokenData => {
          this.http.get<UpdateTheirGiftsResponse>(this.globalVar.getSentGiftsURL(data.ID), {
            headers: new HttpHeaders().set('Authorization', 'GiftToken ' + btoa(data.ID + ":" + tokenData))
          })
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              this.setTheirGifts(data.gifts);
              observer.next(true);
              observer.complete();
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
      });
    });
  }

  updateMyGifts (): Observable<any> {
    return Observable.create(observer => {
      this.getUser().then(data => {
        this.getGIFTToken().then(tokenData => {
          this.http.get<UpdateMyGiftsResponse>(this.globalVar.getReceivedGiftsURL(data.ID), {
            headers: new HttpHeaders().set('Authorization', 'GiftToken ' + btoa(data.ID + ":" + tokenData))
          })
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              this.setMyGifts(data.gifts);
              observer.next(true);
              observer.complete();
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
      });
    });
  }

  updateContacts (): Observable<any> {
    return Observable.create(observer => {
      this.getUser().then(data => {
        this.getGIFTToken().then(tokenData => {
          this.http.get<UpdateContactsResponse>(this.globalVar.getContactsURL(data.ID), {
            headers: new HttpHeaders().set('Authorization', 'GiftToken ' + btoa(data.ID + ":" + tokenData))
          })
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              this.setContacts(data.contacts);
              observer.next(true);
              observer.complete();
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
      });
    });
  }

  updateObjects (): Observable<any> {
    return Observable.create(observer => {
      this.getUser().then(data => {
        this.http.get<UpdateObjectsResponse>(this.globalVar.getObjectsURL(data.ID))
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              this.setObjects(data.objects);
              observer.next(true);
              observer.complete();
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
    });
  }

  updateLocations (): Observable<any> {
    return Observable.create(observer => {
      this.getUser().then(data => {
        this.http.get<UpdateLocationsResponse>(this.globalVar.getLocationsURL())
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              this.setLocations(data.locations);
              observer.next(true);
              observer.complete();
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
    });
  }

  updateActivity (): Observable<any> {
    return Observable.create(observer => {
      this.getUser().then(data => {
        this.getGIFTToken().then(tokenData => {
          this.http.get<UpdateActivityResponse>(this.globalVar.getActivityURL(data.ID), {
            headers: new HttpHeaders().set('Authorization', 'GiftToken ' + btoa(data.ID + ":" + tokenData))
          })
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              this.setActivity(data.responses);
              observer.next(true);
              observer.complete();
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
      });
    });
  }

  sendGift () {
    return Observable.create(observer => {
      this.getUser().then(data => {
        this.getGIFTToken().then(tokenData => {
          this.getUnfinishedGift().then(gift => {
            let body = new URLSearchParams();
            body.append('gift', JSON.stringify(gift));
            this.http.post<FinaliseGiftResponse>(this.globalVar.getFinaliseGiftURL(data.ID), body, {
              headers: new HttpHeaders().set('Authorization', 'GiftToken ' + btoa(data.ID + ":" + tokenData))
            })
            .subscribe(data => {
              if (typeof data.success !== 'undefined' && data.success) {
                observer.next(true);
                observer.complete();
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
        });
      });
    });
  }

  unwrappedGift (giftId) {
    return Observable.create(observer => {
      this.getUser().then(data => {
        this.getGIFTToken().then(tokenData => {
          this.getUnopenedGift(giftId).then(gift => {
            this.http.get<UnwrappedGiftResponse>(this.globalVar.getUnwrappedURL(giftId, data.ID), {
              headers: new HttpHeaders().set('Authorization', 'GiftToken ' + btoa(data.ID + ":" + tokenData))
            })
            .subscribe(data => {
              if (typeof data.success !== 'undefined' && data.success) {
                observer.next(true);
                observer.complete();
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
        });
      });
    });
  }

  receivedGift (giftId) {
    return Observable.create(observer => {
      this.getUser().then(data => {
        this.getGIFTToken().then(tokenData => {
          this.getUnopenedGift(giftId).then(gift => {
            this.http.get<ReceivedGiftResponse>(this.globalVar.getReceivedURL(giftId, data.ID), {
              headers: new HttpHeaders().set('Authorization', 'GiftToken ' + btoa(data.ID + ":" + tokenData))
            })
            .subscribe(data => {
              if (typeof data.success !== 'undefined' && data.success) {
                observer.next(true);
                observer.complete();
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
        });
      });
    });
  }
}
