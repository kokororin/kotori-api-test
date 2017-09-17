import assert from 'power-assert';
import got from 'got';

const baseURL = 'https://api.kotori.love';

describe('api.kotori.love', () => {
	it('/netease/([0-9]+).mp3', async () => {
		const response = await got(`${baseURL}/netease/487003521.mp3`, {
			followRedirect: false
		});

		assert.equal(302, response.statusCode);
		assert.equal(
			true,
			/m([0-9]).music.126.net/.test(response.headers.location)
		);
	});

	it('/netease/([0-9]+).webp', async () => {
		const response = await got(`${baseURL}/netease/487003521.webp`, {
			followRedirect: false
		});

		assert.equal(302, response.statusCode);
		assert.equal(
			true,
			/p([0-9]).music.126.net/.test(response.headers.location)
		);
	});
});
