import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
const Unauthorized = () => {
    const navigate = useNavigate();
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-100", children: _jsxs("div", { className: "bg-white p-8 rounded-lg shadow-md text-center", children: [_jsx("h1", { className: "text-2xl font-bold text-red-600 mb-4", children: "Unauthorized Access" }), _jsx("p", { className: "text-gray-600 mb-6", children: "You do not have permission to access this page." }), _jsx("button", { onClick: () => navigate(-1), className: "bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors", children: "Go Back" })] }) }));
};
export default Unauthorized;
