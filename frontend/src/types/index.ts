export type FeedbackCategory =
  | 'Punctuality / Delay'
  | 'Cleanliness'
  | 'Crowding'
  | 'Driver Behaviour'
  | 'Service / Route Issue'
  | 'Safety'
  | 'Other';

export type FeedbackSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type FeedbackStatus = 'New' | 'Under Review' | 'Resolved';

export type RouteStatus = 'Excellent' | 'Good' | 'Needs Attention' | 'Poor' | 'Critical';

export type TrendDirection = 'Improving' | 'Stable' | 'Deteriorating';

export type TimePeriod =
  | '6 AM–9 AM'
  | '9 AM–12 PM'
  | '12 PM–3 PM'
  | '3 PM–5 PM'
  | '5 PM–7 PM'
  | '7 PM–10 PM'
  | 'Late Night';

export interface Route {
  id: string;
  route_number: string;
  route_name: string;
  origin: string;
  destination: string;
  status: RouteStatus;
  operating_hours: string;
}

export interface Trip {
  id: string;
  route_id: string;
  journey_date: string;
  start_time: string;
  end_time: string;
  time_period: TimePeriod;
  status: 'Completed' | 'Delayed' | 'Cancelled';
}

export interface Feedback {
  id: string;
  route_id: string;
  route_number: string;
  route_name: string;
  trip_id?: string;
  journey_date: string;
  journey_time: string;
  time_period: TimePeriod;
  punctuality_rating: number;
  cleanliness_rating: number;
  crowding_rating: number;
  driver_behaviour_rating: number;
  overall_rating: number;
  comment: string;
  category: FeedbackCategory;
  severity: FeedbackSeverity;
  status: FeedbackStatus;
  created_at: string;
  ai_classified?: boolean;
  ai_confidence?: number;
}

export interface FilterState {
  dateRange: '7d' | '30d' | '90d' | 'all';
  routeId: string;
  category: string;
  severity: string;
  timePeriod: string;
  searchQuery: string;
  status: string;
}

export interface AnalyticsOverview {
  totalFeedback: number;
  averageRating: number;
  ratingChangePercent: number;
  totalComplaints: number;
  complaintsChangePercent: number;
  highCriticalComplaints: number;
  worstPerformingRoute: {
    route_id: string;
    route_number: string;
    route_name: string;
    rating: number;
  };
  mostReportedIssue: {
    category: FeedbackCategory;
    count: number;
  };
}

export interface RoutePerformance {
  rank: number;
  route_id: string;
  route_number: string;
  route_name: string;
  average_rating: number;
  previous_period_rating: number;
  rating_change: number;
  punctuality: number;
  cleanliness: number;
  crowding: number;
  driver_behaviour: number;
  total_feedback: number;
  complaints_count: number;
  high_severity_count: number;
  trend: TrendDirection;
  status: RouteStatus;
  top_issue: FeedbackCategory;
  second_issue: FeedbackCategory;
  worst_period: TimePeriod;
}

export interface RouteDetailAnalytics extends RoutePerformance {
  rating_history: { date: string; rating: number }[];
  complaint_history: { date: string; count: number }[];
  category_breakdown: { category: string; count: number }[];
  time_period_breakdown: { period: string; average_rating: number; complaints: number }[];
  ai_insight: string;
}

export interface OperationalInsight {
  id: string;
  type: 'critical' | 'crowding' | 'punctuality' | 'driver' | 'general';
  title: string;
  description: string;
  route_id?: string;
  route_number?: string;
  metric: string;
  severity: FeedbackSeverity;
  created_at: string;
}

export interface ImportSummary {
  recordsImported: number;
  recordsRejected: number;
  routesDetected: number;
  dateRange: { start: string; end: string };
  categoriesDetected: string[];
}

export interface ClassificationResult {
  category: FeedbackCategory;
  severity: FeedbackSeverity;
  confidence: number;
  keywords: string[];
  explanation: string;
}
