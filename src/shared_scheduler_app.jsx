import React, { useState } from "react";

const users = ["나", "친구A", "친구B"];
const daysKor = ["일", "월", "화", "수", "목", "금", "토"];

const getInitialMonth = () => {
  const daysInMonth = new Date(2025, 6, 0).getDate();
  const firstDay = new Date(2025, 5, 1).getDay();
  const totalCells = firstDay + daysInMonth;
  const fullWeeks = Math.ceil(totalCells / 7) * 7;

  const days = [];

  for (let i = 0; i < fullWeeks; i++) {
    if (i < firstDay || i >= firstDay + daysInMonth) {
      days.push(null);
    } else {
      days.push({ date: i - firstDay + 1, schedule: [] });
    }
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
};

export default function SchedulerApp() {
  const [monthSchedule, setMonthSchedule] = useState(getInitialMonth());
  const [selectedDay, setSelectedDay] = useState(null);
  const [newEvent, setNewEvent] = useState({ user: "나", title: "", time: "", note: "", isPrivate: false });
  const [selectedUser, setSelectedUser] = useState("모두 보기");

  const openModal = (day) => {
    if (!day) return;
    setSelectedDay(day.date);
    setNewEvent({ user: "나", title: "", time: "", note: "", isPrivate: false });
  };

  const handleInputChange = (field, value) => {
    setNewEvent({ ...newEvent, [field]: value });
  };

  const saveSchedule = () => {
    const newSchedule = [...monthSchedule];
    for (const week of newSchedule) {
      for (const day of week) {
        if (day && day.date === selectedDay) {
          day.schedule.push(newEvent);
        }
      }
    }
    setMonthSchedule(newSchedule);
    setSelectedDay(null);
  };

  const shareLink = () => {
    alert("공유 링크: https://my-schedule-app.com/june-2025");
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📅 2025년 6월 스케줄러</h1>

      <div className="mb-4">
        <label className="mr-2 font-semibold">사용자 보기:</label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="border p-1"
        >
          <option>모두 보기</option>
          {users.map((user, idx) => (
            <option key={idx} value={user}>{user}</option>
          ))}
        </select>
      </div>

      {/* 격자형 달력 */}
      <div className="overflow-x-auto">
        <div className="min-w-full"> {/* ✅ 고정 너비 기준 통일 */}

          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 text-center font-bold">
            {daysKor.map((day, idx) => (
              <div key={idx} className="border p-2 bg-gray-100">{day}</div>
            ))}
          </div>

          {/* 날짜 줄 */}
          {monthSchedule.map((week, wIdx) => (
            <div key={wIdx} className="grid grid-cols-7">
              {week.map((day, dIdx) => (
                <div
                  key={dIdx}
                  className={`border aspect-square p-2 text-sm align-top ${
                    day ? "cursor-pointer hover:bg-blue-50" : "bg-gray-50"
                  }`}
                  onClick={() => openModal(day)}
                >
                  {day && (
                    <>
                      <div className="font-bold text-xs mb-1">{day.date}</div>
                      {/* 일정 목록 */}
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>


      {/* 일정 추가 모달 */}
      {selectedDay && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded shadow-md w-80">
            <h2 className="text-lg font-semibold mb-2">{selectedDay}일 일정 추가</h2>
            <select
              value={newEvent.user}
              onChange={(e) => handleInputChange("user", e.target.value)}
              className="border p-1 w-full mb-2"
            >
              {users.map((user, idx) => (
                <option key={idx} value={user}>{user}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="제목"
              value={newEvent.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="border p-1 w-full mb-2"
            />
            <input
              type="time"
              value={newEvent.time}
              onChange={(e) => handleInputChange("time", e.target.value)}
              className="border p-1 w-full mb-2"
            />
            <textarea
              placeholder="특이사항"
              value={newEvent.note}
              onChange={(e) => handleInputChange("note", e.target.value)}
              className="border p-1 w-full mb-2"
            />
            <label className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={newEvent.isPrivate}
                onChange={(e) => handleInputChange("isPrivate", e.target.checked)}
                className="mr-2"
              />
              비공개 일정
            </label>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setSelectedDay(null)} className="px-2 py-1 border rounded">
                취소
              </button>
              <button onClick={saveSchedule} className="px-2 py-1 bg-blue-500 text-white rounded">
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={shareLink}
          className="px-4 py-2 bg-green-500 text-white rounded shadow"
        >
          📤 6월 전체 스케줄 공유
        </button>
      </div>
    </div>
  );
}
