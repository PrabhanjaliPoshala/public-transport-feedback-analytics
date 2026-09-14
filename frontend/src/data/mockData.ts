import type { Feedback, Route, TimePeriod, Trip } from '../types';

export const INITIAL_ROUTES: Route[] = [
  {
    id: 'route-42',
    route_number: 'Route 42',
    route_name: 'Crosstown Express (Downtown - University)',
    origin: 'Downtown Terminal',
    destination: 'State University North',
    status: 'Critical',
    operating_hours: '05:00 AM - 11:30 PM',
  },
  {
    id: 'route-17',
    route_number: 'Route 17',
    route_name: 'Harbor Metro Line',
    origin: 'East Port Harbor',
    destination: 'Central Transit Hub',
    status: 'Poor',
    operating_hours: '05:30 AM - 11:00 PM',
  },
  {
    id: 'route-4',
    route_number: 'Route 4',
    route_name: 'Westside Commuter Loop',
    origin: 'West End Mall',
    destination: 'Financial District',
    status: 'Needs Attention',
    operating_hours: '06:00 AM - 10:00 PM',
  },
  {
    id: 'route-10',
    route_number: 'Route 10',
    route_name: 'Airport Direct Shuttle',
    origin: 'International Airport',
    destination: 'Grand Hotel Terminal',
    status: 'Excellent',
    operating_hours: '24 Hours',
  },
  {
    id: 'route-88',
    route_number: 'Route 88',
    route_name: 'Northern Heights Feeder',
    origin: 'North Ridge Park',
    destination: 'Subway Station',
    status: 'Good',
    operating_hours: '06:00 AM - 09:30 PM',
  },
  {
    id: 'route-12',
    route_number: 'Route 12',
    route_name: 'South Bay Corridor',
    origin: 'South Bay Marina',
    destination: 'Civic Center',
    status: 'Good',
    operating_hours: '05:45 AM - 10:45 PM',
  },
  {
    id: 'route-25',
    route_number: 'Route 25',
    route_name: 'Tech Park Rapid Transit',
    origin: 'Innovation District',
    destination: 'Central Station',
    status: 'Excellent',
    operating_hours: '06:30 AM - 08:30 PM',
  },
  {
    id: 'route-31',
    route_number: 'Route 31',
    route_name: 'Eastside Orbital',
    origin: 'Eastside Plaza',
    destination: 'Medical Center',
    status: 'Needs Attention',
    operating_hours: '06:00 AM - 10:30 PM',
  },
  {
    id: 'route-55',
    route_number: 'Route 55',
    route_name: 'Industrial Park Shuttle',
    origin: 'Logistics Hub',
    destination: 'Metro Gate',
    status: 'Good',
    operating_hours: '05:00 AM - 09:00 PM',
  },
  {
    id: 'route-9',
    route_number: 'Route 9',
    route_name: 'Riverfront Circular',
    origin: 'Pier 9',
    destination: 'Riverfront Market',
    status: 'Excellent',
    operating_hours: '07:00 AM - 11:00 PM',
  },
];

export const INITIAL_TRIPS: Trip[] = [
  {
    id: 'trip-42-101',
    route_id: 'route-42',
    journey_date: '2026-09-14',
    start_time: '17:15',
    end_time: '18:30',
    time_period: '5 PM–7 PM',
    status: 'Delayed',
  },
  {
    id: 'trip-42-102',
    route_id: 'route-42',
    journey_date: '2026-09-14',
    start_time: '08:00',
    end_time: '08:50',
    time_period: '6 AM–9 AM',
    status: 'Completed',
  },
  {
    id: 'trip-17-201',
    route_id: 'route-17',
    journey_date: '2026-09-14',
    start_time: '17:30',
    end_time: '18:45',
    time_period: '5 PM–7 PM',
    status: 'Delayed',
  },
];

