import { expect } from 'chai';
import got from 'got';
import mlog from 'mocha-logger';

describe('api.kotori.love', () => {
  const baseURL = 'https://api.kotori.love';
  const songs = [
    '477331181',
    '477332177',
    '467952010',
    '27612863',
    '28768036',
    '29747854',
    '28592857',
    '26303180',
    '33111737',
    '26214326',
    '29027453',
    '28138666',
    '22740170',
    '22677448',
    '29307938'
  ];

  it('/netease/([0-9]+).mp3', async () => {
    for (const id of songs) {
      mlog.log(`testing ${id}`);
      const response = await got(`${baseURL}/netease/${id}.mp3`, {
        followRedirect: false
      });

      expect(response.statusCode).to.equal(302);
      expect(/m([0-9]).music.126.net/.test(response.headers.location)).to.be
        .true;
    }
  });

  it('/netease/([0-9]+).webp', async () => {
    for (const id of songs) {
      mlog.log(`testing ${id}`);
      const response = await got(`${baseURL}/netease/${id}.webp`, {
        followRedirect: false
      });

      expect(response.statusCode).to.equal(302);
      expect(/p([0-9]).music.126.net/.test(response.headers.location)).to.be
        .true;
    }
  });
});
