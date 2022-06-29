import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  transportationOptions = [
    {
      title: 'אוטובוס',
      color: '#ffca22',
      id: 1,
      callback:()=>this.onClick(1)
    },
    {
      title: 'רכבת קלה',
      color: '#29c467',
      id: 2,
      callback:()=>this.onClick(2)
    },
    {
      title: 'רכבת ישראל',
      color: '#cf3c4f',
      id: 3,
      callback:()=>this.onClick(3)
    },
    {
      title: 'רכבלית',
      color: '#50c8ff',
      id: 4,
      callback:()=>this.onClick(4)
    },
    {
      title: 'מטרונית',
      color: '#fd7e14',
      id: 5,
      callback:()=>this.onClick(5)
    },
    {
      title: 'הסעות בתי מלון',
      color: '#d63384',
      id: 6,
      callback:()=> {
        this.router.navigate(['/scan']);
      }
    },
  ];
  constructor( private router: Router,) {}

  ngOnInit() {}
  onClick(id){
    console.log(id);
  }
}
