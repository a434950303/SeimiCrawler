package cn.wanghaomiao.seimi.services;

import cn.wanghaomiao.seimi.domain.Node;
import com.alibaba.fastjson.JSONObject;
import org.springframework.stereotype.Service;

import java.lang.reflect.Array;
import java.util.List;

public interface SpiderService {
    Node getTree(String canem);
}
