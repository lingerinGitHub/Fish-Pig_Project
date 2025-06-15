import { defineStore } from "pinia";
import { fish_post } from "../services/axiosMethods";
import { httpUrl } from "../api/httpUrl";
import mitt from "../utils/mitt";
import type { order } from "@/interface/order";
import { corporation } from "@/interface/corporation";

export const useOrderStore = defineStore('orderStore', {
    state: () => ({
        orders: [] as order[],
        pageNum: 1,
        pageSize: 8,
        currentPage: 1,
        total: 0, // 订单总数
        // 公司订单相关数据
        ifLoadingOrder: false, // 是否正在加载订单列表数据
        ifMoreOrder: true, // 是否有更多订单
    }),
    getters: {
        ordersTotalGrains(state) {
            return state.orders.reduce((total, order) => total + order.totalNumberOfGrains, 0)
        },
        ordersTotalAmount(state) {
            return state.orders.reduce((total, order) => total + order.amount, 0)
        },

    },
    actions: {
        async getOrderList(pageNum: number, corporationId: number, selectCondition?: any) {

            this.pageNum = pageNum;

            if (this.ifLoadingOrder) {
                mitt.emit('ElNotification', { type: 'error', title: "错误", message: '错误信息：' + '正在加载中，请稍后...' })
                return
            } else if (this.currentCorporationId === null) {
                return
            } else if (!this.ifMoreOrder) {
                mitt.emit('ElNotification', { type: 'error', title: "错误", message: '错误信息：' + '没有更多订单了' })
            }

            await fish_post(httpUrl.selectAllOrderById, {},
                {
                    corporationId: corporationId,
                    pageNo: this.pageNum,
                    pageSize: this.pageSize,
                    orderCode: selectCondition?.orderCode,
                    material: selectCondition?.material,
                    year: selectCondition?.year,
                    month: selectCondition?.month
                }
            )
                .then(res => {

                    this.total = res.data.data.total;

                    this.orders = res.data.data.totalList.map((item: any) => {

                        let specification = JSON.parse(item.specification);
                        item.specification1 = specification[1];
                        item.specification2 = specification[2];
                        item.specification3 = specification[3];
                        item.specification = 'φ' + specification[1] + '*φ' + specification[2] + '*' + specification[3];

                        return item
                    })

                })


        },
        async addOrder(orderInfo: order, corporation: corporation) {


            await fish_post(httpUrl.addOrder, orderInfo, {
                amount: orderInfo.amount,
                bead: orderInfo.bead,
                corporationId: orderInfo.corporationId,
                date: orderInfo.date,
                grainPerCatty: orderInfo.grainPerCatty,
                material: orderInfo.material,
                specification: orderInfo.specification,
                totalmemberOfGrains: orderInfo.totalNumberOfGrains,
                totalWeight: orderInfo.totalWeight,
                unitPrice: orderInfo.unitPrice,
                originalUnitPrice: orderInfo.originalUnitPrice,
                type: corporation.type
            })
                .then(() => {
                    this.getOrderList(1, orderInfo.corporationId)
                })
                .catch((err: any) => {
                    mitt.emit('ElNotification', { type: 'error', title: "错误", message: '错误信息：' + err.message })
                    throw err;
                })

        },
        async updateOrder(orderInfo: order) {
            await fish_post(httpUrl.updateOrder, orderInfo, {
                amount: orderInfo.amount,
                bead: orderInfo.bead,
                corporationId: orderInfo.corporationId,
                date: orderInfo.date,
                grainPerCatty: orderInfo.grainPerCatty,
                material: orderInfo.material,
                specification: orderInfo.specification,
                totalmemberOfGrains: orderInfo.totalNumberOfGrains,
                totalWeight: orderInfo.totalWeight,
                unitPrice: orderInfo.unitPrice,
                originalUnitPrice: orderInfo.originalUnitPrice
            })
                .then(() => {
                    this.getOrderList(this.currentPage, orderInfo.corporationId)
                })
        },
        async deleteOrder(orderId: number) {
            await fish_post(httpUrl.deleteOrder + orderId, {}, { id: orderId })
                .then(() => {
                    const index = this.orders.findIndex(item => item.id === orderId)
                    this.orders.splice(index, 1)
                })
        }
    }
})