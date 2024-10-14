import { CiStar } from 'react-icons/ci';
import { FaStar } from 'react-icons/fa';
import { IoCubeOutline, IoPeopleOutline, IoFileTrayFullOutline, IoFileTrayStackedOutline } from 'react-icons/io5';

export const sidebarItems = [
    {
        id: 'favourite',
        title: 'Favourite',
        icon: <CiStar />,
        items: [
            { label: 'Section', icon: '', isHighlighted: false },
            { label: 'Storage Group', icon: '', isHighlighted: true },
            { label: 'Store Delivery Schedule', icon: '', isHighlighted: false },
            { label: 'Family', icon: <FaStar />, isHighlighted: false },
            { label: 'Replenishment Location Product', icon: '', isHighlighted: false },
        ],
    },
    {
        id: 'masterData',
        title: 'Master Data',
        icon: <IoCubeOutline />,
        items: [
            { label: 'Section', icon: '', isHighlighted: false },
            { label: 'Storage Group', icon: '', isHighlighted: true },
            { label: 'Store Delivery Schedule', icon: '', isHighlighted: false },
            { label: 'Family', icon: <FaStar />, isHighlighted: false },
            { label: 'Replenishment Location Product', icon: '', isHighlighted: false },
        ],
    },
    {
        id: 'receivingManagement',
        title: 'Receiving Management',
        icon: <IoPeopleOutline />,
        items: [
            { label: 'Section', icon: '', isHighlighted: false },
            { label: 'Storage Group', icon: '', isHighlighted: true },
            { label: 'Store Delivery Schedule', icon: '', isHighlighted: false },
            { label: 'Family', icon: <FaStar />, isHighlighted: false },
            { label: 'Replenishment Location Product', icon: '', isHighlighted: false },
        ],
    },
    {
        id: 'shippingManagement',
        title: 'Shipping Management',
        icon: <IoFileTrayFullOutline />,
        items: [],
    },
    {
        id: 'inventoryManagement',
        title: 'Inventory Management',
        icon: <IoFileTrayStackedOutline />,
        items: [],
    },
];
