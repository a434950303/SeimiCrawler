package cn.wanghaomiao.seimi.ipproxy.htmlparse;

import cn.wanghaomiao.seimi.ipproxy.IPModel.IPMessage;
import cn.wanghaomiao.seimi.ipproxy.httpbrowser.MyHttpResponse;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

import java.util.List;

import static java.lang.System.out;

/**
 * Created by paranoid on 17-4-10.
 */

public class URLFecter {
    public static String url_template = "http://api3.xiguadaili.com/ip/?tid=556311021780182&num=%s&operator=1,2,3&format=json&show_area=true" +
            "&show_operator=true&category=2&procotol=https&delay=2&longlife=60";
    //西瓜代理网站


    //使用代理进行爬取
    public static boolean urlParse(String url, String ip, String port,
                                   List<IPMessage> ipMessages1) {
        //调用一个类使其返回html源码
        String html = MyHttpResponse.getHtml(url, ip, port);

        if (html != null) {
            //将html解析成DOM结构
            Document document = Jsoup.parse(html);

            //提取所需要的数据
            Elements trs = document.select("table[id=ip_list]").select("tbody").select("tr");

            for (int i = 1; i < trs.size(); i++) {
                IPMessage ipMessage = new IPMessage();
                String ipAddress = trs.get(i).select("td").get(1).text();
                String ipPort = trs.get(i).select("td").get(2).text();
                String ipType = trs.get(i).select("td").get(5).text();
                String ipSpeed = trs.get(i).select("td").get(6).select("div[class=bar]").
                        attr("title");

                ipMessage.setIPAddress(ipAddress);
                ipMessage.setIPPort(ipPort);
                ipMessage.setIPType(ipType);
                ipMessage.setIPSpeed(ipSpeed);


                ipMessages1.add(ipMessage);
            }

            return true;
        } else {
            out.println(ip + ": " + port + " 代理不可用");

            return false;
        }
    }

    //使用本机IP爬取xici代理网站的第一页
    public static List<IPMessage> urlParse(List<IPMessage> ipMessages) {
        String url = "http://www.xicidaili.com/nn/1";
        String html = MyHttpResponse.getHtml(url);

        //将html解析成DOM结构
        Document document = Jsoup.parse(html);

        //提取所需要的数据
        Elements trs = document.select("table[id=ip_list]").select("tbody").select("tr");

        for (int i = 1; i < trs.size(); i++) {
            IPMessage ipMessage = new IPMessage();
            String ipAddress = trs.get(i).select("td").get(1).text();
            String ipPort = trs.get(i).select("td").get(2).text();
            String ipType = trs.get(i).select("td").get(5).text();
            String ipSpeed = trs.get(i).select("td").get(6).select("div[class=bar]").
                    attr("title");

            ipMessage.setIPAddress(ipAddress);
            ipMessage.setIPPort(ipPort);
            ipMessage.setIPType(ipType);
            ipMessage.setIPSpeed(ipSpeed);

            ipMessages.add(ipMessage);
        }

        return ipMessages;
    }

    //使用本机IP爬取xigua代理网站
    public static List<IPMessage> urlParseFromXigua(List<IPMessage> ipMessages, int count) {

        String request_url = String.format(url_template, count);

        String html = MyHttpResponse.getHtml(request_url);
        System.out.println(request_url);

        //System.out.println(html+"(●'◡'●)");

        //将html解析成DOM结构

        JSONArray jsonArray = JSON.parseArray(html);

        for (int i = 0; i < jsonArray.size(); i++) {
            IPMessage ipMessage = new IPMessage();
            JSONObject jsonObject = jsonArray.getJSONObject(i);
            String ipAddress = jsonObject.getString("host");
            String ipPort = jsonObject.getString("port");
            String ipType = "HTTPS";
            String ipSpeed = "1.0秒";
            String area = jsonObject.getString("area");
            String operator = jsonObject.getString("operator");

            ipMessage.setIPAddress(ipAddress);
            ipMessage.setIPPort(ipPort);
            ipMessage.setIPType(ipType);
            ipMessage.setIPSpeed(ipSpeed);
            ipMessage.setArea(area);
            ipMessage.setOperator(operator);
            ipMessages.add(ipMessage);
        }

        return ipMessages;
    }


    public static void urlParse(List<IPMessage> list, List<String> address) {
        String baseUrl = "https://restapi.amap.com/v3/geocode/geo?address=%s&output=JSON&key=8a83e8c756ac716f02e43c0708f536b5";
        int i = 0;
        for (  ; i < address.size(); i++) {
             String   url = String.format(baseUrl, address.get(i));
             System.out.println(url);
            String html = MyHttpResponse.myGetHtml(url, list.get(i).getIPAddress(), list.get(i).getIPPort());
            System.out.println(html);
            if (html != null) {
                //将html解析成DOM结构
                Document document = Jsoup.parse(html);
                System.out.println(document);
                //提取所需要的数据
                Elements trs = document.select("table[id=ip_list]").select("tbody").select("tr");


            } else {

            }
        }
    }
}
