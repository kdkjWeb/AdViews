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
          path: '/hotel',
          name: 'hotel',
          component: resolve => require(['@/pages/Hotel'],resolve)
        },{
          path: '/ad',
          name: 'ad',
          component: resolve => require(['@/pages/Ad'],resolve)
        },{
          path: '/chartDetails',
          name: 'chartDetails',
          component: resolve => require(['@/pages/ChartDetails'],resolve)
        },{
          path: '*',
          name: 'notFound',
          component: resolve => require(['@/pages/NotFound'],resolve)
        }
      ]
    },{
      path: '/login',
      name: 'Login',
      component: resolve => require(['@/pages/Login'],resolve)
    }
  ]
}

/* end 引入路由文件 */
