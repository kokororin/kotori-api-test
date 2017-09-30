import assert from 'power-assert';
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

    assert.equal(
      originImgInfo.headers['content-type'],
      proxyImgInfo.headers['content-type']
    );
    assert.equal(true, proxyImgInfo.size.width > 0);
    assert.equal(true, proxyImgInfo.size.height > 0);
    assert.equal(originImgInfo.size.width, proxyImgInfo.size.width);
    assert.equal(originImgInfo.size.height, proxyImgInfo.size.height);
  }
};

describe('api.pixiv.moe', () => {
  const baseURL = 'https://api.pixiv.moe';

  it('/v1/ranking', async () => {
    const response = await got(`${baseURL}/v1/ranking`, {
      json: true
    });
    const data = response.body;

    assert.equal('success', data.status);
    assert.equal(true, Array.isArray(data.response.works));
    assert.equal(true, data.response.works.length > 10);

    for (const value of data.response.works) {
      const work = value.work;
      mlog.log(`testing Rank ${value.rank}`);
      assert.equal(true, work.hasOwnProperty('id'));
      assert.equal(true, work.hasOwnProperty('title'));
      assert.equal(true, work.hasOwnProperty('caption'));
      assert.equal(true, work.hasOwnProperty('tags'));
      assert.equal(true, work.hasOwnProperty('image_urls'));
      assert.equal(true, work.hasOwnProperty('width'));
      assert.equal(true, work.hasOwnProperty('height'));
      assert.equal(true, work.hasOwnProperty('stats'));
      await testImages(work.image_urls);
    }
  });

  it('/v1/illust/([0-9]+)', async () => {
    const response = await got(`${baseURL}/v1/illust/64945741`, {
      json: true
    });
    const data = response.body;

    assert.equal('success', data.status);
    assert.equal(true, Object.keys(data.response.image_urls).length > 0);
    await testImages(data.response.image_urls);
  });

  it('/v1/illust/comments/([0-9]+)', async () => {
    const response = await got(`${baseURL}/v1/illust/comments/64945741`, {
      json: true
    });
    const data = response.body;

    assert.equal(true, data.comments.length > 0);
  });
});
