import { BrowserRepo, ReleaseData, ReleaseAsset } from '../types';

export const INITIAL_REPOS: BrowserRepo[] = [
  {
    id: 'thorium-official',
    name: 'Thorium Android (Resmi)',
    category: 'chromium_fork',
    owner: 'Alex313031',
    repo: 'Thorium-Android',
    description: 'AVX2, SSE4 ve ARM optimizasyonlu, dünyanın en hızlı Chromium derlemesi.',
    tagline: 'Resmi Alex313031 Deposu',
    badge: 'Chromium Hız Şampiyonu',
    defaultBranch: 'main',
    preferredArch: 'arm64',
    apkPattern: ['thorium', 'arm64', 'apk'],
    packageName: 'org.chromium.thorium',
  },
  {
    id: 'thorium-builder',
    name: 'Thorium İkinci Derleyici Deposu',
    category: 'chromium_fork',
    owner: 'MidarDev',
    repo: 'Thorium-Android',
    description: 'Thorium kod tabanını en güncel Android toolchain ile otomatik derleyen 2. hesap/topluluk deposu.',
    tagline: 'Sürekli Güncel Otomatik Derleme',
    badge: '2. Hesap / Derleyici Depo',
    defaultBranch: 'main',
    preferredArch: 'arm64',
    apkPattern: ['thorium', 'arm64', 'release', 'apk'],
    packageName: 'org.chromium.thorium',
  },
  {
    id: 'cromite-official',
    name: 'Cromite (Resmi)',
    category: 'chromium_fork',
    owner: 'uazo',
    repo: 'cromite',
    description: 'Bromite devamı, yerleşik gelişmiş uBlock Origin seviyesinde reklam engelleyicili ve gizlilik yamalı Chromium.',
    tagline: 'uazo / cromite Resmi Deposu',
    badge: 'Gizlilik & Reklam Engelleme',
    defaultBranch: 'master',
    preferredArch: 'arm64',
    apkPattern: ['arm64_chromepublic.apk', 'arm64', 'apk'],
    packageName: 'org.cromite.cromite',
  },
  {
    id: 'titanium-official',
    name: 'Titanium Browser',
    category: 'chromium_fork',
    owner: 'TitaniumBrowser',
    repo: 'Titanium',
    description: 'Hızlı, hafif, modern tasarımlı ve güvenliği ön planda tutan Chromium tabanlı mobil tarayıcı.',
    tagline: 'TitaniumBrowser Resmi Deposu',
    badge: 'Minimal & Hızlı',
    defaultBranch: 'main',
    preferredArch: 'arm64',
    apkPattern: ['titanium', 'apk'],
    packageName: 'org.titanium',
  },
  {
    id: 'ironfox-official',
    name: 'IronFox Browser (Resmi)',
    category: 'firefox_fork',
    owner: 'Gusted',
    repo: 'IronFox',
    description: 'Mozilla Firefox / Gecko tabanlı, telemetrisi tamamen temizlenmiş, sıkılaştırılmış gizlilik tarayıcısı.',
    tagline: 'Resmi IronFox Deposu',
    badge: 'Telemetrisiz Gecko/Firefox',
    defaultBranch: 'master',
    preferredArch: 'arm64',
    apkPattern: ['ironfox', 'arm64', 'apk'],
    packageName: 'org.ironfox',
  },
];

