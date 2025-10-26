export interface AnalyticsData {
  totalImagesCompressed: number;
  totalBytesOriginal: number;
  totalBytesCompressed: number;
  formatUsage: {
    jpg: number;
    png: number;
    webp: number;
    other: number;
  };
  sessions: string[];
  firstVisit: string;
  lastVisit: string;
}

const STORAGE_KEY = 'bildklein_analytics';

export function initializeAnalytics(): AnalyticsData {
  if (typeof window === 'undefined') {
    return getDefaultData();
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      return {
        ...getDefaultData(),
        ...data,
        formatUsage: {
          ...getDefaultData().formatUsage,
          ...(data.formatUsage || {}),
        },
      };
    }
  } catch (error) {
    console.error('Failed to load analytics:', error);
  }

  const newData = getDefaultData();
  saveAnalytics(newData);
  return newData;
}

function getDefaultData(): AnalyticsData {
  return {
    totalImagesCompressed: 0,
    totalBytesOriginal: 0,
    totalBytesCompressed: 0,
    formatUsage: {
      jpg: 0,
      png: 0,
      webp: 0,
      other: 0,
    },
    sessions: [],
    firstVisit: new Date().toISOString(),
    lastVisit: new Date().toISOString(),
  };
}

export function saveAnalytics(data: AnalyticsData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save analytics:', error);
  }
}

export function getAnalytics(): AnalyticsData {
  return initializeAnalytics();
}

export function trackCompression(
  originalSize: number,
  compressedSize: number,
  format: string
): void {
  const data = getAnalytics();
  
  data.totalImagesCompressed += 1;
  data.totalBytesOriginal += originalSize;
  data.totalBytesCompressed += compressedSize;
  
  // Track format usage
  const formatKey = format.toLowerCase() as keyof typeof data.formatUsage;
  if (formatKey in data.formatUsage) {
    data.formatUsage[formatKey] += 1;
  } else {
    data.formatUsage.other += 1;
  }

  // Track session (daily unique session)
  const today = new Date().toISOString().split('T')[0];
  if (!data.sessions.includes(today)) {
    data.sessions.push(today);
  }

  data.lastVisit = new Date().toISOString();

  saveAnalytics(data);
}

export function getCompressionRatio(): number {
  const data = getAnalytics();
  if (data.totalBytesOriginal === 0) return 0;
  
  return Math.round(
    ((data.totalBytesOriginal - data.totalBytesCompressed) / data.totalBytesOriginal) * 100
  );
}

export function getTotalImagesCompressed(): number {
  return getAnalytics().totalImagesCompressed;
}

export function getFormatStats(): { format: string; count: number; percentage: number }[] {
  const data = getAnalytics();
  const total = Object.values(data.formatUsage).reduce((sum, count) => sum + count, 0);
  
  if (total === 0) {
    return [
      { format: 'JPG', count: 0, percentage: 0 },
      { format: 'PNG', count: 0, percentage: 0 },
      { format: 'WebP', count: 0, percentage: 0 },
    ];
  }

  return [
    { format: 'JPG', count: data.formatUsage.jpg, percentage: (data.formatUsage.jpg / total) * 100 },
    { format: 'PNG', count: data.formatUsage.png, percentage: (data.formatUsage.png / total) * 100 },
    { format: 'WebP', count: data.formatUsage.webp, percentage: (data.formatUsage.webp / total) * 100 },
  ];
}

export function resetAnalytics(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to reset analytics:', error);
  }
}

