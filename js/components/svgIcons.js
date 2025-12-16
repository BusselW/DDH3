/**
 * SVG Icon Components for DDH Portal
 * Replaces UTF-8 emoji characters with proper SVG icons
 */

const { createElement: h } = window.React;

// Base icon wrapper
const SvgIcon = ({ children, size = 16, className = '', ...props }) => {
    return h('svg', {
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'currentColor',
        className: `svg-icon ${className}`,
        ...props
    }, children);
};

// Location/Map Icons
export const HomeIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z' })
);

export const LocationIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z' })
);

export const BuildingIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z' })
);

export const CityIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M15 11V5l-3-3-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z' })
);

// Status Icons
export const CheckIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' })
);

export const WarningIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z' })
);

export const ErrorIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' })
);

export const AlertIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' })
);

// Action Icons
export const SearchIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' })
);

export const FilterIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z' })
);

export const SortIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z' })
);

export const MenuIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' })
);

export const CloseIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' })
);

export const ExpandIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z' })
);

export const CollapseIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z' })
);

// Problem/Issue Icons
export const ProblemIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' })
);

export const ActiveProblemIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' })
);

export const ResolvedIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' })
);

// Document Icons
export const DocumentIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z' })
);

export const LinkIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H6.9C4.29 7 2.2 9.09 2.2 11.7v.6c0 2.61 2.09 4.7 4.7 4.7H11v-1.9H6.9c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm5-6h4.1c1.71 0 3.1 1.39 3.1 3.1v.6c0 2.61-2.09 4.7-4.7 4.7H13v-1.9h4.1c1.71 0 3.1-1.39 3.1-3.1 0-1.71-1.39-3.1-3.1-3.1H13V7z' })
);

export const ContactIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' })
);

// Chart/Data Icons
export const ChartIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z' })
);

export const TrendUpIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z' })
);

export const TrendDownIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M16 18l2.29-2.29-4.88-4.88-4 4L2 7.41 3.41 6l6 6 4-4 6.3 6.29L22 12v6z' })
);

// Navigation Icons
export const BackIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z' })
);

export const ForwardIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z' })
);

export const RefreshIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z' })
);

// Time Icons
export const TimeIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z' }),
    h('path', { d: 'M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z' })
);

export const CalendarIcon = (props) => h(SvgIcon, props,
    h('path', { d: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z' })
);

// Export all icons as named exports
export default {
    HomeIcon,
    LocationIcon,
    BuildingIcon,
    CityIcon,
    CheckIcon,
    WarningIcon,
    ErrorIcon,
    AlertIcon,
    SearchIcon,
    FilterIcon,
    SortIcon,
    MenuIcon,
    CloseIcon,
    ExpandIcon,
    CollapseIcon,
    ProblemIcon,
    ActiveProblemIcon,
    ResolvedIcon,
    DocumentIcon,
    LinkIcon,
    ContactIcon,
    ChartIcon,
    TrendUpIcon,
    TrendDownIcon,
    BackIcon,
    ForwardIcon,
    RefreshIcon,
    TimeIcon,
    CalendarIcon
};