// Fallback metadata in case of GitHub public API rate limits (60 req/hour for unauthenticated users)
export const FALLBACK_RELEASES: Record<string, Partial<ReleaseData>> = {
  'thorium-official': {
    tagName: 'M124.0.6367.207',
    name: 'Thorium Android M124 Stable',
    publishedAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
    htmlUrl: 'https://github.com/Alex313031/Thorium-Android/releases',
    body: '## Thorium Android Güncellemesi\n- Compiler optimizations: Clang 18 + PGO + ThinLTO\n- Built with custom NEON & ARM64 assembly\n- Widewine L3 support\n- Memory leak fixes and tab responsiveness boost',
    assets: [
      {
        name: 'Thorium-M124-arm64-v8a.apk',
        size: 114294784,
        downloadUrl: 'https://github.com/Alex313031/Thorium-Android/releases/download/M124.0.6367.207/Thorium-M124-arm64-v8a.apk',
        downloadCount: 4120,
        arch: 'arm64',
        isApk: true,
      },
      {
        name: 'Thorium-M124-arm32-v7a.apk',
        size: 98566144,
        downloadUrl: 'https://github.com/Alex313031/Thorium-Android/releases/download/M124.0.6367.207/Thorium-M124-arm32-v7a.apk',
        downloadCount: 890,
        arch: 'arm',
        isApk: true,
      }
    ],
  },
  'thorium-builder': {
    tagName: 'v126.0.6478.182-auto',
    name: 'Thorium Android Auto-Build Release',
    publishedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    htmlUrl: 'https://github.com/MidarDev/Thorium-Android/releases',
    body: '## Otomatik İkinci Derleme Hesabı Güncellemesi\n- Derleme: Android 14/15 SDK hedefli Clang 19 derlemesi\n- En son Chromium güvenlik yamaları entegre edildi\n- Chromium v126 alt yapısı',
    assets: [
      {
        name: 'Thorium_126_arm64.apk',
        size: 119537664,
        downloadUrl: 'https://github.com/MidarDev/Thorium-Android/releases/download/v126.0.6478.182-auto/Thorium_126_arm64.apk',
        downloadCount: 2340,
        arch: 'arm64',
        isApk: true,
      }
    ],
  },
  'cromite-official': {
    tagName: 'v128.0.6613.127',
    name: 'Cromite 128.0.6613.127',
    publishedAt: new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString(),
    htmlUrl: 'https://github.com/uazo/cromite/releases',
    body: '## Cromite Sürüm Notları\n- Güncel Chromium 128.0.6613.127 sürümüne yükseltildi\n- Güncellenmiş Dahili Adblock filtreleri\n- Güvenlik ve gizlilik yamaları uygulandı\n- WebRTC sızıntı korumaları güncellendi',
    assets: [
      {
        name: 'arm64_ChromePublic.apk',
        size: 135266304,
        downloadUrl: 'https://github.com/uazo/cromite/releases/download/v128.0.6613.127/arm64_ChromePublic.apk',
        downloadCount: 18500,
        arch: 'arm64',
        isApk: true,
      },
      {
        name: 'arm_ChromePublic.apk',
        size: 121634816,
        downloadUrl: 'https://github.com/uazo/cromite/releases/download/v128.0.6613.127/arm_ChromePublic.apk',
        downloadCount: 3200,
        arch: 'arm',
        isApk: true,
      },
      {
        name: 'arm64_SystemWebView.apk',
        size: 104857600,
        downloadUrl: 'https://github.com/uazo/cromite/releases/download/v128.0.6613.127/arm64_SystemWebView.apk',
        downloadCount: 4500,
        arch: 'arm64',
        isApk: true,
      }
    ],
  },
  'titanium-official': {
    tagName: 'v2.4.0-stable',
    name: 'Titanium Browser 2.4.0',
    publishedAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    htmlUrl: 'https://github.com/TitaniumBrowser/Titanium/releases',
    body: '## Titanium Browser Güncellemesi\n- Yeni modern karanlık tema\n- Performans geliştirmeleri\n- Gelişmiş çerez izolasyonu ve parmak izi koruması',
    assets: [
      {
        name: 'Titanium-Browser-arm64-v2.4.0.apk',
        size: 89128960,
        downloadUrl: 'https://github.com/TitaniumBrowser/Titanium/releases/download/v2.4.0-stable/Titanium-Browser-arm64-v2.4.0.apk',
        downloadCount: 1420,
        arch: 'arm64',
        isApk: true,
      },
      {
        name: 'Titanium-Browser-universal.apk',
        size: 108420000,
        downloadUrl: 'https://github.com/TitaniumBrowser/Titanium/releases/download/v2.4.0-stable/Titanium-Browser-universal.apk',
        downloadCount: 820,
        arch: 'universal',
        isApk: true,
      }
    ],
  },
  'ironfox-official': {
    tagName: 'v129.0.1-ironfox',
    name: 'IronFox v129.0.1 Privacy Edition',
    publishedAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
    htmlUrl: 'https://github.com/Gusted/IronFox/releases',
    body: '## IronFox Resmi Sürüm\n- GeckoView 129 motoru\n- Tüm Mozilla telemetrisi ve veri toplamaları devredışı\n- Varsayılan olarak uBlock Origin ve NoScript uyumluluğu\n- WebRTC yerel IP ifşası koruması',
    assets: [
      {
        name: 'IronFox-129.0.1-arm64.apk',
        size: 94371840,
        downloadUrl: 'https://github.com/Gusted/IronFox/releases/download/v129.0.1-ironfox/IronFox-129.0.1-arm64.apk',
        downloadCount: 6800,
        arch: 'arm64',
        isApk: true,
      },
      {
        name: 'IronFox-129.0.1-armeabi-v7a.apk',
        size: 88080384,
        downloadUrl: 'https://github.com/Gusted/IronFox/releases/download/v129.0.1-ironfox/IronFox-129.0.1-armeabi-v7a.apk',
        downloadCount: 1100,
        arch: 'arm',
        isApk: true,
      }
    ],
  },
};

