import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import Navigation from './components/navigation/Navigation';
import Calendar from './components/calendar/CalendarView';
import Notification from './components/notification/Notification';
import Schedule from './components/schedule/Schedule';

// Placeholder pages
const Analytics = () => <div>Analytics Page</div>;
const Settings = () => <div>Settings Page</div>;
const Profile = () => <div>Profile Page</div>;

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Navigation />
        <main style={{ paddingTop: '64px' }}>
          <Routes>
            <Route path="/" element={<Calendar />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/notifications" element={<Notification />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
};

export default App;
