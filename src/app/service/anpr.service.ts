import { Injectable } from "@angular/core";
import { GenericResponse, SignIn } from "../app.interface";
import { Observable, catchError, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { MessageService } from "primeng/api";

@Injectable()
export class AnprService {
    constructor(private httpClient: HttpClient, private messageService: MessageService){}
    private remoteURL = 'http://localhost:8080/api/v1/'
    private static handleError(error: HttpErrorResponse): any {
        let errorMessage: string;
        if (error.error instanceof ErrorEvent) {
          // Client-side errors
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side errors
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.log('errorMessage     ', errorMessage);
        return throwError(() => errorMessage);
    }

    public get(endpoint: string): Observable<any> {
        const URL = this.remoteURL+endpoint;
        return this.httpClient.get<HttpResponse<any>>(URL).pipe(catchError(AnprService.handleError));
      }

    public post(endpoint: string, body: any): Observable<any> {
        const URL = this.remoteURL+endpoint;
        return this.httpClient.post<HttpResponse<GenericResponse>>(URL, body).pipe(catchError(AnprService.handleError));
    }

    public put(endpoint: string, data: any): Observable<any> {
        const URL = this.remoteURL+endpoint;
        return this.httpClient.put<HttpResponse<any>>(URL, data).pipe(catchError(AnprService.handleError));
      }
    
      public delete(endpoint: string): Observable<any> {
        const URL = this.remoteURL+endpoint;
        return this.httpClient.delete<HttpResponse<any>>(URL).pipe(catchError(AnprService.handleError));
      }

  public addToast(severity: string, summary: string, detail: string) {
    this.messageService.add({ severity, summary, detail });
  }
}