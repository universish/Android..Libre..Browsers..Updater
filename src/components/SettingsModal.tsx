import React from 'react';
import {
  X,
  Clock,
  Bell,
  Cpu,
  Key,
  Trash2,
  CheckCircle2,
  Sliders,
  ShieldAlert
} from 'lucide-react';
import { SettingsState } from '../types';

interface SettingsModalProps {
  settings: SettingsState;
  onUpdateSettings: (newSettings: Partial<SettingsState>) => void;
  onClearCache: () => void;
  onRequestNotificationPermission: () => void;
  notificationPermission: NotificationPermission | 'unsupported';
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onClearCache,
  onRequestNotificationPermission,
  notificationPermission,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Günlük Takip ve Sistem Ayarları</h2>
              <p className="text-xs text-slate-400">Otomatik kontrol periyodu ve tercihleri yapılandırın</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 text-sm overflow-y-auto max-h-[75vh]">
          {/* Daily 24h Check Section */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="font-semibold text-white text-xs">Günde 1 Kez Otomatik Takip</h4>
                  <p className="text-[11px] text-slate-400">
                    24 saatte bir tüm GitHub depolarını arka planda kontrol eder
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.dailyCheckEnabled}
                  onChange={(e) => onUpdateSettings({ dailyCheckEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            <div className="pt-2 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
              <span>Son Kontrol Zamanı:</span>
              <span className="font-mono text-cyan-300">
                {settings.lastDailyCheckTimestamp
                  ? new Date(settings.lastDailyCheckTimestamp).toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: 'numeric',
                      month: 'short',
                    })
                  : 'Henüz yapılmadı'}
              </span>
            </div>
          </div>

          {/* Architecture Selector */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="font-semibold text-white text-xs">Cihaz / Mimari Tercihi</h4>
                <p className="text-[11px] text-slate-400">
                  Otomatik seçilecek ve indirilecek APK işlemci mimarisi
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                { id: 'arm64', label: 'ARM64 (v8a)', desc: 'Modern telefonların %99\'u (Önerilen)' },
                { id: 'arm', label: 'ARMv7 (32-bit)', desc: 'Eski veya 32-bit Android cihazlar' },
                { id: 'x86_64', label: 'x86_64', desc: 'Emülatörler ve Intel/AMD cihazlar' },
                { id: 'all', label: 'Tüm Mimariler', desc: 'Filtreleme olmadan tüm APK\'ları göster' },
              ].map((arch) => (
                <button
                  key={arch.id}
                  type="button"
                  onClick={() => onUpdateSettings({ preferredArch: arch.id as any })}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    settings.preferredArch === arch.id
                      ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs text-white">{arch.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{arch.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Bell className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="font-semibold text-white text-xs">Yeni Sürüm Bildirimleri</h4>
                <p className="text-[11px] text-slate-400">
                  Yeni bir APK yayınlandığında masaüstü veya mobil bildirim gönder
                </p>
              </div>
            </div>

            {notificationPermission === 'granted' ? (
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                İzin Verildi
              </span>
            ) : (
              <button
                type="button"
                onClick={onRequestNotificationPermission}
                className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                İzin İste
              </button>
            )}
          </div>

          {/* GitHub Token (Optional) */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2.5">
              <Key className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="font-semibold text-white text-xs">GitHub Kişisel Erişim Jetonu (İsteğe Bağlı)</h4>
                <p className="text-[11px] text-slate-400">
                  GitHub anonim istek sınırını (60 req/saat) aşmak için token girebilirsiniz
                </p>
              </div>
            </div>
            <input
              type="password"
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
              value={settings.githubToken || ''}
              onChange={(e) => onUpdateSettings({ githubToken: e.target.value })}
              className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Clear Cache */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
            <span>İndirilen APK geçmişi ve önbelleği:</span>
            <button
              type="button"
              onClick={onClearCache}
              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-lg font-medium flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Önbelleği Temizle
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-cyan-500/20"
          >
            Kaydet ve Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
