import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutData } from '../../model/layout-data';
import { GitBody } from '../../model/git-body';
import { TokenManagerService } from '../token-manager/token-manager.service';

@Injectable({
  providedIn: 'root'
})
export class GitManagerService {
  branch = 'own-develop'; 
  sha!: string;

  private apiUrl = 'https://api.github.com';
  private owner = 'FrancoisBornancin';
  private repo = 'save-the-date'; 

  private finalApiUrl!: string;
  private finalHeaders!: HttpHeaders;

  data: any;

  constructor(
    private http: HttpClient,
    private tokenManager: TokenManagerService,
  ){

  }

  putData(body: GitBody): Observable<any>{
    const headers: HttpHeaders = this.finalHeaders; 
    return this.http.put(this.finalApiUrl, body, { headers })
  }

  get(filePath: string): Observable<any>{
    this.setRequiredData(filePath);
    return this.getData();
  }

  setRequiredData(filePath: string){
    this.finalApiUrl = this.getApiUrl(filePath);
    this.finalHeaders = this.getHeaders();
  }

  getApiUrl(filePath: string): string{
    return `${this.apiUrl}/repos/${this.owner}/${this.repo}/contents/${filePath}?ref=${this.branch}`;
  }

  getHeaders(): HttpHeaders{
    return new HttpHeaders({
      'Authorization': 'Bearer ' + this.tokenManager.decryptToken(),
      'Content-Type': 'application/json',
    });
  }

  getData(): Observable<any>{
    const headers: HttpHeaders = this.finalHeaders;
    return this.http.get(this.finalApiUrl, { headers }); 
  }

  getResponseContent(response: any): any{
    return JSON.parse(atob(response.content)); 
  }

  getGitBody(filePath: string, stringData: string, stringSha: string): GitBody{
    return{
      message: 'update ' + filePath,
      content: btoa(stringData),
      branch: this.branch,
      sha: stringSha
    }
  }
}
