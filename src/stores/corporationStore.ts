import { defineStore } from "pinia";
import { fish_post } from "../services/axiosMethods";
import { httpUrl } from "../api/httpUrl";
import mitt from "../utils/mitt";
import type { corporation } from "@/interface/corporation";

export const useCorporationStore = defineStore('coroporationStore', {
    state: () => ({
        corporations: [] as corporation[],
        pageNum: 1,
        pageSize: 5,
        currentPage: 1,
        total: 0, // 公司总数
        currentFuzzyLookupcorporationName: '',
        currentSelectModel: 0, // 0代表所有查询的列表，1代表模糊查询列表
        // 公司订单相关数据
        orderList: [], // 订单列表
        orderTotal: 0, // 订单总数
        ifLoadingOrder: false, // 是否正在加载订单列表数据
        ifMoreOrder: true, // 是否有更多订单
    }),
    getters: {

    },
    actions: {
        async getCorporationList(pageNum: number) {

            // 对查询的模式进行判断并根据情况更新pageNum
            if (this.currentSelectModel === 0) {
                this.pageNum = pageNum
                // 重置corporations列表
                this.corporations = []
            } else {
                // 重置pageNum
                this.pageNum = 1
                // 重置corporations列表
                this.corporations = []
                // 切换查询模式
                this.currentSelectModel = 0
            }

            await fish_post(httpUrl.selectCroporation, {},
                {
                    pageNo: this.pageNum,
                    pageSize: this.pageSize,
                }
            )
                .then((res: any) => {
                    // 拼接数据
                    this.corporations = this.corporations.concat(res.data.data.totalList)
                    this.total = res.data.data.total
                })
                .catch((err: any) => {
                    mitt.emit('ElNotification', { type: 'error', title: "错误", message: '错误信息：' + err.message })
                })
        },
        async fuzzyLookupCorporationList(pageNum: number, corporationName: string) {

            // 对查询的模式进行判断并根据情况更新pageNum
            if (this.currentSelectModel === 1) {
                this.pageNum = pageNum
            } else {
                // 重置pageNum
                this.pageNum = 1
                // 重置corporations列表
                this.corporations = []
                // 切换查询模式
                this.currentSelectModel = 0
            }

            await fish_post(httpUrl.selectCroporation, {},
                {
                    pageNo: this.pageNum,
                    pageSize: this.pageSize,
                    corporationName: corporationName
                }
            )
                .then((res: any) => {
                    // 拼接数据
                    this.corporations = this.corporations.concat(res.data.data.totalList)
                    this.total = res.data.data.total
                })
                .catch((err: any) => {
                    mitt.emit('ElNotification', { type: 'error', title: "错误", message: '错误信息：' + err.message })
                })

        }

    }
})