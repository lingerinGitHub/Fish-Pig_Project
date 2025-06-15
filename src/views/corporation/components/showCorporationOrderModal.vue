<template>
    <!-- 二次确认对话框 -->
    <el-dialog v-model="alertDialogVisible" top="10vh" width="500" :before-close="handleAlertClose">
        <template #header="{ titleId, titleClass }">
            <div class="my-header">
                <el-icon size="40px" color="#f56c6c">
                    <Warning />
                </el-icon>
                <h4 :id="titleId" :class="titleClass">{{ props.corporation.corporationName }}</h4>
                <div :id="titleId" :class="titleClass">是否删除货单编号为{{ currentSelectOrder.orderCode }} 的订单！</div>
            </div>
        </template>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="alertDialogVisible = false">取消</el-button>
                <el-button type="danger" @click="deleteOrder">
                    确认删除
                </el-button>
            </div>
        </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible" :title="title" top="7.5vh" width="88%" :height="81">
        <!-- 弹窗头部 -->
        <template #header="">
            <div class="header">
                <el-tag effect="dark" :type="corporationTagTypeFilter(props.corporation.type)">
                    {{ corporationTypeToChinese(props.corporation.type) }}
                </el-tag>
                {{ title }}
            </div>
        </template>
        <!-- 添加滚动容器 -->
        <div class="table-container">
            <art-table :data="filteredCorporations" height="67.5vh">
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
                        <!-- <template #default="{ row }">
                            <el-tag :type="row.status !== 1 ? 'success' : 'danger'">
                                {{ row.status !== 1 ? '正常' : '异常' }}
                            </el-tag>
                        </template> -->
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
                    <el-table-column label="单价(元/粒)" prop="unitPrice" width="100" />
                    <el-table-column label="总价(元)" prop="amount" width="130" />
                    <el-table-column v-if="props.corporation.type != 0" label="原单价" prop="originalUnitPrice"
                        width="130" />
                    <el-table-column v-if="props.corporation.type != 0" label="原金额" prop="originalAmount" width="130" />
                    <el-table-column v-if="props.corporation.type != 0" label="净金额" prop="netAmount" width="130" />
                    <el-table-column label="操作" width="110" fixed="right">
                        <template #default="{ row }">
                            <el-button type="primary" size="small" icon="Edit"
                                @click="openUpdateOrderInfoModal(row)"></el-button>
                            <el-button type="danger" size="small" icon="Delete"
                                @click="confirmDialogVisible(row)"></el-button>
                        </template>
                    </el-table-column>
                    <!-- <div>123</div> -->
                </template>
            </art-table>

            <!-- 分页区域 -->
            <div class="pagination-container">
                <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="orderStore.total"
                    :page-size="orderStore.pageSize" :current-page="orderStore.currentPage"
                    :page-sizes="[8, 10, 20, 50, 100, 99999]" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>

            <!-- 表单查询条件 -->
            <div class="selectForm">
                <el-form :inline="true" :model="selectForm" class="" size="small">
                    <el-form-item label="订单编号">
                        <el-input v-model="selectForm.orderCode" placeholder="可输入查询订单编号" @input="onInput" />
                    </el-form-item>
                    <el-form-item label="订单材料">
                        <el-input v-model="selectForm.material" placeholder="可输入查询订单材料" @input="onInput" />
                    </el-form-item>
                    <el-form-item label="订单年份">
                        <el-input v-model="selectForm.year" placeholder="可输入查询订单年份" @input="onInput" />
                    </el-form-item>
                    <el-form-item label="订单月份">
                        <el-input v-model="selectForm.month" placeholder="可输入查询订单月份" @input="onInput" />
                    </el-form-item>
                </el-form>
            </div>

            <div class="infoContainer">
                <div class="infoItem">
                    <div>总粒数</div>
                    <div>{{ orderStore.ordersTotalGrains || 0 }}</div>
                </div>
                <div class="infoItem">
                    <div>总价</div>
                    <div>{{ orderStore.ordersTotalAmount || 0 }}</div>
                </div>
            </div>

            <!-- 添加订单按钮 -->
            <el-button type="warning" class="button" @click="openAddOrderInfoModal">添加订单</el-button>

            <!-- 添加订单模态框 -->
            <add-order-info-modal v-model:visible="isAddOrderInfoModal" v-model:corporation="props.corporation"
                @close="closeAddOrderInfoModal"></add-order-info-modal>

            <!-- 修改订单模态框 -->
            <update-order-info-modal v-model:visible="isUpdateOrderInfoModal" v-model:corporation="props.corporation"
                v-model:order="currentSelectOrder" @close="closeUpdateOrderInfoModal"></update-order-info-modal>

        </div>
    </el-dialog>

</template>

<script lang="ts" setup>
import { corporation } from '@/interface/corporation';
// import { useCorporationStore } from '@/stores/corporationStore';
import { useOrderStore } from '@/stores/orderStore';
import { computed, ref, watch, reactive } from 'vue'
import addOrderInfoModal from './addOrderInfoModal.vue';
import updateOrderInfoModal from './updateOrderInfoModal.vue';
import { order } from '@/interface/order';
import { corporationTypeToChinese, corporationTagTypeFilter } from '@/utils/corporationUtils'
import mitt from '@/utils/mitt';


