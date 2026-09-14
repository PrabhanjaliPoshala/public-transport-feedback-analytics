import {
  AnalyticsOverview,
  ClassificationResult,
  Feedback,
  FilterState,
  OperationalInsight,
  Route,
  RouteDetailAnalytics,
  RoutePerformance,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiClient {
  private token: string | null = null;

  public setToken(token: string) {
    this.token = token;
  }

  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    return headers;
  }

  public async getRoutes(): Promise<Route[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/routes`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend API offline, utilizing dynamic frontend data store');
    }
    return [];
  }

  public async submitFeedback(feedback: any): Promise<Feedback> {
    try {
      const res = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(feedback),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend API offline, utilizing dynamic frontend data store');
    }
    throw new Error('API submission failed');
  }

  public async getFeedback(filters?: FilterState): Promise<Feedback[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        if (filters.dateRange) params.append('dateRange', filters.dateRange);
        if (filters.routeId) params.append('routeId', filters.routeId);
        if (filters.category) params.append('category', filters.category);
        if (filters.severity) params.append('severity', filters.severity);
        if (filters.timePeriod) params.append('timePeriod', filters.timePeriod);
        if (filters.searchQuery) params.append('searchQuery', filters.searchQuery);
      }
      const res = await fetch(`${API_BASE_URL}/feedback?${params.toString()}`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend API offline, utilizing dynamic frontend data store');
    }
    return [];
  }

  public async getAnalyticsOverview(filters?: FilterState): Promise<AnalyticsOverview | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/overview`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend API offline');
    }
    return null;
  }

  public async getRouteRankings(filters?: FilterState): Promise<RoutePerformance[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/analytics/routes`, { headers: this.getHeaders() });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend API offline');
    }
    return [];
  }

  public async classifyFeedback(comment: string): Promise<ClassificationResult | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/classify-feedback`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ comment }),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend API offline');
    }
    return null;
  }
}

export const apiClient = new ApiClient();
