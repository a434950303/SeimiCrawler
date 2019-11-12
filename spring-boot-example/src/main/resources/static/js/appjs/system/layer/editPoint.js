 $(function(){

            initmap();
            map.getView().setZoom(9);
            loadlayersgroup_base();
            loadlayer_kaifeng_quxianbianjie();
            loadlayer_kaifeng_shibianjie();
            
            layerImage=document.getElementById("layerImage").value;
            
            var imageURL='/gis/image/cam.png';
            if(layerImage!=''){
            	imageURL='/gis/image/video_'+layerImage+'.png';
            }
            
            styles = [ new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: 'blue',
                    width: 3
                  }),
                  fill: new ol.style.Fill({
                    color: 'rgba(0, 0, 255, 0.1)'
                  }),
            	image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                   anchor: [0.5, 46],
                   anchorXUnits: 'fraction',
                   anchorYUnits: 'pixels',
                   src: imageURL
               }))
            })];
            
            drawVector = new ol.layer.Vector({
                source: drawSource,
                style: styles
            });
            
            addInteraction();
 });
 var layerImage;
 /**
  *从父页面获取点的坐标信息 显示在地图上
  *
  * @param 
  * @returns {}
  */
 function initSource(){
	 var polyCoords=this.parent.document.getElementById("rangeCoordinate").value;
	 if(polyCoords!=""){
		 	var coordstr=polyCoords;
			coordstr=coordstr.replace('[','');
			coordstr=coordstr.replace(']','');
			var coordArr=coordstr.split(',');
			var coord=new Array();
			coord[0]=parseFloat(coordArr[0]);
			coord[1]=parseFloat(coordArr[1]);
			
	       	var feature = new ol.Feature({
	       	  geometry: new ol.geom.Point(coord)
	       	});
	       	drawSource.addFeature(feature);
	       	geoResult=polyCoords;
	       	
	        map.getView().setCenter(coord);
	        map.getView().setZoom(15);
	 }
 }
 
 
//拉框查询
 var geoResult="";//保存画图的数据
 var draw;
 var modify;
 var drawSource = new ol.source.Vector();
 var styles;
 var drawVector;
 /**
  *给map添加 画图 和 编辑事件
  *
  * @param 
  * @returns {}
  */
 function addInteraction() {
     
     initSource();
    
     map.addLayer(drawVector);
     draw = new ol.interaction.Draw({
         source: drawSource,
         type: "Point",
         style: styles
     });
     draw.on("drawend",function(evt) {
         //var geo=evt.feature.getGeometry();
         var featureStr=new ol.format.GeoJSON().writeFeature(evt.feature);
         var feature=JSON.parse(featureStr);
         var geo=feature.geometry.coordinates;
         geoResult=JSON.stringify(geo);
         draw.setActive(false);
         setTimeout(function () {
             map.addInteraction(new ol.interaction.DoubleClickZoom({delta:0}));
         });
     });
     map.addInteraction(draw);
     draw.setActive(false);
     
     
     modify = new ol.interaction.Modify({source: drawSource});
     modify.on("modifyend",function(evt) {
         var featureStr=new ol.format.GeoJSON().writeFeatures(drawSource.getFeatures());
         var feas=JSON.parse(featureStr);
         var feature=feas.features[0];
         var geo=feature.geometry.coordinates;
         geoResult=JSON.stringify(geo);
     });
     map.addInteraction(modify);
     modify.setActive(false);
 }
 /**
  *激活modify
  *
  * @param 
  * @returns {}
  */
 function  modifyActive() {
     draw.setActive(false);
     modify.setActive(true);
 }
 /**
  *激活画图
  *
  * @param 
  * @returns {}
  */
 function  drawActive() {
     drawSource.clear();
     draw.setActive(true);
     modify.setActive(false);
     //去除map双击zoom事件
     var dblClickInteraction;
     map.getInteractions().getArray().forEach(function(interaction) {
         if (interaction instanceof ol.interaction.DoubleClickZoom) {
             dblClickInteraction = interaction;
         }
     });
     // remove from map
     map.removeInteraction(dblClickInteraction);
 }
 /**
  *把坐标信息提交到父页面
  *
  * @param 
  * @returns {}
  */
 function save(){
	 this.parent.document.getElementById("rangeCoordinate").value=geoResult;
	 var index = parent.layer.getFrameIndex(window.name); // 获取窗口索引
	 parent.layer.close(index);

 }