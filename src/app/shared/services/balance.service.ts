import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Balance } from '../interfaces/balance';
import { mergeMap, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {

  constructor(private http: HttpClient) { }

  changeUserBalance(userId: number | undefined, cryptoBalance: Balance) {
    const userUrl = `http://localhost:3000/users/${userId}`;

    return this.http.get(userUrl).pipe(
      switchMap((userData: any) => {
        const mergedBalance = { ...userData.balance };

        for (const key in cryptoBalance) {
          if (cryptoBalance.hasOwnProperty(key)) {
            if (mergedBalance.hasOwnProperty(key)) {
              mergedBalance[key] += cryptoBalance[key];
            } else {
              mergedBalance[key] = cryptoBalance[key];
            }
          }
        }

        const patchData = { balance: mergedBalance };

        return this.http.patch(userUrl, patchData);
      })
    );
  }

  getCurrentUserBalance(userId: number | undefined) {
    return this.http.get(`http://localhost:3000/users/${userId}`)
  }

  depositUSD(userId: number | undefined, value: number) {
    const userUrl = `http://localhost:3000/users/${userId}`;

    return this.http.get(userUrl).pipe(
      mergeMap((userData: any) => {
        const mergedBalance = { ...userData.balance };

        if (mergedBalance.hasOwnProperty('usd-coin')) {
          mergedBalance['usd-coin'] += value;
        } else {
          mergedBalance['usd-coin'] = value;
        }

        const patchData = { balance: mergedBalance };

        return this.http.patch(userUrl, patchData);
      })
    );
  }
}
