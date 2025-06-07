import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import mitt from '../utils/mitt'
import { useOrderStore } from '@/stores/orderStore'
import { useUserStore } from '@/stores/userStore'
import { useCorporationStore } from '@/stores/corporationStore'

// 路由
const routes = [
    // {
    //     path: '/',
    //     name: 'index',
    //     component: () => import('../views/index/index.vue')
    // },
    {
        path: '/',
        name: 'login',
        component: () => import('../views/login/login.vue')
    },
    {
        path: '/corporation',
        name: 'corporation',
        component: () => import('../views/corporation/corporation.vue')
    }
]


export const router = createRouter({
    history: createWebHashHistory(), // history 模式
    routes: routes, // 路由表
    scrollBehavior: () => ({ left: 0, top: 0 }) // 页面滚动行为
})


// 路由守卫
router.beforeEach((to, from, next) => {

    if (to.path !== '/') {
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
            // 没有token，跳转到登录页
            mitt.emit('ElNotification', { type: 'error', title: "错误", message: '错误信息：' + '请先登录账号！' })
            next('/')
            return
        }
    }

    // 重置store数据
    if(to.path === '/') {
        localStorage.removeItem('accessToken')
        useUserStore().$reset()
        useOrderStore().$reset()
        useCorporationStore().$reset()
    }

    next()
})



export function initRouter(app: App<Element>) {
    app.use(router)
}