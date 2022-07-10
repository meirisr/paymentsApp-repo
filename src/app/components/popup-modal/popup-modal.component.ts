import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-popup-modal',
  templateUrl: './popup-modal.component.html',
  styleUrls: ['./popup-modal.component.scss'],
})
export class PopupModalComponent implements OnInit {
   header:string;
   text:string;
   type:string;
  constructor() { }

  ngOnInit() {}

}
