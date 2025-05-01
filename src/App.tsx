import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { I18nextProvider } from 'react-i18next';
import store from './store';
import i18n from './i18n';
import theme from './styles/theme';
import GlobalStyle from './styles/GlobalStyle';
import ScheduleList from './components/schedule/ScheduleList';
import ScheduleDetail from './components/schedule/ScheduleDetail';
import ScheduleForm from './components/schedule/ScheduleForm';
import ScheduleShare from './components/schedule/ScheduleShare';
import ScheduleImportExport from './components/schedule/ScheduleImportExport';
import ScheduleCalendar from './components/schedule/ScheduleCalendar';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Router>
            <Routes>
              <Route path="/" element={<ScheduleList />} />
              <Route path="/schedules" element={<ScheduleList />} />
              <Route path="/schedules/new" element={<ScheduleForm />} />
              <Route path="/schedules/:id" element={<ScheduleDetail />} />
              <Route path="/schedules/:id/edit" element={<ScheduleForm />} />
              <Route path="/schedules/:id/share" element={<ScheduleShare />} />
              <Route path="/schedules/import-export" element={<ScheduleImportExport />} />
              <Route path="/schedules/calendar" element={<ScheduleCalendar />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </I18nextProvider>
    </Provider>
  );
};

export default App;
