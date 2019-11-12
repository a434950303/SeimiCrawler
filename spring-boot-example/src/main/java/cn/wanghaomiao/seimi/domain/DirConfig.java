package cn.wanghaomiao.seimi.domain;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DirConfig {
    @Value("${dir.config.moonAll.baseDir}")
    private String moonAllBaseDir;

    public String getMoonAllBaseDir() {
        return moonAllBaseDir;
    }

    public void setMoonAllBaseDir(String moonAllBaseDir) {
        this.moonAllBaseDir = moonAllBaseDir;
    }
}
