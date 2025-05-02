import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { fetchNotificationSettings, updateNotificationSettings, } from '../../store/slices/notificationSlice';
const Container = styled.div `
  padding: 20px;
`;
const Title = styled.h2 `
  margin-bottom: 20px;
`;
const SettingItem = styled.div `
  margin-bottom: 15px;
`;
const Label = styled.label `
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;
const Checkbox = styled.input `
  margin-right: 10px;
`;
const Select = styled.select `
  margin-left: 10px;
  padding: 5px;
`;
const NotificationSettings = ({ scheduleId }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation('schedule');
    const { settings, loading, error } = useSelector((state) => state.notifications);
    useEffect(() => {
        dispatch(fetchNotificationSettings(scheduleId));
    }, [dispatch, scheduleId]);
    const handleSettingChange = async (setting) => {
        await dispatch(updateNotificationSettings(setting));
    };
    if (loading) {
        return _jsx("div", { children: t('notifications.loading') });
    }
    if (error) {
        return _jsx("div", { children: error });
    }
    const notificationTypes = ['email', 'browser'];
    const notificationTimes = ['5', '10', '15', '30', '60', '120', '1440'];
    return (_jsxs(Container, { children: [_jsx(Title, { children: t('notifications.title') }), notificationTypes.map(type => {
                const setting = settings.find(s => s.type === type) || {
                    id: '',
                    scheduleId,
                    type,
                    time: '10',
                    enabled: false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                return (_jsx(SettingItem, { children: _jsxs(Label, { children: [_jsx(Checkbox, { type: "checkbox", checked: setting.enabled, onChange: e => handleSettingChange({
                                    ...setting,
                                    enabled: e.target.checked,
                                }) }), t(`notifications.types.${type}`), setting.enabled && (_jsx(Select, { value: setting.time, onChange: e => handleSettingChange({
                                    ...setting,
                                    time: e.target.value,
                                }), children: notificationTimes.map(time => (_jsx("option", { value: time, children: t(`notifications.times.${time}`) }, time))) }))] }) }, type));
            })] }));
};
export default NotificationSettings;
