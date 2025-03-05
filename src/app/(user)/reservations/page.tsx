"use client";
import UserDesktopNavbar from "@/components/UserDesktopNavbar";
import UserMobileNavbar from "@/components/UserMobileNavbar";
import React, { useState, useEffect, useReducer, useCallback } from "react";
import { useRouter } from "next/navigation";
import DateTimePickerForm from "@/components/time-picker/date-time-picker-form";
import { format } from "date-fns";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface TableMapProps {
  selectedTable: number | string;
  onTableSelect: (table: number | string) => void;
}

const TableMap: React.FC<TableMapProps> = ({ selectedTable, onTableSelect }) => {
  return (
    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 w-full">
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] bg-gray-50 rounded-lg mb-4 p-2 md:p-4 overflow-hidden">
        {/* ห้อง VIP */}
        <div className="absolute top-2 md:top-4 left-2 md:left-4 w-[60px] sm:w-[80px] md:w-[80px] h-[110px] sm:h-[140px] md:h-[180px] rounded-3xl border-2 border-gray-300 flex items-center justify-center">
          <span className="text-xs sm:text-sm md:text-base text-gray-700 font-medium text-center">ห้อง VIP</span>
        </div>

        {/* ห้องครัว */}
        <div className="absolute top-[130px] sm:top-[160px] md:top-[200px] left-2 md:left-4 w-[60px] sm:w-[80px] md:w-[80px] h-[120px] sm:h-[140px] md:h-[180px] rounded-3xl border-2 border-gray-300 flex items-center justify-center">
          <span className="text-xs sm:text-sm md:text-base text-gray-700 font-medium text-center">ห้องครัว</span>
        </div>

        {/* ทางเข้า */}
        <div className="absolute bottom-2 md:bottom-4 left-[90px] sm:left-[120px] md:left-[150px] w-[80px] rounded-3xl border-2 border-gray-300 text-center">
          <span className="text-xs sm:text-sm md:text-base text-gray-700 font-medium">ทางเข้า</span>
        </div>

        {/* cashier */}
        <div className="absolute top-[180px] sm:top-[230px] md:top-[280px] left-[70px] sm:left-[100px] md:left-[100px] w-[30px] sm:w-[40px] md:w-[50px] h-[60px] sm:h-[80px] md:h-[100px] rounded-full border-2 border-gray-300 flex items-center justify-center">
          <span className="text-gray-700 text-[10px] sm:text-xs font-medium transform -rotate-90">แคชเชียร์</span>
        </div>

        {/* โต๊ะแถวบน */}
        <div className="absolute top-[12px] left-[100px] sm:left-[150px] md:left-[120px] flex space-x-4 sm:space-x-7 md:space-x-6">
          {[13, 14, 15, 16].map((table) => (
            <button
              key={table}
              onClick={() => onTableSelect(table)}
              className={`w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all text-xs sm:text-sm md:text-base
                ${selectedTable === table ? "bg-[#FFB8DA] text-white shadow-md transform scale-105" : "bg-gray-300 text-gray-700 hover:bg-gray-200"}`}
            >
              {table}
            </button>
          ))}
        </div>

        {/* โต๊ะแถวล่าง */}
        <div className="absolute top-[140px] sm:top-[170px] md:top-[200px] left-[130px] sm:left-[180px] md:left-[160px] grid grid-cols-4 sm:grid-cols-4 gap-x-2 gap-y-2 sm:gap-x-3 sm:gap-y-3 md:gap-x-3 md:gap-y-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((table) => (
            <button
              key={table}
              onClick={() => onTableSelect(table)}
              className={`w-8 h-8 sm:w-10 sm:h-10 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all text-xs sm:text-sm md:text-base
                ${selectedTable === table ? "bg-[#FFB8DA] text-white shadow-md transform scale-105" : "bg-gray-300 text-gray-700 hover:bg-gray-200"}`}
            >
              {table}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

type ReservationState = {
  name: string;
  phone: string;
  reservationDate: Date | null;
  peopleCount: number;
  selectedTable: string | number;
};

type ReservationAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_PHONE'; payload: string }
  | { type: 'SET_RESERVATION_DATE'; payload: Date }
  | { type: 'SET_PEOPLE_COUNT'; payload: number }
  | { type: 'SET_SELECTED_TABLE'; payload: string | number }
  | { type: 'RESET_FORM' };

const initialReservationState: ReservationState = {
  name: '',
  phone: '',
  reservationDate: null,
  peopleCount: 1,
  selectedTable: 1,
};

const reservationReducer = (state: ReservationState, action: ReservationAction): ReservationState => {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, name: action.payload };
    case 'SET_PHONE':
      return { ...state, phone: action.payload };
    case 'SET_RESERVATION_DATE':
      return { ...state, reservationDate: action.payload };
    case 'SET_PEOPLE_COUNT':
      return { ...state, peopleCount: action.payload };
    case 'SET_SELECTED_TABLE':
      return { ...state, selectedTable: action.payload };
    case 'RESET_FORM':
      return initialReservationState;
    default:
      return state;
  }
};

