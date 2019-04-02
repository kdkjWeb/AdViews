/**
 * @author 杨勇
 * @date 18/10/31
 * @Description: 将所有路由文件单独放在一个文件中并抛出去
 */


/* start 引入路由文件 */

export default {
  routes: [
    {
      path: '/',
      component: resolve => require(['@/components/Home'],resolve),
      redirect: '/index',
      children: [
        {
          path: '/index',
          name: 'index',
          component: resolve => require(['@/pages/index'],resolve),
          meta: { title: '系统首页', keepalive: true }
        },{
          path: '/user',
          name: 'user',
          component: resolve => require(['@/pages/user'],resolve),
          meta: { title: '用户管理', keepalive: true }
        },{
          path: '/role',
          name: 'role',
          component: resolve => require(['@/pages/role'],resolve),
          meta: { title: '角色管理', keepalive: true}
        },{
          path: '/log',
          name: 'log',
          component: resolve => require(['@/pages/logs'],resolve),
          meta: { title: '系统日志', keepalive: true }
        },{
          path: '/client',
          name: 'client',
          component: resolve => require(['@/pages/client'],resolve),
          meta: { title: '客户资源管理', keepalive: true }
        },{
          path: '/clientDetails',
          name: 'clientDetails',
          component: resolve => require(['@/pages/clientDetails'],resolve),
          meta: { title: '会员详情', keepalive: false }
        },{
          path: '/supplier',
          name: 'supplier',
          component: resolve => require(['@/pages/supplier'],resolve),
          meta: { title: '供应商管理', keepalive: true }
        },{
          path: '/order',
          name: 'order',
          component: resolve => require(['@/pages/order'],resolve),
          meta: { title: '订单管理', keepalive: true }
        },{
          path: '/destination',
          name: 'destination',
          component: resolve => require(['@/pages/destination'],resolve),
          meta: { title: '热门目的地', keepalive: true }
        },
        {
          path: '/destinationTpl',
          name: 'destinationTpl',
          component: resolve => require(['@/pages/destinationTpl'],resolve),
          meta: { title: '新增热门目的地', keepalive: false }
        },
        {
          path: '/viewpoint',
          name: 'viewpoint',
          component: resolve => require(['@/pages/viewpoint'],resolve),
          meta: { title: '精品案例', keepalive: true }
        },
        {
          path: '/viewpointTpl',
          name: 'viewpointTpl',
          component: resolve => require(['@/pages/viewpointTpl'],resolve),
          meta: { title: '新增精品案例', keepalive: false}
        },
        {
          path: '/travelList',
          name: 'travelList',
          component: resolve => require(['@/pages/travelList'],resolve),
          meta: { title: '制作行程', keepalive: false}
        },
        {
          path: '/AirTickets',
          name: 'AirTickets',
            component: resolve => require(['@/pages/AirTickets'],resolve),
          meta: { title: '机票', keepalive: true}
        },
        {
          path: '/Hotel',
          name: 'Hotel',
          component: resolve => require(['@/pages/Hotel'],resolve),
          meta: { title: '酒店', keepalive: true}
        },
        {
          path: '/ScenicSpot',
          name: 'ScenicSpot',
          component: resolve => require(['@/pages/ScenicSpot'],resolve),
          meta: { title: '景区', keepalive: true}
        },
        {
          path: '/visa',
          name: 'visa',
          component: resolve => require(['@/pages/visa'],resolve),
          meta: { title: '签证', keepalive: true}
        },
        {
          path: '/Transfer',
          name: 'Transfer',
          component: resolve => require(['@/pages/Transfer'],resolve),
          meta: { title: '接送机', keepalive: true}
        },
        {
          path: '/DayTrip',
          name: 'DayTrip',
          component: resolve => require(['@/pages/DayTrip'],resolve),
          meta: { title: '一日游', keepalive: true}
        },
        {
          path: '/wifiPhone',
          name: 'wifiPhone',
          component: resolve => require(['@/pages/wifiPhone'],resolve),
          meta: { title: 'WIFI电话卡', keepalive: true}
        }




      ]
    },{
      path: '/login',
      name: 'Login',
      component: resolve => require(['@/pages/Login'],resolve)
    },{
      path: '*',
      name: 'notFound',
      component: resolve => require(['@/pages/NotFound'],resolve)
    }
  ]
}

/* end 引入路由文件 */
