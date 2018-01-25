import { AuthserviceService } from './../authservice.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Params } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-oauth2connect',
  templateUrl: './oauth2connect.component.html',
  styleUrls: ['./oauth2connect.component.css']
})
export class Oauth2connectComponent implements OnInit {

  constructor(private route: ActivatedRoute, private authserviceService: AuthserviceService) {
    // Bä... das geht auch schöner =)
    const b = {};
    this.route.fragment.subscribe((fragment: String) => {
      const token = fragment.split('&').map(param => {
        return param.split('=');
      }).filter(e => e[0] === 'access_token')[0][1];
      this.authserviceService.nextToken(token);
    });

  }

  ngOnInit() {
  }

}
