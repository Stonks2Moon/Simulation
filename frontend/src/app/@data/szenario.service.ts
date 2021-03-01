import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SzenarioService {
  constructor(private readonly httpClient: HttpClient) {}

  getAvailableSzenarios() {
    this.httpClient.get('/api').subscribe((v) => {
      console.log('test', v);
    });

    return [];
  }
}
