<template>
    <el-drawer v-model="dialogVisible" direction="ltr" size="30%" :show-close="false">
        <template #header>
            <!-- <h2>{{ title }}</h2> -->
            <h2 v-html="title"></h2>
        </template>
        <template #default>
            <div class="container">
                <div class="input-button">
                    <el-input v-model="formData.year" style="max-width: 600px" placeholder="可选择输入订单年份" @input="onInput">
                        <template #prepend>年份</template>
                    </el-input>

                    <el-input v-model="formData.month" style="max-width: 600px" placeholder="可选择输入订单月份"
                        @input="onInput">
                        <template #prepend>月份</template>
                    </el-input>

                    <el-select v-model="formData.type" placeholder="可选择输入公司类型" style="width: 100%" multiple
                        @change="onInput">
                        <el-option v-for="item in corporationTypeOptions" :key="item.value" :label="item.label"
                            :value="item.value">
                            <el-tag :key="item.value" effect="dark" :type="corporationTagTypeFilter(item.value)">
                                {{ item.label }}
                            </el-tag>
                        </el-option>
                        <template #tag>
                            <el-tag v-for="item in formData.type" effect="dark" :key="item"
                                :type="corporationTagTypeFilter(item)">
                                {{ corporationTypeToChinese(item) }}
                            </el-tag>
                        </template>
                    </el-select>
                </div>
                <div class="result">
                    <div class="result-item">
                        <div>总粒数</div>
                        <div>{{ resultSet.totalNumberOfGrains }}</div>
                    </div>
                    <div class="result-item">
                        <div>总金额</div>
                        <div>{{ resultSet.totalAmount }}</div>
                    </div>
                    <div class="result-item">
                        <div>总原金额</div>
                        <div>{{ resultSet.totalOriginalAmount }}</div>
                    </div>
                    <div class="result-item">
                        <div>总净金额</div>
                        <div>{{ resultSet.totalNetAmount }}</div>
                    </div>
                </div>
            </div>
        </template>
        <template #footer>
            <div style="flex: auto">
                <!-- <el-button @click="cancelClick">cancel</el-button> -->
                <el-button type="primary" @click="searchResult">手动点击查询</el-button>
            </div>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { corporationTypeToChinese, corporationTagTypeFilter } from '@/utils/corporationUtils'
import { corporationTypeOptions } from '@/interface/corporation'
import mitt from '@/utils/mitt'
import { fish_post } from '@/services/axiosMethods'
import { httpUrl } from '@/api/httpUrl'

interface Props {
    visible: boolean,
}

const props = defineProps<Props>()

const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})

const formData = reactive<any>({
    year: null,
    month: null,
    type: null
})

const title = computed(() => {

    // 添加输入的查询条件
    let conditions = [];

    if (formData.year !== null && formData.year !== '') {
        conditions.push(`年份=${formData.year}`);
    }

    if (formData.month !== null && formData.month !== '') {
        conditions.push(`月份=${formData.month}`);
    }

    if (false && formData.type !== null && formData.type !== '' && Object.keys(formData.type).length > 0) {
        conditions.push(`公司类型`);

        for (let key in formData.type) {

            if (formData.type[key]) {
                console.log(key)
                console.log(formData.type)
                console.log(formData.type[key])
                conditions.push(`${corporationTypeToChinese(formData.type[key])};`);
            }
        }
    }

    let inputCondition = conditions.length > 0
        ? `查询条件：<br>${conditions.join('，<br>')}`
        : '';

    return "订单汇总 " + inputCondition;
})

// 发射事件
const emit = defineEmits(['update:visible'])

function cancelClick() {
    emit('update:visible', false)
}

const resultSet = ref({
    totalNumberOfGrains: 0,
    totalAmount: 0,
    totalOriginalAmount: 0,
    totalNetAmount: 0,
});

// 自动查询时间
let searchTimeout = null as any;
// 输入查询条件时，延迟1秒后执行搜索
const onInput = async () => {

    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {

        const { year, month, type } = formData;
        if ((year === null || year === '') &&
            (month === null || month === '') &&
            (type === null ||type.length === 0)) {
            resultSet.value.totalAmount = 0
            resultSet.value.totalOriginalAmount = 0
            resultSet.value.totalNetAmount = 0
            resultSet.value.totalNumberOfGrains = 0
            return
        };

        await searchResult()
    }, 1000);
};

const searchResult = async () => {

    let typeList = ''

    if (formData.type !== null && formData.type !== '') {

        const keys = Object.keys(formData.type);
        let lastKey = keys[keys.length - 1];

        for (let key in formData.type) {
            typeList = typeList + formData.type[key].toString();
            if (key !== lastKey) {
                typeList = typeList + ',';
            }
        }
    };

    console.log(formData.month)

    await fish_post(httpUrl.selectTotalOrder, {}, {
        year: formData.year,
        month: formData.month,
        types: typeList,
    })
        .then((res) => {
            resultSet.value.totalNetAmount = res.data.data.totalNetAmount;
            resultSet.value.totalAmount = res.data.data.totalAmount;
            resultSet.value.totalOriginalAmount = res.data.data.totalOriginalAmount;
            resultSet.value.totalNumberOfGrains = res.data.data.totalNumberOfGrains;

            mitt.emit('ElNotification', { type: 'success', title: "成功", message: '查询成功' })
        })
        .catch((err) => {
            mitt.emit('ElNotification', { type: "error", title: "失败", message: '查询失败：' + err })
        })
}

</script>

<style scoped lang="scss">
.container {

    .input-button {
        display: flex;
        flex-direction: column;
        gap: 10px;
        // justify-content: space-between;
        margin-bottom: 20px;
    }

    .result {
        display: flex;
        flex-direction: column;
        gap: 12px;

        .result-item {
            display: flex;
            justify-content: space-between;
            padding: 8px;
            border-radius: 7px;
            background-color: #ccc;
        }
    }

}
</style>