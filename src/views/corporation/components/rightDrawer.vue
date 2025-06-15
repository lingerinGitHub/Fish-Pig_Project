<template>
    <el-drawer v-model="dialogVisible" direction="rtl" size="100%" :show-close="true">
        <template #header>
            <div class="title">根据材质和规格查询订单</div>
        </template>
        <template #default>
            <div class="container">
                <div class="input">
                    <el-input v-model="formData.material" style="max-width: 290px" placeholder="可选择输入订单材料"
                        @input="onInput">
                        <template #prepend>材料</template>
                    </el-input>
                    <el-input v-model="formData.specification1" style="max-width: 290px" placeholder="可选择输入订单规格1"
                        @input="onInput">
                        <template #prepend>规格1</template>
                    </el-input>
                    <el-input v-model="formData.specification2" style="max-width: 290px" placeholder="可选择输入订单规格2"
                        @input="onInput">
                        <template #prepend>规格2</template>
                    </el-input>
                    <el-input v-model="formData.specification3" style="max-width: 290px" placeholder="可选择输入订单规格3"
                        @input="onInput">
                        <template #prepend>规格3</template>
                    </el-input>
                    <el-button type="primary" icon="Search" @click="getSelectedOrder">手动查询</el-button>
                </div>
                <art-table :data="resultOrderList" height="73vh">
                    <template #default>
                        <el-table-column label="日期" prop="date" width="100" fixed="left" />
                        <el-table-column label="货单编号" prop="orderCode" width="100">
                            <!-- <template #default="{ row }">
                            <span class="hover-pointer">
                                {{ row.orderCode }}
                            </span>
                        </template> -->
                        </el-table-column>
                        <el-table-column label="材质" prop="material" width="120" />
                        <el-table-column label="规格(mm)" prop="specification" width="220" :show-overflow-tooltip="false">
                            <template #default="{ row }">
                                {{ specificationParse(row.specification) }}
                            </template>
                        </el-table-column>
                        <el-table-column label="有/无珠" prop="bead" width="80">
                            <template #default="{ row }">
                                <span class="hover-pointer">
                                    {{ row.bead === 1 ? '有' : '无' }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="总斤数" prop="totalWeight" width="90" />
                        <el-table-column label="总粒数" prop="totalNumberOfGrains" width="90" />
                        <el-table-column label="每斤/粒" prop="grainPerCatty" width="90" />
                        <el-table-column label="单价(元/斤)" prop="unitPrice" width="100" />
                        <el-table-column label="总价(元)" prop="amount" width="130" />
                        <el-table-column label="原单价" prop="originalUnitPrice" width="130" />
                        <el-table-column label="原金额" prop="originalAmount" width="130" />
                        <el-table-column label="净金额" prop="netAmount" width="130" />
                        <!-- <el-table-column label="操作" width="110" fixed="right">
                            <template #default="{ row }">
                                <el-button type="primary" size="small" icon="Edit"
                                    @click="openUpdateOrderInfoModal(row)"></el-button>
                                <el-button type="danger" size="small" icon="Delete"
                                    @click="confirmDialogVisible(row)"></el-button>
                            </template>
                        </el-table-column> -->
                        <!-- <div>123</div> -->
                    </template>
                </art-table>
            </div>
        </template>
        <template #footer>
            <div style="flex: auto">
                <!-- <el-button @click="cancelClick">cancel</el-button> -->
                <el-button type="primary" @click="cancelClick">关闭窗口</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { fish_post } from '@/services/axiosMethods';
import { httpUrl } from '@/api/httpUrl';
import { specificationParse, specificationToJson } from '@/utils/orderUtils'

interface Props {
    visible: boolean,
}
const formData = ref<any>({
    material: '',
    specification1: '',
    specification2: '',
    specification3: ''
})

const resultOrderList = ref<any>([])


const props = defineProps<Props>()

const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})

// 发射事件
const emit = defineEmits(['update:visible'])


function cancelClick() {
    emit('update:visible', false)
}

// 自动查询时间
let searchTimeout = null as any;
// 输入查询条件时，延迟1秒后执行搜索
const onInput = async () => {

    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {

        if (formData.value.material === '' && formData.value.specification1 === '' && formData.value.specification2 === '' && formData.value.specification3 === '') {
            ElMessage({
                message: '查找参数为空',
                type: 'warning',
            })
            return
        }

        await getSelectedOrder()
    }, 1000);
};

// 获取选择订单
const getSelectedOrder = async () => {

    if (formData.value.material === '' && formData.value.specification1 === '' && formData.value.specification2 === '' && formData.value.specification3 === '') {
        ElMessage({
            message: '查找参数为空',
            type: 'warning',
        })
        return
    }

    await fish_post(httpUrl.selectAllOrderByMaterialAndSpecification, {},
        {
            material: formData.value.material,
            specification: specificationToJson(formData.value.specification1, formData.value.specification2, formData.value.specification3)
        }
    )
        .then(res => {
            resultOrderList.value = res.data.data
            ElMessage({
                message: '查找成功',
                type: 'success',
            })
        })
        .catch(err => {
            console.error(err)
        })
}

</script>

<style scoped lang="scss">
.title {
    font-size: 20px;
    color: #333;
}

.container {
    position: relative;
    width: 100%;
    height: 96%;

    .input {
        position: absolute;
        display: flex;
        float: left;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        top: -35px;
    }
}
</style>