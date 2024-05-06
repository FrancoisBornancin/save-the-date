import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenManagerService {
  token: string = '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ZXX';

  decryptToken(): string{
    return this.token.split('Z')[0];
  }

}
