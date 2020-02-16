import { expect } from 'chai';
import got from 'got';
import mlog from 'mocha-logger';

describe('api.kotori.love', () => {
  const baseURL = 'https://api.kotori.love';
  const songs = [
    '1333128434', // normal
    '541687281', // normal
    '165340' // multiple artists
  ];

  it('/netease/([0-9]+).mp3', async () => {
    let codeSuccess = false;
    let urlSuccess = false;
    for (const id of songs) {
      mlog.log(`testing ${id}`);
      let response;
      try {
        response = await got(`${baseURL}/netease/${id}.mp3`, {
          followRedirect: false
        });
      } catch (e) {
        continue;
      }

      if (response.statusCode === 302) {
        codeSuccess = true;
      }

      if (/m(\d).music.126.net/.test(response.headers.location)) {
        urlSuccess = true;
      }
    }

    expect(codeSuccess).to.be.true;
    expect(urlSuccess).to.be.true;
  });

  it('/netease/([0-9]+).webp', async () => {
    let codeSuccess = false;
    let urlSuccess = false;
    for (const id of songs) {
      mlog.log(`testing ${id}`);
      let response;
      try {
        response = await got(`${baseURL}/netease/${id}.webp`, {
          followRedirect: false
        });
      } catch (e) {
        continue;
      }

      if (response.statusCode === 302) {
        codeSuccess = true;
      }

      if (/p(\d).music.126.net/.test(response.headers.location)) {
        urlSuccess = true;
      }
    }

    expect(codeSuccess).to.be.true;
    expect(urlSuccess).to.be.true;
  });
});
