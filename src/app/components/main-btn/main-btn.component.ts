import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-btn',
  templateUrl: './main-btn.component.html',
  styleUrls: ['./main-btn.component.scss'],
})
export class MainBtnComponent implements OnInit {
  @Input() type;
  @Input() fullWidth=false;
  @Input() text = '';
  @Input() disabled = false;
  constructor() { }

  ngOnInit() {}

}