export function generateSeedFeedback(): Feedback[] {
  const feedbackList: Feedback[] = [];
  const timePeriods: TimePeriod[] = [
    '6 AM–9 AM',
    '9 AM–12 PM',
    '12 PM–3 PM',
    '3 PM–5 PM',
    '5 PM–7 PM',
    '7 PM–10 PM',
  ];

  const now = new Date('2026-09-14');

  const getDateStr = (daysAgo: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split('T')[0];
  };

  let idCounter = 1000;

  for (let i = 0; i < 130; i++) {
    const daysAgo = Math.floor(Math.random() * 60);
    const isRecent = daysAgo <= 30;

    const isPeakTime = Math.random() < 0.65;
    const period: TimePeriod = isPeakTime
      ? Math.random() < 0.75
        ? '5 PM–7 PM'
        : '6 AM–9 AM'
      : timePeriods[Math.floor(Math.random() * timePeriods.length)];

    const punctuality = isRecent ? (period === '5 PM–7 PM' ? 1 : 2) : 3;
    const cleanliness = isRecent ? (Math.random() < 0.5 ? 2 : 3) : 4;
    const crowding = isRecent ? (period === '5 PM–7 PM' ? 1 : 2) : 3;
    const driver = isRecent ? 3 : 4;

    const overall = Math.max(1, Math.min(5, Math.round((punctuality + cleanliness + crowding + driver) / 4)));

    let category: any = 'Crowding';
    let comment = '';
    let severity: any = 'High';

    if (period === '5 PM–7 PM' || crowding <= 2) {
      category = 'Crowding';
      const comments = [
        'The bus is always packed after 6 PM and often arrives late.',
        'Extremely overcrowded bus during evening peak. Couldn\'t even get on at University stop!',
        'No standing space left, passengers squeezed together dangerously near the doors.',
        'Bus skipped two stops because it was 100% full.',
        'Overcrowding is intolerable between 5:30 PM and 6:30 PM every single weekday.',
      ];
      comment = comments[i % comments.length];
      severity = isRecent && period === '5 PM–7 PM' ? 'Critical' : 'High';
    } else if (punctuality <= 2) {
      category = 'Punctuality / Delay';
      const comments = [
        'Bus arrived 25 minutes late at Downtown Terminal.',
        'Chronic delays during evening rush hour. Waited 35 mins.',
        'Buses bunch together: two arrive at once after a 40 minute gap.',
        'Severe delay without any announcement or app update.',
      ];
      comment = comments[i % comments.length];
      severity = 'High';
    } else if (cleanliness <= 2) {
      category = 'Cleanliness';
      comment = 'Seats were sticky and trash was strewn across the aisle.';
      severity = 'Medium';
    } else {
      category = 'Driver Behaviour';
      comment = 'Driver drove away while passenger was walking up to door.';
      severity = 'Medium';
    }

    idCounter++;
    feedbackList.push({
      id: `FB-${idCounter}`,
      route_id: 'route-42',
      route_number: 'Route 42',
      route_name: 'Crosstown Express (Downtown - University)',
      journey_date: getDateStr(daysAgo),
      journey_time: period === '5 PM–7 PM' ? '18:15' : '08:30',
      time_period: period,
      punctuality_rating: punctuality,
      cleanliness_rating: cleanliness,
      crowding_rating: crowding,
      driver_behaviour_rating: driver,
      overall_rating: overall,
      comment,
      category,
      severity,
      status: i % 4 === 0 ? 'Resolved' : i % 3 === 0 ? 'Under Review' : 'New',
      created_at: `${getDateStr(daysAgo)}T${period === '5 PM–7 PM' ? '18:25:00' : '08:40:00'}Z`,
      ai_classified: true,
      ai_confidence: 94,
    });
  }

  const otherRoutes = INITIAL_ROUTES.filter((r) => r.id !== 'route-42');

  for (let i = 0; i < 110; i++) {
    const route = otherRoutes[i % otherRoutes.length];
    const daysAgo = Math.floor(Math.random() * 60);
    const period = timePeriods[i % timePeriods.length];

    let overall = 4;
    let category: any = 'Cleanliness';
    let severity: any = 'Low';
    let comment = 'Smooth and comfortable ride on time.';

    if (route.id === 'route-17') {
      overall = Math.random() < 0.6 ? 2 : 3;
      category = 'Punctuality / Delay';
      comment = 'Bus running 15 minutes behind schedule near Harbor Metro.';
      severity = 'Medium';
    } else if (route.id === 'route-4') {
      overall = Math.random() < 0.5 ? 3 : 4;
      category = 'Driver Behaviour';
      comment = 'Sudden aggressive braking near West End Mall junction.';
      severity = 'Low';
    } else if (route.id === 'route-10' || route.id === 'route-25') {
      overall = 5;
      category = 'Punctuality / Delay';
      comment = 'Excellent service, punctual driver, clean vehicle!';
      severity = 'Low';
    } else {
      overall = Math.floor(Math.random() * 2) + 3;
      category = i % 2 === 0 ? 'Service / Route Issue' : 'Cleanliness';
      comment = 'Decent service, minor card reader delay at entrance.';
      severity = 'Low';
    }

    idCounter++;
    feedbackList.push({
      id: `FB-${idCounter}`,
      route_id: route.id,
      route_number: route.route_number,
      route_name: route.route_name,
      journey_date: getDateStr(daysAgo),
      journey_time: '12:30',
      time_period: period,
      punctuality_rating: Math.min(5, overall + (Math.random() > 0.5 ? 0 : -1)),
      cleanliness_rating: Math.min(5, overall),
      crowding_rating: Math.min(5, overall),
      driver_behaviour_rating: Math.min(5, overall),
      overall_rating: overall,
      comment,
      category,
      severity,
      status: i % 2 === 0 ? 'Resolved' : 'New',
      created_at: `${getDateStr(daysAgo)}T12:35:00Z`,
      ai_classified: true,
      ai_confidence: 88,
    });
  }

  return feedbackList;
}
