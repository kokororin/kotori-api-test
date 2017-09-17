<?php
use GuzzleHttp\Client as HttpClient;
use GuzzleHttp\Exception\ClientException as HttpClientException;
use GuzzleHttp\Psr7\Request as HttpRequest;
use PHPUnit\Framework\TestCase;

class KotoriTest extends TestCase
{
    protected static $client = null;

    public static function setUpBeforeClass()
    {
        self::$client = new HttpClient([
            'base_uri' => 'https://api.kotori.love',
            'allow_redirects' => false,
        ]);
    }

    public function testNeteaseMp3()
    {
        try {
            $request = new HttpRequest('GET', '/netease/487003521.mp3');
            $response = self::$client->send($request);
            $this->assertEquals($response->getStatusCode(), 302);
            $this->assertRegExp('/m([0-9]).music.126.net/', $response->getHeader('location')[0]);
        } catch (HttpClientException $e) {
            throw new Exception('Request Error');
        }
    }

    public function testNeteaseJpg()
    {
        try {
            $request = new HttpRequest('GET', '/netease/487003521.webp');
            $response = self::$client->send($request);
            $this->assertEquals($response->getStatusCode(), 302);
            $this->assertRegExp('/p([0-9]).music.126.net/', $response->getHeader('location')[0]);
        } catch (HttpClientException $e) {
            throw new Exception('Request Error');
        }
    }
}
