import { ClaimElement, UploadedFile, Evidence } from '../types';

export const INITIAL_MOCK_FILES: UploadedFile[] = [
  {
    id: 'file-1',
    name: 'US123456_Claim_Chart.xlsx',
    type: 'claim_chart',
    size: '142 KB',
  },
  {
    id: 'file-2',
    name: 'Acme_Thermostat_Product_Documentation.pdf',
    type: 'product_doc',
    size: '4.2 MB',
    pages: 24,
  },
  {
    id: 'file-3',
    name: 'Acme_Thermostat_Technical_Specifications.pdf',
    type: 'tech_spec',
    size: '8.7 MB',
    pages: 48,
  },
];

export const INITIAL_CLAIM_ELEMENTS: ClaimElement[] = [
  {
    id: 'element-1',
    elementNum: 1,
    claimText: 'Temperature control device with a wireless communication module',
    accusedFeature: 'WiFi-enabled thermostat',
    reasoning:
      "Acme Thermostat connects to the user's network through its integrated wireless communication module.",
    evidence: [
      {
        id: 'ev-1',
        documentName: 'Acme Thermostat Product Documentation',
        page: 8,
        excerpt:
          'The device connects seamlessly to standard 802.11 b/g/n 2.4GHz home Wi-Fi networks.',
        highlightText: 'connects seamlessly to standard 802.11 b/g/n 2.4GHz home Wi-Fi networks.',
        sourceType: 'Product Specification',
      },
    ],
    evidenceStrength: 'direct',
    version: 1,
  },
  {
    id: 'element-2',
    elementNum: 2,
    claimText: 'Motion sensor for detecting occupancy',
    accusedFeature: 'Built-in motion sensor',
    reasoning:
      'The thermostat uses an integrated motion sensor to detect whether people are present.',
    evidence: [
      {
        id: 'ev-2',
        documentName: 'Acme Thermostat Product Documentation',
        page: 11,
        excerpt:
          'An integrated passive infrared (PIR) motion sensor detects room occupancy within a 20-foot range.',
        highlightText: 'integrated passive infrared (PIR) motion sensor detects room occupancy',
        sourceType: 'Hardware Overview',
      },
    ],
    evidenceStrength: 'direct',
    version: 1,
  },
  {
    id: 'element-3',
    elementNum: 3,
    claimText:
      'Machine learning algorithm that learns user temperature preferences over time',
    accusedFeature: 'Auto-Schedule',
    // ITEM A: Updated initial reasoning text
    reasoning:
      "Acme's Auto-Schedule learns the user's preferred temperatures over time. This suggests adaptive learning behavior, but the available documentation does not establish that the underlying implementation uses machine learning.",
    evidence: [
      {
        id: 'ev-3',
        documentName: 'Acme Thermostat Product Documentation',
        page: 6,
        excerpt:
          'Auto-Schedule adjusts temperatures automatically based on your daily routine and manual adjustments made during the first week.',
        highlightText: 'adjusts temperatures automatically based on your daily routine',
        sourceType: 'Feature Overview',
      },
    ],
    evidenceStrength: 'indirect',
    version: 1,
  },
];

// ITEM B: Expanded highlight text in refinement evidence
export const REFINEMENT_EVIDENCE_EL3: Evidence = {
  id: 'ev-3-strong',
  documentName: 'Acme Thermostat Technical Specifications',
  page: 14,
  excerpt:
    'The adaptive scheduling engine analyzes historical temperature selections and occupancy data to generate future temperature schedules.',
  highlightText:
    'analyzes historical temperature selections and occupancy data to generate future temperature schedules.',
  sourceType: 'Technical Architecture Manual',
};

export const INITIAL_CHAT_MESSAGES = [
  {
    id: 'msg-init',
    role: 'ai' as const,
    content:
      'Analysis workspace initialized for **US123456 vs. Acme Corp**.\n\nI have cross-referenced the claim chart against the uploaded product documentation. **Element 3** has been identified as having an evidence gap (indirect/inferred implementation). Select an element from the table to begin refinement.',
    timestamp: '10:42 AM',
  },
];
