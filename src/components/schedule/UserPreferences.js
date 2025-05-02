import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { fetchUserPreferences, updateUserPreferences, submitFeedback, } from '../../store/slices/userPreferencesSlice';
const Container = styled.div `
  padding: 20px;
`;
const Title = styled.h2 `
  margin-bottom: 20px;
`;
const Form = styled.form `
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;
const FormGroup = styled.div `
  margin-bottom: 15px;
`;
const Label = styled.label `
  display: block;
  margin-bottom: 5px;
`;
const Input = styled.input `
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;
const Select = styled.select `
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;
const Checkbox = styled.input `
  margin-right: 10px;
`;
const Button = styled.button `
  background: #2196f3;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
`;
const FeedbackForm = styled.div `
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ddd;
`;
const SatisfactionScore = styled.div `
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
`;
const Star = styled.span `
  color: ${props => (props.active ? '#FFD700' : '#ddd')};
  cursor: pointer;
  font-size: 24px;
`;
const UserPreferences = () => {
    const { t } = useTranslation('schedule');
    const dispatch = useDispatch();
    const { preferences, loading, error } = useSelector((state) => state.userPreferences);
    const [currentUser, setCurrentUser] = useState(null);
    const [satisfactionScore, setSatisfactionScore] = useState(0);
    const [feedbackText, setFeedbackText] = useState('');
    useEffect(() => {
        dispatch(fetchUserPreferences());
    }, [dispatch]);
    useEffect(() => {
        if (preferences.length > 0) {
            setCurrentUser(preferences[0]);
        }
    }, [preferences]);
    const handleInputChange = (e) => {
        if (!currentUser)
            return;
        const { name, value, type } = e.target;
        setCurrentUser(prev => {
            if (!prev)
                return null;
            if (type === 'checkbox') {
                return {
                    ...prev,
                    [name]: e.target.checked,
                };
            }
            if (name.includes('.')) {
                const [parent, child] = name.split('.');
                return {
                    ...prev,
                    [parent]: {
                        ...prev[parent],
                        [child]: type === 'number' ? Number(value) : value,
                    },
                };
            }
            return {
                ...prev,
                [name]: type === 'number' ? Number(value) : value,
            };
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentUser) {
            dispatch(updateUserPreferences(currentUser));
        }
    };
    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        if (currentUser) {
            dispatch(submitFeedback({
                userId: currentUser.userId,
                satisfactionScore,
                feedbackText,
            }));
            setSatisfactionScore(0);
            setFeedbackText('');
        }
    };
    if (loading) {
        return _jsx("div", { children: t('common.loading') });
    }
    if (error) {
        return _jsx("div", { children: error });
    }
    if (!currentUser) {
        return null;
    }
    return (_jsxs(Container, { children: [_jsx(Title, { children: t('notifications.preferences.title') }), _jsxs(Form, { onSubmit: handleSubmit, children: [_jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.preferences.preferredChannels') }), Object.values(NotificationChannel).map(channel => (_jsxs("div", { children: [_jsx(Checkbox, { type: "checkbox", name: "preferredChannels", value: channel, checked: currentUser.preferredChannels.includes(channel), onChange: e => {
                                            const newChannels = e.target.checked
                                                ? [...currentUser.preferredChannels, channel]
                                                : currentUser.preferredChannels.filter(c => c !== channel);
                                            setCurrentUser(prev => prev ? { ...prev, preferredChannels: newChannels } : null);
                                        } }), t(`notifications.channels.${channel}`)] }, channel)))] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.preferences.notificationTimes') }), _jsxs("div", { style: { display: 'flex', gap: '10px' }, children: [_jsx(Input, { type: "number", name: "notificationTimes.start", value: currentUser.notificationTimes.start, onChange: handleInputChange, min: "0", max: "23" }), _jsx(Input, { type: "number", name: "notificationTimes.end", value: currentUser.notificationTimes.end, onChange: handleInputChange, min: "0", max: "23" })] })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.preferences.maxDailyNotifications') }), _jsx(Input, { type: "number", name: "maxDailyNotifications", value: currentUser.maxDailyNotifications, onChange: handleInputChange, min: "1" })] }), _jsxs(FormGroup, { children: [_jsxs(Label, { children: [_jsx(Checkbox, { type: "checkbox", name: "doNotDisturb.enabled", checked: currentUser.doNotDisturb.enabled, onChange: handleInputChange }), t('notifications.preferences.doNotDisturb')] }), currentUser.doNotDisturb.enabled && (_jsxs("div", { style: { display: 'flex', gap: '10px', marginTop: '10px' }, children: [_jsx(Input, { type: "number", name: "doNotDisturb.start", value: currentUser.doNotDisturb.start, onChange: handleInputChange, min: "0", max: "23" }), _jsx(Input, { type: "number", name: "doNotDisturb.end", value: currentUser.doNotDisturb.end, onChange: handleInputChange, min: "0", max: "23" })] }))] }), _jsx(Button, { type: "submit", children: t('common.save') })] }), _jsxs(FeedbackForm, { children: [_jsx("h3", { children: t('notifications.preferences.feedback') }), _jsxs("form", { onSubmit: handleFeedbackSubmit, children: [_jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.preferences.satisfactionScore') }), _jsx(SatisfactionScore, { children: [1, 2, 3, 4, 5].map(score => (_jsx(Star, { active: score <= satisfactionScore, onClick: () => setSatisfactionScore(score), children: "\u2605" }, score))) })] }), _jsxs(FormGroup, { children: [_jsx(Label, { children: t('notifications.preferences.feedbackText') }), _jsx(Input, { type: "text", value: feedbackText, onChange: e => setFeedbackText(e.target.value), placeholder: t('notifications.preferences.feedbackPlaceholder') })] }), _jsx(Button, { type: "submit", children: t('notifications.preferences.submitFeedback') })] })] })] }));
};
export default UserPreferences;
