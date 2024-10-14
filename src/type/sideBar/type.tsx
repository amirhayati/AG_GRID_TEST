import { ReactNode } from 'react';

export interface LeftSidePropsTypes {
    leftSideItems: LeftSideItemTypes[];
    toggleSidebar: () => void;
    isSidebarOpen: boolean;
    selectedLeftItem: string;
    setSelectedLeftItem: (item: string) => void;
}

export interface SideBarSearchPropsTypes {
    toggleSidebar: () => void;
    handleSearch:(searchTerm: string) => void
}

export interface LeftSideItemTypes {
    label: string;
}

export interface SidebarItemTypes {
    id: string;
    leftSideId: string;
    title: string;
    icon: ReactNode;
    items: { label: string; icon: ReactNode }[];
}

export interface SidebarItemsProps {
    sidebarItems: SidebarItemTypes[];
    openSections: Record<string, boolean>;
    toggleSection: (section: string) => void;
}
