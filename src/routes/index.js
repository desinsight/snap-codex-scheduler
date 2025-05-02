import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Calendar from '../components/calendar/CalendarView';
import Notification from '../components/notification/Notification';
import Schedule from '../components/schedule/Schedule';
// Placeholder pages
const Analytics = () => _jsx("div", { children: "Analytics Page" });
const Settings = () => _jsx("div", { children: "Settings Page" });
const Profile = () => _jsx("div", { children: "Profile Page" });
const AppRoutes = () => {
    return (_jsx(Routes, { children: _jsxs(Route, { element: _jsx(MainLayout, {}), children: [_jsx(Route, { path: "/", element: _jsx(Calendar, {}) }), _jsx(Route, { path: "/calendar", element: _jsx(Calendar, {}) }), _jsx(Route, { path: "/schedule", element: _jsx(Schedule, {}) }), _jsx(Route, { path: "/notifications", element: _jsx(Notification, {}) }), _jsx(Route, { path: "/analytics", element: _jsx(Analytics, {}) }), _jsx(Route, { path: "/settings", element: _jsx(Settings, {}) }), _jsx(Route, { path: "/profile", element: _jsx(Profile, {}) })] }) }));
};
export default AppRoutes;
