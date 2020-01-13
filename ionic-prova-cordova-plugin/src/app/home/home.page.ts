import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Intent } from '@ionic-native/intent/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import {InstructionServiceService} from '../instruction-service.service'
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Dialogs } from '@ionic-native/dialogs/ngx';

interface Alarm {
  datetime: Date;
  playlist: string;
  group: string;
}

interface AlarmInstructions {
  action: string,
  days: boolean[], // starts from Sunday
  datetime: string,
  intervalMin: number, //DEBUG 
  group: string,
  playlist: string,
  limit: number
}

interface AlarmModifiers {
  id: number,
	type: string,
	alarmId: string
	group: string
	playlist: string
}

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements AfterViewInit {

  public songNames: string[]
  public alarms: Alarm[]
  public modifiers: AlarmModifiers[]
  private myintent : Intent
  private myandroidPermissions: AndroidPermissions
  public debug: string

  constructor(platform: Platform, intent: Intent, private androidPermissions: AndroidPermissions, private instructionService: InstructionServiceService, 
                    private storage: Storage) {
      this.songNames = new Array()
      this.alarms = new Array()
      this.modifiers = new Array()
      this.myintent = intent;
      this.myandroidPermissions = androidPermissions;
      this.debug = "debug"

      platform.backButton.subscribe(() => {
        if (this.constructor.name == "HomePage")
          if (window.confirm("Vuoi davvero uscire?"))
            navigator['app'].exitApp()
        })
  }

  createAlarms(instr: AlarmInstructions): Alarm[] {
    const alarms = []
    const d = new Date(instr.datetime);
    const NOW = new Date().getTime();
    var created = 0;
    for (var i = 0; created < instr.limit; i++){
      // creo data aggiungendo 'interval' giorni a d
      const date = new Date(d.getTime() + (1000 * 60) * instr.intervalMin * i)
      if (date.getTime() > NOW && instr.days[date.getDay()]) {
        const song = instr.playlist && instr.playlist != "" ? instr.playlist : this.songNames[Math.floor(Math.random() * this.songNames.length)]
        alarms.push(this.createAlarm(date, song, instr.group))
        created++;
      }
    }
    

    /*this.storage.set('alarms', alarms);

    // Or to get a key/value pair
    this.storage.get('alarms').then((val) => {
      alert("restituito:  " + val);
    });*/
    return alarms;
  }

  
    ngAfterViewInit() {
      const ctx = this;

      
/*this.dialogs.alert('Hello world')
  .then(() => console.log('Dialog dismissed'))
  .catch(e => console.log('Error displaying dialog', e));
*/
      this.myandroidPermissions.requestPermission(this.myandroidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(data => {
        if (data.hasPermission) 
          this.retrieveSongs().subscribe((result) => {
            result.forEach(element => {
            ctx.songNames.push(element);
            });
            this.instructionService.loadRules().subscribe((rules: AlarmInstructions) => {
              //alert("GOT: " + JSON.stringify(rules, undefined, 2));
              ctx.alarms = this.createAlarms(rules);
              ctx.alarms = this.applyModifiers(ctx.alarms);
              ctx.alarms.sort((a,b) => a.datetime.getTime() - b.datetime.getTime());
              if (ctx.alarms.length > 0)
                ctx.startTimer()
            }, (err: any) =>  alert("Problem: " + JSON.stringify(err, undefined, 2)))
          }, (err) => {
            alert("Error: " + JSON.stringify(err, undefined, 2));
            ctx.alarms = this.applyModifiers(ctx.alarms);
            ctx.alarms.sort((a,b) => a.datetime.getTime() - b.datetime.getTime());
            if (ctx.alarms.length > 0)
                ctx.startTimer()
    });
    });
    }

  applyModifiers(alarms: Alarm[]): Alarm[] {

    // DEBUG: Scrivo un po' di modifiers
    this.modifiers.push({
      id : 1,
      type: "REMOVE",
      alarmId: "2020-01-15T05:30:00",
      group : "",
      playlist : ""
    })
    this.modifiers.push({
      id : 2,
      type: "ADD",
      alarmId: "2020-01-18T15:32:00",
      group : "other",
      playlist : "noino.mp3"
    })
    this.modifiers.push({
      id : 3,
      type: "MODIFY",
      alarmId: "2020-01-13T05:30:00",
      group : "other_one",
      playlist : "noino.mp3"
    })

    // test se esiste 
    this.modifiers.forEach((modifier) => {

      var idx = alarms.findIndex((x) => {
        return x.datetime.getTime() == new Date(modifier.alarmId).getTime()      
     });    
        switch(modifier.type){
          case "REMOVE" : {
            if (idx !== -1){  
              alarms.splice(idx, 1);
            }
          break;}
          case "ADD" : {
            if (idx === -1){  
              alarms.push(this.createAlarm(new Date(modifier.alarmId), modifier.playlist, modifier.group)); // TODO  aggiungerla alla posizione giusta
            }
          break;}
          case "MODIFY" : {
            if (idx !== -1){
              alarms.splice(idx, 1); 
              alarms.push(this.createAlarm(new Date(modifier.alarmId), modifier.playlist, modifier.group)); // TODO  aggiungerla alla posizione giusta
            }
          break;}
        }
    })
    return alarms;
  }

retrieveSongs(){
    return this.myintent.invoke({
          action: "LIST",
          directory: "MUSIC",
          file: ""
        })
}

  playSong(song: string) {
      const watch = this.myintent.invoke({
      action: "PLAY",
      directory: "MUSIC",
      file: song
    }).subscribe((result) => {
      result.forEach(element => {
        alert("Playing " + song + "...");
      });
    }, (err) => {
      alert("Error: " + JSON.stringify(err, undefined, 2));
    });
  }

  createAlarm(_datetime: Date, _playlist: string, _group: string): Alarm { 
    return {
        datetime: _datetime,
        playlist: _playlist,
        group: _group
    };
  }

startTimer(){
   return setTimeout(x => {
      if (this.alarms[0].datetime.getTime() < new Date().getTime())
        this.playSong(this.alarms.shift().playlist);
      this.startTimer()
      }, 5000);
  }
  
}
