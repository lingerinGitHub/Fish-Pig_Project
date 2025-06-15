export const corporationTypeToChinese = (type) => {
    switch (type) {
        case 0:
            return '内厂'
        case 1:
            return '外厂1'
        case 2:
            return '外厂2'
        default:
            return '未知类型'
    }
}

export const corporationTagTypeFilter = (type) => {
    switch (type) {
        case 0:
            return 'primary'
        case 1:
            return 'success'
        case 2:
            return 'info'
        default:
            return 'danger'
    }
}
