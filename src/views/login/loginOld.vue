<template>
    <div class="loginContainer">
        <div>登录</div>
        <div>
            <el-input v-model="account" style="width: 240px" placeholder="请输入用户名" />
        </div>
        <div>
            <el-input v-model="password" style="width: 240px" type="password" placeholder="请输入密码" show-password />
        </div>
        <div>
            <el-button @click="login(account, password)">登录</el-button>

        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import mitt from '../../utils/mitt'
import { useUserStore } from '../../stores/userStore'

const account = ref('')
const password = ref('')


const login = (account: string, password: string) => {

    if (account === '' || password === '') {
        mitt.emit('ElNotification', { type: 'error', title: "错误", message: '错误信息：' + '请输入账号密码' })
        return
    }

    const userStore = useUserStore()
    userStore.login(account, password)
}

</script>

<style scoped>
.loginContainer {
    margin-top: auto;
    width: 500px;
    height: 500px;
    /* background-color: pink; */
}
</style>
