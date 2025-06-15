export interface order {
    id: number;
    date: string;
    material: string; // 材料
    specification: object | string; // 规格
    bead: number; // 珠
    totalWeight: number;  // 总重
    grainPerCatty: number; // 每公斤粒数
    totalNumberOfGrains: number; // 总粒数
    unitPrice: number; // 单价
    amount: number; // 金额
    corporationId: number; // 供应商id
    orderCode: number; // 订单编号
    specification1: string; // 规格1
    specification2: string; // 规格2
    specification3: string; // 规格3
    originalUnitPrice: number; // 原单价
    type?: number; // 公司类型
}
