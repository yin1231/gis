<template>
 <div id="viewDiv">
   <div id="homeView"></div>
   <div id="zoom"></div>
 </div>
 
</template>

<script>
var echarts = require('echarts');
// let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
// require('echarts/lib/chart/bar')
// // 引入提示框和title组件
// require('echarts/lib/component/tooltip')
// // require('echarts/lib/component/title')
// import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import geoCoordMap from '../js/point';
import dataValue from '../js/data';
import CSVLayer from "@arcgis/core/layers/CSVLayer";
import gcoord from 'gcoord';
// npm i esri-loader -s
import { loadModules } from 'esri-loader';
export default {
  data () {
    return {
      Map,
      extent:1,
      series: null,
      mapview: nullf
    }
  },
  mounted () {
    this.createView()
  },
  methods:{
      // 创建视图
    createView () {
                const _self = this
                const options = {
                  url:'https://gis.fuchuang.com:8443/agsapi/4.20/init.js',
                  css:"https://gis.fuchuang.com:8443/agsapi/4.20/esri/themes/light/main.css"
                }
                loadModules([
                  'esri/Basemap',
                  'esri/Map',
                  'esri/views/MapView',
                  'esri/widgets/Home',
                  'esri/layers/support/TimeInfo',
                  'esri/config',
                  'esri/Graphic',
                  'esri/geometry/support/webMercatorUtils',
                  "esri/geometry/Point",
                  "esri/geometry/SpatialReference",
                  "esri/layers/FeatureLayer",
                  "esri/widgets/Legend",
                  'esri/widgets/ScaleBar',
                  'esri/widgets/Zoom',
                  'esri/layers/TileLayer',
                  'esri/layers/CSVLayer',
                ], options)
                .then(
                  ([
                    Basemap,
                    Map,
                    MapView,
                    Home,
                    TileInfo,
                    esriConfig,
                    Graphic,
                    webMercatorUtils,
                    Point,
                    SpatialReference,
                    FeatureLayer,
                    Legend,
                    ScaleBar,
                    Zoom,
                    TileLayer,
                    CSVLayer,
                  ]) => {
                    let map = new Map();
                    const view01 = new MapView({
                      container: "viewDiv",
                      map: map,
                      zoom: 5, 
                      center: [120.222771,31.15152]
                      // longitude, latitude
                      // scale: scale,
                    })
                    var layerUrl = "https://gis.fuchuang.com:6443/arcgis/rest/services/MapService/ChinaMap/MapServer";
                  // 官网接口描述该功能主要是在发送ArcGIS Server请求的时候，
                  //可以修改请求的url或者option。
                  //经测试，如下功能可以实现在制图输出之前，修改请求的相关参数
                    esriConfig.request.interceptors.push({
                          urls: layerUrl,
                          before: function(params) {
                            if (params.url.includes('?blankTile=false')) {
                                params.url = params.url.replace('?blankTile=false', '?blankTile=true')
                              }
                          }
                    })
                    var layer = new TileLayer(layerUrl, null);
                        layer.copyright="© 2007-2021 https://www.fuchuang.com/ Corporation, All Rights Reserved 上海孚创实业发展有限公司 版权所有";
                    // 添加图层
                        map.layers.add(layer);
                        const that = this
                        let zoom = new Zoom({
                          view: view01
                        });
                        view01.ui.add(zoom, {
                          position: "bottom-left"
                        });
                      
                        //  实例化图例控件
                        let legend = new Legend({
                          view: view01
                        });
                        view01.ui.add(legend, "bottom-right");
                        // 实例化ScaleBar
                        let scaleBar = new ScaleBar({
                          view: view01,
                          unit:"metric"
                        });
                        view01.ui.add(scaleBar, {
                          position: "top-left"
                        });
                        // home实例化功能：恢复到第一步初始化
                        let homeWidget = new Home({
                          view: view01 
                        },"homeView");
                        view01 .ui.add(homeWidget,"top-left");
          //               // 去除掉初始化自带的控件：放大缩小键，引用
                        view01.ui.components = [];
          //               console.log(view01, 'esriConfig---map')
          var  data=[
                    {
                    type: "point", // autocasts as new Point()
                    longitude: 114.476846,
                    latitude: 31.15152,
                    },
                    {
                    type: "point", // autocasts as new Point()
                    longitude: 120.476846,
                    latitude: 31.15152,
                    }
                  ]
          //         /* ################################### */
          //         // 绘制点，并定义点击点后弹框的内容
          //         // 创建用于绘制点的符号
                  const markerSymbol = {
                    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                    color:[0,0,255],
                    // color: [226, 119, 40],
                    outline: {
                      // autocasts as new SimpleLineSymbol()
                      color: [255, 123, 255],
                      width: 2,
                    }
                  };
                  //   // 创建一个对象来存储与线相关的属性：点击点出现的弹框
                  const lineAtt = {
                    title:"你想取什么名字",
                    Name: "自定义的名字",
                    Owner: "属于我自己",
                    Length: "3,456 km"
                  };
                  var arr=[]
                  for (const item of data) {
                    arr.push(
                    // 创建图形并向其添加几何图形和符号
                    new Graphic({
                        geometry: item,
                        symbol: markerSymbol,
                        attributes: lineAtt,
                        popupTemplate: {
                          // autocasts as new PopupTemplate()
                          title: "{title}",
                          content: [
                            {
                              type: "fields",
                              fieldInfos: [
                                {
                                  fieldName: "Name"
                                },
                                {
                                  fieldName: "Owner"
                                },
                                {
                                  fieldName: "Length"
                                }
                              ]
                            }
                          ]
                        }
                      })
                    )
                
                  }
                  view01.on("mouse-wheel",function(evt){
                    console.log(evt,"ffffff")
                  })
          //         /*################################################## */ 
                  // 绘制一条折线
                const polyline = {
                            type: "polyline", // autocasts as new Polyline()
                            paths: [[119.060347, 32.035997], [121.454863304831, 31.2340553833598]]
                          };
                  // Create a symbol for drawing the line
                  const lineSymbol = {
                    type: "simple-line", // autocasts as SimpleLineSymbol()
                    color: [0,187, 0],
                    width: 1
                  };


                  const polylineGraphic = new Graphic({
                    geometry: polyline,
                    symbol: lineSymbol,
                    attributes: lineAtt,
                    popupTemplate: {
                      // autocasts as new PopupTemplate()
                      title: "这是线",
                      content: [
                        {
                          type: "fields",
                          fieldInfos: [
                            {
                              fieldName: "Name"
                            },
                            {
                              fieldName: "Owner"
                            },
                            {
                              fieldName: "Length"
                            }
                          ]
                        }
                      ]
                    }
                  });

                  /***************************
                   * Create a polygon graphic
                  ***************************/

                // 绘制一块区域
                  const polygon = {
                            type: "polygon", // autocasts as new Polygon()
                            rings: [[119.21, 30.10], [119.10, 30.01], [119.01, 30.03], [119, 30.08]]
                          };

                   // Create a symbol for rendering the graphic
                  const fillSymbol = {
                    type: "simple-fill", // autocasts as new SimpleFillSymbol()
                    color: [255, 132, 0, 0.8],
                    outline: {
                      // autocasts as new SimpleLineSymbol()
                      color: [255, 0, 0],
                      width: 2
                    }
                  };
                 // Add the geometry and symbol to a new graphic
                  const polygonGraphic = new Graphic({
                    geometry: polygon,
                    symbol: fillSymbol
                  });

                 // 将图形添加到视图的图形层
                  view01.graphics.addMany([...arr, polylineGraphic, polygonGraphic]);
                  
                  
                  var popupTemplate = {
                    title: "自己定义的行政区域:{name}",
                    content: [{
                      type: "media",
                      mediaInfos: [{
                        type: "pie-chart",
                        caption: "",
                        value: {
                          fields: ["childrenNu", "adcode"],
                          normalizeField: null,
                          tooltipField: "Min and max elevation values"
                        }
                      }]
                    }]
                  };
                  const featureLayer  = new FeatureLayer({
                    url: "https://arcgis.fuchuang.com:6443/arcgis/rest/services/618/combinshp/MapServer/0",
                    mode: FeatureLayer.MODE_SNAPSHOT,
                    outFields: ["*"],
                    visible:true,
                    popupTemplate:popupTemplate,
                  });
                  featureLayer.renderer = {
                    type: "simple",  // autocasts as new SimpleRenderer()
                    symbol: {
                      type: "simple-fill",  // autocasts as new SimpleMarkerSymbol()
                      size: 0,
                      color: [255,0,0,0],//绘制这块区域的底图颜色
                      outline: {  // autocasts as new SimpleLineSymbol()
                        width: 2,
                        color: [255,0,0,0]//挥着这块区域的线的颜色
                      }
                    }
                  };
                  map.layers.add(featureLayer);
         
               //定义查询
                let query = featureLayer.createQuery();
                      query.where = "ADCODE = '410300'";
                      query.outFields =["*"];
                      view01.whenLayerView(featureLayer).then(function(layerView){
                        layerView.queryFeatures(query).then(function(results){
                          console.log(results.features);
                        });
                      });
          //     //点击视窗进行碰撞检测，检测点击的目标graphic
                view01.on("click", function (evt) {
                      view01.hitTest(evt).then(function (response) {
                        var result = response.results[0];
                        if (result && result.graphic) {
                          console.log(result);
                          var graphic = result.graphic;
                          //自定义高亮
                          // 设置点击地方的高亮区域
                          //这里的几何图形是面状，配置graphic的symbol为fillSymbol
                          graphic.symbol = {
                            type: "simple-fill",
                            color:  [ 255 ,173,255,0.5 ],
                            outline: {
                              color: [ 255 ,255,0,0.5 ],
                              width: "1px"
                            }
                          };
                          view01.graphics.removeAll();//清除上一次点击目标
                          view01.graphics.add(graphic);//添加新的点击目标
                        }
                        })
                        });
                      }
                    ).catch((err) => {
                          console.log('底图创建失败，' + err);
                      });
                  },
  },
}
</script>

<style>
 html,
  body,
  #viewDiv {
    padding: 0;
    margin: 0;
    height: 100%;
    width: 100%;
  }
  /* #homeView{
    position:absolute;
    top:100px;
    left:700px;
  } */
</style>
