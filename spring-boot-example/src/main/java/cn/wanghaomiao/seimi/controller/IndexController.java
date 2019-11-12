package cn.wanghaomiao.seimi.controller;

import cn.wanghaomiao.seimi.core.Seimi;
import cn.wanghaomiao.seimi.services.SpiderService;
import cn.wanghaomiao.seimi.spring.common.CrawlerCache;
import cn.wanghaomiao.seimi.struct.CrawlerModel;
import cn.wanghaomiao.seimi.struct.Request;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;

/**
 * @author github.com/zhegexiaohuozi seimimaster@gmail.com
 */
@RestController
@RequestMapping(value = "/seimi")
public class IndexController {

    @Autowired
    private SpiderService spiderService;

    @RequestMapping(value = "/info/{cname}")
    public String crawler(@PathVariable String cname) {
        CrawlerModel model = CrawlerCache.getCrawlerModel(cname);
        if (model == null) {
            return "not find " + cname;
        }
        return model.queueInfo();
    }

    @RequestMapping(value = "spider")
    public String spider(@RequestBody String cname) {
        JSONObject jsonObject = JSONObject.parseObject(cname);
        cname = jsonObject.getString("type");
        CrawlerModel model = CrawlerCache.getCrawlerModel(cname);
        model.getQueueInstance().clearRecord(cname);
        String s= jsonObject.getString("urlText");
        model.getInstance().setStartsUrls(new String[]{s});
        if (model == null) {
            return "not find " + cname;
        }
        model.startRequest();
        return " model.queueInfo()";
    }

    @RequestMapping(value = "send_req")
    public String sendRequest(Request request) {
        CrawlerCache.consumeRequest(request);
        return "consume suc";
    }


    @RequestMapping(value = "getTreeVieW")
    public Object getTreeVieW(@RequestBody String cname) {
        JSONObject res = new JSONObject();
        res.put("list", spiderService.getTree(cname));
        return res;
    }
}
