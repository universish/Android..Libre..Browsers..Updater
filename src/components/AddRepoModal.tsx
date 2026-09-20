import React, { useState } from 'react';
import { X, Plus, GitBranch, Check } from 'lucide-react';
import { BrowserRepo } from '../types';

interface AddRepoModalProps {
  onClose: () => void;
  onAddRepo: (repo: BrowserRepo) => void;
}

export const AddRepoModal: React.FC<AddRepoModalProps> = ({ onClose, onAddRepo }) => {
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [repo, setRepo] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'chromium_fork' | 'firefox_fork'>('chromium_fork');
  const [packageName, setPackageName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !owner || !repo) return;

    const newRepo: BrowserRepo = {
      id: `custom-${Date.now()}`,
      name: name.trim(),
      category,
      owner: owner.trim(),
      repo: repo.trim(),
      description: description.trim() || 'Özel eklenen tarayıcı deposu.',
      tagline: 'Kullanıcı Tanımlı Özel Depo',
      badge: category === 'chromium_fork' ? 'Özel Chromium' : 'Özel Gecko',
      defaultBranch: 'main',
      preferredArch: 'arm64',
      apkPattern: ['apk'],
      packageName: packageName.trim() || 'com.custom.browser',
    };

    onAddRepo(newRepo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <GitBranch className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Yeni GitHub Deposu Ekle</h2>
              <p className="text-xs text-slate-400">Takip edilecek çatal veya tarayıcı deposunu tanımlayın</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tarayıcı Adı <span className="text-cyan-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Thorium Canary / Vanadium"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                GitHub Sahibi (Owner) <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Örn: Alex313031 veya MidarDev"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Depo Adı (Repo) <span className="text-cyan-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Örn: Thorium-Android"
                value={repo}
                onChange={(e) => setRepo(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
              >
                <option value="chromium_fork">Chromium Çatalı</option>
                <option value="firefox_fork">Firefox / Gecko Çatalı</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Paket Adı (Opsiyonel)</label>
              <input
                type="text"
                placeholder="org.chromium.custom"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Açıklama (Opsiyonel)</label>
            <textarea
              rows={2}
              placeholder="Özel derleme veya takip notları..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500 transition-colors resize-none"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20"
            >
              <Plus className="w-4 h-4" />
              Depoyu Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
