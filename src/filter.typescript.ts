import format from 'date-fns/format';
import parseISO from 'date-fns/parseISO';
import isBefore from 'date-fns/isBefore';
import add from 'date-fns/add';

export interface HomePageFeaturedCategoryResponse {
    section: Pick<SectionProps, 'title' | 'href' | 'hrefAs' | 'hrefLabel'>;
    slider: Pick<EventCardSliderProps, 'events' | 'categorySlug'>;
}

export interface Values {
    categories: string[];
    locationQuery: string;
    location?: string;
    date?: {
        from: string;
        to: string;
    };
}

interface FilterComponentResponse {
    featuredCategoriesFiltered: HomePageFeaturedCategoryResponse[];
    click: boolean;
}

export const removeAccentsSpace = (str: string): string => {
    return str
        .normalize('NFD')
        .replace(/[^a-zA-Zs]/g, '')
        .toLowerCase();
};

export const filterComponentReset = (
    featuredCategories: HomePageFeaturedCategoryResponse[],
    values: Values,
    callBackParentValuesFiltered: (featuredCategories: HomePageFeaturedCategoryResponse[]) => void,
): void => {
    if (!localStorage.getItem('items')) {
        localStorage.setItem('items', JSON.stringify(featuredCategories));
    }

    const filterComponentReponse = filterComponent(JSON.parse(localStorage.getItem('items')), values);

    if (!filterComponentReponse.click) {
        callBackParentValuesFiltered(filterComponentReponse.featuredCategoriesFiltered);
    } else {
        callBackParentValuesFiltered(JSON.parse(localStorage.getItem('items')));
    }
};

export const filterComponent = (
    featuredCategories: HomePageFeaturedCategoryResponse[],
    values: Values,
): FilterComponentResponse => {
    const arrayManipulated = [];

    const ExistingFeaturedCategories = featuredCategories.filter(category => category.slider.events.length);

    const date = { from: '2021-03-18', to: '2022-03-27' };

    values.date = date;

    values.categories.map(category => {
        const categories = ExistingFeaturedCategories.filter(item => item.slider.categorySlug === category);

        if (categories.length > 0) {
            if (categories.length > 1) {
                categories.map(event => {
                    arrayManipulated.push(event);
                });
            } else if (categories.length === 1) {
                categories.map(event => {
                    arrayManipulated.push(event);
                });
            }
        }
    });

    arrayManipulated.map((array, index) => {
        const LISTA_DE_DATAS = [];
        const LISTA_DE_DATAS_FINAL = [];

        array.slider.events
            .filter(item => item.date)
            .filter(item => {
                const dateFormattedBefore = format(parseISO(item.date), 'yyyy-MM-dd');

                const dateBefore = isBefore(parseISO(dateFormattedBefore), parseISO(values.date.from));

                if (!dateBefore) {
                    LISTA_DE_DATAS.push(item);
                }
            });

        LISTA_DE_DATAS.filter(date => {
            const dateFormattedLater = format(parseISO(date.date), 'yyyy-MM-dd');

            const dateLater = isBefore(
                parseISO(dateFormattedLater),
                add(parseISO(values.date.to), {
                    days: 1,
                }),
            );

            if (dateLater) {
                LISTA_DE_DATAS_FINAL.push(date);
            }
        });
        arrayManipulated[index].slider.events = LISTA_DE_DATAS_FINAL;
    });

    //TESTE -> arr[0].slider.events[2].location = 'Rio de Janeiro, RJ'

    if (values.location) {
        if (values.location === 'sp') {
            arrayManipulated.map((item, index) => {
                const LISTA_LOCAIS_EVENTOS = [];

                item.slider.events.filter(event => {
                    const checkLocation = event.location === 'São Paulo, SP';
                    if (checkLocation) {
                        LISTA_LOCAIS_EVENTOS.push(event);
                    }
                });
                arrayManipulated[index].slider.events = LISTA_LOCAIS_EVENTOS;
            });
        } else if (values.location === 'rj') {
        }
    }

    if (values.locationQuery) {
        arrayManipulated.map((item, index) => {
            const LISTA_LOCAIS_EVENTOS = [];

            item.slider.events.filter(event => {
                const locationQuery = removeAccentsSpace(values.locationQuery);

                const arrStr = [];

                for (let i = 0; i < locationQuery.length; i++) {
                    const c = locationQuery.charAt(i);
                    arrStr.push(c);
                }

                const arrayString = [];

                const stringFormatted = removeAccentsSpace(event.locationName);

                for (let i = 0; i < stringFormatted.length; i++) {
                    const c = stringFormatted.charAt(i);
                    arrayString.push(c);
                }

                const result = [...Array(arrStr.length).keys()].map(
                    element => arrStr[element] === arrayString[element],
                );

                if (result[0] && result[1] && result[2] && result[3] && result[4]) {
                    LISTA_LOCAIS_EVENTOS.push(event);
                }
            });
            arrayManipulated[index].slider.events = LISTA_LOCAIS_EVENTOS;
        });
    }

    return {
        featuredCategoriesFiltered: arrayManipulated,
        click: values.categories.length > 0 ? false : true,
    };
};
