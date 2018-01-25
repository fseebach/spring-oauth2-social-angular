import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor (private http: HttpClient) {

  }

  public bla() {
    this.http.get('http://localhost:9999/api/helloworld').subscribe(res => {
      alert(JSON.stringify(res));
    });
  }

}
