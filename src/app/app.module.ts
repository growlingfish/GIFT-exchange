import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage';

import { ActivityPage } from '../pages/activity/activity';
import { ContactsPage } from '../pages/contacts/contacts';
import { GiftcardPage } from '../pages/giftcard/giftcard';
import { IntroPage } from '../pages/intro/intro';
import { KickoutPage } from '../pages/kickout/kickout';
import { LoginPage } from '../pages/login/login';
import { LogoutPage } from '../pages/logout/logout';
import { MyGiftsPage } from '../pages/mygifts/mygifts';
import { NewGiftPage } from '../pages/newgift/newgift';
import { NewMessagePage } from '../pages/newmessage/newmessage';
import { ObjectsPage } from '../pages/objects/objects';
import { OpenMessagePage } from '../pages/openmessage/openmessage';
import { OpenMyGiftPage } from '../pages/openmygift/openmygift';
import { OpenObjectPage } from '../pages/openobject/openobject';
import { RegisterPage } from '../pages/register/register';
import { RespondPage } from '../pages/respond/respond';
import { ReviewGiftPage } from '../pages/reviewgift/reviewgift';
import { ReviewObjectPage } from '../pages/reviewobject/reviewobject';
import { ReviewMessagePage } from '../pages/reviewmessage/reviewmessage';
import { ReviewMyGiftPage } from '../pages/reviewmygift/reviewmygift';
import { TabsPage } from '../pages/tabs/tabs';
import { TheirGiftsPage } from '../pages/theirgifts/theirgifts';
import { TsAndCsPage } from '../pages/tsandcs/tsandcs';

import { FCM } from '@ionic-native/fcm';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { UserProvider } from '../providers/user/user';
import { GlobalVarProvider } from '../providers/global-var/global-var';

@NgModule({
  declarations: [
    MyApp,
    ActivityPage,
    ContactsPage,
    GiftcardPage,
    IntroPage,
    KickoutPage,
    LoginPage,
    LogoutPage,
    MyGiftsPage,
    NewGiftPage,
    OpenMessagePage,
    OpenMyGiftPage,
    OpenObjectPage,
    RegisterPage,
    RespondPage,
    ReviewGiftPage,
    ReviewObjectPage,
    ReviewMessagePage,
    ReviewMyGiftPage,
    TabsPage,
    TheirGiftsPage,
    TsAndCsPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ActivityPage,
    ContactsPage,
    GiftcardPage,
    IntroPage,
    KickoutPage,
    LoginPage,
    LogoutPage,
    MyGiftsPage,
    NewGiftPage,
    OpenMessagePage,
    OpenMyGiftPage,
    OpenObjectPage,
    RegisterPage,
    RespondPage,
    ReviewGiftPage,
    ReviewObjectPage,
    ReviewMessagePage,
    ReviewMyGiftPage,
    TabsPage,
    TheirGiftsPage,
    TsAndCsPage
  ],
  providers: [
    FCM,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    GlobalVarProvider
  ]
})
export class AppModule {}
