package cn.wanghaomiao.seimi.crawlers;

import cn.wanghaomiao.seimi.annotation.Crawler;
import cn.wanghaomiao.seimi.def.BaseSeimiCrawler;
import cn.wanghaomiao.seimi.def.DefaultLocalQueue;
import cn.wanghaomiao.seimi.domain.DirConfig;
import cn.wanghaomiao.seimi.ipproxy.IPModel.IPMessage;
import cn.wanghaomiao.seimi.ipproxy.database.MyRedis;
import cn.wanghaomiao.seimi.struct.Request;
import cn.wanghaomiao.seimi.struct.Response;
import org.seimicrawler.xpath.JXDocument;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;

/**
 * 使用seimicrawler提供的默认redis队列实现，独立启动需通过 {@link cn.wanghaomiao.seimi.config.SeimiConfig} 配置redis信息，
 * spring boot 请自行注册 {@link org.redisson.Redisson} bean ,相关配置请参考 https://github.com/redisson/redisson/wiki/2.-%E9%85%8D%E7%BD%AE%E6%96%B9%E6%B3%95
 *
 * @author github.com/zhegexiaohuozi seimimaster@gmail.com
 * @since 2015/10/21.
 */
@Crawler(name = "moonAll", queue = DefaultLocalQueue.class)
public class MoonAll extends BaseSeimiCrawler {

    @Autowired
    DirConfig dirConfig;

    @Override
    public String[] startUrls() {
        //http://lroc.sese.asu.edu/data/
        //http://lroc.sese.asu.edu/data/LRO-L-LROC-2-EDR-V1.0/LROLRC_0040A/
        //http://lroc.sese.asu.edu/data/LRO-L-LROC-2-EDR-V1.0/LROLRC_0001/
        return getStartsUrls();
    }

    public String[] getStartsUrls() {
        if (startsUrls != null && startsUrls.length > 0) {
            return startsUrls;
        }
        return new String[]{"http://lroc.sese.asu.edu/data/LRO-L-LROC-2-EDR-V1.0/LROLRC_0001/CATALOG/"};
    }

    public void setStartsUrls(String[] startsUrls) {
        this.startsUrls = startsUrls;
    }

    @Override
    public void start(Response response) {
        JXDocument doc = response.document();
        System.out.println(response.getContent());
        try {
            List<Object> urls = doc.sel("//a/@href");
            urls = filter(urls);
            logger.info("爬取的url：{},当前页面获取的新的爬取页面数：{}   ", response.getRealUrl(), urls.size());
            for (int i = 0; i < urls.size(); i++) {
                Object s = urls.get(i);
                String flagStr = s.toString();
                s = response.getRealUrl() + s;
                if (!flagStr.endsWith("/")) {
                    logger.info("爬取的url：{},当前页面获取的可下载文件：{}   ", response.getRealUrl(), i + "__ " + s);
                    push(Request.build(s.toString(), MoonAll::downFile));
                } else {
                    logger.info("爬取的url：{},当前页面获取的新的爬取页URL：{}   ", response.getRealUrl(), i + "__ " + s);
                    push(Request.build(s.toString(), MoonAll::start));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private List<Object> filter(List<Object> urls) {
        List<Object> result = new LinkedList();
        for (Object s : urls) {
            if (s.toString().contains("?C=") && s.toString().contains("O=")) {
            } else {
                result.add(s);
            }
        }

        return result;
    }

    public void downFile(Response response) {
        String filePath = response.getRealUrl();
        String basedir = dirConfig.getMoonAllBaseDir();

        filePath = filePath.replace("http://lroc.sese.asu.edu/data", basedir);
        File file = new File(filePath);
        File fileParet = new File(file.getParent());
        if (!file.exists()) {
            try {
                if (!fileParet.exists()) {
                    fileParet.mkdirs();
                }
                new File(file.getParent()).mkdirs();
                file.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        try {
            logger.info("下载文件的 url:{} ", response.getRealUrl());
            response.saveTo(file);
            //do something
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public String proxy() {
        MyRedis myRedis = new MyRedis();
        IPMessage ip = myRedis.getIPByList();
        String s = ip.getIPType().substring(0, 4).toLowerCase() + "://" + ip;
        logger.info("prox = " + s);
        return s;
    }
}
