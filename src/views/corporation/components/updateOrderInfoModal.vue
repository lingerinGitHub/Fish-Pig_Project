<template>
    <el-dialog v-model="dialogVisible" :title="title" width="530px" @closed="handleClose" top="4vh"
        class="basic-info-dialog" :close-on-click-modal="false">
        <el-form ref="formRef" :model="formData" :rules="formRules" label-position="left" label-width="130px"
            @submit.prevent="handleSubmit">

            <el-form-item label="日期" prop="date">
                <el-date-picker v-model="formData.date" type="date" placeholder="请选择日期" format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD" />
            </el-form-item>

            <el-form-item label="货单编号" prop="orderCode">
                <el-input v-model="formData.orderCode" placeholder="请输入货单编号" clearable :maxlength="100"
                    show-word-limit />
            </el-form-item>

            <el-form-item label="材质" prop="material">
                <el-input v-model="formData.material" placeholder="请输入材质信息" clearable :maxlength="255"
                    show-word-limit />
            </el-form-item>

            <el-form-item label="规格参数1(mm)" prop="specification1">
                <el-input v-model="formData.specification1" placeholder="请输入规格参数1" clearable :maxlength="100"
                    show-word-limit />
            </el-form-item>

            <el-form-item label="规格参数2(mm)" prop="specification2">
                <el-input v-model="formData.specification2" placeholder="请输入规格参数2" clearable :maxlength="100"
                    show-word-limit />
            </el-form-item>

            <el-form-item label="规格参数3(mm)" prop="specification3">
                <el-input v-model="formData.specification3" placeholder="请输入规格参数3" clearable :maxlength="100"
                    show-word-limit />
            </el-form-item>

            <el-form-item label="有/无珠" prop="bead">
                <!-- <el-input v-model="formData.bead" placeholder="请输入公司名称" clearable :maxlength="100"
                    show-word-limit /> -->
                <el-select v-model="formData.bead" placeholder="请选择有/无珠" style="width: 100%">
                    <el-option v-for="item in beadOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="总斤数" prop="totalWeight">
                <el-input v-model="formData.totalWeight" placeholder="请输入总斤数" clearable :maxlength="100"
                    show-word-limit />
            </el-form-item>

            <el-form-item label="总粒数" prop="totalNumberOfGrains">
                <el-input v-model="formData.totalNumberOfGrains" placeholder="请输入总粒数" clearable :maxlength="100"
                    show-word-limit />
            </el-form-item>

            <el-form-item label="每斤/粒" prop="grainPerCatty">
                <el-input v-model="formData.grainPerCatty" placeholder="请输入每斤/粒" clearable :maxlength="100"
                    show-word-limit />
            </el-form-item>

            <el-form-item label="单价(元)" prop="unitPrice">
                <el-input v-model="formData.unitPrice" placeholder="请输入单价" clearable :maxlength="120" show-word-limit />
            </el-form-item>

            <el-form-item label="总价(元)" prop="amount">
                <el-input v-model="formData.amount" placeholder="请输入总价" clearable :maxlength="120" show-word-limit />
            </el-form-item>


            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" native-type="submit" :loading="submitting">
                    保存修改后订单信息
                </el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import mitt from '@/utils/mitt'
import type { order } from '@/interface/order'
import { corporation } from '@/interface/corporation';
import { useOrderStore } from '@/stores/orderStore';


interface Props {
    visible: boolean,
    corporation: corporation,
    order: order
}

const props = defineProps<Props>()
const emit = defineEmits(['update:visible', 'update:user'])

const formRef = ref<FormInstance>()
const submitting = ref(false)

const beadOptions = [
    { label: '有珠', value: 1 },
    { label: '无珠', value: 0 }
]

const formData = reactive<order>({
    id: null, // 订单id
    date: props.order.date,
    material: props.order.material, // 材料
    specification: '', // 规格
    bead: props.order.bead, // 珠
    totalWeight: props.order.totalWeight,  // 总重
    grainPerCatty: props.order.grainPerCatty, // 每公斤粒数
    totalNumberOfGrains: props.order.totalNumberOfGrains, // 总粒数
    unitPrice: props.order.unitPrice,// 单价
    amount: props.order.amount, // 金额
    corporationId: props.corporation.id, // 供应商id
    orderCode: props.order.orderCode, // 订单编号
    specification1: props.order.specification1, // 规格1
    specification2: props.order.specification2, // 规格2
    specification3: props.order.specification3, // 规格3
})

const title = computed(() => {
    return `修改 ${props.corporation.corporationName} 订单信息`
})

