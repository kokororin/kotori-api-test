import { expect } from 'chai';
import got from 'got';
import sizeOf from 'image-size';
import mlog from 'mocha-logger';

const fetchImage = (url, options = {}) => {
  return new Promise(resolve => {
    const chunks = [];
    let headers = {};
    const stream = got.stream(url, options);
    stream.on('response', response => {
      headers = response.headers;
    });
    stream.on('data', chunk => {
      chunks.push(chunk);
    });
    stream.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve({
        size: sizeOf(buffer),
        headers
      });
    });
  });
};

const testImages = async images => {
  for (const key of Object.keys(images)) {
    const proxyImgURL = images[key];
    const proxyImgInfo = await fetchImage(proxyImgURL);
    const originImgURL = proxyImgInfo.headers['x-pixiv-url'];
    const originImgInfo = await fetchImage(originImgURL, {
      headers: { Referer: 'https://www.pixiv.net' }
    });

    expect(proxyImgInfo.headers['content-type']).to.equal(
      originImgInfo.headers['content-type']
    );
    expect(proxyImgInfo.size.width).to.be.above(0);
    expect(proxyImgInfo.size.height).to.be.above(0);
    expect(proxyImgInfo.size.width).to.equal(originImgInfo.size.width);
    expect(proxyImgInfo.size.height).to.equal(originImgInfo.size.height);
  }
};

describe('api.pixiv.moe', () => {
  const baseURL = 'https://api.pixiv.moe';

  it('/v1/ranking', async () => {
    const response = await got(`${baseURL}/v1/ranking`, {
      json: true
    });
    const data = response.body;

    expect(data.status).to.equal('success');
    expect(Array.isArray(data.response.works)).to.be.true;
    expect(data.response.works.length).to.be.above(10);

    for (const [key, value] of Object.entries(data.response.works)) {
      if (key > 10) {
        break;
      }
      const work = value.work;
      mlog.log(`testing Rank ${value.rank}`);
      expect(work).to.have.property('id');
      expect(work).to.have.property('title');
      expect(work).to.have.property('caption');
      expect(work).to.have.property('tags');
      expect(work).to.have.property('image_urls');
      expect(work).to.have.property('width');
      expect(work).to.have.property('height');
      expect(work).to.have.property('stats');
      await testImages(work.image_urls);
    }
  });

  it('/v1/illust/([0-9]+)', async () => {
    const response = await got(`${baseURL}/v1/illust/64945741`, {
      json: true
    });
    const data = response.body;

    expect(data.status).to.equal('success');
    expect(Object.keys(data.response.image_urls).length).to.be.above(0);
    await testImages(data.response.image_urls);
  });

  it('/v1/illust/comments/([0-9]+)', async () => {
    const response = await got(`${baseURL}/v1/illust/comments/64945741`, {
      json: true
    });
    const data = response.body;

    expect(data.comments.length).to.be.above(0);
  });
});
