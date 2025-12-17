<%@ Page Language="C#" CodePage="65001" %>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Digitale handhaving en probleemlocaties</title>
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><path d=%22M50 5 L10 20 V45 C10 70 25 90 50 95 C75 90 90 70 90 45 V20 L50 5 Z%22 fill=%22%233b82f6%22/><path d=%22M30 50 L45 65 L70 35%22 fill=%22none%22 stroke=%22white%22 stroke-width=%228%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>">
    
    <style>
        * { box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; padding: 0 0 60px 0; background: #f1f5f9; color: #1e293b;
        }
        .portal-container {
            max-width: 1600px;
            margin: 0 auto; padding: 20px;
        }
        
        /* Header */
        .portal-header {
            background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
            color: white; padding: 32px; border-radius: 16px; margin-bottom: 32px;
            display: flex; justify-content: space-between;
        }
        .header-content { 
            flex: 1; 
            display: flex; 
            flex-direction: column; 
            justify-content: flex-end; 
        }
        .recent-changes-board {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 16px;
            border-radius: 12px;
            width: 320px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            margin-left: 24px;
        }
        .recent-title {
            font-size: 12px; font-weight: 700; margin-bottom: 12px;
            text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8;
            display: flex; align-items: center; gap: 6px;
        }
        .recent-item {
            display: flex; align-items: center; gap: 10px;
            padding: 8px; border-radius: 6px;
            cursor: pointer; transition: background 0.2s;
            font-size: 13px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .recent-item:last-child { border-bottom: none; }
        .recent-item:hover { background: rgba(255, 255, 255, 0.1); }
        .recent-date { font-size: 11px; color: #94a3b8; margin-left: auto; white-space: nowrap; }
        
        .portal-title {
            font-size: 32px;
            font-weight: 800; margin: 0 0 8px 0;
        }
        .portal-subtitle {
            font-size: 16px;
            opacity: 0.8; margin: 0;
        }
        
        /* Sidebar and Main Layout */
        .main-layout {
            display: grid;
            grid-template-columns: 320px 1fr; gap: 24px;
        }
        
        /* Sidebar with Tree */
        .sidebar {
            background: white;
            border-radius: 16px; padding: 24px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.08); height: fit-content;
            position: sticky; top: 20px;
        }
        .sidebar-header {
            margin-bottom: 20px;
            padding-bottom: 16px; border-bottom: 2px solid #e2e8f0;
        }
        .sidebar-title-row {
            display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;
        }
        .sidebar-title {
            font-size: 18px;
            font-weight: 700; margin: 0; color: #1e293b;
        }
        .refresh-btn {
            background: none; border: none; cursor: pointer; color: #64748b; padding: 4px;
            border-radius: 4px; transition: all 0.2s;
        }
        .refresh-btn:hover { background: #f1f5f9; color: #3b82f6; }
        .search-input {
            width: 100%;
            padding: 10px 12px; border: 2px solid #e2e8f0;
            border-radius: 8px; font-size: 14px;
        }
        .search-input:focus {
            outline: none;
            border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        /* Tree Structure */
        .tree-container {
            max-height: 70vh;
            overflow-y: auto;
        }
        .tree-node {
            margin-bottom: 4px;
        }
        .tree-item {
            display: flex;
            align-items: center; padding: 8px 12px;
            border-radius: 8px; cursor: pointer; transition: all 0.2s ease;
            font-size: 14px;
            border: 1px solid transparent;
        }
        .tree-item:hover { 
            background: #f1f5f9;
            border-color: #e2e8f0;
        }
        .tree-item.active { 
            background: #eff6ff !important; /* Force blue on selection */
            color: #1d4ed8 !important;
            border-color: #bfdbfe !important;
        }
        
        /* Specific Tree Item Types */
        .tree-item.gemeente {
            font-weight: 600;
        }
        
        /* Nieuwe stijl voor items met actieve problemen (Gemeente & Locatie) */
        .tree-item.gemeente.has-active-problems,
        .tree-item.locatie.has-active-problems {
            background-color: #fff1f2; /* Pastel Red background */
            border-color: #fecdd3;
            color: #be123c; /* Dark red text */
        }
        .tree-item.gemeente.has-active-problems:hover,
        .tree-item.locatie.has-active-problems:hover {
            background-color: #ffe4e6;
        }
        
        .tree-item.locatie {
            margin-left: 18px;
            font-size: 13px;
        }
        
        /* Update icon colors for active problem items */
        .tree-item.gemeente.has-active-problems .tree-type-icon,
        .tree-item.locatie.has-active-problems .tree-type-icon {
            color: #be123c;
        }

        .tree-item.problem {
            margin-left: 36px;
            font-size: 12px;
        }
        .tree-item.problem.active-problem {
            color: #dc2626; 
        }
        .tree-item.problem.active-problem.active {
            background: #fef2f2;
            border-color: #fecaca;
        }
        
        /* Tree Icons */
        .tree-toggle {
            width: 16px; height: 16px; 
            display: flex; align-items: center; justify-content: center;
            color: #94a3b8;
            margin-right: 4px;
            transition: transform 0.2s;
        }
        .tree-toggle:hover {
            color: #3b82f6;
        }
        .tree-type-icon {
            width: 18px; height: 18px;
            display: flex; align-items: center; justify-content: center;
            margin-right: 8px;
            color: #64748b;
        }
        .tree-item.active .tree-type-icon {
            color: #2563eb;
        }

        .tree-text {
            flex: 1;
            overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .tree-badge {
            background: #e2e8f0;
            color: #64748b; padding: 2px 8px;
            border-radius: 10px; font-size: 11px; font-weight: 700;
            min-width: 20px; text-align: center;
        }
        .tree-badge.problems { background: #fee2e2; color: #dc2626; }
        .tree-badge.resolved { background: #dcfce7; color: #16a34a; }
        
        /* Bordeaux Counter Badge */
        .tree-badge.bordeaux {
            background: #9f1239; /* Matches the text color better now */
            color: #ffffff;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
        }
        
        /* Main Content Area */
        .content-area {
            background: white;
            border-radius: 16px; padding: 32px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.08); min-height: 600px;
        }
        .content-header {
            margin-bottom: 24px;
            padding-bottom: 16px; border-bottom: 2px solid #e2e8f0;
        }
        .content-title {
            font-size: 24px;
            font-weight: 700; margin: 0 0 8px 0; color: #1e293b;
        }
        .content-subtitle {
            font-size: 14px;
            color: #64748b; margin: 0;
            display: flex; align-items: center; gap: 6px;
        }
        
        .breadcrumb {
            display: flex;
            align-items: center; gap: 8px; margin-bottom: 24px;
            font-size: 14px; color: #64748b;
        }
        .breadcrumb-item {
            display: flex;
            align-items: center; gap: 6px;
            cursor: pointer;
        }
        .breadcrumb-item:hover { color: #3b82f6; text-decoration: underline; }
        .breadcrumb-separator { color: #cbd5e1; }
        
        /* Detail Views */
        .detail-section { margin-bottom: 32px; }
        .detail-title {
            font-size: 18px;
            font-weight: 600; margin: 0 0 16px 0; color: #1e293b;
            display: flex; align-items: center; gap: 8px;
        }
        
        .gemeente-detail {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;
        }
        .detail-card {
            background: #f8fafc;
            border-radius: 12px; padding: 20px;
            border-left: 4px solid #3b82f6;
        }
        .detail-card.warning { border-left-color: #f59e0b; background: #fffbeb; }
        .detail-card.danger { border-left-color: #dc2626; background: #fef2f2; }
        .detail-card.success { border-left-color: #16a34a; background: #f0fdf4; }
        
        .card-metric {
            font-size: 28px;
            font-weight: 800; margin-bottom: 4px; color: #1e293b;
        }
        .card-label {
            font-size: 12px;
            color: #64748b; text-transform: uppercase; font-weight: 600;
        }
        .card-description {
            font-size: 14px;
            color: #64748b; margin-top: 8px;
        }
        
        .locatie-detail {
            background: #f8fafc;
            border-radius: 12px; padding: 24px; margin-bottom: 16px;
            border: 1px solid #e2e8f0;
            cursor: pointer; transition: all 0.2s ease;
        }
        .locatie-detail:hover {
            border-color: #3b82f6;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
            transform: translateY(-2px);
        }
        /* Active Problem Styling for Detail Cards */
        .locatie-detail.has-active-problems {
            background-color: #fff1f2;
            border-color: #fecdd3;
        }
        .locatie-detail.has-active-problems:hover {
            border-color: #be123c;
            background-color: #ffe4e6;
            box-shadow: 0 4px 12px rgba(190, 18, 60, 0.1);
        }
        .locatie-detail.has-active-problems .locatie-name {
            color: #be123c;
        }

        .locatie-info {
            display: grid;
            grid-template-columns: 1fr auto; gap: 16px; align-items: start;
        }
        .locatie-name {
            font-size: 20px;
            font-weight: 600; margin: 0 0 8px 0; color: #1e293b;
            display: flex; align-items: center; gap: 8px;
        }
        .locatie-meta {
            font-size: 14px; color: #64748b; margin-top: 4px;
        }
        .locatie-status-grid {
            display: flex; gap: 8px; flex-wrap: wrap;
        }
        .status-chip {
            padding: 6px 12px;
            border-radius: 20px; font-size: 12px; font-weight: 600;
            display: flex; align-items: center; gap: 6px;
        }
        .status-chip.active { background: #fee2e2; color: #dc2626; }
        .status-chip.resolved { background: #dcfce7; color: #16a34a; }
        .status-chip.warning { background: #fef3c7; color: #d97706; }
        
        .problems-grid {
            display: grid; gap: 12px; margin-top: 20px;
        }
        .problem-card {
            background: white;
            border-radius: 8px; padding: 16px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04); border-left: 4px solid #e2e8f0;
        }
        .problem-card.active { border-left-color: #dc2626; background: #fffbfb; }
        .problem-card.resolved { border-left-color: #16a34a; opacity: 0.8; }
        
        .problem-header {
            display: flex;
            justify-content: space-between; align-items: center; margin-bottom: 8px;
        }
        .problem-id {
            font-size: 12px;
            color: #64748b; font-weight: 600;
            display: flex; align-items: center; gap: 6px;
        }
        .problem-age {
            font-size: 11px; color: #9ca3af;
        }
        .problem-description {
            font-size: 14px;
            color: #374151; line-height: 1.5; margin-bottom: 12px;
        }
        .problem-footer {
            display: flex;
            justify-content: space-between; align-items: center;
        }
        .problem-category {
            background: #e2e8f0; color: #475569;
            padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 600;
        }
        .problem-status {
            padding: 4px 8px;
            border-radius: 12px; font-size: 11px; font-weight: 600;
        }
        .problem-status.aangemeld { background: #fee2e2; color: #dc2626; }
        .problem-status.behandeling { background: #dbeafe; color: #2563eb; }
        .problem-status.uitgezet { background: #fef3c7; color: #d97706; }
        .problem-status.uitgezet-bij-oi { background: #fef3c7; color: #d97706; }
        .problem-status.opgelost { background: #dcfce7; color: #16a34a; }
        
        .empty-state {
            text-align: center;
            padding: 60px 20px; color: #64748b;
        }
        .empty-icon { color: #cbd5e1; margin-bottom: 16px; }
        .empty-title { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
        .empty-subtitle { font-size: 14px; line-height: 1.5; }
        
        /* Responsive */
        @media (max-width: 1024px) {
            .main-layout { grid-template-columns: 1fr; }
            .sidebar { position: static; max-height: 400px; margin-bottom: 24px; }
        }

        /* Admin Menu */
        .admin-menu {
            position: fixed;
            right: 20px;
            top: 100px;
            width: 260px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            padding: 20px;
            z-index: 1000;
            border: 1px solid #e2e8f0;
            animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
            from { transform: translateX(20px); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        .admin-header {
            font-weight: 700;
            margin-bottom: 16px;
            padding-bottom: 12px;
            border-bottom: 1px solid #e2e8f0;
            color: #1e293b;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 16px;
        }
        .admin-section {
            margin-bottom: 20px;
        }
        .admin-section:last-child { margin-bottom: 0; }
        .admin-section-title {
            font-size: 11px;
            text-transform: uppercase;
            color: #64748b;
            font-weight: 700;
            margin-bottom: 10px;
            letter-spacing: 0.5px;
        }
        .admin-btn {
            display: flex;
            align-items: center;
            gap: 10px;
            width: 100%;
            padding: 10px 12px;
            border: 1px solid #e2e8f0;
            background: white;
            border-radius: 8px;
            margin-bottom: 8px;
            cursor: pointer;
            font-size: 13px;
            color: #334155;
            transition: all 0.2s;
            font-weight: 500;
        }
        .admin-btn:hover:not(:disabled) {
            background: #f8fafc;
            border-color: #cbd5e1;
            color: #0f172a;
            transform: translateY(-1px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        .admin-btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: #f1f5f9;
        }
        .admin-btn.danger:hover:not(:disabled) {
            background: #fef2f2;
            border-color: #fecaca;
            color: #dc2626;
        }
        
        /* Admin Selection Style */
        .tree-item.locatie.admin-selected {
            border: 1px dashed #3b82f6 !important;
            background-color: #eff6ff;
        }
    </style>
</head>
<body>
    <div id="portal-root" class="portal-container">
        <div style="display: flex; justify-content: center; align-items: center; height: 50vh;">
            <div style="text-align: center;">
                <div style="width: 50px; height: 50px; border: 4px solid #f3f3f3; border-top: 4px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                <p>Tree Portal wordt geladen...</p>
            </div>
        </div>
    </div>

    <!-- React -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>

    <script type="module">
        const { createElement: h, useState, useEffect, useMemo } = window.React;
        const { createRoot } = window.ReactDOM;

        // Import configuration and navigation
        const v = Date.now() + 1;
        const { DDH_CONFIG } = await import('./js/config/index.js?v=' + v);
        const { TEMP_PLACEHOLDER_DATA } = await import('./js/components/pageNavigation.js?v=' + v);
        const { AdminMenu } = await import('./js/components/AdminMenu.js?v=' + v);
        // FooterNavigation removed as per request

        // --- Inline SVG Icons Component Set ---
        const Icons = {
            ChevronRight: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('polyline', {points: "9 18 15 12 9 6"})),
            ChevronDown: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('polyline', {points: "6 9 12 15 18 9"})),
            Home: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('path', {d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}), h('polyline', {points: "9 22 9 12 15 12 15 22"})),
            Folder: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('path', {d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"})),
            FolderOpen: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('path', {d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"}), h('line', {x1: "2", y1: "9", x2: "22", y2: "9"})),
            Location: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('path', {d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"}), h('circle', {cx: "12", cy: "10", r: "3"})),
            Alert: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('circle', {cx: "12", cy: "12", r: "10"}), h('line', {x1: "12", y1: "8", x2: "12", y2: "12"}), h('line', {x1: "12", y1: "16", x2: "12.01", y2: "16"})),
            CheckCircle: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('path', {d: "M22 11.08V12a10 10 0 1 1-5.93-9.14"}), h('polyline', {points: "22 4 12 14.01 9 11.01"})),
            Empty: () => h('svg', {width: 48, height: 48, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1, strokeLinecap: "round", strokeLinejoin: "round"}, h('rect', {x: "2", y: "7", width: "20", height: "14", rx: "2", ry: "2"}), h('path', {d: "M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"})),
            Stats: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('rect', {x: "2", y: "2", width: "20", height: "20", rx: "2.18", ry: "2.18"}), h('line', {x1: "7", y1: "2", x2: "7", y2: "22"}), h('line', {x1: "17", y1: "2", x2: "17", y2: "22"}), h('line', {x1: "2", y1: "12", x2: "22", y2: "12"})),
            Search: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('circle', {cx: "11", cy: "11", r: "8"}), h('line', {x1: "21", y1: "21", x2: "16.65", y2: "16.65"})),
            Settings: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('circle', {cx: "12", cy: "12", r: "3"}), h('path', {d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"})),
            Plus: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('line', {x1: "12", y1: "5", x2: "12", y2: "19"}), h('line', {x1: "5", y1: "12", x2: "19", y2: "12"})),
            Edit: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('path', {d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"}), h('path', {d: "M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"})),
            Trash: () => h('svg', {width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round"}, h('polyline', {points: "3 6 5 6 21 6"}), h('path', {d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"}))
        };



        const TreePortal = () => {
            const [data, setData] = useState([]);
            const [loading, setLoading] = useState(true);
            const [searchTerm, setSearchTerm] = useState('');
            const [selectedItem, setSelectedItem] = useState({ type: 'overview', data: null });
            const [expandedNodes, setExpandedNodes] = useState(new Set());
            const [isAdmin, setIsAdmin] = useState(false);
            const [adminSelectedProblem, setAdminSelectedProblem] = useState(null);

            useEffect(() => {
                const checkAdmin = async () => {
                    try {
                        const allowed = ["1. Sharepoint beheer", "1.1 Mulder MT", "2.3 Senioren beoordelen"];
                        let allGroups = new Set();

                        const fetchFromUrl = async (url) => {
                            try {
                                console.log("Fetching groups from:", url);
                                const res = await fetch(url, { headers: { "Accept": "application/json;odata=verbose" } });
                                if (res.ok) {
                                    const data = await res.json();
                                    if (data.d && data.d.results) {
                                        console.log(`Found ${data.d.results.length} groups at ${url}`);
                                        data.d.results.forEach(g => allGroups.add(g.Title));
                                    }
                                } else {
                                    console.log(`Fetch failed ${res.status} for ${url}`);
                                }
                            } catch(e) { console.log("Fetch error for:", url, e); }
                        };

                        // 1. Try standard SharePoint Context
                        if (window._spPageContextInfo) {
                            console.log("SP Context found. Web:", window._spPageContextInfo.webAbsoluteUrl);
                            if (window._spPageContextInfo.webAbsoluteUrl) {
                                await fetchFromUrl(window._spPageContextInfo.webAbsoluteUrl + "/_api/web/currentuser/groups");
                            }
                            if (window._spPageContextInfo.siteAbsoluteUrl && window._spPageContextInfo.siteAbsoluteUrl !== window._spPageContextInfo.webAbsoluteUrl) {
                                await fetchFromUrl(window._spPageContextInfo.siteAbsoluteUrl + "/_api/web/currentuser/groups");
                            }
                        } else {
                            console.warn("_spPageContextInfo is missing. Attempting URL heuristics.");
                        }

                        // 2. URL Heuristics (Fallback if context is missing or incorrect)
                        // Detect /sites/SiteName pattern
                        const path = window.location.pathname;
                        const sitesMatch = path.match(/(\/sites\/[^\/]+)/i);
                        if (sitesMatch) {
                            const siteUrl = sitesMatch[1];
                            // Avoid duplicate call if we already hit it via context
                            if (!window._spPageContextInfo || window._spPageContextInfo.webAbsoluteUrl.indexOf(siteUrl) === -1) {
                                await fetchFromUrl(siteUrl + "/_api/web/currentuser/groups");
                            }
                        }

                        // 3. Site Admin Check (Super User)
                        try {
                            let userUrl = "/_api/web/currentuser";
                            if (window._spPageContextInfo && window._spPageContextInfo.webAbsoluteUrl) {
                                userUrl = window._spPageContextInfo.webAbsoluteUrl + "/_api/web/currentuser";
                            }
                            const userRes = await fetch(userUrl, { headers: { "Accept": "application/json;odata=verbose" } });
                            if (userRes.ok) {
                                const userData = await userRes.json();
                                if (userData.d && userData.d.IsSiteAdmin) {
                                    console.log("User is Site Admin. Access granted.");
                                    setIsAdmin(true);
                                    return;
                                }
                            }
                        } catch(e) { console.log("Site Admin check skipped"); }

                        // 4. Validate Groups
                        const groupsList = Array.from(allGroups);
                        console.log("Final Consolidated Group List:", groupsList);

                        const isAuthorized = groupsList.some(g => allowed.some(a => a.toLowerCase() === g.toLowerCase()));
                        
                        if (isAuthorized) {
                            console.log("Admin authorized via Group.");
                            setIsAdmin(true);
                        } else {
                            console.warn("User not in allowed admin groups.");
                        }

                    } catch (e) {
                        console.error("Admin check error:", e);
                        // Fallback for local development/testing
                        if (window.location.hostname === 'localhost' || window.location.protocol === 'file:') {
                            console.log("Local environment detected, enabling admin for testing.");
                            setIsAdmin(true);
                        }
                    }
                };
                checkAdmin();
            }, []);

            const loadData = async (showLoading = true) => {
                if (showLoading) setLoading(true);
                try {
                    const result = await DDH_CONFIG.queries.haalAllesMetRelaties();
                    setData(result);
                } catch (error) {
                    console.error('Data loading error, using placeholder data:', error);
                    setData(TEMP_PLACEHOLDER_DATA);
                } finally {
                    if (showLoading) setLoading(false);
                }
            };

            useEffect(() => {
                loadData();
            }, []);

            // Group data by gemeente
            const groupedData = useMemo(() => {
                const grouped = {};
                data.forEach(location => {
                    const gemeente = location.Gemeente;
                    if (!grouped[gemeente]) {
                        grouped[gemeente] = [];
                    }
                    grouped[gemeente].push(location);
                });
                return grouped;
            }, [data]);

            const filteredData = useMemo(() => {
                if (!searchTerm) return groupedData;
                
                const filtered = {};
                Object.entries(groupedData).forEach(([gemeente, locations]) => {
                    const searchMatch = gemeente.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                      locations.some(loc => 
                                          loc.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                          (loc.problemen || []).some(p => 
                                              p.Probleembeschrijving.toLowerCase().includes(searchTerm.toLowerCase())
                                          )
                                      );
                    
                    if (searchMatch) {
                        filtered[gemeente] = locations;
                    }
                });
                return filtered;
            }, [groupedData, searchTerm]);

            const recentChanges = useMemo(() => {
                const allItems = [];
                data.forEach(loc => {
                    allItems.push({
                        type: 'Locatie',
                        title: loc.Title,
                        date: new Date(loc.Modified),
                        id: loc.Id,
                        data: loc,
                        gemeente: loc.Gemeente
                    });
                    if (loc.problemen) {
                        loc.problemen.forEach(prob => {
                            allItems.push({
                                type: 'Probleem',
                                title: prob.Title || `Probleem #${prob.Id}`,
                                date: new Date(prob.Modified),
                                id: prob.Id,
                                data: prob,
                                parentLoc: loc
                            });
                        });
                    }
                });
                return allItems.sort((a, b) => b.date - a.date).slice(0, 5);
            }, [data]);

            const toggleNode = (nodeId, siblings = []) => {
                const newExpanded = new Set(expandedNodes);
                if (newExpanded.has(nodeId)) {
                    newExpanded.delete(nodeId);
                } else {
                    // Close siblings (Accordion behavior)
                    if (siblings && siblings.length > 0) {
                        siblings.forEach(siblingId => newExpanded.delete(siblingId));
                    }
                    newExpanded.add(nodeId);
                }
                setExpandedNodes(newExpanded);
            };

            const selectItem = (type, data) => {
                setSelectedItem({ type, data });
            };

            const copyToClipboard = (e, url) => {
                e.preventDefault();
                // Convert https://server/sites/... to \\server\sites\...
                let path = url.replace(/^https?:\/\//, '');
                path = path.replace(/\//g, '\\');
                path = '\\\\' + path;
                
                navigator.clipboard.writeText(path).then(() => {
                    alert('Pad gekopieerd naar klembord:\n' + path + '\n\nPlak dit in de adresbalk van de Verkenner.');
                }).catch(err => {
                    console.error('Fout bij kopiëren:', err);
                    prompt('Kopieer dit pad handmatig:', path);
                });
            };

            const renderContent = () => {
                const { type, data: itemData } = selectedItem;

                if (type === 'overview') {
                    const stats = {
                        totalGemeentes: Object.keys(groupedData).length,
                        totalLocations: data.length,
                        totalProblems: data.reduce((sum, loc) => sum + (loc.problemen?.length || 0), 0),
                        activeProblems: data.reduce((sum, loc) => 
                            sum + (loc.problemen?.filter(p => p.Opgelost_x003f_ !== 'Opgelost').length || 0), 0)
                    };

                    return h('div', null,
                        h('div', { className: 'content-header' },
                            h('h2', { className: 'content-title' }, 'DDH Handhavingsoverzicht'),
                            h('p', { className: 'content-subtitle' }, h(Icons.Stats), 'Algemene statistieken en overzicht')
                        ),
                        h('div', { className: 'detail-section' },
                            h('h3', { className: 'detail-title' }, h(Icons.Stats), 'Statistieken'),
                            h('div', { className: 'gemeente-detail' },
                                h('div', { className: 'detail-card' },
                                    h('div', { className: 'card-metric' }, stats.totalGemeentes),
                                    h('div', { className: 'card-label' }, 'Gemeentes'),
                                    h('div', { className: 'card-description' }, 'Totaal aantal gemeentes in systeem')
                                ),
                                h('div', { className: 'detail-card' },
                                    h('div', { className: 'card-metric' }, stats.totalLocations),
                                    h('div', { className: 'card-label' }, 'Handhavingslocaties'),
                                    h('div', { className: 'card-description' }, 'Actieve locaties voor digitale handhaving')
                                ),
                                h('div', { 
                                    className: 'detail-card warning',
                                    style: { cursor: 'pointer', transition: 'transform 0.2s' },
                                    onClick: () => selectItem('active-problems-overview', null),
                                    onMouseOver: (e) => e.currentTarget.style.transform = 'translateY(-2px)',
                                    onMouseOut: (e) => e.currentTarget.style.transform = 'none'
                                },
                                    h('div', { className: 'card-metric' }, stats.activeProblems),
                                    h('div', { className: 'card-label' }, 'Actieve Problemen'),
                                    h('div', { className: 'card-description' }, 'Klik voor overzicht per gemeente')
                                ),
                                h('div', { className: 'detail-card success' },
                                    h('div', { className: 'card-metric' }, stats.totalProblems - stats.activeProblems),
                                    h('div', { className: 'card-label' }, 'Opgeloste Problemen'),
                                    h('div', { className: 'card-description' }, 'Succesvol afgehandelde meldingen')
                                )
                            )
                        )
                    );
                }

                if (type === 'active-problems-overview') {
                    // Filter gemeentes with active problems
                    const gemeentesWithProblems = Object.entries(groupedData).filter(([gemeente, locations]) => {
                        return locations.some(loc => 
                            (loc.problemen || []).some(p => p.Opgelost_x003f_ !== 'Opgelost')
                        );
                    }).sort((a, b) => a[0].localeCompare(b[0]));

                    return h('div', null,
                        h('div', { className: 'breadcrumb' },
                            h('span', { className: 'breadcrumb-item', onClick: () => selectItem('overview', null) }, 
                                h(Icons.Home), 'Overzicht'
                            ),
                            h('span', { className: 'breadcrumb-separator' }, h(Icons.ChevronRight)),
                            h('span', { className: 'breadcrumb-item' }, h(Icons.Alert), 'Actieve Problemen')
                        ),
                        h('div', { className: 'content-header' },
                            h('h2', { className: 'content-title' }, 'Gemeentes met Actieve Problemen'),
                            h('p', { className: 'content-subtitle' }, 'Selecteer een gemeente om de locaties te bekijken')
                        ),
                        h('div', { className: 'detail-section' },
                            h('div', { className: 'gemeente-detail' },
                                gemeentesWithProblems.map(([gemeente, locations]) => {
                                    const activeCount = locations.reduce((sum, loc) => 
                                        sum + (loc.problemen?.filter(p => p.Opgelost_x003f_ !== 'Opgelost').length || 0), 0);
                                    
                                    return h('div', { 
                                        key: gemeente,
                                        className: 'detail-card warning',
                                        style: { cursor: 'pointer', transition: 'transform 0.2s' },
                                        onClick: () => selectItem('gemeente', gemeente),
                                        onMouseOver: (e) => e.currentTarget.style.transform = 'translateY(-2px)',
                                        onMouseOut: (e) => e.currentTarget.style.transform = 'none'
                                    },
                                        h('div', { className: 'card-metric' }, activeCount),
                                        h('div', { className: 'card-label' }, gemeente),
                                        h('div', { className: 'card-description' }, `${locations.length} locaties in totaal`)
                                    );
                                })
                            )
                        )
                    );
                }

                if (type === 'gemeente') {
                    const locations = groupedData[itemData] || [];
                    const totalProblems = locations.reduce((sum, loc) => sum + (loc.problemen?.length || 0), 0);
                    const activeProblems = locations.reduce((sum, loc) => 
                        sum + (loc.problemen?.filter(p => p.Opgelost_x003f_ !== 'Opgelost').length || 0), 0);

                    return h('div', null,
                        h('div', { className: 'breadcrumb' },
                            h('span', { className: 'breadcrumb-item', onClick: () => selectItem('overview', null) }, 
                                h(Icons.Home), 'Overzicht'
                            ),
                            h('span', { className: 'breadcrumb-separator' }, h(Icons.ChevronRight)),
                            h('span', { className: 'breadcrumb-item' }, h(Icons.Folder), itemData)
                        ),
                        h('div', { className: 'content-header' },
                            h('h2', { className: 'content-title' }, itemData),
                            h('p', { className: 'content-subtitle' }, `${locations.length} handhavingslocaties`)
                        ),
                        h('div', { className: 'detail-section' },
                            h('h3', { className: 'detail-title' }, h(Icons.Stats), 'Gemeente Statistieken'),
                            h('div', { className: 'gemeente-detail' },
                                h('div', { className: 'detail-card' },
                                    h('div', { className: 'card-metric' }, locations.length),
                                    h('div', { className: 'card-label' }, 'Locaties'),
                                    h('div', { className: 'card-description' }, 'Handhavingslocaties in deze gemeente')
                                ),
                                h('div', { className: 'detail-card warning' },
                                    h('div', { className: 'card-metric' }, activeProblems),
                                    h('div', { className: 'card-label' }, 'Actieve Problemen'),
                                    h('div', { className: 'card-description' }, 'Vereisen directe aandacht')
                                ),
                                h('div', { className: 'detail-card success' },
                                    h('div', { className: 'card-metric' }, totalProblems - activeProblems),
                                    h('div', { className: 'card-label' }, 'Opgelost'),
                                    h('div', { className: 'card-description' }, 'Succesvol afgehandeld')
                                )
                            )
                        ),
                        h('div', { className: 'detail-section' },
                            h('h3', { className: 'detail-title' }, h(Icons.Location), 'Handhavingslocaties'),
                            locations.map(location => {
                                const problems = location.problemen || [];
                                const activeProbs = problems.filter(p => p.Opgelost_x003f_ !== 'Opgelost');
                                
                                return h('div', { 
                                    key: location.Id, 
                                    className: `locatie-detail ${activeProbs.length > 0 ? 'has-active-problems' : ''}`,
                                    onClick: () => {
                                        selectItem('locatie', location);
                                        if (!expandedNodes.has(location.Id)) {
                                            toggleNode(location.Id);
                                        }
                                    }
                                },
                                    h('div', { className: 'locatie-info' },
                                        h('div', null,
                                            h('h4', { className: 'locatie-name' }, 
                                                h(Icons.Location), 
                                                location.Title
                                            ),
                                            h('div', { className: 'locatie-meta' },
                                                `Status: ${location.Status_x0020_B_x0026_S || 'Onbekend'} • `,
                                                `Feitcodegroep: ${location.Feitcodegroep}`
                                            )
                                        ),
                                        h('div', { className: 'locatie-status-grid' },
                                            activeProbs.length > 0 && h('div', { className: 'status-chip active' }, 
                                                h(Icons.Alert), `${activeProbs.length} actief`
                                            ),
                                            problems.length - activeProbs.length > 0 && h('div', { className: 'status-chip resolved' }, 
                                                h(Icons.CheckCircle), `${problems.length - activeProbs.length} opgelost`
                                            ),
                                            problems.length === 0 && h('div', { className: 'status-chip' }, h(Icons.CheckCircle), 'Geen problemen')
                                        )
                                    )
                                );
                            })
                        )
                    );
                }

                if (type === 'locatie') {
                    const problems = itemData.problemen || [];
                    const activeProbs = problems.filter(p => p.Opgelost_x003f_ !== 'Opgelost');
                    const resolvedProbs = problems.filter(p => p.Opgelost_x003f_ === 'Opgelost');

                    return h('div', null,
                        h('div', { className: 'breadcrumb' },
                            h('span', { className: 'breadcrumb-item', onClick: () => selectItem('overview', null) }, 
                                h(Icons.Home), 'Overzicht'
                            ),
                            h('span', { className: 'breadcrumb-separator' }, h(Icons.ChevronRight)),
                            h('span', { className: 'breadcrumb-item', onClick: () => selectItem('gemeente', itemData.Gemeente) }, 
                                h(Icons.Folder), itemData.Gemeente
                            ),
                            h('span', { className: 'breadcrumb-separator' }, h(Icons.ChevronRight)),
                            h('span', { className: 'breadcrumb-item' }, h(Icons.Location), itemData.Title)
                        ),
                        h('div', { className: 'content-header' },
                            h('h2', { className: 'content-title' }, itemData.Title),
                            h('p', { className: 'content-subtitle' }, `${itemData.Gemeente} • ${problems.length} problemen`)
                        ),
                        
                        // --- Nieuwe Locatie Details Sectie ---
                        h('div', { className: 'detail-section' },
                            h('h3', { className: 'detail-title' }, h(Icons.Location), 'Locatie Details'),
                            
                            h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' } },
                                // Card 1: Algemene Info
                                h('div', { className: 'detail-card', style: { height: '100%', padding: '20px' } },
                                    h('h4', { style: { marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: 0, color: '#1e293b' } }, 'Algemene Informatie'),
                                    h('div', { className: 'location-details-grid', style: { display: 'grid', gap: '12px' } },
                                        h('div', { className: 'detail-row', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                            h('span', { style: { color: '#64748b', fontSize: '14px' } }, 'ID:'),
                                            h('span', { style: { fontWeight: '600', color: '#334155' } }, itemData.Id || '-')
                                        ),
                                        h('div', { className: 'detail-row', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                            h('span', { style: { color: '#64748b', fontSize: '14px' } }, 'Gemeente:'),
                                            h('span', { style: { fontWeight: '600', color: '#334155' } }, itemData.Gemeente || '-')
                                        ),
                                        h('div', { className: 'detail-row', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                            h('span', { style: { color: '#64748b', fontSize: '14px' } }, 'Status B&S:'),
                                            h('span', { style: { fontWeight: '600', color: '#334155' } }, itemData.Status_x0020_B_x0026_S || '-')
                                        ),
                                        h('div', { className: 'detail-row', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                            h('span', { style: { color: '#64748b', fontSize: '14px' } }, 'Feitcodegroep:'),
                                            h('span', { style: { fontWeight: '600', color: '#334155' } }, itemData.Feitcodegroep || '-')
                                        ),
                                        h('div', { className: 'detail-row', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                            h('span', { style: { color: '#64748b', fontSize: '14px' } }, 'Laatste Schouw:'),
                                            h('span', { style: { fontWeight: '600', color: '#334155' } }, itemData.Laatste_x0020_schouw ? new Date(itemData.Laatste_x0020_schouw).toLocaleDateString('nl-NL') : '-')
                                        ),
                                        h('div', { className: 'detail-row', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                            h('span', { style: { color: '#64748b', fontSize: '14px' } }, 'Waarschuwing:'),
                                            h('span', { style: { fontWeight: '600', color: itemData.Waarschuwing ? '#d97706' : '#334155' } }, itemData.Waarschuwing ? 'Ja' : 'Nee')
                                        ),
                                        itemData.Waarschuwing === 'Ja' && h('div', { className: 'detail-row', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                            h('span', { style: { color: '#64748b', fontSize: '14px' } }, 'Waarschuwingsperiode:'),
                                            h('span', { style: { fontWeight: '600', color: '#334155', fontSize: '13px' } }, 
                                                `${itemData.Start_x0020_Waarschuwingsperiode ? new Date(itemData.Start_x0020_Waarschuwingsperiode).toLocaleDateString('nl-NL') : '?'} - ${itemData.Einde_x0020_Waarschuwingsperiode ? new Date(itemData.Einde_x0020_Waarschuwingsperiode).toLocaleDateString('nl-NL') : '?'}`
                                            )
                                        ),
                                        h('div', { className: 'detail-row', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                            h('span', { style: { color: '#64748b', fontSize: '14px' } }, 'Contactpersoon:'),
                                            h('span', { style: { fontWeight: '600', color: '#334155' } }, itemData.Contactpersoon?.Title || '-')
                                        ),
                                        itemData.E_x002d_mailadres_x0020_contactp && h('div', { className: 'detail-row', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                            h('span', { style: { color: '#64748b', fontSize: '14px' } }, 'Email Contact:'),
                                            h('a', { href: `mailto:${itemData.E_x002d_mailadres_x0020_contactp}`, style: { fontWeight: '600', color: '#3b82f6', textDecoration: 'none' } }, itemData.E_x002d_mailadres_x0020_contactp)
                                        ),
                                        h('div', { className: 'detail-row', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #e2e8f0', paddingTop: '8px', marginTop: '4px' } },
                                            h('span', { style: { color: '#64748b', fontSize: '12px' } }, 'Aangemaakt:'),
                                            h('span', { style: { color: '#64748b', fontSize: '12px' } }, itemData.Created ? new Date(itemData.Created).toLocaleDateString('nl-NL') : '-')
                                        ),
                                        h('div', { className: 'detail-row', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
                                            h('span', { style: { color: '#64748b', fontSize: '12px' } }, 'Gewijzigd:'),
                                            h('span', { style: { color: '#64748b', fontSize: '12px' } }, itemData.Modified ? new Date(itemData.Modified).toLocaleDateString('nl-NL') : '-')
                                        )
                                    )
                                ),

                                // Card 2: Documenten & Links
                                h('div', { className: 'detail-card', style: { height: '100%', padding: '20px' } },
                                    h('h4', { style: { marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px', marginTop: 0, color: '#1e293b' } }, 'Documenten & Links'),
                                    h('div', { className: 'links-grid', style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
                                        // SharePoint Item Link
                                        h('div', { className: 'split-btn-container', style: { display: 'flex', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' } },
                                            h('a', { 
                                                href: `${DDH_CONFIG.sharepoint.siteUrl}/Lists/Digitale%20handhaving/DispForm.aspx?ID=${itemData.Id}`, 
                                                target: '_blank',
                                                className: 'doc-link-primary',
                                                style: { 
                                                    flex: '1', display: 'flex', alignItems: 'center', gap: '12px', 
                                                    padding: '12px', background: '#f8fafc', textDecoration: 'none', color: '#334155',
                                                    transition: 'all 0.2s'
                                                },
                                                onMouseOver: (e) => { e.currentTarget.style.background = '#eff6ff'; },
                                                onMouseOut: (e) => { e.currentTarget.style.background = '#f8fafc'; }
                                            }, 
                                                h('div', { style: { color: '#3b82f6', display: 'flex' } }, h(Icons.Folder)),
                                                h('div', null,
                                                    h('div', { style: { fontWeight: '600', fontSize: '14px' } }, 'Bekijk Item in SharePoint'),
                                                    h('div', { style: { fontSize: '12px', color: '#64748b', marginTop: '2px' } }, 'Open eigenschappen formulier')
                                                )
                                            )
                                        ),

                                        itemData.Link_x0020_Algemeen_x0020_PV ? h('div', { className: 'split-btn-container', style: { display: 'flex', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' } },
                                            // Primary Button (SharePoint)
                                            h('a', { 
                                                href: itemData.Link_x0020_Algemeen_x0020_PV.Url, 
                                                target: '_blank',
                                                className: 'doc-link-primary',
                                                style: { 
                                                    flex: '1', display: 'flex', alignItems: 'center', gap: '12px', 
                                                    padding: '12px', background: '#f8fafc', textDecoration: 'none', color: '#334155',
                                                    transition: 'all 0.2s', borderRight: '1px solid #e2e8f0'
                                                },
                                                onMouseOver: (e) => { e.currentTarget.style.background = '#eff6ff'; },
                                                onMouseOut: (e) => { e.currentTarget.style.background = '#f8fafc'; }
                                            }, 
                                                h('div', { style: { color: '#3b82f6', display: 'flex' } }, h(Icons.Folder)),
                                                h('div', null,
                                                    h('div', { style: { fontWeight: '600', fontSize: '14px' } }, 'Algemeen Proces-Verbaal'),
                                                    h('div', { style: { fontSize: '12px', color: '#64748b', marginTop: '2px' } }, 'Open in SharePoint')
                                                )
                                            ),
                                            // Secondary Button (UNC/Explorer)
                                            h('a', { 
                                                className: 'doc-link-secondary',
                                                title: 'Kopieer pad naar klembord (voor Verkenner)',
                                                href: '#',
                                                onClick: (e) => copyToClipboard(e, itemData.Link_x0020_Algemeen_x0020_PV.Url),
                                                style: { 
                                                    width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    background: '#f1f5f9', cursor: 'pointer', transition: 'all 0.2s',
                                                    textDecoration: 'none', color: '#334155'
                                                },
                                                onMouseOver: (e) => { e.currentTarget.style.background = '#e2e8f0'; },
                                                onMouseOut: (e) => { e.currentTarget.style.background = '#f1f5f9'; }
                                            }, h(Icons.FolderOpen))
                                        ) : h('div', { style: { padding: '12px', color: '#94a3b8', fontStyle: 'italic', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #e2e8f0' } }, 'Algemeen Proces-Verbaal niet beschikbaar'),

                                        itemData.Link_x0020_Schouwrapporten ? h('div', { className: 'split-btn-container', style: { display: 'flex', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' } },
                                            // Primary Button (SharePoint)
                                            h('a', { 
                                                href: itemData.Link_x0020_Schouwrapporten.Url, 
                                                target: '_blank',
                                                className: 'doc-link-primary',
                                                style: { 
                                                    flex: '1', display: 'flex', alignItems: 'center', gap: '12px', 
                                                    padding: '12px', background: '#f8fafc', textDecoration: 'none', color: '#334155',
                                                    transition: 'all 0.2s', borderRight: '1px solid #e2e8f0'
                                                },
                                                onMouseOver: (e) => { e.currentTarget.style.background = '#eff6ff'; },
                                                onMouseOut: (e) => { e.currentTarget.style.background = '#f8fafc'; }
                                            }, 
                                                h('div', { style: { color: '#3b82f6', display: 'flex' } }, h(Icons.Folder)),
                                                h('div', null,
                                                    h('div', { style: { fontWeight: '600', fontSize: '14px' } }, 'Schouwrapporten'),
                                                    h('div', { style: { fontSize: '12px', color: '#64748b', marginTop: '2px' } }, 'Open in SharePoint')
                                                )
                                            ),
                                            // Secondary Button (UNC/Explorer)
                                            h('a', { 
                                                className: 'doc-link-secondary',
                                                title: 'Kopieer pad naar klembord (voor Verkenner)',
                                                href: '#',
                                                onClick: (e) => copyToClipboard(e, itemData.Link_x0020_Schouwrapporten.Url),
                                                style: { 
                                                    width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    background: '#f1f5f9', cursor: 'pointer', transition: 'all 0.2s',
                                                    textDecoration: 'none', color: '#334155'
                                                },
                                                onMouseOver: (e) => { e.currentTarget.style.background = '#e2e8f0'; },
                                                onMouseOut: (e) => { e.currentTarget.style.background = '#f1f5f9'; }
                                            }, h(Icons.FolderOpen))
                                        ) : h('div', { style: { padding: '12px', color: '#94a3b8', fontStyle: 'italic', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #e2e8f0' } }, 'Schouwrapporten niet beschikbaar'),

                                        itemData.Instemmingsbesluit ? h('div', { className: 'split-btn-container', style: { display: 'flex', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' } },
                                            // Primary Button (SharePoint)
                                            h('a', { 
                                                href: itemData.Instemmingsbesluit.Url, 
                                                target: '_blank',
                                                className: 'doc-link-primary',
                                                style: { 
                                                    flex: '1', display: 'flex', alignItems: 'center', gap: '12px', 
                                                    padding: '12px', background: '#f8fafc', textDecoration: 'none', color: '#334155',
                                                    transition: 'all 0.2s', borderRight: '1px solid #e2e8f0'
                                                },
                                                onMouseOver: (e) => { e.currentTarget.style.background = '#eff6ff'; },
                                                onMouseOut: (e) => { e.currentTarget.style.background = '#f8fafc'; }
                                            }, 
                                                h('div', { style: { color: '#3b82f6', display: 'flex' } }, h(Icons.Folder)),
                                                h('div', null,
                                                    h('div', { style: { fontWeight: '600', fontSize: '14px' } }, 'Instemmingsbesluit'),
                                                    h('div', { style: { fontSize: '12px', color: '#64748b', marginTop: '2px' } }, 'Open in SharePoint')
                                                )
                                            ),
                                            // Secondary Button (UNC/Explorer)
                                            h('a', { 
                                                className: 'doc-link-secondary',
                                                title: 'Kopieer pad naar klembord (voor Verkenner)',
                                                href: '#',
                                                onClick: (e) => copyToClipboard(e, itemData.Instemmingsbesluit.Url),
                                                style: { 
                                                    width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    background: '#f1f5f9', cursor: 'pointer', transition: 'all 0.2s',
                                                    textDecoration: 'none', color: '#334155'
                                                },
                                                onMouseOver: (e) => { e.currentTarget.style.background = '#e2e8f0'; },
                                                onMouseOut: (e) => { e.currentTarget.style.background = '#f1f5f9'; }
                                            }, h(Icons.FolderOpen))
                                        ) : h('div', { style: { padding: '12px', color: '#94a3b8', fontStyle: 'italic', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #e2e8f0' } }, 'Geen Instemmingsbesluit beschikbaar')
                                    )
                                )
                            )
                        ),

                        h('div', { className: 'detail-section' },
                            h('h3', { className: 'detail-title' }, h(Icons.Alert), 'Actieve Problemen'),
                            activeProbs.length > 0 ?
                                h('div', { className: 'problems-grid' },
                                    activeProbs.map(problem => {
                                        const daysSince = Math.floor((new Date() - new Date(problem.Aanmaakdatum)) / (1000 * 60 * 60 * 24));
                                        
                                        // Helper to format date
                                        const formatDate = (d) => d ? new Date(d).toLocaleDateString('nl-NL') : '-';
                                        
                                        // Helper to format user(s)
                                        const formatUser = (u) => {
                                            if (!u) return '-';
                                            if (u.results) return u.results.map(r => r.Title).join(', '); // Multi-user
                                            return u.Title || '-'; // Single user
                                        };

                                        return h('div', { key: problem.Id, className: 'problem-card active' },
                                            h('div', { className: 'problem-header' },
                                                h('div', { className: 'problem-id' }, h(Icons.Alert), h('span', { style: { fontWeight: 'bold', fontSize: '14px', color: '#1e293b' } }, problem.Title || `Probleem #${problem.Id}`)),
                                                h('div', { className: 'problem-age' }, `${daysSince} dagen geleden`)
                                            ),
                                            
                                            h('div', { className: 'problem-description' }, problem.Probleembeschrijving),
                                            
                                            // Action & Explanation Section
                                            (problem.Actie_x0020_Beoordelaars || problem.Uitleg_x0020_actie_x0020_beoorde) && h('div', { 
                                                style: (problem.Uitleg_x0020_actie_x0020_beoorde || (problem.Actie_x0020_Beoordelaars && problem.Actie_x0020_Beoordelaars !== 'Geen actie nodig')) ? 
                                                    { background: '#fff7ed', padding: '12px', borderRadius: '6px', margin: '12px 0', border: '1px solid #fdba74', borderLeft: '4px solid #f97316' } :
                                                    { background: '#f8fafc', padding: '12px', borderRadius: '6px', margin: '12px 0', border: '1px solid #e2e8f0' }
                                            },
                                                problem.Actie_x0020_Beoordelaars && h('div', { style: { marginBottom: '4px' } },
                                                    h('span', { style: { fontWeight: '600', fontSize: '13px', color: '#475569' } }, 'Actie beoordelaar: '),
                                                    h('span', { style: { color: '#1e293b' } }, problem.Actie_x0020_Beoordelaars)
                                                ),
                                                problem.Uitleg_x0020_actie_x0020_beoorde && h('div', null,
                                                    h('span', { style: { fontWeight: '600', fontSize: '13px', color: '#475569', display: 'block', marginBottom: '2px' } }, 'Toelichting:'),
                                                    h('span', { style: { color: '#334155', fontStyle: 'italic' } }, problem.Uitleg_x0020_actie_x0020_beoorde)
                                                )
                                            ),

                                            // Metadata Grid (Subtle)
                                            h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: '#64748b', margin: '12px 0', paddingTop: '12px', borderTop: '1px dashed #e2e8f0' } },
                                                h('div', null, h('strong', null, 'Melder: '), formatUser(problem.Melder)),
                                                h('div', null, h('strong', null, 'Eigenaar: '), formatUser(problem.Eigenaar)),
                                                h('div', { style: { gridColumn: 'span 2' } }, h('strong', null, 'Afhandelende beoordelaar: '), formatUser(problem.Beoordelaar)),
                                                h('div', null, h('strong', null, 'Startdatum: '), formatDate(problem.Startdatum)),
                                                h('div', null, h('strong', null, 'Einddatum: '), formatDate(problem.Einddatum))
                                            ),

                                            h('div', { className: 'problem-footer' },
                                                h('div', { className: 'problem-category' }, problem.Feitcodegroep),
                                                h('div', {
                                                    className: `problem-status ${(problem.Opgelost_x003f_ || '').toLowerCase().replace(/\s+/g, '-')}`
                                                }, problem.Opgelost_x003f_)
                                            )
                                        );
                                    })
                                ) : h('div', { className: 'empty-state' },
                                    h('div', { className: 'empty-icon' }, h(Icons.CheckCircle)),
                                    h('div', { className: 'empty-title' }, 'Geen actieve problemen'),
                                    h('div', { className: 'empty-subtitle' }, 'Alle problemen voor deze locatie zijn opgelost.')
                                )
                        ),
                        resolvedProbs.length > 0 && h('div', { className: 'detail-section' },
                            h('h3', { className: 'detail-title' }, h(Icons.CheckCircle), 'Opgeloste Problemen'),
                            h('div', { className: 'problems-grid' },
                                resolvedProbs.map(problem => {
                                    const daysSince = Math.floor((new Date() - new Date(problem.Aanmaakdatum)) / (1000 * 60 * 60 * 24));
                                    
                                    // Helper to format date
                                    const formatDate = (d) => d ? new Date(d).toLocaleDateString('nl-NL') : '-';
                                    
                                    // Helper to format user(s)
                                    const formatUser = (u) => {
                                        if (!u) return '-';
                                        if (u.results) return u.results.map(r => r.Title).join(', '); // Multi-user
                                        return u.Title || '-'; // Single user
                                    };

                                    return h('div', { key: problem.Id, className: 'problem-card resolved' },
                                        h('div', { className: 'problem-header' },
                                            h('div', { className: 'problem-id' }, h(Icons.CheckCircle), h('span', { style: { fontWeight: 'bold', fontSize: '14px', color: '#1e293b' } }, `${problem.Title || `Probleem #${problem.Id}`} (Opgelost)`)),
                                            h('div', { className: 'problem-age' }, `${daysSince} dagen geleden`)
                                        ),
                                        
                                        h('div', { className: 'problem-description' }, problem.Probleembeschrijving),
                                        
                                        // Action & Explanation Section
                                        (problem.Actie_x0020_Beoordelaars || problem.Uitleg_x0020_actie_x0020_beoorde) && h('div', { style: { background: '#f8fafc', padding: '12px', borderRadius: '6px', margin: '12px 0', border: '1px solid #e2e8f0' } },
                                            problem.Actie_x0020_Beoordelaars && h('div', { style: { marginBottom: '4px' } },
                                                h('span', { style: { fontWeight: '600', fontSize: '13px', color: '#475569' } }, 'Actie beoordelaar: '),
                                                h('span', { style: { color: '#1e293b' } }, problem.Actie_x0020_Beoordelaars)
                                            ),
                                            problem.Uitleg_x0020_actie_x0020_beoorde && h('div', null,
                                                h('span', { style: { fontWeight: '600', fontSize: '13px', color: '#475569', display: 'block', marginBottom: '2px' } }, 'Toelichting:'),
                                                h('span', { style: { color: '#334155', fontStyle: 'italic' } }, problem.Uitleg_x0020_actie_x0020_beoorde)
                                            )
                                        ),

                                        // Metadata Grid (Subtle)
                                        h('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px', color: '#64748b', margin: '12px 0', paddingTop: '12px', borderTop: '1px dashed #e2e8f0' } },
                                            h('div', null, h('strong', null, 'Melder: '), formatUser(problem.Melder)),
                                            h('div', null, h('strong', null, 'Eigenaar: '), formatUser(problem.Eigenaar)),
                                            h('div', { style: { gridColumn: 'span 2' } }, h('strong', null, 'Afhandelende beoordelaar: '), formatUser(problem.Beoordelaar)),
                                            h('div', null, h('strong', null, 'Startdatum: '), formatDate(problem.Startdatum)),
                                            h('div', null, h('strong', null, 'Einddatum: '), formatDate(problem.Einddatum))
                                        ),

                                        h('div', { className: 'problem-footer' },
                                            h('div', { className: 'problem-category' }, problem.Feitcodegroep),
                                            h('div', { className: 'problem-status opgelost' }, 'Opgelost')
                                        )
                                    );
                                })
                            )
                        )
                    );
                }

                return h('div', { className: 'empty-state' },
                    h('div', { className: 'empty-icon' }, h(Icons.Empty)),
                    h('div', { className: 'empty-title' }, 'Selecteer een item'),
                    h('div', { className: 'empty-subtitle' }, 'Kies een gemeente of locatie uit de boom om details te bekijken.')
                );
            };

            if (loading) {
                return h('div', { style: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' } },
                    h('div', { style: { textAlign: 'center' } },
                        h('div', { style: { 
                            width: '50px', height: '50px', border: '4px solid #f3f3f3', 
                            borderTop: '4px solid #3b82f6', borderRadius: '50%',
                            animation: 'spin 1s linear infinite', margin: '0 auto 20px'
                        } }),
                        h('p', null, 'Tree Portal wordt geladen...')
                    )
                );
            }

            return h('div', null,
                // Header
                h('div', { className: 'portal-header' },
                    h('div', { className: 'header-content' },
                        h('h1', { className: 'portal-title' }, 'Digitale handhaving en probleemlocaties'),
                        h('p', { className: 'portal-subtitle' }, 'Hi\u00EBrarchische weergave van gemeentes, locaties en problemen')
                    ),
                    h('div', { className: 'recent-changes-board' },
                        h('div', { className: 'recent-title' }, '🕒 Recent Veranderingen'),
                        recentChanges.map(item => 
                            h('div', { 
                                className: 'recent-item',
                                onClick: () => {
                                    if (item.type === 'Locatie') {
                                        selectItem('locatie', item.data);
                                        const newExpanded = new Set(expandedNodes);
                                        newExpanded.add(item.gemeente);
                                        setExpandedNodes(newExpanded);
                                    } else {
                                        selectItem('locatie', item.parentLoc);
                                        const newExpanded = new Set(expandedNodes);
                                        newExpanded.add(item.parentLoc.Gemeente);
                                        newExpanded.add(item.parentLoc.Id);
                                        setExpandedNodes(newExpanded);
                                    }
                                }
                            },
                                h('span', { 
                                    style: { 
                                        fontSize: '10px', 
                                        padding: '2px 6px', 
                                        borderRadius: '4px',
                                        background: item.type === 'Locatie' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                                        color: item.type === 'Locatie' ? '#60a5fa' : '#f87171',
                                        fontWeight: '600',
                                        marginRight: '4px'
                                    } 
                                }, item.type === 'Locatie' ? 'LOC' : 'PRB'),
                                
                                h('span', { 
                                    style: { 
                                        whiteSpace: 'nowrap', 
                                        overflow: 'hidden', 
                                        textOverflow: 'ellipsis',
                                        maxWidth: '140px',
                                        color: '#e2e8f0'
                                    } 
                                }, item.title),

                                h('span', { className: 'recent-date' }, 
                                    item.date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
                                )
                            )
                        )
                    )
                ),

                // Main Layout
                h('div', { className: 'main-layout' },
                    // Sidebar with Tree
                    h('div', { className: 'sidebar' },
                        h('div', { className: 'sidebar-header' },
                            h('div', { className: 'sidebar-title-row' },
                                h('h3', { className: 'sidebar-title' }, 'Navigatie'),
                                h('button', { 
                                    className: 'refresh-btn',
                                    title: 'Ververs data',
                                    onClick: () => loadData(true) // Force refresh
                                }, h(Icons.Refresh || (() => h('span', null, '↻'))))
                            ),
                            h('div', { style: { position: 'relative' } },
                                h('input', {
                                    type: 'text',
                                    className: 'search-input',
                                    placeholder: 'Zoeken...',
                                    value: searchTerm,
                                    onChange: (e) => setSearchTerm(e.target.value)
                                }),
                                h('div', { style: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' } },
                                    h(Icons.Search)
                                )
                            )
                        ),
                        h('div', { className: 'tree-container' },
                            // Overview node
                            h('div', { className: 'tree-node' },
                                h('div', {
                                    className: `tree-item ${selectedItem.type === 'overview' ? 'active' : ''}`,
                                    onClick: () => selectItem('overview', null)
                                },
                                    h('div', { className: 'tree-type-icon' }, h(Icons.Home)),
                                    h('div', { className: 'tree-text' }, 'Overzicht'),
                                    h('div', { className: 'tree-badge' }, Object.keys(filteredData).length)
                                )
                            ),
                            
                            // Gemeente nodes
                            Object.entries(filteredData).map(([gemeente, locations]) => {
                                const isExpanded = expandedNodes.has(gemeente);
                                const activeProblems = locations.reduce((sum, loc) => 
                                    sum + (loc.problemen?.filter(p => p.Opgelost_x003f_ !== 'Opgelost').length || 0), 0);
                                const allGemeentes = Object.keys(filteredData);
                                
                                return h('div', { key: gemeente, className: 'tree-node' },
                                    h('div', {
                                        className: `tree-item gemeente ${selectedItem.type === 'gemeente' && selectedItem.data === gemeente ? 'active' : ''} ${activeProblems > 0 ? 'has-active-problems' : ''}`,
                                        onClick: () => {
                                            selectItem('gemeente', gemeente);
                                            toggleNode(gemeente, allGemeentes);
                                        }
                                    },
                                        // Toggle Icon (Chevron)
                                        h('div', { 
                                            className: 'tree-toggle',
                                            onClick: (e) => {
                                                e.stopPropagation();
                                                toggleNode(gemeente, allGemeentes);
                                            }
                                        }, isExpanded ? h(Icons.ChevronDown) : h(Icons.ChevronRight)),
                                        // Type Icon (Folder)
                                        h('div', { className: 'tree-type-icon' }, isExpanded ? h(Icons.FolderOpen) : h(Icons.Folder)),
                                        
                                        h('div', { className: 'tree-text' }, gemeente),
                                        activeProblems > 0 && h('div', { className: 'tree-badge problems' }, activeProblems)
                                    ),
                                    
                                    // Location nodes
                                    isExpanded && locations.map(location => {
                                        const problems = location.problemen || [];
                                        const activeProbs = problems.filter(p => p.Opgelost_x003f_ !== 'Opgelost');
                                        const isLocExpanded = expandedNodes.has(location.Id);
                                        const hasActiveProblems = activeProbs.length > 0;
                                        const siblingIds = locations.map(l => l.Id);
                                        
                                        return h('div', { key: location.Id },
                                            h('div', {
                                                className: `tree-item locatie ${selectedItem.type === 'locatie' && selectedItem.data?.Id === location.Id ? 'active' : ''} ${hasActiveProblems ? 'has-active-problems' : ''} ${isAdmin && selectedItem.type === 'locatie' && selectedItem.data?.Id === location.Id ? 'admin-selected' : ''}`,
                                                onClick: () => {
                                                    selectItem('locatie', location);
                                                    toggleNode(location.Id, siblingIds);
                                                }
                                            },
                                                // Toggle Icon (Chevron) - only if there are problems
                                                problems.length > 0 ? h('div', { 
                                                    className: 'tree-toggle',
                                                    onClick: (e) => {
                                                        e.stopPropagation();
                                                        toggleNode(location.Id, siblingIds);
                                                    }
                                                }, isLocExpanded ? h(Icons.ChevronDown) : h(Icons.ChevronRight)) : h('div', { className: 'tree-toggle' }), // spacer
                                                
                                                // Type Icon (Location)
                                                h('div', { className: 'tree-type-icon' }, h(Icons.Location)),
                                                
                                                h('div', { className: 'tree-text' }, location.Title),
                                                
                                                // Bordeaux Counter for active problems
                                                hasActiveProblems && h('div', { className: 'tree-badge bordeaux' }, activeProbs.length)
                                            ),
                                            
                                            // Problem nodes
                                            isLocExpanded && problems.map(problem => {
                                                const isActive = problem.Opgelost_x003f_ !== 'Opgelost';
                                                return h('div', {
                                                    key: problem.Id,
                                                    className: `tree-item problem ${isActive ? 'active-problem' : 'resolved-problem'}`,
                                                    onClick: (e) => {
                                                        e.stopPropagation();
                                                        // Open the parent location view
                                                        selectItem('locatie', location);
                                                        // Also select for admin if applicable
                                                        if (isAdmin) {
                                                            setAdminSelectedProblem(problem);
                                                        }
                                                    }
                                                },
                                                    // No Toggle Icon
                                                    h('div', { className: 'tree-toggle' }),
                                                    
                                                    // Admin Checkbox
                                                    isAdmin && h('input', {
                                                        type: 'checkbox',
                                                        checked: adminSelectedProblem?.Id === problem.Id,
                                                        onChange: (e) => {
                                                            e.stopPropagation();
                                                            setAdminSelectedProblem(e.target.checked ? problem : null);
                                                        },
                                                        style: { marginRight: '8px', cursor: 'pointer' }
                                                    }),

                                                    // Type Icon
                                                    h('div', { className: 'tree-type-icon' }, 
                                                        isActive ? h(Icons.Alert) : h(Icons.CheckCircle)
                                                    ),
                                                    h('div', { className: 'tree-text' }, problem.Title || `#${problem.Id}`)
                                                );
                                            })
                                        );
                                    })
                                );
                            })
                        )
                    ),
                    
                    // Content Area
                    h('div', { className: 'content-area' }, renderContent())
                ),
                
                // Admin Menu
                h(AdminMenu, { 
                    selectedItem, 
                    selectedProblem: adminSelectedProblem,
                    isAdmin, 
                    onRefresh: () => {
                        loadData(false);
                        setAdminSelectedProblem(null);
                    }
                })
            );
        };

        const rootElement = document.getElementById('portal-root');
        const root = createRoot(rootElement);
        root.render(h(TreePortal));
    </script>
    
    <style>
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</body>
</html>