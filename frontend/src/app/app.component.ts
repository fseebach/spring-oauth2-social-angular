import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  public user: any;
  public rs1response: any;
  constructor (private http: HttpClient) {

  }

  public bla() {
    //this.http.get('http://localhost:9999/api/auth/me').subscribe(u => {
    //  this.user = u;
    //});

    this.http.get('http://localhost:8888/api/rs1/entity1s').subscribe(res => {
      this.rs1response = JSON.parse(JSON.stringify(res))._embedded.entity1s;
    });
  }

}

