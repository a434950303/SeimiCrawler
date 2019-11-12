package cn.wanghaomiao.seimi.ipproxy.httpbrowser;

import org.apache.http.HttpHost;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.message.BasicHeader;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.*;
import java.nio.charset.Charset;

import static java.lang.System.out;
import static redis.clients.jedis.Protocol.CHARSET;

/**
 * Created by paranoid on 17-4-10.
 * 进行代理访问
 *
 * setConnectTimeout：设置连接超时时间，单位毫秒.
 * setConnectionRequestTimeout：设置从connect Manager获取Connection 超时时间，单位毫秒.
 * 这个属性是新加的属性，因为目前版本是可以共享连接池的.
 * setSocketTimeout：请求获取数据的超时时间，单位毫秒.如果访问一个接口，多少时间内无法返回数据，
 * 就直接放弃此次调用。
 */

public class MyHttpResponse {
    public static String getHtml( String url, String ip, String port) {
        String entity = null;
       // CloseableHttpClient httpClient = HttpClients.createDefault();

        // CloseableHttpClient httpClient = new DefaultHttpClient();
        // 创建HttpClientBuilder
        HttpClientBuilder httpClientBuilder = HttpClientBuilder.create();
// HttpClient
        CloseableHttpClient httpClient = httpClientBuilder.build();
        CloseableHttpResponse response = null;

        //设置代理访问和超时处理
        out.println("此时线程: " + Thread.currentThread().getName() + " 爬取所使用的代理为: "
                + ip + ":" + port);
        HttpHost proxy = new HttpHost(ip, Integer.parseInt(port));
        RequestConfig config = RequestConfig.custom().setProxy(proxy).setConnectTimeout(3000).
                setSocketTimeout(3000).build();
        HttpGet httpGet = new HttpGet(url);
        httpGet.setConfig(config);

        httpGet.setHeader("Accept", "text/html,application/xhtml+xml,application/xml;" +
                "q=0.9,image/webp,*/*;q=0.8");
        httpGet.setHeader("Accept-Encoding", "gzip, deflate, sdch");
        httpGet.setHeader("Accept-Language", "zh-CN,zh;q=0.8");
        httpGet.setHeader("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 " +
                "(KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36");

        try {
            //客户端执行httpGet方法，返回响应
            CloseableHttpResponse httpResponse = httpClient.execute(httpGet);

            //得到服务响应状态码
            if (httpResponse.getStatusLine().getStatusCode() == 200) {
                entity = EntityUtils.toString(httpResponse.getEntity(), "utf-8");
            }

            httpResponse.close();
            httpClient.close();
        } catch (ClientProtocolException e) {
            entity = null;
        } catch (IOException e) {
           System.out.println(e);
            entity = null;
        }

        return entity;
    }


