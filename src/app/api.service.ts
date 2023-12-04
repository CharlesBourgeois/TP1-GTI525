import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  public loadData(url: string): Observable<any> {
    return this.http.get(url);
  }
  public loadDataWithParams(url: string, params: any): Observable<any> {
    let queryParams = new HttpParams();
    for (let key in params) {
      if (params.hasOwnProperty(key)) {
        queryParams = queryParams.append(key, params[key]);
      }
    }

    return this.http.get(url, { params: queryParams });
  }
}
