import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { exportSchedules, importSchedules } from '../../store/slices/scheduleSlice';
const Container = styled.div `
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
`;
const Title = styled.h2 `
  margin-bottom: 20px;
`;
const Section = styled.section `
  margin-bottom: 30px;
`;
const ButtonGroup = styled.div `
  display: flex;
  gap: 10px;
`;
const Button = styled.button `
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
const ExportButton = styled(Button) `
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;
const ImportButton = styled(Button) `
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.secondaryDark};
  }
`;
const FileInput = styled.input `
  display: none;
`;
const ErrorMessage = styled.div `
  color: ${({ theme }) => theme.colors.error};
  font-size: 14px;
  margin-top: 10px;
`;
const SuccessMessage = styled.div `
  color: ${({ theme }) => theme.colors.success};
  font-size: 14px;
  margin-top: 10px;
`;
const ScheduleImportExport = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation('schedule');
    const { loading, error } = useSelector((state) => state.schedules);
    const [success, setSuccess] = useState(null);
    const fileInputRef = useRef(null);
    const handleExport = async () => {
        await dispatch(exportSchedules());
        if (!error) {
            setSuccess('export');
        }
    };
    const handleImport = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            await dispatch(importSchedules(file));
            if (!error) {
                setSuccess('import');
            }
        }
    };
    const handleImportClick = () => {
        fileInputRef.current?.click();
    };
    return (_jsxs(Container, { children: [_jsx(Title, { children: t('title') }), _jsxs(Section, { children: [_jsx("h3", { children: t('actions.export') }), _jsx(ButtonGroup, { children: _jsx(ExportButton, { onClick: handleExport, disabled: loading, children: loading ? t('common.exporting') : t('actions.export') }) }), success === 'export' && _jsx(SuccessMessage, { children: t('export.success') })] }), _jsxs(Section, { children: [_jsx("h3", { children: t('actions.import') }), _jsx(ButtonGroup, { children: _jsx(ImportButton, { onClick: handleImportClick, disabled: loading, children: loading ? t('common.importing') : t('actions.import') }) }), _jsx(FileInput, { type: "file", ref: fileInputRef, onChange: handleImport, accept: ".json" }), success === 'import' && _jsx(SuccessMessage, { children: t('import.success') })] }), error && _jsx(ErrorMessage, { children: error })] }));
};
export default ScheduleImportExport;
