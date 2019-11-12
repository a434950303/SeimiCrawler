function Search() {
    var type = $("#type").val();
    var textVal = $("#textVal").val();
    var urlText = $("#urlText").val();
    var param = {
        type: type,
        textVal: textVal,
        urlText: urlText
    };
    param = JSON.stringify(param);
    $.ajax({
        data: param,
        type: "POST",
        url: "/seimi/spider",
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (data) {//data是返回的hash,key之类的值，key是定义的文件名
            alert("爬虫任务已经开始!");
            refreashTreeView();
        },
        error: function () {
        }
    });

}

function refreashTreeView() {
    var type = $("#type").val();
    var textVal = $("#textVal").val();
    var urlText = $("#urlText").val();
    var param = {
        type: type,
        textVal: textVal,
        urlText: urlText
    };
    param = JSON.stringify(param);
    $.ajax({
        data: param,
        type: "POST",
        url: "/seimi/getTreeVieW",
        cache: false,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (data) {//data是返回的hash,key之类的值，key是定义的文件名
            console.log(data)
            $('#mytree').treeview({
                data: data.list.nodes,
                showCheckbox: true,// 展示checkbox
                multiSelect: true,
                emptyIcon: "glyphicon", //当节点没有子节点的时候显示的图标              String
                enableLinks: true //是否将节点文本呈现为超链接。前提是在每个节点基础上，必须在数据结构中提供href值。
            });


        },
        error: function () {
        }
    });

}

function selChange() {
    var a = $("#type").val();

    switch (a) {
        case 'moonMatch':
            $("#urlText").val("http://moon.bao.ac.cn/mul/index/lis");
            break;
        case 'moonAll':
            var seltext = $("#type").find("option:selected").text();
            if(seltext=="测试"){
                $("#urlText").val("http://lroc.sese.asu.edu/data/LRO-L-LROC-2-EDR-V1.0/LROLRC_0001");
            }else{
                $("#urlText").val("http://lroc.sese.asu.edu/data");
            }
            break;
        default:
            alert("error，请联系IT人员。");
    }
}

function Jump(a) {
    switch (a) {
        case 'home':
            changeActive(0);
            $("#ifr1").attr("scrolling", "no");
            $("#ifr1").attr("src", "view/spider.html");
            break;
        case 'db':
            changeActive(1);
            $("#ifr1").attr("scrolling", "no");
            $("#ifr1").attr("src", "view/dbTable.html");
            break;
        case 'fields':
            changeActive(2);
            $("#ifr1").attr("scrolling", "no");
            $("#ifr1").attr("src", "view/fieldTable.html");
            break;
        case 'config':
            changeActive(3);
            $("#ifr1").attr("scrolling", "no");
            $("#ifr1").attr("src", "view/esDataConfigTable.html");
            break;
        case 'anaylze':
            changeActive(4);
            $("#ifr1").attr("scrolling", "yes");
            $("#ifr1").attr("src", "tableConfig/toAnaylze");
            break;
        default:
            alert("跳转异常，请联系IT人员。");
    }
}

function changeActive(param) {
    li = document.getElementById("pro").getElementsByTagName("li")
    for (var i = 0; i < li.length; i++) {
        // li[i].className="";
        $(li[i]).removeClass("active");
    }
    //  li[param].className="active";
    $(li[param]).addClass("active");
}


window.onload = function () {

    /*//1.初始化tree
    var oTable = new TreeInit();
    oTable.Init();

    //2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    oButtonInit.Init();*/

};


var TreeInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $("#tree").treeview({
            data: result.nodes,         // 数据源
            levels: 1,  //设置继承树默认展开的级别
            showTags: true, //是否在每个节点右边显示tags标签。tag值必须在每个列表树的data结构中给出
            onNodeSelected: function (event, data) {
                /* console.log(data); */
                /* alert(data.nodeId); */
                window.location = basePath + "webtype/view"
                    + data.id + "/Pub1.html";
            }
        });

    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var textVal = $("#textVal").val();

        if (textVal == null || textVal == "") {
            var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                pageSize: params.limit, //页面大小
                currentPage: (params.offset / params.limit) + 1, //页码
                asc: true,
                sortcloumn: "_id",
            };
        } else {
            var typeVal = $("#type").val();
            typeVal = "fieldsValue_" + typeVal;

            var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                pageSize: params.limit, //页面大小
                currentPage: (params.offset / params.limit) + 1, //页码
                asc: true,
            };
            temp[typeVal] = "*" + textVal + "*";
        }
        return {query: JSON.stringify(temp)};
    };
    return oTableInit;
};


var ButtonInit = function () {
    var oInit = new Object();
    var postdata = {};

    oInit.Init = function () {
        //初始化页面上面的按钮事件
    };

    return oInit;
};