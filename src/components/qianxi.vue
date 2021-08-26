<template>
     <div className="mainview">
            <div id=""></div>
    </div>
</template>
<script>
import GeoCodingData from '../js/point';
import { loadModules } from 'esri-loader';
export default{
    data(){
        return{
            state:{
            BJData: [
            [{name:'北京'}, {name:'上海',value:95}],
            [{name:'北京'}, {name:'广州',value:90}],
            [{name:'北京'}, {name:'大连',value:80}],
            [{name:'北京'}, {name:'南宁',value:70}],
            [{name:'北京'}, {name:'南昌',value:60}],
            [{name:'北京'}, {name:'拉萨',value:50}],
            [{name:'北京'}, {name:'长春',value:40}],
            [{name:'北京'}, {name:'包头',value:30}],
            [{name:'北京'}, {name:'重庆',value:20}],
            [{name:'北京'}, {name:'常州',value:10}]
        ],
        SHData: [
            [{name:'上海'},{name:'包头',value:95}],
            [{name:'上海'},{name:'昆明',value:90}],
            [{name:'上海'},{name:'广州',value:80}],
            [{name:'上海'},{name:'郑州',value:70}],
            [{name:'上海'},{name:'长春',value:60}],
            [{name:'上海'},{name:'重庆',value:50}],
            [{name:'上海'},{name:'长沙',value:40}],
            [{name:'上海'},{name:'北京',value:30}],
            [{name:'上海'},{name:'丹东',value:20}],
            [{name:'上海'},{name:'大连',value:10}]
        ],
        GZData: [
            [{name:'广州'},{name:'福州',value:95}],
            [{name:'广州'},{name:'太原',value:90}],
            [{name:'广州'},{name:'长春',value:80}],
            [{name:'广州'},{name:'重庆',value:70}],
            [{name:'广州'},{name:'西安',value:60}],
            [{name:'广州'},{name:'成都',value:50}],
            [{name:'广州'},{name:'常州',value:40}],
            [{name:'广州'},{name:'北京',value:30}],
            [{name:'广州'},{name:'北海',value:20}],
            [{name:'广州'},{name:'海口',value:10}]
        ],
        planePath: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
        color: ['#F4EF8D', '#323296', '#CB4743'],
        series: [],
        mapview: null,
        }
     };
    },
    mounted(){
        this._createMapview();
        this._initCharts()
    },
    methods:{
         _createMapview(){
            const _self = this;
            const options = {
                url: 'https://js.arcgis.com/4.14/',
                css: 'https://js.arcgis.com/4.14/esri/themes/light/main.css'
            };
    
            loadModules(['esri/Map',
                'esri/Basemap',
                'esri/layers/TileLayer',
                'esri/views/MapView',
                'esri/views/SceneView',
            ], options).then(([
                Map, 
                Basemap,
                TileLayer,
                MapView,
                SceneView,
            ]) => {
                        let basemap = new Basemap({
                            baseLayers: [
                                new TileLayer({
                                    url: "http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer",
                                    title: "Basemap"
                                })
                            ],
                            title: "basemap",
                            id: "basemap"
                        });
                        let map = new Map({
                            basemap: basemap
                        });
                        // let view = new MapView({
                        //     container: "mapview", 
                        //     map: map, 
                        //     zoom: 5, 
                        //     center: [107.246152,34.414465] 
                        // });
                        let view = new SceneView({
                            container: "mapview", 
                            map: map, 
                            scale: 50000000, 
                            center: [107.246152,34.414465] 
                        });
                        
                        view.when(function() {
                            _self.state.mapview = view;
                            _self._drawCharts();
                        });
                }
            ).catch((err) => {
                console.log('底图创建失败，' + err);
            });
     },
     _initCharts(){
        const _self = this;
        let placeCenter = [
            ['北京', this.state.BJData], 
            ['上海', this.state.SHData], 
            ['广州', this.state.GZData]
        ];
 
        placeCenter.map((value, key) => {
            _self.state.series.push({
                name: value[0] + 'Top10',
                type: 'lines',
                coordinateSystem: 'arcgis',
                zlevel: 1,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0.7,
                    color: '#fff',
                    symbolSize: 3
                },
                lineStyle: {
                    normal: {
                        color: _self.state.color[key],
                        width: 0,
                        curveness: 0.2
                    }
                },
                data: _self._convertData(value[1])
            }, {
                name: value[0] + ' Top10',
                type: 'lines',
                coordinateSystem: 'arcgis',
                zlevel: 2,
                symbol: ['none', 'arrow'],
                symbolSize: 10,
                effect: {
                    show: true,
                    period: 6,
                    trailLength: 0,
                    symbol: _self.state.planePath,
                    symbolSize: 15
                },
                lineStyle: {
                  normal: {
                    color: _self.state.color[key],
                    width: 1,
                    opacity: 0.6,
                    curveness: 0.2
                  }
                },
                data: _self._convertData(value[1])
            }, {
                name: value[0] + ' Top10',
                type: 'effectScatter',
                coordinateSystem: 'arcgis',
                zlevel: 2,
                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    normal: {
                        show: true,
                        position: 'left',
                        formatter: '{b}'
                    }
                },
                symbolSize: function (val) {
                    return val[2] / 8;
                },
                itemStyle: {
                    normal: {
                        color: _self.state.color[key]
                    }
                },
                data: value[1].map(function(dataItem) {
                    return {
                        name: dataItem[1].name,
                        value: GeoCodingData[dataItem[1].name].concat([dataItem[1].value])
                    };
                })
            });
        });
    },
     _convertData(data){
        let res = [];
            for (var i = 0; i < data.length; i++) {
              var dataItem = data[i];
              var fromCoord = GeoCodingData[dataItem[0].name];
              var toCoord = GeoCodingData[dataItem[1].name];
              if (fromCoord && toCoord) {
                res.push({
                  fromName: dataItem[0].name,
                  toName: dataItem[1].name,
                  coords: [fromCoord, toCoord],
                  value: dataItem[1].value
                });
              }
            }
        return res;
    },

    }
}
</script>
<style scoped>
.mainview {
    width: 100%;
    height: 100%;     
  }
#mapview{
    width: 100%;
    height: 100%;
  }
</style>
