// src/utils/CustomError.ts
import type { errorResponse } from '../interface/errorResponse';

// 导出一个自定义错误类
export class CustomError extends Error {
    public code?: number;

    // 构造函数，用于创建一个自定义的错误对象
    constructor(message: string, code?: number) {
        // 调用父类的构造函数，传入错误消息
        super(message);
        // 设置错误代码
        this.code = code;
    }

    // 将当前对象转换为错误响应对象
    toErrorResponse(): errorResponse {
        // 返回一个错误响应对象，包含成功状态、错误信息、错误代码和错误字段
        return {
            message: this.message,
            code: this.code,
        };
    }
}