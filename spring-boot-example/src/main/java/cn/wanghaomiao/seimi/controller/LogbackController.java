package cn.wanghaomiao.seimi.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Controller
@Configuration
public class LogbackController {


    /**
     * 获取日志对象，构造函数传入当前类，查找日志方便定位
     */
    private final Logger logger = LoggerFactory.getLogger(this.getClass());

    /**
     * 启动成功
     */
    @Bean
    public ApplicationRunner applicationRunner() {
        return applicationArguments -> {
            try {
                InetAddress ia = InetAddress.getLocalHost();
                //获取本机内网IP
            } catch (UnknownHostException ex) {
                ex.printStackTrace();
            }
        };
    }

}
