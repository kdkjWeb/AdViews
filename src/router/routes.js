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
          meta: { title: '系统首页' }
        },{
          path: '/user',
          name: 'user',
          component: resolve => require(['@/pages/user'],resolve),
          meta: { title: '用户管理' }
        },{
          path: '/role',
          name: 'role',
          component: resolve => require(['@/pages/role'],resolve),
          meta: { title: '角色管理' }
        },{
          path: '/log',
          name: 'log',
          component: resolve => require(['@/pages/logs'],resolve),
          meta: { title: '系统日志' }
        },{
          path: '/client',
          name: 'client',
          component: resolve => require(['@/pages/client'],resolve),
          meta: { title: '客户资源管理 ' }
        },{
          path: '/clientDetails',
          name: 'clientDetails',
          component: resolve => require(['@/pages/clientDetails'],resolve),
          meta: { title: '会员详情 ' }
        },{
          path: '/supplier',
          name: 'supplier',
          component: resolve => require(['@/pages/supplier'],resolve),
          meta: { title: '供应商管理 ' }
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
