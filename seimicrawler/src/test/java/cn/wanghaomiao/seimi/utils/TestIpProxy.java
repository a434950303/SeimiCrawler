package cn.wanghaomiao.seimi.utils;

import cn.wanghaomiao.seimi.ipproxy.IPModel.IPMessage;
import cn.wanghaomiao.seimi.ipproxy.database.MyRedis;

import java.util.List;

public class TestIpProxy {
    public static  void  main(String[] args){
        MyRedis myRedis = new MyRedis();
        List<IPMessage> ipList = myRedis.getIPList(0, 10);
        IPMessage ip = myRedis.getIPByList();
        System.out.println(ip);
        System.out.println(ipList.get(1));


    }
}
