import { expect } from 'chai';
import cheerio from 'cheerio';
import got from 'got';

describe('pixiv.moe', () => {
  it('check page', async () => {
    const response = await got('https://pixiv.moe');
    const $ = cheerio.load(response.body, { decodeEntities: false });
    expect($('title').html()).to.equal('pixivギャラリー');
  });
});
