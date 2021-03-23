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

export const filterComponent = (
    featuredCategories: HomePageFeaturedCategoryResponse[],
    values: Values,
): FilterComponentResponse => {
    let arrayManipulated = [];

    const ExistingFeaturedCategories = featuredCategories.filter(category => category.slider.events.length);

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
        const elementsBeforeDate = [];

        array.slider.events
            .filter(item => item.date)
            .filter(item => {
                const dateFormattedBefore = format(parseISO(item.date), 'yyyy-MM-dd');

                const dateBefore = isBefore(parseISO(dateFormattedBefore), parseISO(values.date.from));

                if (!dateBefore) {
                    elementsBeforeDate.push(item);
                }
            });

        const elementsBeforeEndDate = [];

        elementsBeforeDate.filter(date => {
            const dateFormattedLater = format(parseISO(date.date), 'yyyy-MM-dd');

            const dateLater = isBefore(
                parseISO(dateFormattedLater),
                add(parseISO(values.date.to), {
                    days: 1,
                }),
            );

            if (dateLater) {
                elementsBeforeEndDate.push(date);
            }
        });
        arrayManipulated[index].slider.events = elementsBeforeEndDate;
    });

    // -> arr[0].slider.events[2].location = 'Rio de Janeiro, RJ'

    if (arrayManipulated.length === 0) {
        arrayManipulated = ExistingFeaturedCategories;
    }

    if (values.location) {
        if (values.location === 'sp') {
            arrayManipulated.map((item, index) => {
                const arrayEventsLocales = [];

                item.slider.events.filter(event => {
                    const checkLocation = event.location === 'São Paulo, SP';
                    if (checkLocation) {
                        arrayEventsLocales.push(event);
                    }
                });
                arrayManipulated[index].slider.events = arrayEventsLocales;
            });
        } else if (values.location === 'rj') {
            arrayManipulated.map((item, index) => {
                const arrayEventsLocales = [];

                item.slider.events.filter(event => {
                    const checkLocation = event.location === 'Rio de Janeiro, RJ';
                    if (checkLocation) {
                        arrayEventsLocales.push(event);
                    }
                });
                arrayManipulated[index].slider.events = arrayEventsLocales;
            });
        }
    }

    if (values.locationQuery) {
        arrayManipulated.map((item, index) => {
            const arraySearchEventsLocales = [];

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
                    arraySearchEventsLocales.push(event);
                }
            });
            arrayManipulated[index].slider.events = arraySearchEventsLocales;
        });
    }

    return {
        featuredCategoriesFiltered: arrayManipulated,
        click: values.categories.length > 0 ? false : true,
    };
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
        callBackParentValuesFiltered(filterComponentReponse.featuredCategoriesFiltered);
        //callBackParentValuesFiltered(JSON.parse(localStorage.getItem('items')));
    }
};