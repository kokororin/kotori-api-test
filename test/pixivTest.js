import assert from 'power-assert';
import got from 'got';
import btoa from 'btoa';

const baseURL = 'https://api.pixiv.moe';

describe('api.pixiv.moe', () => {
	it('/v1/ranking', async () => {
		const response = await got(`${baseURL}/v1/ranking`, {
			json: true
		});
		const data = response.body;

		assert.equal('success', data.status);
		assert.equal(true, Array.isArray(data.response.works));
		assert.equal(true, data.response.works.length > 0);
	});

	it('/v1/illust/([0-9]+)', async () => {
		const response = await got(`${baseURL}/v1/illust/64945741`, {
			json: true
		});
		const data = response.body;

		assert.equal('success', data.status);
		assert.equal(true, Object.keys(data.response.image_urls).length > 0);
	});

	it('/v1/illust/comments/([0-9]+)', async () => {
		const response = await got(`${baseURL}/v1/illust/comments/64945741`, {
			json: true
		});
		const data = response.body;

		assert.equal(true, data.comments.length > 0);
	});

	it('/v1/image/(.+)', async () => {
		const pixivImg =
			'https://i.pximg.net/c/600x600/img-master/img/2017/09/17/14/47/42/65001705_p0_master1200.jpg';
		const response = await got(`${baseURL}/v1/image/${btoa(pixivImg)}`);
		const data = response.body;

		assert.equal(true, data.length > 2000);
	});
});
