import { Injectable } from '@nestjs/common';
import * as c from 'crypto';
import * as URLSafeBase64 from 'urlsafe-base64';
@Injectable()
export class OauthGoogleService {
  async something(payload: any) {
    console.log('@OauthGoogleService something ', payload);
  }

  generateCodeVerifier(): string {
    const array = new Uint8Array(32); // Create a byte array of length 32
    c.getRandomValues(array); // Fill the array with random values

    // Base64 encode the array with URL and padding safe characters
    return URLSafeBase64.encode(btoa(String.fromCharCode(...array)));
  }

  async generateCodeChallenge(verifier: string): Promise<string> {
    const buffer = Buffer.from(verifier, 'utf8');

    // Hash the buffer using SHA-256:
    const hashBuffer = c.createHash('sha256').update(buffer).digest();

    return URLSafeBase64.encode(hashBuffer);
  }
}
