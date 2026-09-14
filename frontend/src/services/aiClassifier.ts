import type { ClassificationResult, FeedbackCategory, FeedbackSeverity } from '../types';

const CATEGORY_RULES: { keywords: string[]; category: FeedbackCategory; defaultSeverity: FeedbackSeverity }[] = [
  {
    keywords: ['crowd', 'packed', 'full', 'standing', 'squeeze', 'no room', 'overflow', 'rush hour', 'jammed', 'no space'],
    category: 'Crowding',
    defaultSeverity: 'High',
  },
  {
    keywords: ['late', 'delay', 'behind schedule', 'wait', 'waited', 'cancelled', 'never showed', 'skip', 'slow', 'stuck', 'punctual', 'timing', 'schedule'],
    category: 'Punctuality / Delay',
    defaultSeverity: 'Medium',
  },
  {
    keywords: ['dirty', 'filthy', 'trash', 'smell', 'odor', 'stain', 'seat', 'sticky', 'garbage', 'unclean', 'litter', 'pest'],
    category: 'Cleanliness',
    defaultSeverity: 'Medium',
  },
  {
    keywords: ['driver', 'rude', 'reckless', 'brake', 'speeding', 'yelled', 'attitude', 'phone', 'texting', 'curt', 'drove off', 'ignore', 'skipped stop'],
    category: 'Driver Behaviour',
    defaultSeverity: 'High',
  },
  {
    keywords: ['route', 'detour', 'sign', 'announcement', 'card reader', 'app', 'ticket', 'fare', 'machine', 'display'],
    category: 'Service / Route Issue',
    defaultSeverity: 'Low',
  },
  {
    keywords: ['danger', 'unsafe', 'fight', 'assault', 'harass', 'weapon', 'scared', 'dark', 'emergency', 'accident', 'collision', 'smoke', 'threat'],
    category: 'Safety',
    defaultSeverity: 'Critical',
  },
];

const SEVERITY_MODIFIERS: { keywords: string[]; severity: FeedbackSeverity }[] = [
  { keywords: ['dangerous', 'injured', 'threatened', 'police', 'assault', 'weapon', 'hospital', 'fire', 'emergency'], severity: 'Critical' },
  { keywords: ['horrible', 'terrible', 'extremely', 'always', 'worst', 'unacceptable', 'packed', 'missed work', 'angry', 'skipped'], severity: 'High' },
  { keywords: ['bad', 'annoying', 'delayed', 'dirty', 'uncomfortable', 'inconvenient'], severity: 'Medium' },
  { keywords: ['slightly', 'minor', 'a bit', 'could be better', 'small issue'], severity: 'Low' },
];

export function classifyFeedback(comment: string, ratings?: { punctuality?: number; cleanliness?: number; crowding?: number; driver?: number; overall?: number }): ClassificationResult {
  const text = comment.toLowerCase().trim();
  
  if (!text) {
    return {
      category: 'Other',
      severity: 'Low',
      confidence: 70,
      keywords: [],
      explanation: 'No comment provided; classified based on neutral fallback.',
    };
  }

  let matchedCategory: FeedbackCategory = 'Other';
  let matchedSeverity: FeedbackSeverity = 'Medium';
  let highestScore = 0;
  let detectedKeywords: string[] = [];

  for (const rule of CATEGORY_RULES) {
    const matches = rule.keywords.filter((kw) => text.includes(kw));
    if (matches.length > highestScore) {
      highestScore = matches.length;
      matchedCategory = rule.category;
      matchedSeverity = rule.defaultSeverity;
      detectedKeywords = matches;
    }
  }

  for (const mod of SEVERITY_MODIFIERS) {
    const modMatches = mod.keywords.filter((kw) => text.includes(kw));
    if (modMatches.length > 0) {
      matchedSeverity = mod.severity;
      detectedKeywords = Array.from(new Set([...detectedKeywords, ...modMatches]));
      break;
    }
  }

  if (ratings && ratings.overall) {
    if (ratings.overall === 1) {
      if (matchedSeverity !== 'Critical') matchedSeverity = 'High';
    } else if (ratings.overall >= 4 && matchedSeverity === 'High') {
      matchedSeverity = 'Medium';
    }
  }

  const baseConfidence = 82;
  const matchBonus = Math.min(highestScore * 5, 14);
  const confidence = Math.min(baseConfidence + matchBonus, 98);

  const explanation = `Detected category "${matchedCategory}" with ${matchedSeverity} severity based on keywords [${detectedKeywords.join(', ')}].`;

  return {
    category: matchedCategory,
    severity: matchedSeverity,
    confidence,
    keywords: detectedKeywords,
    explanation,
  };
}