const formRules = reactive<FormRules<typeof formData>>({
    date: [
        { required: true, message: '请选择日期', trigger: 'blur' },
        {
            pattern: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/,
            message: '请输入正确的日期格式 (YYYY-MM-DD)',
            trigger: 'blur'
        }
    ],
    orderCode: [
        { required: true, message: '请输入订单编号', trigger: 'blur' },
    ], // 订单编号
    material: [
        { required: true, message: '请输入材质', trigger: 'blur' },
    ],
    specification1: [
        { required: true, message: '请输入规格1', trigger: 'blur' },
        {
            min: 1,
            pattern: /^\d+(\.\d+)?$/, // 允许整数或小数（最多一个小数点）
            message: '请输入有效的数字（可包含一位小数点）',
            trigger: 'blur'
        }
    ],
    specification2: [
        { required: true, message: '请输入规格2', trigger: 'blur' },
        {
            min: 1,
            pattern: /^\d+(\.\d+)?$/, // 允许整数或小数（最多一个小数点）
            message: '请输入有效的数字（可包含一位小数点）',
            trigger: 'blur'
        }
    ],
    specification3: [
        { required: true, message: '请输入规格3', trigger: 'blur' },
        {
            min: 1,
            pattern: /^\d+(\.\d+)?$/, // 允许整数或小数（最多一个小数点）
            message: '请输入有效的数字（可包含一位小数点）',
            trigger: 'blur'
        }
    ],
    bead: [
        { required: true, message: '请选择是否有珠', trigger: 'blur' },
    ],
    grainPerCatty: [
        { required: true, message: '请输入每斤/粒', trigger: 'blur' },
        {
            min: 1,
            pattern: /^\d+(\.\d+)?$/, // 允许整数或小数（最多一个小数点）
            message: '请输入有效的数字（可包含一位小数点）',
            trigger: 'blur'
        }
    ],
    totalWeight: [
        { required: true, message: '请输入总重', trigger: 'blur' },
        {
            min: 1,
            pattern: /^\d+(\.\d+)?$/, // 允许整数或小数（最多一个小数点）
            message: '请输入有效的数字（可包含一位小数点）',
            trigger: 'blur'
        }
    ],
    totalNumberOfGrains: [
        { required: true, message: '请输入总粒数', trigger: 'blur' },
        {
            min: 1,
            pattern: /^\d+(\.\d+)?$/, // 允许整数或小数（最多一个小数点）
            message: '请输入有效的数字（可包含一位小数点）',
            trigger: 'blur'
        }
    ],
    unitPrice: [
        { required: true, message: '请输入单价', trigger: 'blur' },
        {
            min: 1,
            pattern: /^\d+(\.\d+)?$/, // 允许整数或小数（最多一个小数点）
            message: '请输入有效的数字（可包含一位小数点）',
            trigger: 'blur'
        }
    ],
    amount: [
        { required: true, message: '请输入总价', trigger: 'blur' },
        {
            min: 1,
            pattern: /^\d+(\.\d+)?$/, // 允许整数或小数（最多一个小数点）
            message: '请输入有效的数字（可包含一位小数点）',
            trigger: 'blur'
        }
    ],
})

const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})


const handleSubmit = async () => {
    try {
        submitting.value = true
        await formRef.value?.validate()


        formData.specification = JSON.stringify(
            {
                '1': formData.specification1,
                '2': formData.specification2,
                '3': formData.specification3,
            })

        console.log(formData)

        await useOrderStore().updateOrder(formData)
            .then(() => {
                // 重置表单并关闭对话框
                formRef.value?.resetFields()
                emit('update:visible', false)
                mitt.emit('ElNotification', { type: 'success', title: "成功", message: '订单修改成功' })
            })
            .catch((err: any) => {
                mitt.emit('ElNotification', { type: 'error', title: "错误", message: '错误信息：' + err.message })
            })

        // 更新用户信息并关闭对话框
        // ElMessage.success('信息更新成功')
        // emit('update:visible', false)

        // await userStore.updateUserBaseInfo(formData.name, formData.phone, formData.email, formData.bio)


    } catch (error) {
        mitt.emit('ElNotification', { type: 'error', title: "错误", message: '表单校验失败' })
    } finally {
        submitting.value = false
    }
}

const handleClose = () => {
    // formRef.value?.resetFields()
    emit('update:visible', false)
}

// 当选择订单更新时
watch(
    () => props.order,
    (newVal) => {
        Object.assign(formData, newVal)
    },
    { immediate: true, deep: true }
)
</script>

<style lang="scss" scoped>
.b-dialog {
    --dialog-radius: 12px;
    --primary-color: #409eff;
    --hover-color: #79bbff;

    ::v-deep .el-dialog {
        border-radius: var(--dialog-radius);
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);

        &__header {
            padding: 24px 24px 12px;
            margin-right: 0;
            border-bottom: 1px solid #eee;

            .el-dialog__title {
                font-size: 18px;
                font-weight: 600;
                color: #333;
            }
        }

        &__body {
            padding: 20px 24px;
        }
    }

    .el-form-item {
        margin-bottom: 24px;

        :deep(.el-form-item__label) {
            font-weight: 500;
            color: #666;
            padding-bottom: 6px;
        }

        .el-input,
        .el-textarea {
            --input-radius: 8px;

            &__inner {
                border-radius: var(--input-radius);
                transition: all 0.3s ease;

                &:focus {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
                }
            }
        }
    }

    .dialog-footer {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 32px;

        .el-button {
            min-width: 100px;
            border-radius: 8px;
            transition: all 0.2s ease;

            &:hover {
                transform: translateY(-1px);
            }

            &--primary {
                background: var(--primary-color);
                border-color: var(--primary-color);

                &:hover {
                    background: var(--hover-color);
                    border-color: var(--hover-color);
                }
            }
        }
    }

    @media (max-width: 768px) {
        :deep(.el-dialog) {
            width: 90% !important;
            margin-top: 20vh !important;
        }
    }
}
</style>