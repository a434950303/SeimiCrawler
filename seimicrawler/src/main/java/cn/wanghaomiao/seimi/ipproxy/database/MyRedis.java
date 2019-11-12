package cn.wanghaomiao.seimi.ipproxy.database;

import cn.wanghaomiao.seimi.ipproxy.IPModel.IPMessage;
import cn.wanghaomiao.seimi.ipproxy.IPModel.SerializeUtil;
import redis.clients.jedis.Jedis;

import java.util.ArrayList;
import java.util.List;

import static java.lang.System.out;

/**
 * Created by hg_yi on 17-8-9.
 */
public class MyRedis {
    Jedis jedis = RedisDB.getJedis();

    //将ip信息保存在Redis列表中
    public void setIPToList(List<IPMessage> ipMessages) {
        for (IPMessage ipMessage : ipMessages) {
            //首先将ipMessage进行序列化
            byte[] bytes = SerializeUtil.serialize(ipMessage);

            jedis.rpush("IPPool".getBytes(), bytes);
        }
    }

    //将Redis中保存的对象进行反序列化
    public IPMessage getIPByList() {
        int rand = (int)(Math.random()*jedis.llen("IPPool"));

        Object o = SerializeUtil.unserialize(jedis.lindex("IPPool".getBytes(), rand));
        if (o instanceof IPMessage) {
            return (IPMessage)o;
        } else {
            out.println("不是IPMessage的一个实例~");
            return null;
        }
    }

    //将Redis中保存的对象进行反序列化
    public List<IPMessage> getIPList(int start,int count) {
        List<IPMessage> listIp= new ArrayList<IPMessage>();
        int rand = (int)(Math.random()*jedis.llen("IPPool"));
        for (int i =start;i<count+start;i++){
        Object o = SerializeUtil.unserialize(jedis.lindex("IPPool".getBytes(), 0));
        if (o instanceof IPMessage) {
            listIp.add((IPMessage)o);
        } else {
            out.println("不是IPMessage的一个实例~");
        }
        }
        return  listIp;
    }

    public void deleteKey(String key) {
        jedis.del(key);
    }

    public void close() {
        RedisDB.close(jedis);
    }
}
