import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-end-trip-modal',
  templateUrl: './end-trip-modal.component.html',
  styleUrls: ['./end-trip-modal.component.scss'],
})
export class EndTripModalComponent implements OnInit {
  header: string='הנסיעה הסתיימה';
  origin:string;
  destanation: string;
  constructor() { }

  ngOnInit() {}

}
