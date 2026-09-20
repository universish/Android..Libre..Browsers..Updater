import React, { useState } from 'react';
import { X, Code2, Smartphone, Download, Copy, Check, Terminal } from 'lucide-react';

interface AndroidSourceModalProps {
  onClose: () => void;
}

export const AndroidSourceModal: React.FC<AndroidSourceModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'manifest' | 'installer' | 'dailyWorker'>('installer');

  const installerCode = `// Android APK İndirme ve Doğrudan Kurulum Kodu (Kotlin)
package com.example.updater

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import androidx.core.content.FileProvider
import java.io.File

class ApkInstallerHelper(private val context: Context) {

    fun installApk(apkFile: File) {
        if (!apkFile.exists()) return

        // Android 8.0 (API 26) ve üzeri Bilinmeyen Kaynaklar izni kontrolü
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            if (!context.packageManager.canRequestPackageInstalls()) {
                val settingsIntent = Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES).apply {
                    data = Uri.parse("package:\${context.packageName}")
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK
                }
                context.startActivity(settingsIntent)
                return
            }
        }

        // FileProvider ile güvenli content:// URI oluşturma
        val apkUri: Uri = FileProvider.getUriForFile(
            context,
            "\${context.packageName}.fileprovider",
            apkFile
        )

        // Android Paket Yükleyici (PackageInstaller) Intent'i başlat
        val installIntent = Intent(Intent.ACTION_VIEW).apply {
            setDataAndType(apkUri, "application/vnd.android.package-archive")
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_GRANT_READ_URI_PERMISSION
        }

        context.startActivity(installIntent)
    }
}`;

  const manifestCode = `<!-- AndroidManifest.xml Yetkileri ve FileProvider Tanımı -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <!-- Paket tespiti için queries (Android 11+) -->
    <queries>
        <package android:name="org.chromium.thorium" />
        <package android:name="org.cromite.cromite" />
        <package android:name="org.ironfox" />
        <package android:name="org.titanium" />
    </queries>

    <application>
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="\${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>
    </application>
</manifest>`;

  const dailyWorkerCode = `// Günde 1 Kez Arka Planda Güncelleme Kontrolcüsü (Kotlin / WorkManager)
package com.example.updater

import android.content.Context
import androidx.work.*
import java.util.concurrent.TimeUnit

class DailyUpdateWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        // Thorium, Cromite, Titanium ve IronFox son sürümlerini GitHub API'den kontrol et
        val repos = listOf(
            "Alex313031/Thorium-Android",
            "MidarDev/Thorium-Android",
            "uazo/cromite",
            "TitaniumBrowser/Titanium",
            "Gusted/IronFox"
        )
        // Yeni sürüm varsa sistem bildirimi oluştur
        return Result.success()
    }

    companion object {
        fun scheduleDailyCheck(context: Context) {
            val constraints = Constraints.Builder()
                .setRequiredNetworkType(NetworkType.CONNECTED)
                .build()

            // Günde 1 kez (24 saatte bir) periyodik çalışma
            val dailyRequest = PeriodicWorkRequestBuilder<DailyUpdateWorker>(24, TimeUnit.HOURS)
                .setConstraints(constraints)
                .build()

            WorkManager.getInstance(context).enqueueUniquePeriodicWork(
                "DailyBrowserCheck",
                ExistingPeriodicWorkPolicy.KEEP,
                dailyRequest
            )
        }
    }
}`;

  const currentCode =
    activeTab === 'installer'
      ? installerCode
      : activeTab === 'manifest'
      ? manifestCode
      : dailyWorkerCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Yerel Android (Kotlin) Kaynak Kodları</h2>
              <p className="text-xs text-slate-400">
                Doğrudan Android Studio'da derlenebilir APK yükleyici ve günlük takipçi mantığı
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-6 py-2">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('installer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'installer'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ApkInstallerHelper.kt
            </button>
            <button
              onClick={() => setActiveTab('dailyWorker')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dailyWorker'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              DailyUpdateWorker.kt (24h)
            </button>
            <button
              onClick={() => setActiveTab('manifest')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'manifest'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              AndroidManifest.xml
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Kopyalandı!' : 'Kodu Kopyala'}
          </button>
        </div>

        {/* Code Viewer */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-950">
          <pre className="font-mono text-xs text-emerald-400/90 leading-relaxed overflow-x-auto whitespace-pre">
            <code>{currentCode}</code>
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-400">
          <span>Tüm bu dosyalar projedeki <code>/app/src/main/</code> dizinine yerleştirilmiştir.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
