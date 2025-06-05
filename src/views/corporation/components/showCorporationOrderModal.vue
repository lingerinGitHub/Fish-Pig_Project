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
    <el-dialog v-model="dialogVisible" :title="title" top="7.5vh" width="88%" :height="80">
        <!-- 添加滚动容器 -->
        <div class="table-container">
            <art-table :data="filteredCorporations" height="67.5vh">
                <template #default>
                    <el-table-column label="日期" prop="date" width="100" />
                    <el-table-column label="货单编号" prop="orderCode" width="100">
                        <!-- <template #default="{ row }">
                            <span class="hover-pointer">
                                {{ row.orderCode }}
                            </span>
                        </template> -->
                    </el-table-column>
                    <el-table-column label="材质" prop="material" width="190" />
                    <el-table-column label="规格(mm)" prop="specification" width="150">
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
                    <el-table-column label="单价(元/斤)" prop="unitPrice" width="100" />
                    <el-table-column label="总价(元)" prop="amount" width="130" />
                    <el-table-column label="操作" width="180" fixed="right">
                        <template #default="{ row }">
                            <el-button type="primary" size="small" icon="Edit"
                                @click="openUpdateOrderInfoModal(row)">编辑</el-button>
                            <el-button type="danger" size="small" icon="Delete"
                                @click="confirmDialogVisible(row)">删除</el-button>
                        </template>
                    </el-table-column>
                    <!-- <div>123</div> -->
                </template>
            </art-table>

            <!-- 分页区域 -->
            <div class="pagination-container">
                <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="orderStore.total"
                    :page-size="orderStore.pageSize" :current-page="orderStore.currentPage"
                    :page-sizes="[8, 10, 20, 50]" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>

            <!-- 触底检测元素 -->
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
import { computed, ref, watch } from 'vue'
import addOrderInfoModal from './addOrderInfoModal.vue';
import updateOrderInfoModal from './updateOrderInfoModal.vue';
import { order } from '@/interface/order';
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

const title = computed(() => {
    return props.corporation?.corporationName + '订单列表'
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
    console.log(newSize)
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

// 当选择公司更新时
watch(
    () => props.corporation,
    (newVal) => {
        // Object.assign(formData, newVal)
        orderStore.$reset()
        orderStore.getOrderList(0, newVal.id)
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
.table-container {
    margin-top: -4vh;
    position: relative;
    height: 80vh;
    overflow-y: auto;

    .button {
        margin-top: -4vh;
        float: right;
    }

    .pagination-container {
        margin-top: 1%;
        display: flex;
        justify-content: center;
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