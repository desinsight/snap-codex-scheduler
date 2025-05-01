import React from 'react';
import { CheckCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            대시보드
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {new Date().toLocaleDateString('ko-KR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            })}
          </p>
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">오늘의 과제</h3>
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between space-x-4 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
                  <CheckCircleIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">보정 디자인보고</p>
                  <p className="text-sm text-gray-500">ID_2301_동인천중</p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-primary-100 px-3 py-0.5 text-sm font-medium text-primary-800">
                진행중
              </span>
            </div>

            <div className="flex items-center justify-between space-x-4 rounded-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                  <ClockIcon className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">방어진조명계획</p>
                  <p className="text-sm text-gray-500">ID_2301_동인천중</p>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-sm font-medium text-gray-800">
                예정
              </span>
            </div>
          </div>

          <button className="mt-6 w-full rounded-lg border border-dashed border-gray-300 px-4 py-3 text-center text-sm font-medium text-gray-600 hover:border-gray-400 hover:bg-gray-50">
            + 과제 추가하기
          </button>
        </div>
      </div>

      {/* Project Status and Weekly Calendar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Weekly Calendar */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">주간 일정</h3>
            <div className="mt-6 h-48 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
              주간 캘린더가 이곳에 표시됩니다
            </div>
            <button className="mt-6 w-full rounded-lg bg-primary-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-primary-700">
              전체 일정 보기
            </button>
          </div>
        </div>

        {/* Project Status */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">프로젝트 현황</h3>
            <div className="mt-6 space-y-6">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">ID_2301_동인천중</span>
                  <span className="text-sm font-medium text-primary-600">65%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-primary-600" style={{ width: '65%' }} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">ID_2302_복사초</span>
                  <span className="text-sm font-medium text-primary-600">40%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-gray-200">
                  <div className="h-2 rounded-full bg-primary-600" style={{ width: '40%' }} />
                </div>
              </div>
            </div>
            <button className="mt-6 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-600 hover:bg-gray-50">
              모든 프로젝트 보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
