<?php
use GuzzleHttp\Client as HttpClient;
use GuzzleHttp\Exception\ClientException as HttpClientException;
use GuzzleHttp\Psr7\Request as HttpRequest;

class PixivTest extends PHPUnit_Framework_TestCase
{
    protected static $client = null;

    public static function setUpBeforeClass()
    {
        self::$client = new HttpClient([
            'base_uri' => 'https://api.pixiv.moe',
            'allow_redirects' => false,
        ]);
    }

    public function testRanking()
    {
        try {
            $request = new HttpRequest('GET', '/v1/ranking');
            $response = self::$client->send($request);
            $data = json_decode((string) $response->getBody(), true);
            $this->assertEquals('success', $data['status']);
            $this->assertTrue(is_array($data['response']['works']));
            $this->assertGreaterThan(0, count($data['response']['works']));
        } catch (HttpClientException $e) {
            throw new Exception('Request Error');
        }
    }

    public function testIllust()
    {
        try {
            $request = new HttpRequest('GET', '/v1/illust/64945741');
            $response = self::$client->send($request);
            $data = json_decode((string) $response->getBody(), true);
            $this->assertEquals('success', $data['status']);
            $this->assertGreaterThan(0, count($data['response']['image_urls']));
        } catch (HttpClientException $e) {
            throw new Exception('Request Error');
        }
    }

    public function testIllustComments()
    {
        try {
            $request = new HttpRequest('GET', '/v1/illust/comments/64945741');
            $response = self::$client->send($request);
            $data = json_decode((string) $response->getBody(), true);
            $this->assertGreaterThan(0, count($data['comments']));
        } catch (HttpClientException $e) {
            throw new Exception('Request Error');
        }
    }

    public function testImage()
    {
        $pixivImg = 'https://i.pximg.net/c/600x600/img-master/img/2017/09/17/14/47/42/65001705_p0_master1200.jpg';
        try {
            $request = new HttpRequest('GET', '/v1/image/' . base64_encode($pixivImg));
            $response = self::$client->send($request);
            $proxyData = (string) $response->getBody();
            $this->assertGreaterThan(20000, strlen($proxyData));
        } catch (HttpClientException $e) {
            throw new Exception('Request Error');
        }
    }
}
