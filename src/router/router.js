import Vue from 'vue' //引入Vue对象
import VueRouter from 'vue-router' //引入路由对象
//1.引入首页index.vue组件
    //命名组件名  //文件路径
    // import Shanghai from '../views/shanghai.vue'
    // import testmap from '../components/mapApply/mapApply.vue'
    Vue.use(VueRouter)
    
    //2.在路由字典里分配路径
    const routes=[
    //   {path:'/testmap',redirect:'./mapApply/ma'},
    //分配路径(地址)   //组件名(component-->组件)
    // {path:'/testmap',component:testmap},
    //   //路由传参
      // {path:'/courses/:lid',component:courses,props:true},
    ]
    const router = new VueRouter({
      mode: 'hash', //路由不再显示hash(路径没有#,防止和锚点冲突)
      base: process.env.BASE_URL,  
      routes,
    //   //方法三:添加scrollBehavior方法,自定义路由切换时页面如何滚动。
    //   scrollBehavior (to, from, savedPosition) {////点击浏览器的前进后退或切换导航触发
    //     if (savedPosition) {
    //       console.log(to)
    //       console.log(from)
    //       console.log(savedPosition)
    //       return savedPosition
    //     } else {
    //       return { x: 0, y: 0 }
    //     }
    //   }
      })
    //导出模块
    export default router