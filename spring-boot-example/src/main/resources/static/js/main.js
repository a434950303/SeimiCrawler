function ClimbTo() {
    this.parentElement.childNodes[1].className = this.parentElement.childNodes[1].className + " btn-click";
    $.ajax({
        url: "/es/addDataToEs",
        type: 'POST',
        datatype: "TEXT",
        success: function (data) {
            window.clearInterval(progressDemmo);
            $("#pertageLen").css('width', '100%');
        },

        error: function (data) {
            $("#pertageLen").css('width', '0%');
        }
    });
}

function Search() {
    $('#mytable').bootstrapTable('refresh');
}

function Jump(a) {
    switch (a) {
        case 'home':
            changeActive(0);
            $("#ifr1").attr("src", "view/spider.html")
            break;
        case 'db':
            changeActive(1);
            $("#ifr1").attr("src", "view/dbTable.html")
            break;
        case 'fields':
            changeActive(2);
            $("#ifr1").attr("src", "view/fieldTable.html")
            break;
        case 'config':
            changeActive(3);
            $("#ifr1").attr("src", "view/esDataConfigTable.html")
            break;
        default:
            alert("跳转异常，请联系IT人员。");
    }
}

function changeActive(param) {
    li= document.getElementById("pro").getElementsByTagName("li")
    for (var i = 0; i < li.length; i++) {
       // li[i].className="";
        $(li[i]).removeClass("active");
    }
  //  li[param].className="active";
    $(li[param]).addClass("active");
}


window.onload = function () {

    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();

    //2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    oButtonInit.Init();

};


var TableInit = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#mytable').bootstrapTable({
            url: '/es/findEsDataByPage', //请求后台的URL（*）
            method: 'get', //请求方式（*）
            dataType: "json", //类型json
            toolbar: '#toolbar', //工具按钮用哪个容器
            striped: false, //是否显示行间隔色
            cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true, //是否显示分页（*）
            sortable: true, //是否启用排序
            sortOrder: "asc", //排序方式
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            pageNumber: 1, //初始化加载第一页，默认第一页
            pageSize: 50, //每页的记录行数（*）
            pageList: [10, 25, 50, 100], //可供选择的每页的行数（*）
            search: false, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: true,
            showColumns: true, //是否显示所有的列
            showRefresh: true, //是否显示刷新按钮
            minimumCountColumns: 2, //最少允许的列数
            clickToSelect: true, //是否启用点击选中行
            height: 500, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "fId", //每一行的唯一标识，一般为主键列
            showToggle: true, //是否显示详细视图和列表视图的切换按钮
            cardView: false, //是否显示详细视图
            detailView: false, //是否显示父子表
            columns: [{
                checkbox: true
            }, {
                field: 'fId',
                title: 'id'
            }, {
                field: 'fXzqmc',
                title: '行政区名称'
            }, {
                field: 'fQsdwmc',
                title: '权属单位名称'
            }, {
                field: 'fJzsm',
                title: '描述'
            },]
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
            };
        } else {
            var fieldVal = $("#field").val();
            var typeVal = $("#type").val();
            typeVal = fieldVal + "_" + typeVal;

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