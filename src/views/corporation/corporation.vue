<template>
    <!-- 二次确认对话框 -->
    <el-dialog v-model="alertDialogVisible" top="10vh" width="500" :before-close="handleAlertClose">
        <template #header="{ titleId, titleClass }">
            <div class="my-header">
                <el-icon size="40px" color="#f56c6c">
                    <Warning />
                </el-icon>
                <!-- <h4 :id="titleId" :class="titleClass">{{ currentSelectedCorporation.corporationName }}</h4> -->
                <div :id="titleId" :class="titleClass">是否删除 {{ currentSelectedCorporation.corporationName }} ！</div>
            </div>
        </template>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="alertDialogVisible = false">取消</el-button>
                <el-button type="danger" @click="deleteCorporation">
                    确认删除
                </el-button>
            </div>
        </template>
    </el-dialog>
    <div class="corporations-container">
        <!-- 标题区域 -->
        <div class="header">
            <div class="title-container">
                <h1 class="page-title">公司管理</h1>
                <p class="page-subtitle">管理系统中的所有公司信息</p>
            </div>
            <div class="header-actions">
                <el-button type="primary" icon="Plus" @click="openAddCorporationInfoModal">新增公司</el-button>
                <el-button icon="Refresh" @click="refreshData">刷新</el-button>
            </div>
        </div>

        <!-- 表格区域 -->
        <div class="table-card">
            <art-table :data="filteredCorporations">
                <template #default>
                    <el-table-column label="ID" prop="id" width="80" />
                    <el-table-column label="公司名称" prop="corporationName" min-width="200">
                        <template #default="{ row }">
                            <el-tooltip class="box-item" effect="dark" content="点击查看公司订单" placement="top">
                                <span class="hover-pointer" @click="openShowCorporationOrderModal(row)">
                                    {{ row.corporationName }}
                                </span>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="排序" prop="sort" width="100" sortable />
                    <el-table-column label="状态" width="100">
                        <template #default="{ row }">
                            <el-tag :type="row.status !== 1 ? 'success' : 'danger'">
                                {{ row.status !== 1 ? '正常' : '异常' }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="创建时间" prop="createTime" width="180" />
                    <el-table-column label="操作" width="180" fixed="right">
                        <template #default="{ row }">
                            <el-button type="primary" size="small" icon="Edit"
                                @click="openUpdateCorporationInfoModal(row)">编辑</el-button>
                            <el-button type="danger" size="small" icon="Delete"
                                @click="confirmDialogVisible(row)">删除</el-button>
                        </template>
                    </el-table-column>
                </template>
            </art-table>
        </div>

        <!-- 分页区域 -->
        <div class="pagination-container">
            <el-pagination background layout="total, sizes, prev, pager, next, jumper" :total="corporationStore.total"
                :page-size="corporationStore.pageSize" :current-page="corporationStore.currentPage"
                :page-sizes="[6, 10, 20, 50]" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>

        <!-- 搜索区域 -->
        <div class="search-container">
            <el-input v-model="searchQuery" placeholder="搜索公司名称..." clearable prefix-icon="Search" style="width: 300px;"
                @input="onInput" />
            <el-button type="primary" icon="Search"
                @click="corporationStore.fuzzyLookupCorporationList(1, searchQuery)">搜索</el-button>
        </div>

        <!-- 添加公司弹窗 -->
        <add-corporation-info-modal v-model:visible="isAddCorporationInfoModal" @close="closeAddCorporationInfoModal" />
        <!-- 更新公司弹窗 -->
        <update-corporation-info-modal v-model:visible="isupdateCorporationInfoModal"
            v-model:corporation="currentSelectedCorporation" @close="closeUpdateCorporationInfoModal" />
        <!-- 查看公司订单弹窗 -->
        <show-corporation-order-modal v-model:visible="isShowCorporationOrderModal"
            v-model:corporation="currentSelectedCorporation"
            @close="closeShowCorporationOrderModal"></show-corporation-order-modal>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import ArtTable from '@/components/Table/ArtTable.vue'
import { useCorporationStore } from '@/stores/corporationStore'
import addCorporationInfoModal from './components/addCorporationInfoModal.vue'
import updateCorporationInfoModal from './components/updateCorporationInfoModal.vue'
import showCorporationOrderModal from './components/showCorporationOrderModal.vue'
import { corporation } from '@/interface/corporation'
import mitt from '@/utils/mitt'


const corporationStore = useCorporationStore()
// const currentPage = corporationStore.currentPage
const searchQuery = ref('')
let searchTimeout = null as any;
const currentSelectedCorporation = ref<corporation | null>(null)

// 处理分页大小变化事件
const handleSizeChange = (newSize: number) => {

    corporationStore.pageSize = newSize

    // 需要判断是普通查询还是模糊查询
    if (corporationStore.currentSelectModel === 0) {
        fetchInitData()

        // 如果是模糊查询，则重新执行模糊查询操作，传入新页码和搜索关键字
    } else if (corporationStore.currentSelectModel === 1) {
        corporationStore.fuzzyLookupCorporationList(1, searchQuery.value)
    }

}

// 处理当前页码变化事件
const handleCurrentChange = (newPage: number) => {
    corporationStore.currentPage = newPage
    // 需要判断是普通查询还是模糊查询
    if (corporationStore.currentSelectModel === 0) {
        corporationStore.getCorporationList(newPage)

        // 如果是模糊查询，则重新执行模糊查询操作，传入新页码和搜索关键字
    } else if (corporationStore.currentSelectModel === 1) {
        corporationStore.fuzzyLookupCorporationList(newPage, searchQuery.value)
    }
}

// 删除公司信息
const deleteCorporation = async () => {

    console.log('删除公司信息：', currentSelectedCorporation.value?.id)

    // 调用删除接口
    await corporationStore.deleteCorporation(currentSelectedCorporation.value.id)
        .then(() => {
            mitt.emit('ElNotification', { type: 'success', title: "成功", message: `删除 ${currentSelectedCorporation.value.corporationName} 成功~` })
            // 关闭弹窗
            alertDialogVisible.value = false
        })
        .catch((err: any) => {
            mitt.emit('ElNotification', { type: 'error', title: "错误", message: '删除失败，错误信息：' + err.message })
        })


}


// 刷新数据
const refreshData = () => {
    fetchInitData()
}

// 获取数据
const fetchInitData = () => {
    corporationStore.getCorporationList(corporationStore.currentPage)
}

// 过滤后的公司数据(后期可添加条件过滤搜索等操作)
const filteredCorporations = computed(() => {
    return corporationStore.corporations
})

// 输入框输入时，延迟1秒后执行搜索
const onInput = () => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {

        if (!searchQuery.value) {
            fetchInitData()
            return
        }
        corporationStore.fuzzyLookupCorporationList(1, searchQuery.value)
    }, 1000);
};

