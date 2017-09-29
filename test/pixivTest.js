import assert from 'power-assert';
import got from 'got';
import sizeOf from 'image-size';

const baseURL = 'https://api.pixiv.moe';

describe('api.pixiv.moe', () => {
  it('/v1/ranking', async () => {
    const response = await got(`${baseURL}/v1/ranking`, {
      json: true
    });
    const data = response.body;

    assert.equal('success', data.status);
    assert.equal(true, Array.isArray(data.response.works));
    assert.equal(true, data.response.works.length > 10);
  });

  it('/v1/illust/([0-9]+)', async () => {
    const response = await got(`${baseURL}/v1/illust/64945741`, {
      json: true
    });
    const data = response.body;

    assert.equal('success', data.status);
    assert.equal(true, Object.keys(data.response.image_urls).length > 0);

    const fetchImage = (url, options) => {
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

    Object.keys(data.response.image_urls).forEach(async key => {
      const proxyImgURL = data.response.image_urls[key];
      const proxyImgInfo = await fetchImage(proxyImgURL);
      const originImgURL = proxyImgInfo.headers['x-pixiv-url'];
      const originImgInfo = await fetchImage(originImgURL, {
        headers: { Referer: 'https://www.pixiv.net' }
      });

      assert.equal(200, proxyImgInfo.headers.status);
      assert.equal('image/jpeg', proxyImgInfo.headers['content-type']);
      assert.equal(originImgInfo.size.width, proxyImgInfo.size.width);
      assert.equal(originImgInfo.size.width, proxyImgInfo.size.height);
    });
  });

  it('/v1/illust/comments/([0-9]+)', async () => {
    const response = await got(`${baseURL}/v1/illust/comments/64945741`, {
      json: true
    });
    const data = response.body;

    assert.equal(true, data.comments.length > 0);
  });
});
