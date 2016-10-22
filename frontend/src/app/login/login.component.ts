import { Component, OnInit } from '@angular/core';
import { AuthService } from '@plone/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string;
  password: string;

  constructor(
    public auth: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.auth.loggedin.subscribe(
      data => this.router.navigate(['/'])
    );
  }

  login() {
    this.auth.login(this.username, this.password);
  }

}
