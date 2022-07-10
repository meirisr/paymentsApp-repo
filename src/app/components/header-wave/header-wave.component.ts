import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-wave',
  templateUrl: './header-wave.component.html',
  styleUrls: ['./header-wave.component.scss'],
})
export class HeaderWaveComponent implements OnInit {
@Input() text: string
@Input() big: boolean=false;
  constructor() { }

  ngOnInit() {}

}
