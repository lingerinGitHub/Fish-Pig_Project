<template>
    <el-dialog v-model="dialogVisible" title="订单列表" top="14vh" width="80%">
        <!-- 添加滚动容器 -->
        <div class="table-container">
            <art-table :data="filteredCorporations" height="200px">
                <template #default>
                    <!-- 列定义保持不变 -->
                    <el-table-column label="日期" prop="id" width="80" />
                    <!-- ... 其他列定义 ... -->
                    <el-table-column label="操作" width="180" fixed="right">
                        <template #default="{ row }">
                            <el-button type="primary" size="small" icon="Edit" @click="">编辑</el-button>
                            <el-button type="danger" size="small" icon="Delete">删除</el-button>
                        </template>
                    </el-table-column>
                </template>
            </art-table>

            <!-- 触底检测元素 -->
            <div ref="scrollTrigger" class="scroll-trigger"></div>

            <!-- 加载状态提示 -->
            <div v-if="corporationStore.ifLoadingOrder" class="loading-tip">加载中...</div>
            <div v-if="!corporationStore.ifMoreOrder" class="no-more">没有更多数据了</div>
        </div>
    </el-dialog>

</template>

<script lang="ts" setup>
import { corporation } from '@/interface/corporation';
import { useCorporationStore } from '@/stores/corporationStore';
import { computed, reactive, ref, useTemplateRef, shallowRef } from 'vue'
import { useIntersectionObserver } from '@vueuse/core';
import { ElMessage } from 'element-plus';

const corporationStore = useCorporationStore()

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


const title = ref('订单列表')

// 过滤后的公司数据(后期可添加条件过滤搜索等操作)
const filteredCorporations = computed(() => {
    return corporationStore.corporations
    // return corporationStore.corporations.filter(item =>
    //     item.corporationName.includes(searchQuery.value)
    // )
})



// 触底加载更多,使用 vueuse 的 useIntersectionObserver
const target = useTemplateRef<HTMLDivElement>('target')

const { stop } = useIntersectionObserver(
    target,
    ([entry], observerElement) => {

        if (corporationStore.ifMoreOrder && entry.isIntersecting && !corporationStore.ifLoadingOrder) {
            // 分页加载更多订单数据
            console.log('触底加载更多订单数据');

        } else if (!corporationStore.ifMoreOrder) {
            ElMessage({
                message: '暂无更多订单',
                type: 'success',
            })
        }
    },
)


</script>

<style lang="scss" scoped>
.table-container {
  position: relative;
  max-height: 300px; /* 设置最大高度 */
  overflow-y: auto; /* 启用垂直滚动 */
}

.scroll-trigger {
  height: 1px;
  visibility: hidden;
}

.loading-tip, .no-more {
  padding: 10px;
  text-align: center;
  color: #999;
  font-size: 14px;
}
</style>