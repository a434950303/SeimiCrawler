package cn.wanghaomiao.seimi.controller.common;

import com.xiaoleilu.hutool.util.StrUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;

/**
 * @Author: Ten Locks
 * @Date: 2019/9/4 11:29
 */
@Controller
public class DefaultController {
    @RequestMapping(value = "/view/**", method = RequestMethod.GET)
    public String html(HttpServletRequest request) {
        String s=  StrUtil.removePrefix(request.getRequestURI(), request.getContextPath() + "/view");
        return s;
    }
    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public String index(HttpServletRequest request) {
        return "/index.html";
    }

}