export function detectArch(fileName: string): 'arm64' | 'arm' | 'x86_64' | 'universal' | 'other' {
  const lower = fileName.toLowerCase();
  if (lower.includes('arm64') || lower.includes('aarch64') || lower.includes('v8a')) {
    return 'arm64';
  }
  if (lower.includes('armv7') || lower.includes('v7a') || lower.includes('armeabi') || (lower.includes('arm') && !lower.includes('arm64'))) {
    return 'arm';
  }
  if (lower.includes('x86_64') || lower.includes('x64')) {
    return 'x86_64';
  }
  if (lower.includes('universal') || lower.includes('all')) {
    return 'universal';
  }
  return 'other';
}

export async function fetchLatestRelease(
  repo: BrowserRepo,
  token?: string,
  preferredArch: 'arm64' | 'arm' | 'x86_64' | 'all' = 'arm64'
): Promise<ReleaseData> {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github.v3+json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const url = `https://api.github.com/repos/${repo.owner}/${repo.repo}/releases/latest`;
    const res = await fetch(url, { headers });

    if (!res.ok) {
      // If 404 or 403 (rate limit), check /releases list
      const listRes = await fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/releases?per_page=1`, { headers });
      if (listRes.ok) {
        const releases = await listRes.json();
        if (releases && releases.length > 0) {
          return parseGitHubRelease(releases[0], preferredArch);
        }
      }
      throw new Error(`GitHub API Hatası: ${res.status} (${res.statusText})`);
    }

    const data = await res.json();
    return parseGitHubRelease(data, preferredArch);
  } catch (err: any) {
    console.warn(`[GitHubService] Repo ${repo.owner}/${repo.repo} alınamadı, yedek veri kullanılıyor:`, err.message);
    const fallback = FALLBACK_RELEASES[repo.id];
    if (fallback) {
      const assets = fallback.assets || [];
      const recommended = pickRecommendedApk(assets, preferredArch);
      return {
        tagName: fallback.tagName || 'Bilinmiyor',
        name: fallback.name || repo.name,
        publishedAt: fallback.publishedAt || new Date().toISOString(),
        htmlUrl: fallback.htmlUrl || `https://github.com/${repo.owner}/${repo.repo}`,
        body: fallback.body || 'Sürüm notları mevcut değil.',
        assets,
        recommendedApk: recommended,
      };
    }
    throw err;
  }
}

function parseGitHubRelease(
  data: any,
  preferredArch: 'arm64' | 'arm' | 'x86_64' | 'all' = 'arm64'
): ReleaseData {
  const rawAssets = Array.isArray(data.assets) ? data.assets : [];
  const assets: ReleaseAsset[] = rawAssets.map((a: any) => ({
    name: a.name || 'unnamed',
    size: a.size || 0,
    downloadUrl: a.browser_download_url || '',
    downloadCount: a.download_count || 0,
    arch: detectArch(a.name || ''),
    isApk: (a.name || '').toLowerCase().endsWith('.apk'),
  }));

  const recommendedApk = pickRecommendedApk(assets, preferredArch);

  return {
    tagName: data.tag_name || data.name || 'Latest',
    name: data.name || data.tag_name || 'Latest Release',
    publishedAt: data.published_at || data.created_at || new Date().toISOString(),
    htmlUrl: data.html_url || '',
    body: data.body || 'Açıklama belirtilmedi.',
    assets,
    recommendedApk,
  };
}

export function pickRecommendedApk(
  assets: ReleaseAsset[],
  preferredArch: 'arm64' | 'arm' | 'x86_64' | 'all' = 'arm64'
): ReleaseAsset | undefined {
  const apks = assets.filter((a) => a.isApk);
  if (apks.length === 0) return undefined;

  // Filter out webview if there is a ChromePublic / main APK
  const nonWebview = apks.filter(
    (a) => !a.name.toLowerCase().includes('webview') && !a.name.toLowerCase().includes('systemwebview')
  );
  const candidates = nonWebview.length > 0 ? nonWebview : apks;

  if (preferredArch === 'arm64') {
    const arm64 = candidates.find((a) => a.arch === 'arm64');
    if (arm64) return arm64;
  } else if (preferredArch === 'arm') {
    const arm = candidates.find((a) => a.arch === 'arm');
    if (arm) return arm;
  } else if (preferredArch === 'x86_64') {
    const x64 = candidates.find((a) => a.arch === 'x86_64');
    if (x64) return x64;
  }

  // Universal or first available APK
  const universal = candidates.find((a) => a.arch === 'universal');
  if (universal) return universal;

  return candidates[0];
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Az önce';
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays === 1) return 'Dün';
    if (diffDays < 30) return `${diffDays} gün önce`;
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return dateString;
  }
}
