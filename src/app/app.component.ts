import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private apiUrl = 'https://api.github.com';
  private owner = 'FrancoisBornancin'; // Remplacez par le propriétaire du référentiel
  private repo = 'save-the-date'; // Remplacez par le nom du référentiel
  private branch = 'own-develop'; // Remplacez par le nom de la branche
  private filePath: string = 'test.txt';

  constructor(private http: HttpClient){

  }

  pushToGit() {
    const apiUrl = `${this.apiUrl}/repos/${this.owner}/${this.repo}/contents/${this.filePath}?ref=${this.branch}`;


    // !!!! Le token est supprimé après chaque Push !!!!
    const headers = new HttpHeaders({
      // 'Authorization': 'Bearer ' + environment.accessToken,
      'Content-Type': 'application/json',
    });

    console.log("apiUrl: ", apiUrl)
    console.log("headers: ", headers)
  
    // Récupérer le contenu et le SHA actuels du fichier
    this.http.get(apiUrl, { headers }).subscribe({
      next: (response: any) => {
        const sha = response.sha;
        const content: string = atob(response.content); // Décode le contenu de base64
        const newContent: string = 'TOTO'; // Nouveau contenu du fichier
  
        const commitMessage = 'update ' + this.filePath;
        const body = {
          message: commitMessage,
          content: btoa(content + ' ' + newContent), // Encode content to base64
          branch: this.branch,
          sha: sha // Fournir le SHA actuel du fichier
        };
  
        // Mettre à jour le fichier avec le nouveau contenu
        this.http.put(apiUrl, body, { headers }).subscribe({
          next: e => {
            console.log(e);
          },
          error: e => {
            console.log(e);
          },
        });
      },
      error: e => {
        console.log(e);
      },
    });
  }
}
