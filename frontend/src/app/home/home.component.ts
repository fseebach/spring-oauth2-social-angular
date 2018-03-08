import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public user: any;
  public rs1response: any;
  constructor (private http: HttpClient) {

  }

  public bla() {

    this.http.get('/api/rs1/entity1s').subscribe(res => {
      this.rs1response = JSON.parse(JSON.stringify(res))._embedded.entity1s;
    });
  }

  ngOnInit() {
  }

}
