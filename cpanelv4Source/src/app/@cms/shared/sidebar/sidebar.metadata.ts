// Sidebar route metadata
export interface MenuInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
    badge: string;
    badgeClass: string;
    isExternalLink: boolean;
    submenu : MenuInfo[];
}
