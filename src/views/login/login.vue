<template>
    <div class="login-container">
        <el-card class="login-card">
            <h2 class="login-title">系统登录</h2>

            <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" @keyup.enter="handleLogin">
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="User" clearable />
                </el-form-item>

                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" placeholder="请输入密码" prefix-icon="Lock" show-password
                        clearable />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" class="login-btn" :loading="loading" @click="handleLogin">
                        登录
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/userStore'
import { ElMessage } from 'element-plus'
import mitt from '../../utils/mitt'

const router = useRouter()
const userStore = useUserStore()

const loginForm = reactive({
    username: '',
    password: ''
})

const loginRules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 12, message: '长度在3到12个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 18, message: '长度在6到18个字符', trigger: 'blur' }
    ]
})

const loginFormRef = ref(null)
const loading = ref(false)

const handleLogin = () => {
    loginFormRef.value.validate(valid => {

        if (!valid) {
            mitt.emit('ElNotification', { type: 'error', title: "错误", message: '错误信息：' + '请输入账号密码' })
            return
        }

        loading.value = true
        userStore.login(loginForm.username, loginForm.password)

    })
}
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f7fa;
}

.login-card {
    width: 400px;
    padding: 30px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-title {
    text-align: center;
    margin-bottom: 30px;
    color: #409eff;
}

.login-btn {
    width: 100%;
    margin-top: 10px;
    height: 42px;
    font-size: 16px;
}
</style>