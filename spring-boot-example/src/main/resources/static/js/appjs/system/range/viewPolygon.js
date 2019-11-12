 $(function(){

            initmap();
            map.getView().setZoom(9);
            loadlayersgroup_base();
            loadlayer_kaifeng_quxianbianjie();
            loadlayer_kaifeng_shibianjie();
            addInteraction();
 });
 
 
 function initSource(){
	 var polyCoords=this.document.getElementById("range_Coordinate").value;
	 if(polyCoords!=""){
	       	var feature = new ol.Feature({
	       	  geometry: new ol.geom.Polygon(JSON.parse(polyCoords))
	       	});
	       	drawSource.addFeature(feature);
	       	
	 }
 }
 
 
//拉框查询
 
 var drawSource = new ol.source.Vector();
 var styles = [ new ol.style.Style({
     stroke: new ol.style.Stroke({
         color: 'red',
         width: 3
       }),
       fill: new ol.style.Fill({
         color: 'rgba(255, 0, 0, 0.1)'
       })
     })];
 var drawVector = new ol.layer.Vector({
     source: drawSource,
     style: styles
 });
 function addInteraction() {
     
     initSource();
    
     map.addLayer(drawVector);

     map.getView().fit(drawSource.getExtent());
 }