import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Httpdata } from 'src/app/shared/interfaces/httpdata';

@Injectable({
  providedIn: 'root'
})
export class CoinService {
  private API_KEY = 'CG-Yk4D8SiWo13Hc69nN5pnLnbC'

  constructor(private http: HttpClient) { }

  getCoinList(): Observable<Httpdata[]> {
    return this.http.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&x_cg_demo_api_key=${this.API_KEY}`).pipe(
      map((response: Object) => response as Httpdata[])
    );
  }

}
