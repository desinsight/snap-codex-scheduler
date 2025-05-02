import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useAuth } from '../hooks/useAuth';
const Dashboard = () => {
    const { user, logout } = useAuth();
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx("nav", { className: "bg-white shadow-sm", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between h-16", children: [_jsx("div", { className: "flex items-center", children: _jsx("h1", { className: "text-xl font-semibold", children: "Dashboard" }) }), _jsxs("div", { className: "flex items-center", children: [_jsxs("span", { className: "mr-4", children: ["Welcome, ", user?.name] }), _jsx("button", { onClick: logout, className: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors", children: "Logout" })] })] }) }) }), _jsx("main", { className: "max-w-7xl mx-auto py-6 sm:px-6 lg:px-8", children: _jsx("div", { className: "px-4 py-6 sm:px-0", children: _jsx("div", { className: "border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center", children: _jsx("p", { className: "text-gray-500", children: "Dashboard content goes here" }) }) }) })] }));
};
export default Dashboard;
