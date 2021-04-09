import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

type Stock = {
  price: number;
  name: string;
  color: string;
  thumbnail: string;
  id: string;
};

export type Szenario = {
  id: number;
  name: string;
  data: { time: string; volume: number; delta: number }[];
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Simulation';

  isOpen = false;

  stocks: Stock[] = [];
  szenarios: Szenario[] = [];
  
  
  selectedStock: string | null = null;
  selectedSzenario: number | null = null;
  token: string | null = null;

  speedMultiplicator = 60;

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    console.log('start');
    this.isOpen = await this.http
      .get<boolean>('https://boerse.moonstonks.space/market/isOpen')
      .toPromise();

    this.stocks = await this.http
      .get<Stock[]>('https://boerse.moonstonks.space/share')
      .toPromise();

    this.szenarios = await this.http
      .get<Szenario[]
      >('http://localhost:3000/api/szenarios')
      .toPromise();

    console.log(this.szenarios);
  }

  async start() {
    await this.http.post('http://localhost:3000/api/szenarios', {
      szenario: this.selectedSzenario,
      stock: this.selectedStock,
      speedMultiplicator: this.speedMultiplicator,
    }, {
      headers: {
        Authorization: 'Bearer ' + this.token
      }
    }).toPromise()
  }
}
