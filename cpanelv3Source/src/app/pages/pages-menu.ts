import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'داشبورد فروشگاهی',
    icon: 'shopping-cart-outline',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'داشبورد معمولی',
    icon: 'home-outline',
    link: '/pages/iot-dashboard',
  },
  {
    title: 'امکانات',
    group: true,
  },
  {
    title: 'لایه بندی فرم ها',
    icon: 'layout-outline',
    children: [
      {
        title: 'مرحله ای',
        link: '/pages/layout/stepper',
      },
      {
        title: 'لیست',
        link: '/pages/layout/list',
      },
      {
        title: 'لیست نا محدود',
        link: '/pages/layout/infinite-list',
      },
      {
        title: 'لیست کشویی',
        link: '/pages/layout/accordion',
      },
      {
        title: 'تب بندی',
        pathMatch: 'prefix',
        link: '/pages/layout/tabs',
      },
    ],
  },
  {
    title: 'امکانات فرم و دیتاپیکر شمسی',
    icon: 'edit-2-outline',
    children: [
      {
        title: 'ورودی های فرم',
        link: '/pages/forms/inputs',
      },
      {
        title: 'لای بندی فرم',
        link: '/pages/forms/layouts',
      },
      {
        title: 'دکمه ها',
        link: '/pages/forms/buttons',
      },
      {
        title: 'دیتا پیکر شمسی',
        link: '/pages/forms/datepicker',
      },
    ],
  },
  {
    title: 'امکانات ظاهری',
    icon: 'keypad-outline',
    link: '/pages/ui-features',
    children: [
      {
        title: 'گرید',
        link: '/pages/ui-features/grid',
      },
      {
        title: 'آیکون ها',
        link: '/pages/ui-features/icons',
      },
      {
        title: 'تایپوگرافی',
        link: '/pages/ui-features/typography',
      },
      {
        title: 'افکت های سرچ',
        link: '/pages/ui-features/search-fields',
      },
    ],
  },
  {
    title: 'پاپ آپ و تولتیپ',
    icon: 'browser-outline',
    children: [
      {
        title: 'پاپ آپ',
        link: '/pages/modal-overlays/dialog',
      },
      {
        title: 'فرم پاپ آپ',
        link: '/pages/modal-overlays/window',
      },
      {
        title: 'پیام و فرم کنار دکمه',
        link: '/pages/modal-overlays/popover',
      },
      {
        title: 'پیام های کنار صفحه و رنگی',
        link: '/pages/modal-overlays/toastr',
      },
      {
        title: 'Tooltip',
        link: '/pages/modal-overlays/tooltip',
      },
    ],
  },
  {
    title: 'امکانات ویژه',
    icon: 'message-circle-outline',
    children: [
      {
        title: 'تقویم',
        link: '/pages/extra-components/calendar',
      },
      {
        title: 'Progress Bar',
        link: '/pages/extra-components/progress-bar',
      },
      {
        title: 'لدینگ های چرخنده',
        link: '/pages/extra-components/spinner',
      },
      {
        title: 'Alert',
        link: '/pages/extra-components/alert',
      },
      {
        title: 'Calendar Kit',
        link: '/pages/extra-components/calendar-kit',
      },
      {
        title: 'چت',
        link: '/pages/extra-components/chat',
      },
    ],
  },
  {
    title: 'نقشه',
    icon: 'map-outline',
    children: [
      {
        title: 'Google Maps',
        link: '/pages/maps/gmaps',
      },
      {
        title: 'Leaflet Maps',
        link: '/pages/maps/leaflet',
      },
      {
        title: 'Bubble Maps',
        link: '/pages/maps/bubble',
      },
      {
        title: 'Search Maps',
        link: '/pages/maps/searchmap',
      },
    ],
  },
  {
    title: 'نمودار',
    icon: 'pie-chart-outline',
    children: [
      {
        title: 'Echarts',
        link: '/pages/charts/echarts',
      },
      {
        title: 'Charts.js',
        link: '/pages/charts/chartjs',
      },
      {
        title: 'D3',
        link: '/pages/charts/d3',
      },
    ],
  },
  {
    title: 'ویرایشگر',
    icon: 'text-outline',
    children: [
      {
        title: 'TinyMCE',
        link: '/pages/editors/tinymce',
      },
      {
        title: 'CKEditor',
        link: '/pages/editors/ckeditor',
      },
    ],
  },
  {
    title: 'جدول بندی',
    icon: 'grid-outline',
    children: [
      {
        title: 'Smart Table',
        link: '/pages/tables/smart-table',
      },
      {
        title: 'Tree Grid',
        link: '/pages/tables/tree-grid',
      },
    ],
  },
  {
    title: 'صفحه ی 404',
    icon: 'shuffle-2-outline',
    children: [
      {
        title: '404',
        link: '/pages/miscellaneous/404',
      },
    ],
  },
  {
    title: 'ورود و ثبت نام',
    icon: 'lock-outline',
    children: [
      {
        title: 'ورود',
        link: '/auth/login',
      },
      {
        title: 'ثبت نام',
        link: '/auth/register',
      },
      {
        title: 'درخواست رمز عبور',
        link: '/auth/request-password',
      },
      {
        title: 'بازیابی رمز عبور',
        link: '/auth/reset-password',
      },
    ],
  },
];
