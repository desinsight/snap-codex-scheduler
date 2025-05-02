import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import styled from 'styled-components';
import Navigation from '../navigation/Navigation';
const MainContent = styled.main `
  padding-top: 64px;
  min-height: calc(100vh - 64px);
  background-color: ${({ theme }) => theme.colors.background};
`;
const MainLayout = ({ children }) => {
    return (_jsxs(_Fragment, { children: [_jsx(Navigation, {}), _jsx(MainContent, { children: children })] }));
};
export default MainLayout;
