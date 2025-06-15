export interface corporation {
    id?: number,
    corporationName: string,
    sort: number,
    username: string,
    type: number,
    detailed: string,
    originalUnitPrice?: number, //原单价
    originalAmount?: number, //原金额
    netAmount?: number, //净金额
}

// export interface addCorporation {
//     sort: number,
//     corporationName: string,
//     corporationUsername: string,
//     corporationType: number,
//     corporationDetailed: string
// }

export const corporationTypeOptions = [
    { value: 0, label: '内厂' },
    { value: 1, label: '外厂1' },
    { value: 2, label: '外厂2' },
]