import React, { useState, useEffect } from 'react';
import {
  Globe,
  RefreshCw,
  Download,
  Smartphone,
  Sliders,
  Plus,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Tag,
  Calendar,
  Layers,
  Sparkles,
  ChevronRight,
  Code2,
  HardDrive,
  Cpu,
  Check,
  Bell,
  Search,
  Filter,
  KeyRound
} from 'lucide-react';
import { BrowserRepo, ReleaseAsset, DownloadedApk, SettingsState } from './types';
import {
  INITIAL_REPOS,
  fetchLatestRelease,
  formatBytes,
  formatRelativeTime,
  pickRecommendedApk
} from './services/githubService';
import { ReleaseDetailsModal } from './components/ReleaseDetailsModal';
import { InstallGuideModal } from './components/InstallGuideModal';
import { AddRepoModal } from './components/AddRepoModal';
import { SettingsModal } from './components/SettingsModal';
import { AndroidSourceModal } from './components/AndroidSourceModal';
import { KeystoreModal } from './components/KeystoreModal';

const SETTINGS_STORAGE_KEY = 'browser_updater_settings_v1';
const REPOS_STORAGE_KEY = 'browser_updater_repos_v1';
const DOWNLOADS_STORAGE_KEY = 'browser_updater_downloads_v1';

