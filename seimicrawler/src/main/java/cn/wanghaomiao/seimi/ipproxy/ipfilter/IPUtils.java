package cn.wanghaomiao.seimi.ipproxy.ipfilter;

import cn.wanghaomiao.seimi.ipproxy.IPModel.IPMessage;
import org.apache.http.HttpHost;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;

import java.io.IOException;
import java.util.List;

import static java.lang.System.out;

/**
 * Created by paranoid on 17-4-21.
 * 测试此IP是否有效
 */

public class IPUtils {
    public static void IPIsable(List<IPMessage> ipMessages1)  {

        int flag = 0 ;
        for(int i = 0; i < ipMessages1.size(); i++) {
            CloseableHttpClient httpClient = new DefaultHttpClient();
            CloseableHttpResponse response = null;
            String ip = ipMessages1.get(i).getIPAddress();
            String port = ipMessages1.get(i).getIPPort();

            HttpHost proxy = new HttpHost(ip, Integer.parseInt(port));
            RequestConfig config = RequestConfig.custom().setProxy(proxy).setConnectTimeout(3000).setConnectionRequestTimeout(1000).
                    setSocketTimeout(3000).build();

            HttpGet httpGet = new HttpGet("https://www.baidu.com");
            httpGet.setConfig(config);

            httpGet.setHeader("Accept", "text/html,application/xhtml+xml,application/xml;" +
                    "q=0.9,image/webp,*/*;q=0.8");
            httpGet.setHeader("Accept-Encoding", "gzip, deflate, sdch");
            httpGet.setHeader("Accept-Language", "zh-CN,zh;q=0.8");
            httpGet.setHeader("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit" +
                    "/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36");

            try {
                String entity = null;
                //得到服务响应状态码
                response = httpClient.execute(httpGet);
               if (response.getStatusLine().getStatusCode() == 200) {
                    entity = EntityUtils.toString(response.getEntity(),"GBK");
                    Document document = Jsoup.parse(entity);
                }
                System.out.println("可用代理已保存(●ˇ∀ˇ●)"+ip+"   "+port+" 已验证"+flag+++"个代理");
            } catch (IOException e) {
                out.println("不可用代理已删除(●ˇ∀ˇ●)" + ipMessages1.get(i).getIPAddress()
                        + ": " + ipMessages1.get(i).getIPPort()+" 已验证"+flag+++"个代理");
                ipMessages1.remove(ipMessages1.get(i));
                i--;
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

        }


    }
}
