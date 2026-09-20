import React from 'react';
import {
  X,
  Calendar,
  Tag,
  ExternalLink,
  Download,
  FileCode,
  HardDrive,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { BrowserRepo, ReleaseAsset } from '../types';
import { formatBytes, formatRelativeTime } from '../services/githubService';

interface ReleaseDetailsModalProps {
  repo: BrowserRepo;
  onClose: () => void;
  onDownloadAsset: (asset: ReleaseAsset) => void;
  onInstallAsset: (asset: ReleaseAsset) => void;
}

export const ReleaseDetailsModal: React.FC<ReleaseDetailsModalProps> = ({
  repo,
  onClose,
  onDownloadAsset,
  onInstallAsset,
}) => {
  const release = repo.lastRelease;

  if (!release) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-slate-800 bg-slate-900">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-medium">
                {repo.name}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-mono">
                {repo.owner}/{repo.repo}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2.5">
              {release.name || release.tagName}
            </h2>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1.5 font-mono text-cyan-300">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                {release.tagName}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                {formatRelativeTime(release.publishedAt)} ({new Date(release.publishedAt).toLocaleDateString('tr-TR')})
              </span>
              {release.htmlUrl && (
                <a
                  href={release.htmlUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  GitHub'da Aç
                </a>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-300">
          {/* APK Assets List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-white flex items-center gap-2 text-base">
              <Layers className="w-4 h-4 text-cyan-400" />
              Yayınlanan İndirme Dosyaları (APK ve Varlıklar)
            </h3>

            <div className="grid gap-2.5">
              {release.assets.length === 0 ? (
                <p className="text-xs text-slate-500 py-3">Bu sürümde doğrudan APK dosyası bulunamadı.</p>
              ) : (
                release.assets.map((asset, idx) => {
                  const isRecommended = repo.lastRelease?.recommendedApk?.name === asset.name;
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                        isRecommended
                          ? 'bg-cyan-950/30 border-cyan-500/40 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs text-white font-medium truncate max-w-md">
                            {asset.name}
                          </span>
                          {isRecommended && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5" />
                              Önerilen APK (ARM64)
                            </span>
                          )}
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-semibold">
                            {asset.arch}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <HardDrive className="w-3 h-3 text-slate-500" />
                            {formatBytes(asset.size)}
                          </span>
                          {asset.downloadCount > 0 && (
                            <span>{asset.downloadCount.toLocaleString()} kez indirildi</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onDownloadAsset(asset)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          İndir
                        </button>
                        {asset.isApk && (
                          <button
                            onClick={() => onInstallAsset(asset)}
                            className="px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm shadow-cyan-600/30"
                          >
                            Kurulum Rehberi
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Release Notes Changelog */}
          <div className="space-y-2.5">
            <h3 className="font-semibold text-white flex items-center gap-2 text-base">
              <FileCode className="w-4 h-4 text-cyan-400" />
              Sürüm Değişiklik Günlüğü (Changelog)
            </h3>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap max-h-72 overflow-y-auto">
              {release.body || 'Ayrıntılı sürüm notu girilmemiş.'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
