import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

type Stock = {
  price: number;
  name: string;
  color: string;
  thumbnail: string;
  id: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'frontend';

  isOpen = false;

  stocks: Stock[] = []
  selectedStock: string|null = null;
  szenarios: any[] = [];

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    console.log('start')
    this.isOpen = await this.http
      .get<boolean>('https://boerse.moonstonks.space/market/isOpen')
      .toPromise();

    this.stocks = await this.http.get<Stock[]>('https://boerse.moonstonks.space/share').toPromise();

    this.szenarios = await this.http.get<any[]>('http://localhost:3000/api/szenarios').toPromise()

    console.log(this.szenarios)
  }
}
