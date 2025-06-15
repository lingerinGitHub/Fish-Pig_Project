import { defineStore } from "pinia";
import { fish_post } from "../services/axiosMethods";
import { httpUrl } from "../api/httpUrl";
import mitt from "../utils/mitt";
import type { corporation } from "@/interface/corporation";

export const useCorporationStore = defineStore('coroporationStore', {
    state: () => ({
        corporations: [] as corporation[],
        pageNum: 1,
        pageSize: 6,
        currentPage: 1,
        total: 0, // 公司总数
        currentFuzzyLookupcorporationName: null,
        currentSelectModel: 0, // 0代表所有查询的列表，1代表模糊查询列表
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
            } else {
                // 从模糊查询转为一般查询
                this.currentSelectModel = 0
                this.currentFuzzyLookupcorporationName = null
                this.pageNum = 1
            }

            await fish_post(httpUrl.selectCroporation, {},
                {
                    pageNo: this.pageNum,
                    pageSize: this.pageSize,
                }
            )
                .then((res: any) => {
                    // 拼接数据
                    this.corporations = res.data.data.totalList
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
                //保存当前查询的公司名称
                this.currentFuzzyLookupcorporationName = corporationName
                // 重置pageNum
                this.pageNum = 1
                // 切换查询模式为模糊查询
                this.currentSelectModel = 0
            }

            await fish_post(httpUrl.selectCroporation, {},
                {
                    pageNo: this.pageNum,
                    pageSize: this.pageSize,
                    corporationName: this.currentFuzzyLookupcorporationName
                }
            )
                .then((res: any) => {

                    console.log(res.data.data.totalList)
                    // 拼接数据
                    this.corporations = res.data.data.totalList
                    this.total = res.data.data.total
                    mitt.emit('ElNotification', { type: 'success', title: "成功", message: '查询成功~' })
                })
                .catch((err: any) => {
                    mitt.emit('ElNotification', { type: 'error', title: "错误", message: '错误信息：' + err.message })
                })

        },
        async addCorporation(corporationName: string, sort: number, client: string, type: number, detail?: string) {

            await fish_post(httpUrl.addaddCorporation,
                {
                    corporationName: corporationName,
                    sort: sort,
                    username: client,
                    type: type,
                    detailed: detail
                }
            )
                .then(res => {
                    // 成功弹窗
                    mitt.emit('ElNotification', { type: 'success', title: "成功", message: `创建 ${corporationName} 成功!` })

                    this.corporations.unshift({
                        id: res.data.data.id,
                        corporationName: res.data.data.corporationName,
                        sort: res.data.data.sort,
                        type: res.data.data.type,
                        username: res.data.data.username,
                        detailed: res.data.data.detailed
                    })
                    // total数量+1
                    this.total++;
                })

        },
        async deleteCorporation(id: number) {
            await fish_post(httpUrl.deleteCorporation + id, {},
                {
                    id: id,
                }
            )
                .then(async () => {
                    // 删除列表中公司
                    const index = await this.corporations.map((item: corporation, index: number) => {
                        if (item.id === id) {
                            return index
                        }
                    })

                    // 删除列表中的数据
                    if (index) {

                        this.corporations.splice(index, 1)

                        // total数量-1
                        this.total--;
                    }
                })
        },
        async updateCorporation(id: number, corporationName: string, sort: number, client: string, type: number, detailed?: string) {

            await fish_post(httpUrl.updateCorporation,
                {
                    id: id,
                    corporationName: corporationName,
                    sort: sort,
                    username: client,
                    type: type,
                    detailed: detailed
                }
            )
                .then(() => {
                    // 修改列表中公司
                    this.corporations.find((item: corporation, index: number) => {

                        if (item.id === id) {
                            this.corporations[index].corporationName = corporationName
                            this.corporations[index].sort = sort
                            this.corporations[index].username = client
                            this.corporations[index].type = type
                            this.corporations[index].detailed = detailed

                            return
                        }

                    })
                })
        }


    }
})