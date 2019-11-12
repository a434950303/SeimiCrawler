$().ready(function() {
	validateRule();
});

$.validator.setDefaults({
	submitHandler : function() {
		save();
	}
});
function save() {
	$.ajax({
		cache : true,
		type : "POST",
		url : "/system/layer/save",
		data : $('#signupForm').serialize(),// 你的formid
		async : false,
		error : function(request) {
			parent.layer.alert("Connection error");
		},
		success : function(data) {
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
            layerName : {
				required : true
			},
            layerNameC : {
				required : true
			}
		},
		messages : {
            layerName : {
				required : icon + "请输入图层名称"
			},
            layerNameC : {
				required : icon + "请输入图层中文名称"
			}
		}
	})
}
	$(".testImg").click(function(){
		$(".testImg").removeClass("chanagelayerImage")
	    $(this).addClass("chanagelayerImage");
		$("#layerImage").val($(this).attr("name"));
	});
