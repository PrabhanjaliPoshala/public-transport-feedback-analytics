import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { importFeedbackCSV } from '../services/csvImporter';
import type {
  AnalyticsOverview,
  Feedback,
  FilterState,
  ImportSummary,
  OperationalInsight,
  Route,
  RoutePerformance,
} from '../types';

const defaultFilters: FilterState = {
  dateRange: '30d',
  routeId: 'all',
  category: 'all',
  severity: 'all',
  timePeriod: 'all',
  searchQuery: '',
  status: 'all',
};

interface AppContextType {
  routes: Route[];
  feedbackList: Feedback[];
  filters: FilterState;
  setFilters: (newFilters: Partial<FilterState>) => void;
  resetFilters: () => void;
  overview: AnalyticsOverview | null;
  routeRankings: RoutePerformance[];
  insights: OperationalInsight[];
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  selectedRouteId: string | null;
  setSelectedRouteId: (id: string | null) => void;
  submitFeedback: (input: Omit<Feedback, 'id' | 'created_at' | 'status'>) => Promise<Feedback>;
  updateFeedbackStatus: (id: string, status: 'New' | 'Under Review' | 'Resolved') => Promise<void>;
  importCSVData: (csvContent: string) => ImportSummary;
  resetToDemoData: () => void;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [routeRankings, setRouteRankings] = useState<RoutePerformance[]>([]);
  const [insights, setInsights] = useState<OperationalInsight[]>([]);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const setFilters = (newFilters: Partial<FilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState(defaultFilters);
  };

  const refreshData = async () => {
    setLoading(true);
    try {
      const [fetchedRoutes, fetchedFeedback, fetchedOverview, fetchedRankings, fetchedInsights] = await Promise.all([
        apiService.getRoutes(),
        apiService.getFeedback(filters),
        apiService.getAnalyticsOverview(filters),
        apiService.getRouteRankings(filters),
        apiService.getOperationalInsights(),
      ]);

      setRoutes(fetchedRoutes);
      setFeedbackList(fetchedFeedback);
      setOverview(fetchedOverview);
      setRouteRankings(fetchedRankings);
      setInsights(fetchedInsights);
    } catch (e) {
      console.error('Failed to load application data', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [filters]);

  const submitFeedbackHandler = async (input: Omit<Feedback, 'id' | 'created_at' | 'status'>) => {
    const created = await apiService.submitFeedback(input);
    await refreshData();
    return created;
  };

  const updateFeedbackStatusHandler = async (id: string, status: 'New' | 'Under Review' | 'Resolved') => {
    await apiService.updateFeedbackStatus(id, status);
    await refreshData();
  };

  const importCSVDataHandler = (csvContent: string): ImportSummary => {
    const { importedFeedback, summary } = importFeedbackCSV(csvContent);
    apiService.importBulkFeedback(importedFeedback);
    refreshData();
    return summary;
  };

  const resetToDemoDataHandler = () => {
    apiService.resetDataStore();
    refreshData();
  };

  return (
    <AppContext.Provider
      value={{
        routes,
        feedbackList,
        filters,
        setFilters,
        resetFilters,
        overview,
        routeRankings,
        insights,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        selectedRouteId,
        setSelectedRouteId,
        submitFeedback: submitFeedbackHandler,
        updateFeedbackStatus: updateFeedbackStatusHandler,
        importCSVData: importCSVDataHandler,
        resetToDemoData: resetToDemoDataHandler,
        loading,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