    public static String myGetHtml( String url, String ip, String port) {
        CloseableHttpClient httpClient = new DefaultHttpClient();
        CloseableHttpResponse response = null;

        HttpHost proxy = new HttpHost(ip, Integer.parseInt(port));
        RequestConfig config = RequestConfig.custom().setProxy(proxy).setConnectTimeout(3000).setConnectionRequestTimeout(1000).
                setSocketTimeout(3000).build();

        HttpGet httpGet = new HttpGet(url);
        httpGet.setConfig(config);

        httpGet.setHeader("Accept", "text/html,application/xhtml+xml,application/xml;" +
                "q=0.9,image/webp,*/*;q=0.8");
        httpGet.setHeader("Accept-Encoding", "gzip, deflate, sdch");
        httpGet.setHeader("Accept-Language", "zh-CN,zh;q=0.8");
        httpGet.setHeader("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit" +
                "/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36");
        String entity = null;
        try {
            //得到服务响应状态码
            response = httpClient.execute(httpGet);
              if (response.getStatusLine().getStatusCode() == 200) {
                    entity = EntityUtils.toString(response.getEntity(),"utf-8");
                    Document document = Jsoup.parse(entity);
                  Elements trs = document.select("body");
                  System.out.println(trs.html());
                  System.out.println(entity);
              }
            //    System.out.println(response.toString()+"!(●ˇ∀ˇ●)");
        } catch (IOException e) {
            out.println("不可用代理(●ˇ∀ˇ●)" + ip
                    + ": " + port);
        }
        try {
            if (httpClient != null) {
                httpClient.close();
            }
            if (response != null) {
                response.close();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return entity;
    }

    //对上一个方法的重载，使用本机ip进行网站爬取
    public static String getHtml(String strUrl) {
        String entity = null;
         try {
            URL url = new URL(strUrl);
            HttpURLConnection uConnection = (HttpURLConnection) url.openConnection();
            Thread.sleep(200);                          //延时200MS
            int flag = uConnection.getResponseCode();       //获取返回状态码 当为200的时候 对正确返回的字符串进行 解析
            if (flag == 200) {
                BufferedReader br = new BufferedReader(new InputStreamReader(url.openStream(), Charset.forName(CHARSET)));
                String s = "";
                StringBuffer sb = new StringBuffer("");
                while ((s = br.readLine()) != null) {
                    sb.append(s);
                }
                br.close();
                return sb.toString();
            } else {                            //
                return "";
            }

        } catch (Exception e) {
            return "";
        }
    }


    public static String getHtmlTest( String url, String ip, String port) throws UnsupportedEncodingException {
        String entity = null;
        // CloseableHttpClient httpClient = HttpClients.createDefault();

        URL url1 = null;
        try {
            url1 = new URL(url);
        } catch (MalformedURLException e) {
            e.printStackTrace();
        }
        URI uri = null;
        try {
            uri = new URI(url1.getProtocol(), url1.getHost(), url1.getPath(), url1.getQuery(), null);
        } catch (URISyntaxException e) {
            e.printStackTrace();
        }
        // CloseableHttpClient httpClient = new DefaultHttpClient();
        // 创建HttpClientBuilder
        HttpClientBuilder httpClientBuilder = HttpClientBuilder.create();
// HttpClient
        CloseableHttpClient httpClient = httpClientBuilder.build();
        CloseableHttpResponse response = null;

        //设置代理访问和超时处理
        out.println("此时线程: " + Thread.currentThread().getName() + " 爬取所使用的代理为: "
                + ip + ":" + port);
        HttpHost proxy = new HttpHost(ip, Integer.parseInt(port));
        RequestConfig config = RequestConfig.custom().setProxy(proxy).setConnectTimeout(10*3000).
                setSocketTimeout(10*3000).setConnectionRequestTimeout(30*1000).build();
        HttpPost httppost = new HttpPost(uri);
        httppost.setConfig(config);
        String jsonstr = "{\"features\": [{\"Uuid\": 0,\"x\": 114.948,\"y\": 38.55,\"p\":\"epsg4326\"},{\"Uuid\": 1,\"x\": 115.39,\"y\": 38.32,\"p\":\"epsg3857\"}]}";
        StringEntity se = new StringEntity(jsonstr);
        se.setContentType("text/json");
        se.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE, "application/json"));
        httppost.setEntity(se);
        httppost.setHeader("Accept", "text/html,application/xhtml+xml,application/xml;" +
                "q=0.9,image/webp,*/*;q=0.8");
        httppost.setHeader("Accept-Encoding", "gzip, deflate, sdch");
        httppost.setHeader("Accept-Language", "zh-CN,zh;q=0.8");
        httppost.setHeader("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 " +
                "(KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36");

        try {
            //客户端执行httpGet方法，返回响应
            CloseableHttpResponse httpResponse = httpClient.execute(httppost);

            //得到服务响应状态码
            if (httpResponse.getStatusLine().getStatusCode() == 200) {
                entity = EntityUtils.toString(httpResponse.getEntity(), "utf-8");
                System.out.println(entity);
            }

            httpResponse.close();
            httpClient.close();
        } catch (ClientProtocolException e) {
            entity = null;
        } catch (IOException e) {
            System.out.println(e);
            entity = null;
        }

        return entity;
    }
}
