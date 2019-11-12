package cn.wanghaomiao.seimi.services.servicesImpl;

import cn.wanghaomiao.seimi.domain.DirConfig;
import cn.wanghaomiao.seimi.domain.Node;
import cn.wanghaomiao.seimi.services.SpiderService;
import org.jsoup.Connection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Service
public class SpiderServicesImpl implements SpiderService {

    @Autowired
    DirConfig dirConfig ;

    @Override
    public Node getTree(String canem) {
        String baseDir=  dirConfig.getMoonAllBaseDir();
        System.out.println(baseDir);
        List<Node> nodes = new ArrayList<Node>();
        File basefiel = new File(baseDir);
        nodes.add(new Node(basefiel.getName(), "0"));
        getAllFileName(basefiel,nodes);
        Node tree = new Node();
        Node mt = tree.createTree(nodes);
        return mt;
    }


    /**
     * 获取某个文件夹下的所有文件
     *
     * @return
     */
    public static void getAllFileName(File file, List<Node> nodes ) {
        File[] tempList = file.listFiles();

        for (int i = 0; i < tempList.length; i++) {
            if (tempList[i].isFile()) {
                Node node = new Node( tempList[i].getName(),file.getName());
                node.setText( tempList[i].getName());
                nodes.add(node);
            }
            if (tempList[i].isDirectory()) {
                Node node = new Node(tempList[i].getName(), file.getName());
                node.setText( tempList[i].getName());
                nodes.add(node);
                getAllFileName(tempList[i],nodes);
            }
        }
        return;
    }
}
