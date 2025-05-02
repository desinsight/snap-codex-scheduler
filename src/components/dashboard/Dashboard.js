import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { DashboardService } from '../../services/DashboardService';
import Widget from './Widget';
import WidgetEditor from './WidgetEditor';
import ThemeEditor from './ThemeEditor';
import { GridLayout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
const Container = styled.div `
  padding: 20px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background};
`;
const Header = styled.div `
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
const Title = styled.h1 `
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
`;
const ButtonGroup = styled.div `
  display: flex;
  gap: 10px;
`;
const Button = styled.button `
  padding: 8px 16px;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme, variant }) => variant === 'secondary' ? theme.colors.secondary : theme.colors.primary};
  color: white;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;
const Dashboard = () => {
    const { t } = useTranslation();
    const [layouts, setLayouts] = useState([]);
    const [currentLayout, setCurrentLayout] = useState(null);
    const [isWidgetEditorOpen, setWidgetEditorOpen] = useState(false);
    const [isThemeEditorOpen, setThemeEditorOpen] = useState(false);
    const [editingWidget, setEditingWidget] = useState(null);
    const dashboardService = DashboardService.getInstance();
    useEffect(() => {
        loadLayouts();
    }, []);
    const loadLayouts = async () => {
        try {
            const userLayouts = await dashboardService.getUserLayouts();
            setLayouts(userLayouts);
            if (userLayouts.length > 0) {
                setCurrentLayout(userLayouts[0]);
            }
        }
        catch (error) {
            console.error('Failed to load layouts:', error);
        }
    };
    const handleLayoutChange = async (layout) => {
        if (!currentLayout)
            return;
        const updatedWidgets = currentLayout.widgets.map((widget, i) => ({
            ...widget,
            x: layout[i].x,
            y: layout[i].y,
            width: layout[i].w,
            height: layout[i].h
        }));
        try {
            await dashboardService.saveLayout({
                ...currentLayout,
                widgets: updatedWidgets
            });
        }
        catch (error) {
            console.error('Failed to save layout:', error);
        }
    };
    const handleAddWidget = () => {
        setEditingWidget(null);
        setWidgetEditorOpen(true);
    };
    const handleEditWidget = (widget) => {
        setEditingWidget(widget);
        setWidgetEditorOpen(true);
    };
    const handleDeleteWidget = async (widgetId) => {
        try {
            await dashboardService.deleteWidget(widgetId);
            if (currentLayout) {
                setCurrentLayout({
                    ...currentLayout,
                    widgets: currentLayout.widgets.filter(w => w.id !== widgetId)
                });
            }
        }
        catch (error) {
            console.error('Failed to delete widget:', error);
        }
    };
    const handleSaveWidget = async (widget) => {
        try {
            if (editingWidget) {
                const updated = await dashboardService.updateWidget(editingWidget.id, widget);
                if (currentLayout) {
                    setCurrentLayout({
                        ...currentLayout,
                        widgets: currentLayout.widgets.map(w => w.id === updated.id ? updated : w)
                    });
                }
            }
            else {
                const created = await dashboardService.addWidget(widget);
                if (currentLayout) {
                    setCurrentLayout({
                        ...currentLayout,
                        widgets: [...currentLayout.widgets, created]
                    });
                }
            }
            setWidgetEditorOpen(false);
        }
        catch (error) {
            console.error('Failed to save widget:', error);
        }
    };
    const handleSaveTheme = async (theme) => {
        try {
            await dashboardService.saveTheme(theme);
            if (currentLayout) {
                setCurrentLayout({
                    ...currentLayout,
                    theme
                });
            }
            setThemeEditorOpen(false);
        }
        catch (error) {
            console.error('Failed to save theme:', error);
        }
    };
    return (_jsxs(Container, { children: [_jsxs(Header, { children: [_jsx(Title, { children: currentLayout?.name || t('dashboard.untitled') }), _jsxs(ButtonGroup, { children: [_jsx(Button, { onClick: handleAddWidget, children: t('dashboard.addWidget') }), _jsx(Button, { variant: "secondary", onClick: () => setThemeEditorOpen(true), children: t('dashboard.customizeTheme') })] })] }), _jsx(GridLayout, { className: "layout", layout: currentLayout?.widgets.map(widget => ({
                    i: widget.id,
                    x: widget.x,
                    y: widget.y,
                    w: widget.width,
                    h: widget.height
                })) || [], cols: 12, rowHeight: 30, width: 1200, onLayoutChange: handleLayoutChange, draggableHandle: ".widget-header", children: currentLayout?.widgets.map(widget => (_jsx("div", { children: _jsx(Widget, { widget: widget, onEdit: () => handleEditWidget(widget), onDelete: () => handleDeleteWidget(widget.id) }) }, widget.id))) }), isWidgetEditorOpen && (_jsx(WidgetEditor, { widget: editingWidget, onSave: handleSaveWidget, onClose: () => setWidgetEditorOpen(false) })), isThemeEditorOpen && (_jsx(ThemeEditor, { theme: currentLayout?.theme, onSave: handleSaveTheme, onClose: () => setThemeEditorOpen(false) }))] }));
};
export default Dashboard;
