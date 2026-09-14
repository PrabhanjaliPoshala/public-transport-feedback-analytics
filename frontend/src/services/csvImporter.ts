import type { Feedback, FeedbackCategory, FeedbackSeverity, ImportSummary } from '../types';
import { classifyFeedback } from './aiClassifier';

function parseCSVText(csvText: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
    if (values.length > 0) {
      const row: Record<string, string> = {};
      headers.forEach((h, idx) => {
        const val = values[idx] ? values[idx].trim().replace(/^"|"$/g, '') : '';
        row[h] = val;
      });
      rows.push(row);
    }
  }

  return { headers, rows };
}

export function importFeedbackCSV(csvContent: string): { importedFeedback: Feedback[]; summary: ImportSummary } {
  const { rows } = parseCSVText(csvContent);

  let recordsImported = 0;
  let recordsRejected = 0;
  const detectedRoutesSet = new Set<string>();
  const detectedCategoriesSet = new Set<string>();
  let minDate = '9999-12-31';
  let maxDate = '0000-01-01';

  const importedFeedback: Feedback[] = [];
  let idIndex = Date.now();

  rows.forEach((row) => {
    const rawRoute = row['Route'] || row['Borough/Route'] || row['Bus Route'] || row['Line'] || 'Route 42';
    const rawComment = row['Comment'] || row['Descriptor'] || row['Complaint Description'] || row['Details'] || '';
    const rawCategory = row['Category'] || row['Complaint Type'] || row['Issue'] || '';
    const rawRating = parseFloat(row['Rating'] || row['Score'] || '3');
    const rawDate = row['Created Date'] || row['Date'] || row['Journey Date'] || new Date().toISOString().split('T')[0];

    if (!rawComment && isNaN(rawRating)) {
      recordsRejected++;
      return;
    }

    const formattedDate = rawDate.split('T')[0] || '2026-09-14';
    if (formattedDate < minDate) minDate = formattedDate;
    if (formattedDate > maxDate) maxDate = formattedDate;

    const routeNumber = rawRoute.startsWith('Route') ? rawRoute : `Route ${rawRoute}`;
    const routeId = `route-${routeNumber.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    detectedRoutesSet.add(routeNumber);

    const classification = classifyFeedback(rawComment, { overall: isNaN(rawRating) ? 3 : rawRating });
    const category: FeedbackCategory = (rawCategory as FeedbackCategory) || classification.category;
    const severity: FeedbackSeverity = classification.severity;

    detectedCategoriesSet.add(category);

    const overall_rating = isNaN(rawRating) ? (severity === 'Critical' ? 1 : severity === 'High' ? 2 : 4) : Math.max(1, Math.min(5, Math.round(rawRating)));

    idIndex++;
    importedFeedback.push({
      id: `CSV-${idIndex.toString().slice(-6)}`,
      route_id: routeId,
      route_number: routeNumber,
      route_name: `${routeNumber} (Imported Corridor)`,
      journey_date: formattedDate,
      journey_time: '14:00',
      time_period: '12 PM–3 PM',
      punctuality_rating: overall_rating,
      cleanliness_rating: overall_rating,
      crowding_rating: overall_rating,
      driver_behaviour_rating: overall_rating,
      overall_rating,
      comment: rawComment || 'Imported passenger report',
      category,
      severity,
      status: 'New',
      created_at: `${formattedDate}T14:00:00Z`,
      ai_classified: true,
      ai_confidence: classification.confidence,
    });

    recordsImported++;
  });

  const summary: ImportSummary = {
    recordsImported,
    recordsRejected,
    routesDetected: detectedRoutesSet.size,
    dateRange: {
      start: minDate === '9999-12-31' ? '2026-09-01' : minDate,
      end: maxDate === '0000-01-01' ? '2026-09-14' : maxDate,
    },
    categoriesDetected: Array.from(detectedCategoriesSet),
  };

  return { importedFeedback, summary };
}
