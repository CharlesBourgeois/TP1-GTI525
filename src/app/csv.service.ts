import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as Papa from 'papaparse';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor(private http: HttpClient) { }

  public loadData(filePath: string = 'assets/compteurs.csv'): Promise<any[]> {
    return this.http.get(filePath, { responseType: 'text' }).toPromise()
      .then(data => {
        let parsedData: any[] = [];
        if (data) {
          Papa.parse(data, {
            header: true,
            complete: (result) => {
              if (result && Array.isArray(result.data)) {
                parsedData = result.data;
              }
            }
          });
        }
        return parsedData;
      });
  }
}

