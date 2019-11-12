$().ready(function() {
	validateRule();
});

$.validator.setDefaults({
	submitHandler : function() {
		update();
	}
});
function update() {
	$.ajax({
		cache : true,
		type : "POST",
		url : "/system/range/update",
		data : $('#signupForm').serialize(),// 你的formid
		async : false,
		error : function(request) {
			parent.layer.alert("Connection error");
		},
		success : function(data) {
			debugger
			if (data.code == 0) {
				parent.layer.msg("操作成功");
				parent.reLoad();
				var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
				parent.layer.close(index);

			} else {
				parent.layer.alert(data.msg)
			}

		}
	});

}
function validateRule() {
	var icon = "<i class='fa fa-times-circle'></i> ";
	$("#signupForm").validate({
        rules : {
            rangeName : {
                required : true
            }
        },
        messages : {
            rangeName : {
                required : icon + "请输入范围名称"
            }
        }
	})
}
function editPolygon() {
	layer.open({
		type : 2,
		title : '地图编辑范围',
		maxmin : true,
		shadeClose : false, // 点击遮罩关闭层
		area : [ '750px', '480px' ],
		content : '/system/range/editPolygon' // iframe的url
	});
}