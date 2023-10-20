import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Balance } from '../interfaces/balance';
import { switchMap } from 'rxjs';

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
}
