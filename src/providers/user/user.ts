import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';

import { App, Platform, AlertController, LoadingController, Loading } from 'ionic-angular';

import { BackgroundMode } from '@ionic-native/background-mode';
import { File } from '@ionic-native/file';
import { FCM } from '@ionic-native/fcm';
import { Network } from '@ionic-native/network';
import { Storage } from '@ionic/storage';

import { TabsPage } from '../../pages/tabs/tabs';
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

interface UpdateFreeGiftResponse {
  success: boolean;
  gifts: Array<Object>;
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

interface FinaliseObjectResponse {
  success: boolean;
  object: Object;
  thumbnail: string;
}

interface UpdateVenuesResponse {
  success: boolean;
  venues: Array<Object>;
}

interface UpdateLocationsResponse {
  success: boolean;
  locations: Array<Object>;
}

interface InviteResponse {
  success: boolean;
  user: Object;
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

interface SendResponseResponse {
  success: boolean;
}

@Injectable()
export class UserProvider {
  loading: Loading;
  shownConnected: boolean = false;
  shownDisconnected: boolean = false;
  paused: boolean = false;

  constructor(public app: App, public http: HttpClient,  private storage: Storage, private globalVar: GlobalVarProvider, private platform: Platform, private fcm: FCM, private alertController: AlertController, private loadingCtrl: LoadingController, private network: Network, private file: File, private backgroundMode: BackgroundMode) {
    this.monitorConnection();
  }

