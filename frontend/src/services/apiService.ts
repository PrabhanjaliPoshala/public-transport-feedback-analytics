import type {
  AnalyticsOverview,
  ClassificationResult,
  Feedback,
  FilterState,
  OperationalInsight,
  Route,
  RouteDetailAnalytics,
  RoutePerformance,
  Trip,
} from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

function buildQuery(filters?: Partial<FilterState>): string {
  if (!filters) return '';

  const params = new URLSearchParams();

  const fields = [
    'dateRange',
    'routeId',
    'category',
    'severity',
    'timePeriod',
    'status',
    'searchQuery',
  ] as const;

  for (const field of fields) {
    const value = filters[field];

    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      value !== 'all'
    ) {
      params.set(field, String(value));
    }
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = `API request failed: ${response.status}`;

    try {
      const errorBody = await response.json();

      if (errorBody?.detail) {
        message = errorBody.detail;
      }
    } catch {
      // Keep default error message.
    }

    throw new Error(message);
  }

  return response.json();
}

function normalizeFeedback(item: any): Feedback {
  return {
    id: item.feedback_id || item.id,
    route_id: item.route_id,
    route_number: item.route_number,
    route_name: item.route_name,
    trip_id: item.trip_id,
    journey_date: item.journey_date,
    journey_time: item.journey_time,
    time_period: item.time_period,
    punctuality_rating: Number(item.punctuality_rating),
    cleanliness_rating: Number(item.cleanliness_rating),
    crowding_rating: Number(item.crowding_rating),
    driver_behaviour_rating: Number(item.driver_behaviour_rating),
    overall_rating: Number(item.overall_rating),
    comment: item.comment,
    category: item.category,
    severity: item.severity,
    status: item.status,
    created_at: item.created_at || new Date().toISOString(),
    ai_classified: Boolean(item.ai_confidence),
    ai_confidence: Number(item.ai_confidence || 0),
  };
}

class ApiService {

  public async resetDataStore(): Promise<Feedback[]> {
    return this.getFeedback({
      dateRange: 'all',
      routeId: 'all',
      category: 'all',
      severity: 'all',
      timePeriod: 'all',
      searchQuery: '',
      status: 'all',
    });
  }

  public async getRoutes(): Promise<Route[]> {
    return apiRequest<Route[]>('/routes');
  }

  public async addRoute(
    newRoute: Omit<Route, 'id'>
  ): Promise<Route> {
    return apiRequest<Route>('/routes', {
      method: 'POST',
      body: JSON.stringify(newRoute),
    });
  }

  public async getTrips(): Promise<Trip[]> {
    return apiRequest<Trip[]>('/trips');
  }

  public async getFeedback(
    filters?: FilterState
  ): Promise<Feedback[]> {
    const result = await apiRequest<any[]>(
      `/feedback${buildQuery(filters)}`
    );

    return result.map(normalizeFeedback);
  }

  public async submitFeedback(
    feedbackInput: Omit<Feedback, 'id' | 'created_at' | 'status'>
  ): Promise<Feedback> {
    const result = await apiRequest<any>('/feedback', {
      method: 'POST',
      body: JSON.stringify({
        route_id: feedbackInput.route_id,
        route_number: feedbackInput.route_number,
        route_name: feedbackInput.route_name,
        trip_id: feedbackInput.trip_id,
        journey_date: feedbackInput.journey_date,
        journey_time: feedbackInput.journey_time,
        time_period: feedbackInput.time_period,
        punctuality_rating: feedbackInput.punctuality_rating,
        cleanliness_rating: feedbackInput.cleanliness_rating,
        crowding_rating: feedbackInput.crowding_rating,
        driver_behaviour_rating:
          feedbackInput.driver_behaviour_rating,
        overall_rating: feedbackInput.overall_rating,
        comment: feedbackInput.comment,
        category: feedbackInput.category,
        severity: feedbackInput.severity,
      }),
    });

    return normalizeFeedback(result);
  }