export default function ReservationDesktop() {
  const [state, dispatch] = useReducer(reservationReducer, initialReservationState);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in by trying to get user data from localStorage or cookies
    try {
      const userDataStr = localStorage.getItem('userData');
      const isLoggedIn = !!userDataStr; // Convert to boolean

      if (!isLoggedIn) {
        // If not logged in and not already on login page, redirect to login
        if (!toast.isActive("login-toast")) {
          toast.error("กรุณาเข้าสู่ระบบก่อนการจองโต๊ะ", { toastId: "login-toast" });
        }
        router.push("/login");
      } else {
        // If user is logged in, try to get their data
        try {
          const userData = JSON.parse(userDataStr);
          if (userData) {
            // Only set phone from user data, allow name to be entered by user
            dispatch({ type: 'SET_PHONE', payload: userData.phone || '' });
          }
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
        }
      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      // For development purposes, allow continuing without login
      // In production, you might want to redirect to login page
    }
  }, [router]);

  const handleSaveClick = async (data: { dateTime: Date }) => {
    if (!data.dateTime) {
      toast.error("กรุณาเลือกวันที่และเวลาจอง");
      return;
    }

    const date = data.dateTime;
    const formattedDate = format(date, "yyyy-MM-dd");
    const formattedTime = format(date, "HH:mm");

    // Get user data from localStorage
    let userId = 0;
    try {
      const userDataStr = localStorage.getItem('userData');
      if (userDataStr) {
        const userData = JSON.parse(userDataStr);
        userId = userData.id || 0;
      }
    } catch (error) {
      console.error('Error getting user ID:', error);
    }

    const updatedCustomer = {
      id: userId,
      name: state.name,
      phone: state.phone,
      date: formattedDate,
      time: formattedTime,
      peopleCount: state.peopleCount,
      table: Number(state.selectedTable)
    };


    console.log(updatedCustomer);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCustomer),
      });

      if (response.ok) {
        toast.success("จองโต๊ะเรียบร้อยแล้ว");
        // Pass reservation data to summary page
        const queryString = `?reservationData=${encodeURIComponent(JSON.stringify(updatedCustomer))}`;
        router.push(`/summary${queryString}`);
      } else {
        toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
      console.error("An error occurred:", error);
    }
  };

  const handleDecrease = useCallback(() => {
    dispatch({ type: 'SET_PEOPLE_COUNT', payload: Math.max(state.peopleCount - 1, 1) });
  }, [state.peopleCount]);

  const handleIncrease = useCallback(() => {
    dispatch({ type: 'SET_PEOPLE_COUNT', payload: Math.min(state.peopleCount + 1, 4) });
  }, [state.peopleCount]);

  const handleTableSelect = useCallback((table: number | string) => {
    dispatch({ type: 'SET_SELECTED_TABLE', payload: table });
  }, []);

  return (
    <>
      <div className="hidden lg:flex fixed top-0 left-0 right-0 z-10">
        <UserDesktopNavbar />
      </div>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-10">
        <UserMobileNavbar />
      </div>

      <div className="min-h-screen bg-gradient-to-b from-white to-pink-50 py-16 mt-10 pb-24 lg:pb-16 relative">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            จองโต๊ะล่วงหน้า
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* ฟอร์มข้อมูลการจอง */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-12 h-12 rounded-full bg-[#FFB8DA] flex items-center justify-center text-white font-bold">
                  1
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">ข้อมูลการจอง</h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="ReservationName" className="block text-sm font-medium text-gray-700 mb-1">
                      ชื่อสำหรับการจอง
                    </label>
                    <input
                      id="Name"
                      name="Name"
                      type="text"
                      value={state.name}
                      onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })}
                      className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#FFB8DA] focus:border-transparent transition"
                      placeholder="กรอกชื่อของคุณ"
                    />
                  </div>

                  <div>
                    <label htmlFor="ReservationPhone" className="block text-sm font-medium text-gray-700 mb-1">
                      เบอร์โทรศัพท์
                    </label>
                    <input
                      id="Phone"
                      name="Phone"
                      type="tel"
                      value={state.phone}
                      onChange={(e) => dispatch({ type: 'SET_PHONE', payload: e.target.value })}
                      className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#FFB8DA] focus:border-transparent transition"
                      placeholder="08X-XXX-XXXX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="PeopleCount" className="block text-sm font-medium text-gray-700 mb-3">
                    จำนวนคน
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      className="w-12 h-12 bg-[#FFB8DA] rounded-full flex items-center justify-center text-white transition hover:bg-pink-400"
                      onClick={handleDecrease}
                    >
                      <span className="text-xl font-bold">-</span>
                    </button>
                    <div className="w-20 text-center">
                      <span className="text-2xl font-semibold text-gray-800">{state.peopleCount}</span>
                      <span className="ml-2 text-gray-500">คน</span>
                    </div>
                    <button
                      type="button"
                      className="w-12 h-12 bg-[#FFB8DA] rounded-full flex items-center justify-center text-white transition hover:bg-pink-400"
                      onClick={handleIncrease}
                    >
                      <span className="text-xl font-bold">+</span>
                    </button>
                  </div>
                </div>

              </div>

              <hr className="my-8 border-gray-200" />

              <div className="bg-[#FFF5F9] p-4 rounded-lg mb-6">
                <h3 className="font-medium text-gray-700 mb-2">รายละเอียดการจอง</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">ชื่อผู้จอง:</div>
                  <div className="font-medium">{state.name}</div>
                  <div className="text-gray-500">เบอร์โทร:</div>
                  <div className="font-medium">{state.phone}</div>
                  <div className="text-gray-500">จำนวนคน:</div>
                  <div className="font-medium">{state.peopleCount} คน</div>
                  <div className="text-gray-500">โต๊ะ:</div>
                  <div className="font-medium">
                    {typeof state.selectedTable === 'string' ? state.selectedTable : `โต๊ะ ${state.selectedTable}`}
                  </div>
                </div>
              </div>

              <div className="mt-6 lg:block hidden">
                <button
                  onClick={() => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                  className="w-full py-4 bg-[#FFB8DA] hover:bg-pink-400 text-white rounded-lg font-medium text-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <span>ยืนยันการจอง</span>
                </button>
              </div>
            </div>

            {/* table */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-[#FFB8DA] flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-800">เลือกโต๊ะ</h2>
                </div>

                <TableMap selectedTable={state.selectedTable} onTableSelect={handleTableSelect} />
              </div>


            </div>
          </div>
        </div>

        {/* Mobile fixed bottom button */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg border-t border-gray-200 z-20">
          <button
            onClick={() => document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
            className="w-full py-4 bg-[#FFB8DA] hover:bg-pink-400 text-white rounded-lg font-medium text-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>ยืนยันการจอง</span>
          </button>
        </div>
      </div>
    </>
  );
}