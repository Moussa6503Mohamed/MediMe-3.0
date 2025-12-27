"use client";

import {
  type ReactNode,
  createContext,
  useRef,
  useContext,
} from "react";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand";
import type { OrderDetails, Insurance } from "@/lib/types";
import { doctors } from "@/lib/data";

type Page =
  | "home"
  | "profile-view"
  | "create-account-view"
  | "calendar-view"
  | "daily-schedule-view"
  | "schedule-detail-view"
  | "family-list"
  | "add-member-form"
  | "invitation-detail-view"
  | "member-summary-view"
  | "doctor-bot"
  | "medication-manager-view"
  | "add-medication-form"
  | "refill-cart-view"
  | "select-pharmacy-view"
  | "refill-checkout-view"
  | "refill-confirmation-view"
  | "schedule-doctor-view"
  | "doctor-details-view"
  | "appointment-checkout-view"
  | "appointment-confirmation-view"
  | "select-location-view"
  | "search-results-view"
  | "reports-list-view"
  | "report-detail-view"
  | "notifications-view"
  | "chat-summary-view"
  | "add-appointment-form"
  | "login-view";

interface AppState {
  currentPage: Page;
  pageHistory: Page[];
  language: "en" | "ar";
  isVoiceAssistantActive: boolean;
  activeMemberId: string | null;
  viewingMemberId: string | null;
  activeDoctorId: string | null;
  activeScheduleItemId: string | null;
  activeReportId: string | null;
  selectedDay: number;
  isLoggedIn: boolean;
  currentUser: any;
  refillCart: string[];
  selectedPharmacyId: string | null;
  lastOrder: OrderDetails | null;
  selectedSpecialty: string;
  selectedDate: string;
  selectedAppointmentTime: string | null;
  selectedCountry: 'Egypt' | 'USA';
  selectedCity: string;
  selectedArea: string;
  savedInsurance: Insurance | null;
  useSavedInsurance: boolean;
  chatHistory: { role: 'user' | 'model'; text: string; includeButton?: boolean }[];
  isBotLoading: boolean;
}

interface PageNavigationOptions {
    activeMemberId?: string | null;
    viewingMemberId?: string | null;
    activeDoctorId?: string | null;
    activeScheduleItemId?: string | null;
    activeReportId?: string | null;
    selectedDay?: number;
}

interface AppActions {
  navigate: (page: Page, options?: PageNavigationOptions) => void;
  back: () => void;
  setLanguage: (language: "en" | "ar") => void;
  toggleVoiceAssistant: () => void;
  startVoiceAssistant: () => void;
  stopVoiceAssistant: () => void;
  setActiveMemberId: (id: string | null) => void;
  setViewingMemberId: (id: string | null) => void;
  setActiveDoctorId: (id: string | null) => void;
  setActiveScheduleItemId: (id: string | null) => void;
  setActiveReportId: (id: string | null) => void;
  setSelectedDay: (day: number) => void;
  login: (user: any) => void;
  logout: () => void;
  setRefillCart: (cart: string[]) => void;
  setSelectedPharmacyId: (id: string | null) => void;
  setLastOrder: (order: OrderDetails | null) => void;
  setSelectedSpecialty: (specialty: string) => void;
  setSelectedDate: (date: string) => void;
  setSelectedAppointmentTime: (time: string | null) => void;
  setSelectedCountry: (country: 'Egypt' | 'USA') => void;
  setSelectedCity: (city: string) => void;
  setSelectedArea: (area: string) => void;
  setSavedInsurance: (insurance: Insurance | null) => void;
  setUseSavedInsurance: (use: boolean) => void;
  setChatHistory: (history: { role: 'user' | 'model'; text: string }[]) => void;
  setIsBotLoading: (loading: boolean) => void;
  setActiveScheduleItemStatus: (id: string, isCompleted: boolean) => void;
}

export type AppStore = AppState & AppActions;

