import React, { useState } from 'react';
import {
  X,
  KeyRound,
  ShieldCheck,
  Download,
  Copy,
  Check,
  FileKey,
  Lock,
  Calendar,
  CheckCircle2,
  Terminal,
  Cpu
} from 'lucide-react';

interface KeystoreModalProps {
  onClose: () => void;
}

export const KeystoreModal: React.FC<KeystoreModalProps> = ({ onClose }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const keystoreData = {
    applicationId: 'org.universish.Labs.kromguncelleyici',
    keystoreFile: 'my-upload-key.jks',
    keyAlias: 'upload',
    storePassword: 'zRujrp6KCK9jzm5HHy9MlhJPAMoXtpXYPtfFceJKyXaSqdPhnbpDgWbooljloB0I7fnAdTNtLTd8l1nMC2hGaCL5sFeQBhz5ghIizC9jURpW3xXIjC9Nciy43bXplFBn',
    keyPassword: 'zRujrp6KCK9jzm5HHy9MlhJPAMoXtpXYPtfFceJKyXaSqdPhnbpDgWbooljloB0I7fnAdTNtLTd8l1nMC2hGaCL5sFeQBhz5ghIizC9jURpW3xXIjC9Nciy43bXplFBn',
    algorithm: 'RSA 2048-bit (PKCS#12 / JKS)',
    validity: '10.000 Gün (~28 Yıl - 2054\'e kadar geçerli)',
    subject: 'CN=UniversishLabs, OU=Labs, O=org.universish.Labs.kromguncelleyici, C=TR',
    sha256: '9E:DA:29:46:E3:C0:A9:52:C1:2D:AB:58:25:F2:2B:3C:7A:5A:B0:14:FB:C5:D7:CD:60:1F:27:61:82:B8:E0:03',
    sha1: '03:2E:6C:64:5F:A8:26:95:6C:A2:BF:5F:FB:B2:DC:62:67:A8:71:E4',
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Şifreli İmza & Keystore Bilgileri
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
                  Aktif
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Uygulama: <span className="text-cyan-400 font-mono">{keystoreData.applicationId}</span>
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

        {/* Content Body */}
        <div className="p-6 space-y-5 text-sm overflow-y-auto max-h-[75vh]">
          {/* Status Banner */}
          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-200/90 space-y-1">
              <p className="font-semibold text-emerald-300 text-sm">
                Güvenli PKCS#12 / JKS İmzası Başarıyla Oluşturuldu
              </p>
              <p>
                İmza anahtarı ve sertifikası proje kök dizinine yerleştirildi. Release derlemeleri bu şifreli anahtar ile otomatik imzalanır.
              </p>
            </div>
          </div>

          {/* Keystore Credential Rows */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              İmza Anahtarı ve Şifreleme Parametreleri
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-400">Anahtar Deposu (Keystore Dosyası):</span>
                <div className="font-mono text-white font-semibold flex items-center justify-between">
                  <span>{keystoreData.keystoreFile}</span>
                  <button
                    onClick={() => copyToClipboard(keystoreData.keystoreFile, 'file')}
                    className="text-slate-500 hover:text-cyan-400"
                  >
                    {copiedField === 'file' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-400">Anahtar Takma Adı (Key Alias):</span>
                <div className="font-mono text-cyan-300 font-semibold flex items-center justify-between">
                  <span>{keystoreData.keyAlias}</span>
                  <button
                    onClick={() => copyToClipboard(keystoreData.keyAlias, 'alias')}
                    className="text-slate-500 hover:text-cyan-400"
                  >
                    {copiedField === 'alias' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Anahtar Şifresi (128-Karakterli Rastgele):</span>
                  <button
                    onClick={() => copyToClipboard(keystoreData.keyPassword, 'pw')}
                    className="text-slate-500 hover:text-cyan-400 flex items-center gap-1 text-xs"
                  >
                    {copiedField === 'pw' ? <span className="text-emerald-400 flex items-center gap-1"><Check className="w-3.5 h-3.5" /> Kopyalandı</span> : <span className="flex items-center gap-1"><Copy className="w-3.5 h-3.5" /> Kopyala</span>}
                  </button>
                </div>
                <div className="font-mono text-xs text-amber-300 font-semibold break-all bg-slate-900/90 p-2 rounded-lg border border-amber-500/20">
                  {keystoreData.keyPassword}
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-slate-400">Geçerlilik Süresi:</span>
                <div className="font-mono text-slate-200 font-medium">
                  {keystoreData.validity}
                </div>
              </div>
            </div>
          </div>

          {/* Certificate Fingerprints */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Sertifika Parmak İzleri (Fingerprints)
            </h3>

            <div className="space-y-2">
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>SHA-256 Parmak İzi:</span>
                  <button
                    onClick={() => copyToClipboard(keystoreData.sha256, 'sha256')}
                    className="text-slate-500 hover:text-cyan-400 flex items-center gap-1"
                  >
                    {copiedField === 'sha256' ? (
                      <span className="text-emerald-400">Kopyalandı</span>
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <div className="font-mono text-[11px] text-emerald-400 break-all">
                  {keystoreData.sha256}
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>SHA-1 Parmak İzi:</span>
                  <button
                    onClick={() => copyToClipboard(keystoreData.sha1, 'sha1')}
                    className="text-slate-500 hover:text-cyan-400 flex items-center gap-1"
                  >
                    {copiedField === 'sha1' ? (
                      <span className="text-emerald-400">Kopyalandı</span>
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
                <div className="font-mono text-[11px] text-cyan-300 break-all">
                  {keystoreData.sha1}
                </div>
              </div>
            </div>
          </div>

          {/* Gradle Signing Config Block */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Gradle Derleme ve İmzalama Yapılandırması
            </h3>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto">
              <code>{`signingConfigs {
  create("release") {
    storeFile = file("\${rootDir}/my-upload-key.jks")
    storePassword = "UniversishSecret2026!"
    keyAlias = "upload"
    keyPassword = "UniversishSecret2026!"
  }
}
buildTypes {
  release {
    signingConfig = signingConfigs.getByName("release")
  }
}`}</code>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            İmza dosyası (my-upload-key.jks) hazır
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
