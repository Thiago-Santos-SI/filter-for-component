import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import isBefore from 'date-fns/isBefore';

const remove_accents_space = (str: string): string => {
    return str.normalize("NFD").replace(/[^a-zA-Zs]/g, "").toLowerCase()
}

export const filterComponent = (categories, values) => {
    let arr = []

    const res = categories
        .filter(category => category.slider.events.length)
    values.categories.map(category => {
        const categories = res.filter(res => res.slider.categorySlug === category)

        if (categories.length > 0) {
            if (categories.length > 1) {
                categories.map(event => {
                    arr.push(event)
                })
            } else if (categories.length === 1) {
                categories.map(event => {
                    arr.push(event)
                })
            }
        }
    })

    arr.map((array, index) => {

        let LISTA_DE_DATAS = []
        let LISTA_DE_DATAS_FINAL = []

        array.slider.events.filter(item => item.date).filter(item => {
            const dateFormattedBefore = format(parseISO(item.date), 'yyyy-MM-dd')
            const dateBefore = isBefore(parseISO(dateFormattedBefore), parseISO(values.date.from))

            if (!dateBefore) {
                LISTA_DE_DATAS.push(item)
            }
        })

        LISTA_DE_DATAS.filter(date => {
            const dateFormattedLater = format(parseISO(date.date), 'yyyy-MM-dd')
            const dateLater = isBefore(parseISO(dateFormattedLater), parseISO(values.date.to))

            if (dateLater) {
                LISTA_DE_DATAS_FINAL.push(date)
            }
        })
        arr[index].slider.events = LISTA_DE_DATAS_FINAL
    })

    if (values.location) {

        if (values.location === 'sp') {

            arr.map((item, index) => {

                let LISTA_LOCAIS_EVENTOS = []

                item.slider.events.filter(event => {

                    const checkLocation = event.location === 'São Paulo, SP'
                    if (checkLocation) {
                        LISTA_LOCAIS_EVENTOS.push(event)
                    }
                })
                arr[index].slider.events = LISTA_LOCAIS_EVENTOS
            })
        }
    }

    if (values.locationQuery) {
        arr.map((item, index) => {

            let LISTA_LOCAIS_EVENTOS = []

            item.slider.events.filter(event => {

                //const checkLocation = event.locationName.toLowerCase() === values.locationQuery.toLowerCase()

                const locationQuery = remove_accents_space(values.locationQuery)

                let arrStr = []

                for (let i = 0; i < locationQuery.length; i++) {
                    let c = locationQuery.charAt(i);
                    arrStr.push(c)
                }

                const arrayString = []

                const stringFormatted = remove_accents_space(event.locationName)

                for (let i = 0; i < stringFormatted.length; i++) {
                    let c = stringFormatted.charAt(i);

                    arrayString.push(c)
                }

                const result = [...Array(arrStr.length).keys()].map(element => arrStr[element] === arrayString[element]);

                console.log('result', result);

                if (result[0] && result[1] && result[2] && result[3] && result[4]) {
                    LISTA_LOCAIS_EVENTOS.push(event)
                }
            })
            arr[index].slider.events = LISTA_LOCAIS_EVENTOS

        })

    }
    return arr
}