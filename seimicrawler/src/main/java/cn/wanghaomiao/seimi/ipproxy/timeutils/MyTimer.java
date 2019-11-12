package cn.wanghaomiao.seimi.ipproxy.timeutils;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.Date;
import java.util.Timer;

/**
 * Created by paranoid on 17-4-13.
 */
@Component
@Order(value = 1)
public class MyTimer implements ApplicationRunner {
    public static void main(String[] args) {
        MyTimeJob job = new MyTimeJob();
        Timer timer = new Timer();

        Calendar calendar = Calendar.getInstance();
        Date date = calendar.getTime();

        //设置定时任务，从现在开始，每1小时执行一次
        timer.schedule(job, date, 1*60*60*1000);
    }

    @Override
    public void run(ApplicationArguments applicationArguments) throws Exception {
        MyTimeJob job = new MyTimeJob();
        Timer timer = new Timer();

        Calendar calendar = Calendar.getInstance();
        Date date = calendar.getTime();

        //设置定时任务，从现在开始，每1小时执行一次
        timer.schedule(job, date, 1*60*60*1000);
    }
}