  public async updateFeedbackStatus(
    feedbackId: string,
    status: 'New' | 'Under Review' | 'Resolved'
  ): Promise<Feedback | null> {
    const result = await apiRequest<any>(
      `/feedback/${encodeURIComponent(feedbackId)}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }
    );

    return normalizeFeedback(result);
  }

  public async getAnalyticsOverview(
    filters: FilterState
  ): Promise<AnalyticsOverview> {
    return apiRequest<AnalyticsOverview>(
      `/analytics/overview${buildQuery(filters)}`
    );
  }

  public async getRouteRankings(
    filters: FilterState
  ): Promise<RoutePerformance[]> {
    return apiRequest<RoutePerformance[]>(
      `/analytics/rankings${buildQuery(filters)}`
    );
  }

  public async getRouteDetail(
    routeId: string
  ): Promise<RouteDetailAnalytics | null> {
    try {
      return await apiRequest<RouteDetailAnalytics>(
        `/analytics/routes/${encodeURIComponent(routeId)}`
      );
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('404')
      ) {
        return null;
      }

      throw error;
    }
  }

  public async getDeteriorationAnalysis(
    _filters: FilterState
  ): Promise<RoutePerformance[]> {
    const rankings = await apiRequest<RoutePerformance[]>(
      '/analytics/rankings'
    );

    return rankings.filter(
      (route) => route.trend === 'Deteriorating'
    );
  }

  public async getOperationalInsights(): Promise<OperationalInsight[]> {
    const rankings = await apiRequest<RoutePerformance[]>(
      '/analytics/rankings'
    );

    const insights: OperationalInsight[] = [];

    rankings
      .filter(
        (route) =>
          route.trend === 'Deteriorating' ||
          route.status === 'Critical'
      )
      .forEach((route) => {
        const severity =
          route.status === 'Critical'
            ? 'Critical'
            : route.trend === 'Deteriorating'
              ? 'High'
              : 'Medium';

        let type: OperationalInsight['type'] = 'general';

        if (
          route.crowding <= route.punctuality &&
          route.crowding <= route.cleanliness &&
          route.crowding <= route.driver_behaviour
        ) {
          type = 'crowding';
        } else if (
          route.punctuality <= route.cleanliness &&
          route.punctuality <= route.driver_behaviour
        ) {
          type = 'punctuality';
        } else if (
          route.driver_behaviour <= route.cleanliness
        ) {
          type = 'driver';
        }

        insights.push({
          id: `insight-${route.route_id}`,
          type,
          title:
            route.trend === 'Deteriorating'
              ? `${route.route_number} is deteriorating`
              : `${route.route_number} requires attention`,
          description:
            route.trend === 'Deteriorating'
              ? `Service performance declined by ${Math.abs(
                  route.rating_change
                ).toFixed(1)} points compared with the previous period.`
              : `${route.route_number} currently has a ${route.status.toLowerCase()} performance status.`,
          route_id: route.route_id,
          route_number: route.route_number,
          metric: `Rating ${route.average_rating.toFixed(1)}/5`,
          severity:
            severity as OperationalInsight['severity'],
          created_at: new Date().toISOString(),
        });
      });

    return insights;
  }

  public async classifyText(
    comment: string
  ): Promise<ClassificationResult> {
    const result = await apiRequest<any>(
      '/ai/classify-feedback',
      {
        method: 'POST',
        body: JSON.stringify({
          comment,
        }),
      }
    );

    return {
      category: result.categories?.[0] || 'Other',
      severity: result.severity,
      confidence: Number(result.confidence || 0),
      keywords: [],
      explanation: result.explanation || '',
    };
  }

  public async importBulkFeedback(
    newRecords: Feedback[]
  ): Promise<number> {
    let imported = 0;

    for (const record of newRecords) {
      try {
        await this.submitFeedback(record);
        imported++;
      } catch (error) {
        console.error(
          'Failed to import feedback:',
          error
        );
      }
    }

    return imported;
  }
}

export const apiService = new ApiService();
