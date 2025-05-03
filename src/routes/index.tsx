import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Calendar from '../components/calendar/CalendarView';
import Notification from '../components/notification/Notification';
import Schedule from '../components/schedule/Schedule';
import TestPage from '../components/TestPage';

// Placeholder pages
const Analytics = () => <div>Analytics Page</div>;
const Settings = () => <div>Settings Page</div>;
const Profile = () => <div>Profile Page</div>;

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Calendar />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/notifications" element={<Notification />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/test" element={<TestPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
