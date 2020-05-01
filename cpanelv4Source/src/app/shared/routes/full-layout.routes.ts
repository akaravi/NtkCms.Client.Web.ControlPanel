import { Routes, RouterModule } from '@angular/router';

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('../../@theme/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'calendar',
    loadChildren: () => import('../../@theme/calendar/calendar.module').then(m => m.CalendarsModule)
  },
  {
    path: 'charts',
    loadChildren: () => import('../../@theme/charts/charts.module').then(m => m.ChartsNg2Module)
  },
   {
    path: 'forms',
    loadChildren: () => import('../../@theme/forms/forms.module').then(m => m.FormModule)
  },
  {
    path: 'maps',
    loadChildren: () => import('../../@theme/maps/maps.module').then(m => m.MapsModule)
  },
  {
    path: 'tables',
    loadChildren: () => import('../../@theme/tables/tables.module').then(m => m.TablesModule)
  },
  {
    path: 'datatables',
    loadChildren: () => import('../../@theme/data-tables/data-tables.module').then(m => m.DataTablesModule)
  },
  {
    path: 'uikit',
    loadChildren: () => import('../../@theme/ui-kit/ui-kit.module').then(m => m.UIKitModule)
  },
  {
    path: 'components',
    loadChildren: () => import('../../@theme/components/ui-components.module').then(m => m.UIComponentsModule)
  },
  {
    path: 'pages',
    loadChildren: () => import('../../@theme/pages/full-pages/full-pages.module').then(m => m.FullPagesModule)
  },
  {
    path: 'cards',
    loadChildren: () => import('../../@theme/cards/cards.module').then(m => m.CardsModule)
  },
  {
    path: 'colorpalettes',
    loadChildren: () => import('../../@theme/color-palette/color-palette.module').then(m => m.ColorPaletteModule)
  },
  {
    path: 'chat',
    loadChildren: () => import('../../@theme/chat/chat.module').then(m => m.ChatModule)
  },
  {
    path: 'chat-ngrx',
    loadChildren: () => import('../../@theme/chat-ngrx/chat-ngrx.module').then(m => m.ChatNGRXModule)
  },
  {
    path: 'inbox',
    loadChildren: () => import('../../@theme/inbox/inbox.module').then(m => m.InboxModule)
  },
  {
    path: 'taskboard',
    loadChildren: () => import('../../@theme/taskboard/taskboard.module').then(m => m.TaskboardModule)
  },
  {
    path: 'taskboard-ngrx',
    loadChildren: () => import('../../@theme/taskboard-ngrx/taskboard-ngrx.module').then(m => m.TaskboardNGRXModule)
  },
  {
    path: 'player',
    loadChildren: () => import('../../@theme/player/player.module').then(m => m.PlayerModule)
  }
];
