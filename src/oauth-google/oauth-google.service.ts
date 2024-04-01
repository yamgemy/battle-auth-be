import { Injectable } from '@nestjs/common';
import { getRandomValues, subtle } from 'crypto';

@Injectable()
export class OauthGoogleService {
  async something(payload: any) {
    console.log('@OauthGoogleService something ', payload);
  }

  generateCodeVerifier(): string {
    const array = new Uint8Array(32); // Create a byte array of length 32
    getRandomValues(array); // Fill the array with random values

    // Base64 encode the array with URL and padding safe characters
    return btoa(String.fromCharCode(...array)).replace(
      /[+\/=]/g,
      (char) => ({ '+': '-', '/': '_', '=': '' })[char],
    );
  }

  async generateCodeChallenge(verifier: string): Promise<string> {
    const buffer = new TextEncoder().encode(verifier); // Convert verifier to buffer
    const hashBuffer = await subtle.digest('SHA-256', buffer); // Hash the buffer using SHA-256
    const challenge = btoa(
      String.fromCharCode(...new Uint8Array(hashBuffer)),
    ).replace(/[+\/=]/g, (char) => ({ '+': '-', '/': '_', '=': '' })[char]);
    return challenge;
  }
}
