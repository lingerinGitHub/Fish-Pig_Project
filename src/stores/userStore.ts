import { defineStore } from 'pinia';
import { fish_post } from '../services/axiosMethods'
import { httpUrl } from '../api/httpUrl';
import mitt from '../utils/mitt'
import { router } from '@/router';


export const useUserStore = defineStore('user', {
    state: () => ({
        username: null as string | null,
    }),
    getters: {

    },
    actions: {
        async login(username: string, password: string) {
            fish_post(httpUrl.userLogin, {

            }, {
                username: username,
                password: password
            })
                .then((err) => {
                    console.log(err)
                    mitt.emit('ElNotification', { type: 'success', title: "成功", message: username + ' 登录成功' })
                    // 保存当前用户
                    this.username = username
                    // 保存返回的token
                    localStorage.setItem('accessToken', err.data.data)

                    router.push('/corporation')
                })
                .catch((err) => {
                    mitt.emit('ElNotification', { type: 'error', title: "错误", message: '错误信息：' + err.message })
                })
        },
        logout() {
            this.token = null
            this.user = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
    }
})