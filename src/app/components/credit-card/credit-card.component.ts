import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.scss'],
})
export class CreditCardComponent implements OnInit {
  @Input() cardNum='';
  @Input() cvsNum='';
  @Input() cardDate='';
  @Input() userName='';
  @Input() flipClass='';
  constructor() { }

  ngOnInit() {}

}
