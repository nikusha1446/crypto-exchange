import { Injectable } from '@angular/core';
import { Sent, Transaction } from '../interfaces/transaction';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(private http: HttpClient) { }

  createTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>('http://localhost:3000/transactions', transaction);
  }

  getTransactionsById(userId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>('http://localhost:3000/transactions', {
      params: new HttpParams().set('userId', userId.toString())
    });
  }

  createSentTransaction(sentTransaction: Sent) {
    return this.http.post<Sent>('http://localhost:3000/sent', sentTransaction);
  }

  getSentTransactionsById(userId: number): Observable<Sent[]> {
    return this.http.get<Sent[]>('http://localhost:3000/sent', {
      params: new HttpParams().set('userId', userId.toString())
    });
  }
  
}