export const createAppStore = (
  initialState: Partial<AppState> = {}
): StoreApi<AppStore> => {
  return createStore<AppStore>((set, get) => ({
    currentPage: "home",
    pageHistory: ["home"],
    language: "en",
    isVoiceAssistantActive: false,
    activeMemberId: "aa-001",
    viewingMemberId: "aa-001",
    activeDoctorId: doctors[0].id,
    activeScheduleItemId: null,
    activeReportId: null,
    selectedDay: new Date().getDate(),
    isLoggedIn: false,
    currentUser: null,
    refillCart: [],
    selectedPharmacyId: null,
    lastOrder: null,
    selectedSpecialty: 'General Practitioner',
    selectedDate: new Date().toISOString().split('T')[0],
    selectedAppointmentTime: null,
    selectedCountry: 'Egypt',
    selectedCity: 'Alexandria',
    selectedArea: 'Any Area',
    savedInsurance: { provider: 'Blue Cross Blue Shield', memberId: 'ABC12345678' },
    useSavedInsurance: true,
    chatHistory: [],
    isBotLoading: false,
    ...initialState,

    navigate: (page, options) => set(state => {
        const newHistory = [...state.pageHistory, page];
        return { currentPage: page, pageHistory: newHistory, ...options };
    }),
    back: () => set(state => {
        const history = state.pageHistory;
        if (history.length > 1) {
            const newHistory = history.slice(0, -1);
            return { currentPage: newHistory[newHistory.length - 1], pageHistory: newHistory };
        }
        return {}; // No change if no history
    }),
    setLanguage: (language) => set({ language }),
    toggleVoiceAssistant: () =>
      set((state) => ({
        isVoiceAssistantActive: !state.isVoiceAssistantActive,
      })),
    startVoiceAssistant: () => set({ isVoiceAssistantActive: true }),
    stopVoiceAssistant: () => set({ isVoiceAssistantActive: false }),
    setActiveMemberId: (id) => set({ activeMemberId: id }),
    setViewingMemberId: (id) => set({ viewingMemberId: id }),
    setActiveDoctorId: (id) => set({ activeDoctorId: id }),
    setActiveScheduleItemId: (id) => set({ activeScheduleItemId: id }),
    setActiveReportId: (id) => set({ activeReportId: id }),
    setSelectedDay: (day) => set({ selectedDay: day }),
    login: (user) => set({ isLoggedIn: true, currentUser: user, currentPage: 'home', pageHistory: ['home'] }),
    logout: () => set({ isLoggedIn: false, currentUser: null, currentPage: 'login-view', pageHistory: ['login-view'] }),
    setRefillCart: (cart) => set({ refillCart: cart }),
    setSelectedPharmacyId: (id) => set({ selectedPharmacyId: id }),
    setLastOrder: (order) => set({ lastOrder: order }),
    setSelectedSpecialty: (specialty) => set({ selectedSpecialty: specialty }),
    setSelectedDate: (date) => set({ selectedDate: date }),
    setSelectedAppointmentTime: (time) => set({ selectedAppointmentTime: time }),
    setSelectedCountry: (country) => set({ selectedCountry: country }),
    setSelectedCity: (city) => set({ selectedCity: city }),
    setSelectedArea: (area) => set({ selectedArea: area }),
    setSavedInsurance: (insurance) => set({ savedInsurance: insurance }),
    setUseSavedInsurance: (use) => set({ useSavedInsurance: use }),
    setChatHistory: (history) => set({ chatHistory: history }),
    setIsBotLoading: (loading) => set({ isBotLoading: loading }),
    setActiveScheduleItemStatus: (id, isCompleted) => {
        // This is a mock update. In a real app, you would update the data source.
        console.log(`Setting status for item ${id} to ${isCompleted}`);
    },
  }));
};

export const AppStoreContext = createContext<StoreApi<AppStore> | null>(null);

export const AppStoreProvider = ({ children }: { children: ReactNode }) => {
  const storeRef = useRef<StoreApi<AppStore>>();
  if (!storeRef.current) {
    storeRef.current = createAppStore();
  }

  return (
    <AppStoreContext.Provider value={storeRef.current}>
      {children}
    </AppStoreContext.Provider>
  );
};

export const useAppStore = <T,>(selector: (store: AppStore) => T): T => {
  const store = useContext(AppStoreContext);
  if (!store) {
    throw new Error("useAppStore must be used within an AppStoreProvider.");
  }
  return useStore(store, selector);
};
