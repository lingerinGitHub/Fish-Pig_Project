export function specificationParse(specificationJson: string) {
    let specification = JSON.parse(specificationJson);
    return 'φ' + specification[1] + '*φ' + specification[2] + '*' + specification[3];
}

export function specificationToJson(specification1: string, specification2: string, specification3: string) {

    console.log(specification1)
    console.log(specification2)
    console.log(specification3)


    if (specification1 === '' && specification2 === '' && specification3 === '') {
        return null
    } else {
        return JSON.stringify(
            {
                '1': specification1,
                '2': specification2,
                '3': specification3,
            })
    }
}