// 处理弹窗的显示
const isAddCorporationInfoModal = ref(false)
const isupdateCorporationInfoModal = ref(false)
const isShowCorporationOrderModal = ref(false)
const alertDialogVisible = ref(false)

// 打开次确认对话框
const confirmDialogVisible = (row: corporation) => {
    // 保存当前选中的订单信息
    currentSelectedCorporation.value = row
    alertDialogVisible.value = true
}
// 关闭二次确认对话框
const handleAlertClose = () => {
    alertDialogVisible.value = false
}
// 打开添加公司信息弹窗
const openAddCorporationInfoModal = () => {
    isAddCorporationInfoModal.value = true
}
// 关闭添加公司信息弹窗
const closeAddCorporationInfoModal = () => {
    isAddCorporationInfoModal.value = false
}
// 打开更新公司信息弹窗
const openUpdateCorporationInfoModal = (row: corporation) => {
    currentSelectedCorporation.value = row
    if (!currentSelectedCorporation.value) {
        return
    }
    isupdateCorporationInfoModal.value = true
}
// 关闭更新公司信息弹窗
const closeUpdateCorporationInfoModal = () => {
    isupdateCorporationInfoModal.value = false
}
// 打开查看公司订单弹窗
const openShowCorporationOrderModal = (row: corporation) => {

    currentSelectedCorporation.value = row
    if (!currentSelectedCorporation.value) {
        return
    }
    isShowCorporationOrderModal.value = true
}
// 关闭查看公司订单弹窗
const closeShowCorporationOrderModal = () => {
    isShowCorporationOrderModal.value = false
}

onMounted(() => {
    // 初始第一页数据加载
    fetchInitData()
})
</script>

<style lang="scss" scoped>
.corporations-container {
    width: 90%;
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
        padding-bottom: 16px;
        border-bottom: 1px solid #eee;

        .title-container {
            .page-title {
                font-size: 24px;
                font-weight: 600;
                color: #1f2d3d;
                margin: 0;
            }

            .page-subtitle {
                font-size: 14px;
                color: #8492a6;
                margin: 5px 0 0;
            }
        }

        .header-actions {
            .el-button {
                margin-left: 10px;
            }
        }
    }

    .table-card {
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
    }

    .hover-pointer {
        cursor: pointer
    }

    .pagination-container {
        margin-top: 24px;
        display: flex;
        justify-content: center;
    }

    .search-container {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
}

@media (max-width: 768px) {
    .corporations-container {
        width: 95%;
        padding: 15px;

        .header {
            flex-direction: column;
            align-items: flex-start;

            .header-actions {
                margin-top: 15px;
                width: 100%;
                display: flex;
                justify-content: space-between;
            }
        }

        .search-container {
            flex-direction: column;

            .el-input {
                width: 100% !important;
                margin-bottom: 10px;
            }
        }
    }
}
</style>