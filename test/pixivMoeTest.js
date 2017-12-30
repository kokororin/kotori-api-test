import assert from 'power-assert';
import puppeteer from 'puppeteer';

const keywords = [
  {
    en: 'ranking',
    jp: 'ランキング'
  },
  {
    en: 'lovelive',
    jp: 'ラブライブ'
  },
  {
    en: 'honoka',
    jp: '高坂穂乃果'
  },
  {
    en: 'kotori',
    jp: '南ことり'
  },
  {
    en: 'umi',
    jp: '園田海未'
  },
  {
    en: 'maki',
    jp: '西木野真姫'
  },
  {
    en: 'rin',
    jp: '星空凛'
  },
  {
    en: 'hanayo',
    jp: '小泉花陽'
  },
  {
    en: 'nico',
    jp: '矢澤にこ'
  },
  {
    en: 'eli',
    jp: '絢瀬絵里'
  },
  {
    en: 'nozomi',
    jp: '东条希'
  },
  {
    en: 'sunshine',
    jp: 'ラブライブ!サンシャイン!!'
  },
  {
    en: 'chika',
    jp: '高海千歌'
  },
  {
    en: 'you',
    jp: '渡辺曜'
  },
  {
    en: 'riko',
    jp: '桜内梨子'
  },
  {
    en: 'yoshiko',
    jp: '津島善子'
  },
  {
    en: 'hanamaru',
    jp: '国木田花丸'
  },
  {
    en: 'dia',
    jp: '黒澤ダイヤ'
  },
  {
    en: 'ruby',
    jp: '黒澤ルビィ'
  },
  {
    en: 'mari',
    jp: '小原鞠莉'
  },
  {
    en: 'kanan',
    jp: '松浦果南'
  }
];

describe('pixiv.moe', () => {
  it('check gallery page', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://pixiv.moe');
    await page.waitForSelector('.mdl-layout', { visible: true });

    const bodyContent = await page.evaluate(() => {
      return document.body.innerHTML;
    });

    for (const keyword of keywords) {
      assert.equal(true, bodyContent.indexOf(keyword.jp) > -1);
    }

    await browser.close();
  });

  it('check illust page', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://pixiv.moe/illust/55388816');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    const title = await page.evaluate(() => {
      return document.title;
    });

    assert.equal('ラブライブ性転換詰', title);

    await browser.close();
  });
});
