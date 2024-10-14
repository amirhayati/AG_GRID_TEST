import { CiStar } from 'react-icons/ci';
import { FaStar } from 'react-icons/fa';
import { IoCubeOutline, IoPeopleOutline, IoFileTrayFullOutline, IoFileTrayStackedOutline, IoClipboardOutline, IoCartOutline, IoReturnUpBackOutline } from 'react-icons/io5';

export const leftSideItems = [
    { label: 'General'},
    { label: 'Settings'},
    { label: 'Profile'},
];

export const sidebarItems = [
    {
        id: 'favourite',
        leftSideId: 'General',
        title: 'Favourite',
        icon: <CiStar />,
        items: [
            { label: 'Section', icon: ''},
            { label: 'Storage Group', icon: ''},
            { label: 'Store Delivery Schedule', icon: ''},
            { label: 'Family', icon: <FaStar />},
            { label: 'Replenishment Location Product', icon: ''},
        ],
    },
    {
        id: 'masterData',
        title: 'Master Data',
        leftSideId: 'General',
        icon: <IoCubeOutline />,
        items: [
            { label: 'Section', icon: ''},
            { label: 'Storage Group', icon: ''},
            { label: 'Store Delivery Schedule', icon: ''},
            { label: 'Family', icon: <FaStar />},
            { label: 'Replenishment Location Product', icon: ''},
        ],
    },
    {
        id: 'receivingManagement',
        title: 'Receiving Management',
        leftSideId: 'General',
        icon: <IoPeopleOutline />,
        items: [
            { label: 'Section', icon: ''},
            { label: 'Storage Group', icon: ''},
            { label: 'Store Delivery Schedule', icon: ''},
            { label: 'Family', icon: <FaStar />},
            { label: 'Replenishment Location Product', icon: ''},
        ],
    },
    {
        id: 'inventory',
        title: 'Inventory Management',
        leftSideId: 'General',
        icon: <IoClipboardOutline />,
        items: [
            { label: 'Stock Status', icon: ''},
            { label: 'Stock Movement', icon: ''},
            { label: 'Stock Adjustment', icon: ''},
            { label: 'Product Family', icon: <FaStar />},
            { label: 'Stock Transfers', icon: ''},
        ],
    },
    {
        id: 'orderManagement',
        title: 'Order Management',
        leftSideId: 'Profile',
        icon: <IoCartOutline />,
        items: [
            { label: 'Purchase Orders', icon: ''},
            { label: 'Supplier Orders', icon: ''},
            { label: 'Order Scheduling', icon: ''},
            { label: 'Family', icon: <FaStar />},
            { label: 'Order Status', icon: ''},
        ],
    },
    {
        id: 'delivery',
        title: 'Delivery Management',
        leftSideId: 'Settings',
        icon: <IoReturnUpBackOutline />,
        items: [
            { label: 'Delivery Status', icon: ''},
            { label: 'Delivery Scheduling', icon: ''},
            { label: 'Shipping Details', icon: ''},
            { label: 'Family', icon: <FaStar />},
            { label: 'Replenishment Orders', icon: ''},
        ],
    },
];