  public monitorConnection () {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')){
        this.platform.pause.subscribe(() => {
          this.paused = true;
        });
        this.platform.resume.subscribe(() => {
          this.paused = false; 
        });

        this.network.onDisconnect().subscribe(data => {
          if (!this.paused && !this.shownDisconnected) {
            this.shownDisconnected = true;
            let alert = this.alertController.create({
              title: 'Connection lost',
              subTitle: "You do not have a connection to the internet. Without an internet connection, you cannot log in to the Gift app, or make, send or receive gifts. Please connect to a wifi hotspot, or enable your mobile data connection.",
              buttons: ['OK']
            });
            alert.present();
          }
        }, error => console.error(error));
        this.network.onConnect().subscribe(data => {
          if (!this.paused && !this.shownConnected) {
            setTimeout(() => {
              let alert = this.alertController.create({
                title: 'Connected',
                subTitle: "You have connected to the internet. Now you will be able to log in to the Gift app, and make, send or receive gifts.",
                buttons: ['OK']
              });
              alert.present();
            }, 3000);
          }
        }, error => console.error(error));
      }
    });
  }

  public getSeenIntro (): Promise<boolean> {
    return this.storage.ready().then(() => this.storage.get('seenIntro'));
  }

  public setSeenIntro (val: boolean) {
    return this.storage.ready().then(() => this.storage.set('seenIntro', val));
  }

  public getSeenRoles (): Promise<boolean> {
    return this.storage.ready().then(() => this.storage.get('seenRoles'));
  }

  public setSeenRoles (val: boolean) {
    return this.storage.ready().then(() => this.storage.set('seenRoles', val));
  }

  public getSeenFreeGift (): Promise<boolean> {
    return this.storage.ready().then(() => this.storage.get('seenFreeGift'));
  }

  public setSeenFreeGift (val: boolean) {
    return this.storage.ready().then(() => this.storage.set('seenFreeGift', val));
  }

  public getUser (): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('user'));
  }

  public setUser (val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('user', val));
  }

  public getVenue (): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('venue'));
  }

  public setVenue (val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('venue', val));
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

  public getFreeGift (): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('freeGift'));
  }

  public setFreeGift (val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('freeGift', val));
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

  public getVenues (): Promise<any> {
    return this.storage.ready().then(() => this.storage.get('venues'));
  }

  public setVenues (val: any): Promise<any> {
    return this.storage.ready().then(() => this.storage.set('venues', val));
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

  public clearGiftMedia () {
    this.getUnfinishedGift().then(gift => {
      if (gift !== null && !!gift.payloads) {
        for (var i = 0; i < gift.payloads.length; i++) {
          if (gift.payloads[i].post_content.length > 0 && gift.payloads[i].post_content.match(/\.([0-9a-z]+)(?:[\?#]|$)/i)) { // was this an audio message?
            var matches = gift.payloads[i].post_content.match(/\/([^\/?#]+)[^\/]*$/);
            if (matches.length > 1) {
              if (this.platform.is('ios')) {
                this.file.removeFile(this.file.documentsDirectory, matches[1]);
              } else if (this.platform.is('android')) {
                this.file.removeFile(this.file.externalDataDirectory, matches[1]);
              }
            }
          }
        }
      }
    });
  }

  public clearUnfinishedGift (): Promise<any> {
    this.clearGiftMedia();
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

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  public login (username: string, password: string, venue: Object) {
    if (venue === null) {
      return Observable.throw("Venue not chosen");
    } else if (username === null || password === null) {
      return Observable.throw("Username or password missing");
    } else {
      return Observable.create(observer => {
        this.setVenue(venue).then(result => {
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
      });
    }
  }

  public logout (): Promise<void> {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova')) {
        this.fcm.unsubscribeFromTopic('giftSent');
        this.fcm.unsubscribeFromTopic('giftUnwrapped');
        this.fcm.unsubscribeFromTopic('giftReceived');
        this.fcm.unsubscribeFromTopic('responseSent');
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
        
        console.log("Attempted to subscribe to giftSent");
        this.fcm.subscribeToTopic('giftSent').then(data => {
          console.log("Attempted to subscribe to giftUnwrapped");
          this.fcm.subscribeToTopic('giftUnwrapped').then(data => {
            console.log("Attempted to subscribe to giftReceived");
            this.fcm.subscribeToTopic('giftReceived').then(data => {
              console.log("Attempted to subscribe to responseSent");
              this.fcm.subscribeToTopic('responseSent').then(data => {
                console.log("Finished subscriptions");
              });  
            });  
          });  
        });
        
         
        this.fcm.onNotification().subscribe(data => {
          this.getUser().then(user => {
            if (user == null) {
              // not logged in; no deliveries for me
            } else {
              if (data.wasTapped) { //Notification was received in notification tray (app is in background)
                this.backgroundMode.moveToForeground();
              }
              switch (data.topic) {
                case 'giftSent':
                  if (user.ID == data.recipientID) {
                    let alert = this.alertController.create({
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
                                  this.app.getRootNav().setRoot(TabsPage, {
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
                  break;
                case 'giftUnwrapped':
                  if (data.senderID == user.ID) {
                    let alert = this.alertController.create({
                      title: data.title,
                      message: data.body,
                      buttons: ['OK']
                    });
                    alert.present();
                  }
                  break;
                case 'giftReceived':
                  if (data.senderID == user.ID) {
                    let alert = this.alertController.create({
                      title: data.title,
                      message: data.body,
                      buttons: ['OK']
                    });
                    alert.present();
                  }
                  break;
                case 'responseSent':
                  if (data.owner == user.ID) {
                    let alert = this.alertController.create({
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
                                  this.app.getRootNav().setRoot(TabsPage, {
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
                  }
                  break;
                default:
                  //console.log(data);
                  break;
              }
            }
          });
        });
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
                              
                              this.updateFreeGift().subscribe(complete => {
                                if (complete) {
                                  console.log("Succeeded getting free gift");
                                  observer.next(true);
                                  observer.complete();
                                } else {
                                  console.log("Failed getting free gift ... kicking out");
                                  observer.next(false);
                                  observer.complete();
                                }
                              },
                              error => {
                                console.log("Failed getting free gift");
                                observer.next(false);
                                observer.complete();
                              });
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

  updateFreeGift (): Observable<any> {
    return Observable.create(observer => {
      this.getVenue().then(venue => {
        this.http.get<UpdateFreeGiftResponse>(this.globalVar.getFreeGiftURL(venue.ID))
        .subscribe(data => {
          if (typeof data.success !== 'undefined' && data.success) {
            if (data.gifts.length > 0) {
              this.setFreeGift(data.gifts[0]);
            }
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
        this.getVenue().then(venue => {
          this.http.get<UpdateObjectsResponse>(this.globalVar.getObjectsURL(venue.ID, data.ID))
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
    });
  }

  updateVenues (): Observable<any> {
    return Observable.create(observer => {
      this.getUser().then(data => {
        this.http.get<UpdateVenuesResponse>(this.globalVar.getVenuesURL())
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              this.setVenues(data.venues);
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
        this.getVenue().then(venue => {
          this.http.get<UpdateLocationsResponse>(this.globalVar.getLocationsURL(venue.ID))
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

  invite (email: string, name: string): Observable<any> {
    return Observable.create(observer => {
      this.getUser().then(data => {
        this.getGIFTToken().then(tokenData => {
          this.http.get<InviteResponse>(this.globalVar.getInviteURL(data.ID, email, name), {
            headers: new HttpHeaders().set('Authorization', 'GiftToken ' + btoa(data.ID + ":" + tokenData))
          })
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              observer.next(data.user);
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

  finaliseObject (object: any, name: string) {
    return Observable.create(observer => {
      this.getUser().then(data => {
        this.getGIFTToken().then(tokenData => {
          this.http.post<FinaliseObjectResponse>(this.globalVar.getFinaliseObjectURL(data.ID), {
            object: JSON.stringify(object),
            name: name
          }, {
            headers: new HttpHeaders().set('Authorization', 'GiftToken ' + btoa(data.ID + ":" + tokenData))
          })
          .subscribe(data => {
            if (typeof data.success !== 'undefined' && data.success) {
              observer.next(data.object);
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
            this.http.post<FinaliseGiftResponse>(this.globalVar.getFinaliseGiftURL(data.ID), {
              gift: JSON.stringify(gift)
            },{
              headers: new HttpHeaders().set('Authorization', 'GiftToken ' + btoa(data.ID + ":" + tokenData))
            })
            .subscribe(data => {
              if (typeof data.success !== 'undefined' && data.success) {
                this.clearGiftMedia();
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

  sendResponse (giftId, response, owner) {
    return Observable.create(observer => {
      this.getUser().then(data => {
        this.getGIFTToken().then(tokenData => {
          this.http.post<SendResponseResponse>(this.globalVar.getResponseURL(giftId), {
            response: response,
            responder: data.ID
          }, {
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
  }
}
