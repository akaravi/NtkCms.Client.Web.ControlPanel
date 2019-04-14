import { addLocaleData } from 'react-intl';
import enLang from './entries/en-US';
import esLang from './entries/es-ES';
import FaLang from './entries/fa-IR';

const AppLocale = {
    en: enLang,
    es: esLang,
    fa: FaLang
};
addLocaleData(AppLocale.en.data);
addLocaleData(AppLocale.es.data);
addLocaleData(AppLocale.fa.data);

export default AppLocale;
