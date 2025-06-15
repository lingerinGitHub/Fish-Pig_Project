// 全局通用的配置参数文件

// 环境变量配置

export const ENV = {
    development: "development",
    production: "production",
};

// 切换当前环境(development||production)
export const CURRENT_ENV: string = 'development';

function returnCurrentEnvUrl(): string {
    return CURRENT_ENV === ENV.development ? 'http://192.168.31.180:8081' : 'http://127.0.0.1:8081';
}


export const CURRENT_ENV_URL = returnCurrentEnvUrl();