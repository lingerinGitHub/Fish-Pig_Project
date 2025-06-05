<template>
    <el-dialog v-model="dialogVisible" title="添加公司信息" width="500px" @closed="handleClose" top="25vh"
        class="basic-info-dialog" :close-on-click-modal="true">
        <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top" @submit.prevent="handleSubmit">
            <el-form-item label="名称" prop="corporationName">
                <el-input v-model="formData.corporationName" placeholder="请输入公司名称" clearable :maxlength="100"
                    show-word-limit />
            </el-form-item>

            <el-form-item label="公司排序" prop="sort">
                <el-input v-model="formData.sort" placeholder="请输入公司排序" clearable :maxlength="10">
                    <template #prefix>
                    </template>
                </el-input>
            </el-form-item>


            <div class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" native-type="submit" :loading="submitting">
                    保存更改
                </el-button>
            </div>
        </el-form>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import mitt from '@/utils/mitt'
import { addCorporation } from '@/interface/corporation'
import { fish_post } from '@/services/axiosMethods';
import { httpUrl } from '@/api/httpUrl';
import { useCorporationStore } from '@/stores/corporationStore';


interface Props {
    visible: boolean,
}

const props = defineProps<Props>()
const emit = defineEmits(['update:visible', 'update:user'])

const formRef = ref<FormInstance>()
const submitting = ref(false)

const formData = reactive<addCorporation>({
    sort: null,
    corporationName: ''
})

const formRules = reactive<FormRules<typeof formData>>({
    sort: [
        { required: true, message: '请输入排序', trigger: 'blur' },
        {
            min: 1,
            pattern: /^\d+$/,
            message: '请输入数字',
            trigger: 'blur'
        }
    ],
    corporationName: [
        { required: true, message: '请输入公司名称', trigger: 'blur' },
        {
            min: 1,
            max: 100,
            message: '请输入正确的公司名称',
            trigger: 'blur'
        }
    ]
})

const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})


const handleSubmit = async () => {
    try {
        submitting.value = true
        await formRef.value?.validate()

        if (formData.sort === null && formData.corporationName === '') {
            ElMessage.warning('未做任何更改')
            return
        }

        await useCorporationStore().addCorporation(formData.corporationName, formData.sort)
            .then(() => {
                // 清空表单
                formRef.value?.resetFields()
                // 关闭弹窗
                emit('update:visible', false)
            })
            .catch(err => {
                console.log(err);
                mitt.emit('ElNotification', { type: 'error', title: "错误", message: err.message })
            })
    } catch (error) {
        mitt.emit('ElNotification', { type: 'error', title: "错误", message: '表单校验失败' })
    } finally {
        submitting.value = false
    }
}

const handleClose = () => {
    formRef.value?.resetFields()
    emit('update:visible', false)
}
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