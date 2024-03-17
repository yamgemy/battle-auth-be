import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(emailToRegister: string, generatedTotp: string) {
    const result = await this.mailerService
      .sendMail({
        to: emailToRegister,
        // from: '"Support Team" <support@example.com>', // override default from
        subject: 'Finish your registration at BattleAuth',
        template: '../templates/verify-email-by-otp', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          generatedTotp: generatedTotp,
        },
      })
      .catch((e) => {
        console.log('@sendUserConfirmation error', e);
      });
    return result;
  }
}

/*
{
  accepted: [ 'withoutjustonenest@gmail.com' ],
  rejected: [],
  ehlo: [
    'SIZE 35882577',
    '8BITMIME',
    'AUTH LOGIN PLAIN XOAUTH2 PLAIN-CLIENTTOKEN OAUTHBEARER XOAUTH',
    'ENHANCEDSTATUSCODES',
    'PIPELINING',
    'CHUNKING',
    'SMTPUTF8'
  ],
  envelopeTime: 884,
  messageTime: 1530,
  messageSize: 610,
  response: '250 2.0.0 OK  1710430662 m2-20020a170902db0200b001db81640315sm1853325plx.91 - gsmtp',
  envelope: {
    from: 'noreply@battleauth247.com',
    to: [ 'withoutjustonenest@gmail.com' ]
  },
  messageId: '<bf3da75b-fb6e-a0a7-5d18-a1f0aa3d09bb@battleauth247.com>'
}

*/
