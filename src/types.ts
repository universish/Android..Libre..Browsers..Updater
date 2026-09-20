export interface BrowserRepo {
  id: string;
  name: string;
  category: 'chromium_fork' | 'firefox_fork';
  owner: string;
  repo: string;
  description: string;
  tagline: string;
  badge: string;
  defaultBranch: string;
  preferredArch: 'arm64' | 'arm' | 'x86_64' | 'all';
  apkPattern: string[];
  packageName: string;
  lastRelease?: ReleaseData | null;
  isLoading?: boolean;
  error?: string | null;
  lastChecked?: number;
}

export interface ReleaseAsset {
  name: string;
  size: number;
  downloadUrl: string;
  downloadCount: number;
  arch: 'arm64' | 'arm' | 'x86_64' | 'universal' | 'other';
  isApk: boolean;
}

export interface ReleaseData {
  tagName: string;
  name: string;
  publishedAt: string;
  htmlUrl: string;
  body: string;
  assets: ReleaseAsset[];
  recommendedApk?: ReleaseAsset;
}

export interface DownloadedApk {
  id: string;
  repoId: string;
  browserName: string;
  version: string;
  fileName: string;
  fileSize: number;
  downloadedAt: number;
  downloadUrl: string;
  arch: string;
  status: 'completed' | 'downloading' | 'failed';
  progress: number;
}

export interface SettingsState {
  dailyCheckEnabled: boolean;
  checkIntervalHours: number;
  lastDailyCheckTimestamp: number;
  preferredArch: 'arm64' | 'arm' | 'x86_64' | 'all';
  notifyOnNewRelease: boolean;
  autoDownload: boolean;
  githubToken?: string;
}
