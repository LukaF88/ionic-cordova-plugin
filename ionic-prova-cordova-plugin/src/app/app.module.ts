import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Intent } from '@ionic-native/intent/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import {InstructionServiceService} from './instruction-service.service'
import { HttpClientModule} from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage';
import {IonicGestureConfig} from "./utils/IonicGestureConfig";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,  IonicModule.forRoot(),
    IonicStorageModule.forRoot()],
  providers: [
    StatusBar,
    SplashScreen,
  Intent,
  InstructionServiceService,
  AndroidPermissions,
  IonicGestureConfig,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
