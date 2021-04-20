import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
  message: string;
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

  progress = 0;
  progressSubscription: Subscription | null = null;

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
      .get<Szenario[]>(environment.simulation_url + 'szenarios')
      .toPromise();

    console.log(this.szenarios);
  }

  async start() {
    const stockname = this.stocks.find(stock => stock.id === this.selectedStock)?.name;

    const messages = [
      `${stockname}: Ein ganz normaler Handelstag.`,
      `Elon Musk twitterte über #${stockname}!`,
      `${stockname} besitzt zur Zeit ein geringes Handelsvolumen.`,
      `Breaking News: ${stockname} wird übernommen!`,
      `${stockname} erfährt sehr hohes Handelsvolumen.`
    ]

    await this.http
      .post(
        environment.simulation_url + 'szenarios',
        {
          szenario: this.selectedSzenario,
          stock: this.selectedStock,
          speedMultiplicator: this.speedMultiplicator,
          message: messages[this.selectedSzenario as number]
        },
        {
          headers: {
            Authorization: 'Bearer ' + this.token,
          },
        }
      )
      .toPromise();

    this.progressSubscription = timer(0, 500)
      .pipe(
        switchMap((_) =>
          this.http.get<number>(environment.simulation_url + 'szenarios/status')
        )
      )
      .subscribe((val) => {
        this.progress = +val.toFixed(2);
      });
  }

  async stop() {
    await this.http
      .post(
        environment.simulation_url + 'szenarios/stop',
        {},
        {
          headers: {
            Authorization: 'Bearer ' + this.token,
          },
        }
      )
      .toPromise();
    this.progressSubscription?.unsubscribe();
  }
}
