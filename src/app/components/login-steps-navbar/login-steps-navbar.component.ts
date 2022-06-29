import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-steps-navbar',
  templateUrl: './login-steps-navbar.component.html',
  styleUrls: ['./login-steps-navbar.component.scss'],
})
export class LoginStepsNavbarComponent implements OnInit {
  @Input() textForm: boolean;
  @Input() creditCardForm = false;

  constructor() {}

  ngOnInit() {}
}
