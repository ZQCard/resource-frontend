import Main from '@/components/main'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/single-page/home')
      }
    ]
  },
  {
    path: '/micro_video',
    name: '短视频',
    meta: {
      icon: 'ios-videocam-outline',
      title: '短视频'
    },
    component: Main,
    children: [
      {
        path: 'center',
        name: '视频列表',
        meta: {
          icon: 'ios-videocam-outline',
          title: '短视频'
        },
        component: () => import('@/view/micro_video/list.vue')
      }
    ]
  },
  {
    path: '/videos',
    name: '影视资源',
    meta: {
      icon: 'md-youtube',
      title: '影视资源'
    },
    component: Main,
    children: [
      {
        path: 'classic_movie',
        name: '经典电影',
        meta: {
          icon: 'ios-film-outline',
          title: '经典电影'
        },
        component: () => import('@/view/videos/movie/list.vue')
      },
      {
        path: 'anime_movie',
        name: '动漫推荐',
        meta: {
          icon: 'logo-octocat',
          title: '动漫推荐'
        },
        component: () => import('@/view/videos/movie/list.1.vue')
      }
    ]
  },
  {
    path: '/personal',
    name: '非礼勿入',
    meta: {
      icon: 'logo-freebsd-devil',
      title: '非礼勿入'
    },
    component: Main,
    children: [
      {
        path: 'center',
        name: '用户列表',
        meta: {
          icon: 'md-contacts',
          title: '用户列表'
        },
        component: () => import('@/view/personal/user/list.vue')
      },
      {
        path: 'assignment',
        name: '角色授权',
        meta: {
          icon: 'ios-person',
          title: '角色授权'
        },
        component: () => import('@/view/personal/auth/assignment.vue')
      },
      {
        path: 'photos',
        name: '白云苍狗',
        meta: {
          icon: 'md-photos',
          title: '白云苍狗'
        },
        component: () => import('@/view/personal/photo/list.vue')
      },
      {
        path: 'bills',
        name: '跬步千里',
        meta: {
          icon: 'md-home',
          title: '跬步千里'
        },
        component: () => import('@/view/personal/bill/list.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