export const App: React.FC = () => {
  // Settings
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      dailyCheckEnabled: true,
      checkIntervalHours: 24,
      lastDailyCheckTimestamp: Date.now() - 2 * 3600 * 1000,
      preferredArch: 'arm64',
      notifyOnNewRelease: true,
      autoDownload: false,
    };
  });

  // Repositories
  const [repos, setRepos] = useState<BrowserRepo[]>(() => {
    const saved = localStorage.getItem(REPOS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_REPOS;
  });

  // Downloads
  const [downloads, setDownloads] = useState<DownloadedApk[]>(() => {
    const saved = localStorage.getItem(DOWNLOADS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // UI States
  const [isRefreshingAll, setIsRefreshingAll] = useState(false);
  const [selectedRepoForDetails, setSelectedRepoForDetails] = useState<BrowserRepo | null>(null);
  const [selectedAssetForInstall, setSelectedAssetForInstall] = useState<{
    asset: ReleaseAsset;
    browserName: string;
  } | null>(null);
  const [showAddRepoModal, setShowAddRepoModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAndroidSourceModal, setShowAndroidSourceModal] = useState(false);
  const [showKeystoreModal, setShowKeystoreModal] = useState(false);
  const [showInstallTestModal, setShowInstallTestModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'chromium' | 'firefox' | 'downloads'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>(
    typeof Notification !== 'undefined' ? Notification.permission : 'unsupported'
  );

  // Save changes
  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(REPOS_STORAGE_KEY, JSON.stringify(repos));
  }, [repos]);

  useEffect(() => {
    localStorage.setItem(DOWNLOADS_STORAGE_KEY, JSON.stringify(downloads));
  }, [downloads]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Check initial or daily update
  const checkSingleRepo = async (repo: BrowserRepo): Promise<BrowserRepo> => {
    try {
      const release = await fetchLatestRelease(repo, settings.githubToken, settings.preferredArch);
      return {
        ...repo,
        lastRelease: release,
        lastChecked: Date.now(),
        isLoading: false,
        error: null,
      };
    } catch (err: any) {
      return {
        ...repo,
        isLoading: false,
        error: err.message || 'Hata oluştu',
      };
    }
  };

  const refreshAllRepos = async () => {
    setIsRefreshingAll(true);
    showToast('Depolar kontrol ediliyor (Thorium, Cromite, Titanium, IronFox)...');

    const updated = await Promise.all(
      repos.map(async (repo) => {
        return await checkSingleRepo(repo);
      })
    );

    setRepos(updated);
    setSettings((prev) => ({
      ...prev,
      lastDailyCheckTimestamp: Date.now(),
    }));
    setIsRefreshingAll(false);
    showToast('Tüm tarayıcı sürümleri güncellendi!');

    // Check if new version detected and send notification if enabled
    if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      try {
        new Notification('Tarayıcı Güncelleyici', {
          body: 'Günlük kontrol tamamlandı. Thorium, Cromite ve IronFox için en son sürümler hazır.',
          icon: '/icon.png',
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Initial load if releases are missing
  useEffect(() => {
    const hasMissingReleases = repos.some((r) => !r.lastRelease);
    const hoursSinceLastCheck = (Date.now() - settings.lastDailyCheckTimestamp) / (1000 * 3600);

    if (hasMissingReleases || (settings.dailyCheckEnabled && hoursSinceLastCheck >= settings.checkIntervalHours)) {
      refreshAllRepos();
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (typeof Notification === 'undefined') {
      alert('Bu tarayıcı bildirimleri desteklemiyor.');
      return;
    }
    const res = await Notification.requestPermission();
    setNotificationPermission(res);
    if (res === 'granted') {
      showToast('Bildirim izni verildi! Yeni sürümler bildirilecek.');
      new Notification('Tarayıcı Güncelleyici', {
        body: 'Günlük güncelleme bildirimleri başarıyla etkinleştirildi.',
      });
    }
  };

  const handleDownloadApk = (repo: BrowserRepo, asset?: ReleaseAsset) => {
    const targetAsset = asset || repo.lastRelease?.recommendedApk;
    if (!targetAsset) {
      showToast('İndirilecek uygun APK dosyası bulunamadı.');
      return;
    }

    // Trigger browser direct download
    const link = document.createElement('a');
    link.href = targetAsset.downloadUrl;
    link.download = targetAsset.name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Track download in list
    const newDownload: DownloadedApk = {
      id: `dl-${Date.now()}`,
      repoId: repo.id,
      browserName: repo.name,
      version: repo.lastRelease?.tagName || 'Güncel',
      fileName: targetAsset.name,
      fileSize: targetAsset.size,
      downloadedAt: Date.now(),
      downloadUrl: targetAsset.downloadUrl,
      arch: targetAsset.arch,
      status: 'completed',
      progress: 100,
    };

    setDownloads((prev) => [newDownload, ...prev]);
    showToast(`${targetAsset.name} indirmesi başlatıldı!`);
  };

  const handleInstallApk = (repo: BrowserRepo, asset?: ReleaseAsset) => {
    const targetAsset = asset || repo.lastRelease?.recommendedApk;
    if (!targetAsset) return;

    setSelectedAssetForInstall({
      asset: targetAsset,
      browserName: repo.name,
    });
  };

  const handleAddRepo = (newRepo: BrowserRepo) => {
    setRepos((prev) => [...prev, newRepo]);
    checkSingleRepo(newRepo).then((withRelease) => {
      setRepos((prev) => prev.map((r) => (r.id === newRepo.id ? withRelease : r)));
    });
    showToast(`${newRepo.name} listeye eklendi ve kontrol edildi.`);
  };

  const handleClearCache = () => {
    setDownloads([]);
    showToast('İndirilenler önbelleği temizlendi.');
  };

  // Filtered repos
  const filteredRepos = repos.filter((r) => {
    if (activeTab === 'chromium' && r.category !== 'chromium_fork') return false;
    if (activeTab === 'firefox' && r.category !== 'firefox_fork') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.owner.toLowerCase().includes(q) ||
        r.repo.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Toast message */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-cyan-600 text-white px-5 py-3 rounded-2xl shadow-2xl shadow-cyan-500/30 flex items-center gap-3 border border-cyan-400/40 text-sm font-medium animate-slide-up">
          <Sparkles className="w-5 h-5 text-cyan-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/30">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight text-white flex items-center gap-2">
                  org.universish.Labs.kromguncelleyici
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    İmzalı APK
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400">
                Thorium (Resmi & 2. Hesap), Cromite, Titanium & IronFox günlük APK takip, indirme ve kurulum yöneticisi
              </p>
            </div>
          </div>

          {/* Quick Actions Header */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Daily schedule status pill */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Günde 1 Kez Takip: <strong className="text-emerald-400 font-medium">Aktif</strong></span>
            </div>

            <button
              onClick={refreshAllRepos}
              disabled={isRefreshingAll}
              className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 active:scale-95 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-md shadow-cyan-600/25"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingAll ? 'animate-spin' : ''}`} />
              {isRefreshingAll ? 'Kontrol Ediliyor...' : 'Şimdi Kontrol Et'}
            </button>

            <button
              onClick={() => setShowInstallTestModal(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-md shadow-emerald-700/30 border border-emerald-400/40"
              title="APK Kurulumunu ve Paket Yükleyiciyi Test Et"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
              <span>Kurulumu Test Et</span>
            </button>

            <a
              href="/org.universish.Labs.kromguncelleyici.apk"
              download="org.universish.Labs.kromguncelleyici.apk"
              className="px-3.5 py-2 bg-cyan-700/80 hover:bg-cyan-600 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all border border-cyan-500/40"
              title="128-Haneli Şifreli İmzalı Gerçek APK'yı İndir"
            >
              <Download className="w-3.5 h-3.5" />
              <span>İmzalı APK ({'61 KB'})</span>
            </a>

            <button
              onClick={() => setShowKeystoreModal(true)}
              className="px-3 py-2 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-600/40 transition-colors shadow-sm"
              title="128-Karakterli Şifreli İmza & Keystore Bilgileri"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">128-Hane İmza</span>
            </button>

            <button
              onClick={() => setShowAndroidSourceModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-medium flex items-center gap-2 border border-slate-700 transition-colors"
              title="Yerel Android Kotlin Kaynak Kodları"
            >
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Android APK Kodu</span>
            </button>

            <button
              onClick={() => setShowSettingsModal(true)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs flex items-center justify-center border border-slate-700 transition-colors"
              title="Ayarlar & Günlük Takip"
            >
              <Sliders className="w-4 h-4" />
            </button>

            <button
              onClick={() => setShowAddRepoModal(true)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs flex items-center justify-center border border-slate-700 transition-colors"
              title="Özel Depo Ekle"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6 flex-1">
        {/* Banner Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/50 border border-slate-800 p-6 md:p-8">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Günde 1 Kez Otomatik GitHub Sürüm Denetimi
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Chromium Çatalları ve IronFox Güncelleme Merkezi
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Google Play Store'da yer almayan yüksek performanslı <strong className="text-cyan-400">Thorium</strong> (resmi ve 2. derleyici hesabı), yerleşik reklam engelleyicili <strong className="text-cyan-400">Cromite</strong>, hafif <strong className="text-cyan-400">Titanium</strong> ve telemetrisiz <strong className="text-cyan-400">IronFox</strong> resmi depolarından en son APK sürümlerini takip edin ve telefonunuza anında kurun.
            </p>

            <div className="flex items-center gap-4 pt-2 text-xs text-slate-400 flex-wrap">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Resmi GitHub Kaynaklı APK'lar
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Varsayılan: ARM64-v8a Optimize
              </span>
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Clock className="w-4 h-4 text-amber-400" />
                Son Kontrol: {formatRelativeTime(new Date(settings.lastDailyCheckTimestamp).toISOString())}
              </span>
            </div>
          </div>
        </div>

        {/* Tab & Search Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'all'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tüm Tarayıcılar ({repos.length})
            </button>
            <button
              onClick={() => setActiveTab('chromium')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'chromium'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Chromium Çatalları ({repos.filter((r) => r.category === 'chromium_fork').length})
            </button>
            <button
              onClick={() => setActiveTab('firefox')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeTab === 'firefox'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Firefox / IronFox ({repos.filter((r) => r.category === 'firefox_fork').length})
            </button>
            <button
              onClick={() => setActiveTab('downloads')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                activeTab === 'downloads'
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Download className="w-3.5 h-3.5" />
              İndirilenler ({downloads.length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tarayıcı veya depo ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Tab 1: Browser Cards */}
        {activeTab !== 'downloads' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRepos.map((repo) => {
              const release = repo.lastRelease;
              const recommendedApk = release?.recommendedApk;

              return (
                <div
                  key={repo.id}
                  className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 shadow-xl group"
                >
                  {/* Card Header */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                          {repo.badge}
                        </span>
                        <h3 className="text-base font-bold text-white mt-1.5 group-hover:text-cyan-400 transition-colors">
                          {repo.name}
                        </h3>
                        <a
                          href={`https://github.com/${repo.owner}/${repo.repo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-400 hover:text-cyan-300 transition-colors mt-0.5"
                        >
                          {repo.owner}/{repo.repo}
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedRepoForDetails(repo);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                        title="Sürüm Ayrıntıları ve Notlar"
                      >
                        <Layers className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {repo.description}
                    </p>

                    {/* Release Info Box */}
                    <div className="p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">En Güncel Sürüm:</span>
                        <span className="font-mono font-bold text-cyan-300 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {release ? release.tagName : 'Kontrol ediliyor...'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Yayınlanma:</span>
                        <span>
                          {release ? formatRelativeTime(release.publishedAt) : '—'}
                        </span>
                      </div>

                      {repo.packageName && (
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800/60">
                          <span>Paket Kimliği:</span>
                          <span className="truncate max-w-[150px]">{repo.packageName}</span>
                        </div>
                      )}
                    </div>

                    {/* Recommended APK Asset Info */}
                    {recommendedApk ? (
                      <div className="p-3 bg-cyan-950/20 border border-cyan-800/40 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-white flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            Önerilen APK ({recommendedApk.arch.toUpperCase()}):
                          </span>
                          <span className="font-mono text-cyan-300 text-xs font-medium">
                            {formatBytes(recommendedApk.size)}
                          </span>
                        </div>
                        <p className="font-mono text-[11px] text-slate-300 truncate" title={recommendedApk.name}>
                          {recommendedApk.name}
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-xl text-center text-xs text-slate-500">
                        APK varlığı bulunamadı veya yükleniyor...
                      </div>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="pt-4 border-t border-slate-800/70 mt-4 flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadApk(repo)}
                      disabled={!recommendedApk}
                      className="flex-1 py-2.5 px-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 active:scale-95 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
                    >
                      <Download className="w-4 h-4" />
                      APK İndir
                    </button>

                    <button
                      onClick={() => handleInstallApk(repo)}
                      disabled={!recommendedApk}
                      className="py-2.5 px-3.5 bg-slate-800 hover:bg-slate-700 active:scale-95 disabled:opacity-50 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
                      title="Android Cihazda Doğrudan Kurulum Rehberi"
                    >
                      <Smartphone className="w-4 h-4 text-cyan-400" />
                      Kur
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Downloads & Installed History */}
        {activeTab === 'downloads' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">İndirilen APK Dosyaları</h3>
                <p className="text-xs text-slate-400">
                  Bu cihaz üzerinden indirilen ve kuruluma hazır paketler
                </p>
              </div>
              {downloads.length > 0 && (
                <button
                  onClick={handleClearCache}
                  className="text-xs text-rose-400 hover:text-rose-300 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 transition-colors"
                >
                  Listeyi Temizle
                </button>
              )}
            </div>

            {downloads.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
                  <Download className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-white text-sm">Henüz APK İndirilmedi</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Thorium, Cromite veya IronFox kartlarındaki <strong className="text-cyan-400">"APK İndir"</strong> butonuna basarak indirme başlatabilirsiniz.
                </p>
              </div>
            ) : (
              <div className="grid gap-3">
                {downloads.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{item.browserName}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                          {item.version}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-semibold">
                          {item.arch}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-slate-400">{item.fileName}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{formatBytes(item.fileSize)}</span>
                        <span>•</span>
                        <span>{formatRelativeTime(new Date(item.downloadedAt).toISOString())}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={item.downloadUrl}
                        download={item.fileName}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Tekrar İndir
                      </a>
                      <button
                        onClick={() => {
                          setSelectedAssetForInstall({
                            asset: {
                              name: item.fileName,
                              size: item.fileSize,
                              downloadUrl: item.downloadUrl,
                              downloadCount: 0,
                              arch: item.arch as any,
                              isApk: true,
                            },
                            browserName: item.browserName,
                          });
                        }}
                        className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-600/20"
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        Kurulum Rehberi
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Feature Highlights Footer info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Thorium Resmi & 2. Hesap
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Alex313031'in resmi AVX2 derlemesi ve MidarDev'in otomatik sürekli derleme deposu yan yana takip edilir.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Cromite (uazo)
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Bromite ardılı, yerleşik katı reklam engelleyici ve parmak izi korumalı lider gizlilik odaklı Chromium.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Titanium Browser
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Ultra hızlı, minimal arayüzlü ve modern Chromium mobil deneyimi.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-1.5">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span>
              IronFox Browser
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Mozilla Firefox / Gecko motorlu, telemetrisiz sıkılaştırılmış resmi Android tarayıcısı.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 Chromium Forks & IronFox Güncelleyici — Günde 1 Kez Otomatik Takip Sistemi</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowAndroidSourceModal(true)}
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <Code2 className="w-3.5 h-3.5" />
              Kotlin Android Kaynakları
            </button>
            <a
              href="https://github.com/Alex313031/Thorium-Android"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-400 transition-colors"
            >
              Thorium
            </a>
            <a
              href="https://github.com/uazo/cromite"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-400 transition-colors"
            >
              Cromite
            </a>
            <a
              href="https://github.com/Gusted/IronFox"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-slate-400 transition-colors"
            >
              IronFox
            </a>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedRepoForDetails && (
        <ReleaseDetailsModal
          repo={selectedRepoForDetails}
          onClose={() => setSelectedRepoForDetails(null)}
          onDownloadAsset={(asset) => handleDownloadApk(selectedRepoForDetails, asset)}
          onInstallAsset={(asset) => handleInstallApk(selectedRepoForDetails, asset)}
        />
      )}

      {selectedAssetForInstall && (
        <InstallGuideModal
          asset={selectedAssetForInstall.asset}
          browserName={selectedAssetForInstall.browserName}
          onClose={() => setSelectedAssetForInstall(null)}
          onDownloadNow={() => {
            if (selectedAssetForInstall) {
              const link = document.createElement('a');
              link.href = selectedAssetForInstall.asset.downloadUrl;
              link.download = selectedAssetForInstall.asset.name;
              link.target = '_blank';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              showToast(`${selectedAssetForInstall.asset.name} indirmesi başlatıldı!`);
            }
          }}
        />
      )}

      {showAddRepoModal && (
        <AddRepoModal
          onClose={() => setShowAddRepoModal(false)}
          onAddRepo={handleAddRepo}
        />
      )}

      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={(newSettings) => setSettings((prev) => ({ ...prev, ...newSettings }))}
          onClearCache={handleClearCache}
          onRequestNotificationPermission={requestNotificationPermission}
          notificationPermission={notificationPermission}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {showAndroidSourceModal && (
        <AndroidSourceModal onClose={() => setShowAndroidSourceModal(false)} />
      )}

      {showKeystoreModal && (
        <KeystoreModal onClose={() => setShowKeystoreModal(false)} />
      )}

      {showInstallTestModal && (
        <InstallGuideModal
          initialTab="test"
          browserName="Krom Güncelleyici APK"
          onClose={() => setShowInstallTestModal(false)}
        />
      )}
    </div>
  );
};

export default App;
