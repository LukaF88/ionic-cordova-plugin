import { Component, OnInit } from '@angular/core';
import { Intent } from '@ionic-native/intent/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import {InstructionServiceService} from '../instruction-service.service'
import { Platform } from '@ionic/angular';

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

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {

  public songNames: string[]
  public alarms: Alarm[]
  private myintent : Intent
  private myandroidPermissions: AndroidPermissions

  constructor(platform: Platform, intent: Intent, private androidPermissions: AndroidPermissions, private instructionService: InstructionServiceService) {
      this.songNames = new Array()
      this.alarms = new Array()
      this.myintent = intent;
      this.myandroidPermissions = androidPermissions;

      platform.backButton.subscribe(() => {
        if (this.constructor.name == "HomePage")
          if (window.confirm("Vuoi davvero uscire?"))
            navigator['app'].exitApp()
        })
  }

  ngOnInit(): void {
    
    this.myandroidPermissions.requestPermission(this.myandroidPermissions.PERMISSION.READ_EXTERNAL_STORAGE).then(data => {
      if (data.hasPermission) {
        this.retrieveSongs().subscribe((result) => {
          result.forEach(element => {
           this.songNames.push(element);
          });
          this.instructionService.loadRules().subscribe((rules: AlarmInstructions) => {
            alert("Ricevuto" + JSON.stringify(rules, undefined, 2));
            this.alarms = this.createAlarms(rules);
            this.startTimer()
          }, (err: any) =>  alert("PRoblema" + JSON.stringify(err, undefined, 2)))
        }, (err) => {
          alert("Err" + JSON.stringify(err, undefined, 2));
        });
      }


  });
  }
  
  createAlarms(instr: AlarmInstructions): Alarm[] {
    this.alarms = []
    const d = new Date(instr.datetime);
    const NOW = new Date().getTime();
    var created = 0;
    for (var i = 0; created < instr.limit; i++){
      // creo data aggiungendo 'interval' giorni a d
      const date = new Date(d.getTime() + (1000 * 60) * instr.intervalMin * i)
      if (date.getTime() > NOW && instr.days[date.getDay()]) {
        const song = instr.playlist && instr.playlist != "" ? instr.playlist : this.songNames[Math.floor(Math.random() * this.songNames.length)]
        this.alarms.push(this.createAlarm(date, song, instr.group))
        created++;
      }
    }
    
    return this.alarms;
  }

public retrieveSongs(){
    return this.myintent.invoke({
          action: "LIST",
          directory: "MUSIC",
          file: ""
        })
}

  public playSong(song: string) {
      const watch = this.myintent.invoke({
      action: "PLAY",
      directory: "MUSIC",
      file: song
    }).subscribe((result) => {
      result.forEach(element => {
        //alert("Song: " + song);
      });
    }, (err) => {
      alert("Err" + JSON.stringify(err, undefined, 2));
    });
  }

  public createAlarm(_datetime: Date, _playlist: string, _group: string): Alarm { 
    return {
        datetime: _datetime,
        playlist: _playlist,
        group: _group
    };
  }

  private startTimer(){
   return setTimeout(x => {
      if (this.alarms[0].datetime.getTime() < new Date().getTime())
        this.playSong(this.alarms.shift().playlist);
      this.startTimer()
      }, 5000);
  }
  
}