// const corporationStore = useCorporationStore()
const orderStore = useOrderStore()
const currentSelectOrder = ref<order>({} as order)

interface Props {
    visible: boolean,
    corporation: corporation
}

const props = defineProps<Props>()
const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})
const emit = defineEmits(['update:visible'])

// 查询条件表单数据
const selectForm = reactive({
    orderCode: '',
    material: '',
    year: '',
    month: ''
})

const title = computed(() => {

    // 添加输入的查询条件
    let conditions = [];
    if (selectForm.orderCode) conditions.push(`订单编号=${selectForm.orderCode}`);
    if (selectForm.material) conditions.push(`材料名称=${selectForm.material}`);
    if (selectForm.year) conditions.push(`年份=${selectForm.year}`);
    if (selectForm.month) conditions.push(`月份=${selectForm.month}`);

    let inputCondition = conditions.length > 0
        ? `查询条件：${conditions.join('，')}`
        : '';

    return props.corporation?.corporationName + '订单列表 ' + inputCondition
})


// 关闭警告
const handleAlertClose = () => {
    alertDialogVisible.value = false
}

// 过滤后的公司数据
const filteredCorporations = computed(() => {
    return orderStore.orders
})

// 处理分页大小变化事件
const handleSizeChange = (newSize: number) => {
    orderStore.pageSize = newSize
    orderStore.getOrderList(0, props.corporation.id)

}

// 处理当前页码变化事件
const handleCurrentChange = (newPage: number) => {
    orderStore.currentPage = newPage
    orderStore.getOrderList(newPage, props.corporation.id)
}

const deleteOrder = async () => {
    await orderStore.deleteOrder(currentSelectOrder.value.id)
        .then(() => {
            mitt.emit('ElNotification', { type: 'success', title: "成功", message: '订单删除成功' })
            alertDialogVisible.value = false
        })
        .catch((err) => {
            mitt.emit('ElNotification', { type: 'error', title: "失败", message: `订单删除失败: ${err}` })
        })
}

let searchTimeout = null as any;
// 输入框输入时，延迟1秒后执行搜索
const onInput = async () => {

    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {

        if (selectForm.orderCode === '' && selectForm.material === '' && selectForm.year === '' && selectForm.month === '') {
            // 重置查询数据
            orderStore.getOrderList(1, props.corporation.id)
            return
        } else if (selectForm.year === '' && selectForm.month !== '') {
            mitt.emit('ElNotification', { type: "error", title: "失败", message: '请同时输入年份和月份' })
            ElMessage.error('请同时输入年份和月份')
            return
        }
        await orderStore.getOrderList(1, props.corporation.id, selectForm)
            .then(() => {
                mitt.emit('ElNotification', { type: 'success', title: "成功", message: '查询成功' })
            })
    }, 1000);
};

// 当选择公司更新时
watch(
    () => props.corporation,
    (newVal) => {

        var getTime = new Date().getTime(); //获取到当前时间戳
        var time = new Date(getTime); //创建一个日期对象
        var year = time.getFullYear().toString(); // 年
        var month = time.getMonth() + 1; // 月
        // Object.assign(formData, newVal)
        // 清空表单
        selectForm.orderCode = ''
        selectForm.material = ''
        selectForm.year = year
        selectForm.month = month.toString()

        orderStore.$reset()
        orderStore.getOrderList(1, newVal.id, selectForm)
    },
)

// 添加订单信息模态框
const isAddOrderInfoModal = ref(false)
const isUpdateOrderInfoModal = ref(false)
const alertDialogVisible = ref(false)

// 二次确认对话框
const confirmDialogVisible = (row: order) => {
    // 保存当前选中的订单信息
    currentSelectOrder.value = row
    alertDialogVisible.value = true
}

// 打开修改订单信息模态框
const openUpdateOrderInfoModal = (row: order) => {
    currentSelectOrder.value = row
    isUpdateOrderInfoModal.value = true
}

// 关闭修改订单信息模态框
const closeUpdateOrderInfoModal = () => {
    isUpdateOrderInfoModal.value = false
}

// 打开添加订单信息模态框
const openAddOrderInfoModal = () => {
    isAddOrderInfoModal.value = true
}

// 关闭添加订单信息模态框
const closeAddOrderInfoModal = () => {
    isAddOrderInfoModal.value = false
}

</script>

<style lang="scss" scoped>
.header {
    display: flex;
    gap: 10px;
}

.table-container {
    margin-top: -3vh;
    position: relative;
    height: 80vh;
    overflow-y: hidden;

    .button {
        margin-top: -4vh;
        float: right;
    }

    .pagination-container {
        margin-top: 1%;
        margin-left: 20%;
        display: flex;
        justify-content: center;
    }

    .selectForm {
        position: absolute;
        bottom: -0.5%;
        left: 0%;
        width: 50%;
        min-width: 400px;
        height: 12%;
    }

    .infoContainer {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        right: 110px;
        bottom: 6px;
        width: 10%;
        height: 10%;
        gap: 5px;
        // background-color: pink;

        .infoItem {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            background-color: #CCCCCC;
            padding: 5px;
            border-radius: 5px;
        }
    }
}

.scroll-trigger {
    height: 1px;
    visibility: hidden;
}

.loading-tip,
.no-more {
    padding: 10px;
    text-align: center;
    color: #999;
    font-size: 14px;
}
</style>