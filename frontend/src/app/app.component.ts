import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

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
      .get<boolean>(environment.boerse_url + 'market/isOpen')
      .toPromise();

    this.stocks = await this.http
      .get<Stock[]>(environment.boerse_url + 'share')
      .toPromise();

    this.szenarios = await this.http
      .get<Szenario[]>(environment.simulation_url + 'api/szenarios')
      .toPromise();

    console.log(this.szenarios);
  }

  async start() {
    await this.http
      .post(
        environment.simulation_url + 'api/szenarios',
        {
          szenario: this.selectedSzenario,
          stock: this.selectedStock,
          speedMultiplicator: this.speedMultiplicator,
        },
        {
          headers: {
            Authorization: 'Bearer ' + this.token,
          },
        }
      )
      .toPromise();
  }

  async stop() {
    await this.http
      .post(
        environment.simulation_url + 'api/szenarios/stop',
        {},
        {
          headers: {
            Authorization: 'Bearer ' + this.token,
          },
        }
      )
      .toPromise();
  }
}
