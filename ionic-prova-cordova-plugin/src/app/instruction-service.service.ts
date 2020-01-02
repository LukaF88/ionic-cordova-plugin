import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class InstructionServiceService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
      'content-type': 'application/json'
    })
  };

 constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
}
  loadRules() {
    alert("STO PER CHIAMARE");
    return this.http.get("http://compiletime.it/dist/index_cors.php", this.httpOptions);
    }

}

