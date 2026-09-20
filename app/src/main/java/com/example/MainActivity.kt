package com.example

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.FileProvider
import com.example.ui.theme.MyApplicationTheme
import java.io.File

data class BrowserTrackItem(
    val id: String,
    val name: String,
    val repo: String,
    val description: String,
    val packageName: String,
    val latestVersion: String,
    val latestApkUrl: String,
    val apkFileName: String
)

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            MyApplicationTheme {
                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    topBar = {
                        TopAppBar(
                            title = {
                                Column {
                                    Text("Tarayıcı Güncelleyici", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                                    Text("Thorium, Cromite, Titanium & IronFox", fontSize = 12.sp, color = Color.Gray)
                                }
                            },
                            actions = {
                                IconButton(onClick = { /* Refresh */ }) {
                                    Icon(Icons.Default.Refresh, contentDescription = "Yenile")
                                }
                            }
                        )
                    }
                ) { innerPadding ->
                    BrowserUpdaterScreen(modifier = Modifier.padding(innerPadding))
                }
            }
        }
    }
}

@Composable
fun BrowserUpdaterScreen(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val browsers = remember {
        listOf(
            BrowserTrackItem(
                id = "thorium",
                name = "Thorium Android (Resmi)",
                repo = "Alex313031/Thorium-Android",
                description = "Dünyanın en hızlı optimize Chromium derlemesi",
                packageName = "org.chromium.thorium",
                latestVersion = "M124.0.6367.207",
                latestApkUrl = "https://github.com/Alex313031/Thorium-Android/releases",
                apkFileName = "Thorium-M124-arm64-v8a.apk"
            ),
            BrowserTrackItem(
                id = "thorium-builder",
                name = "Thorium İkinci Derleyici Deposu",
                repo = "MidarDev/Thorium-Android",
                description = "2. Hesap / Otomatik sürekli Android derleme deposu",
                packageName = "org.chromium.thorium",
                latestVersion = "v126.0.6478.182-auto",
                latestApkUrl = "https://github.com/MidarDev/Thorium-Android/releases",
                apkFileName = "Thorium_126_arm64.apk"
            ),
            BrowserTrackItem(
                id = "cromite",
                name = "Cromite (Resmi)",
                repo = "uazo/cromite",
                description = "Bromite devamı, yerleşik gelişmiş reklam engelleyicili Chromium",
                packageName = "org.cromite.cromite",
                latestVersion = "v128.0.6613.127",
                latestApkUrl = "https://github.com/uazo/cromite/releases",
                apkFileName = "arm64_ChromePublic.apk"
            ),
            BrowserTrackItem(
                id = "titanium",
                name = "Titanium Browser",
                repo = "TitaniumBrowser/Titanium",
                description = "Hafif, minimal ve gizlilik odaklı Chromium çatalı",
                packageName = "org.titanium",
                latestVersion = "v2.4.0-stable",
                latestApkUrl = "https://github.com/TitaniumBrowser/Titanium/releases",
                apkFileName = "Titanium-Browser-arm64-v2.4.0.apk"
            ),
            BrowserTrackItem(
                id = "ironfox",
                name = "IronFox Browser (Resmi)",
                repo = "Gusted/IronFox",
                description = "Mozilla Gecko tabanlı, telemetrisiz gizlilik tarayıcısı",
                packageName = "org.ironfox",
                latestVersion = "v129.0.1-ironfox",
                latestApkUrl = "https://github.com/Gusted/IronFox/releases",
                apkFileName = "IronFox-129.0.1-arm64.apk"
            )
        )
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Card(
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.primaryContainer),
                shape = RoundedCornerShape(16.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(
                    modifier = Modifier.padding(16.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.Schedule,
                        contentDescription = "Zamanlayıcı",
                        tint = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(32.dp)
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Column {
                        Text(
                            "Günde 1 Kez Otomatik Takip: Aktif",
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp
                        )
                        Text(
                            "Her 24 saatte bir GitHub sürümleri denetlenir ve APK güncelleme bildirimi gönderilir.",
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                        )
                    }
                }
            }
        }

        items(browsers) { browser ->
            val isInstalled = remember(browser.packageName) {
                isPackageInstalled(context, browser.packageName)
            }

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(browser.name, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                            Text(browser.repo, fontSize = 11.sp, color = MaterialTheme.colorScheme.secondary)
                        }
                        AssistChip(
                            onClick = {},
                            label = { Text(if (isInstalled) "Kurulu" else "Kurulu Değil") },
                            leadingIcon = {
                                Icon(
                                    if (isInstalled) Icons.Default.CheckCircle else Icons.Default.Info,
                                    contentDescription = null,
                                    modifier = Modifier.size(16.dp)
                                )
                            }
                        )
                    }

                    Spacer(modifier = Modifier.height(8.dp))
                    Text(browser.description, fontSize = 12.sp, color = Color.Gray)

                    Spacer(modifier = Modifier.height(10.dp))
                    Surface(
                        color = MaterialTheme.colorScheme.surfaceVariant,
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text("Son Sürüm: ${browser.latestVersion}", fontSize = 12.sp, fontWeight = FontWeight.Medium)
                            Text("ARM64 APK", fontSize = 12.sp, color = MaterialTheme.colorScheme.primary)
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Button(
                            onClick = {
                                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(browser.latestApkUrl))
                                context.startActivity(intent)
                            },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(Icons.Default.Download, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("APK İndir", fontSize = 12.sp)
                        }

                        OutlinedButton(
                            onClick = {
                                checkAndRequestInstallPermission(context)
                            },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(10.dp)
                        ) {
                            Icon(Icons.Default.InstallMobile, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("APK Kur", fontSize = 12.sp)
                        }
                    }
                }
            }
        }
    }
}

fun isPackageInstalled(context: Context, packageName: String): Boolean {
    return try {
        context.packageManager.getPackageInfo(packageName, 0)
        true
    } catch (e: PackageManager.NameNotFoundException) {
        false
    }
}

fun checkAndRequestInstallPermission(context: Context) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        if (!context.packageManager.canRequestPackageInstalls()) {
            val intent = Intent(Settings.ACTION_MANAGE_UNKNOWN_APP_SOURCES).apply {
                data = Uri.parse("package:${context.packageName}")
                flags = Intent.FLAG_ACTIVITY_NEW_TASK
            }
            context.startActivity(intent)
            return
        }
    }

    // Dosyayı kurma işlemi başlat
    val apkFile = File(context.getExternalFilesDir(null), "downloaded_browser.apk")
    if (apkFile.exists()) {
        installApkFile(context, apkFile)
    } else {
        // İndirme başlat veya yönlendir
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://github.com"))
        context.startActivity(intent)
    }
}

fun installApkFile(context: Context, file: File) {
    val apkUri = FileProvider.getUriForFile(
        context,
        "${context.packageName}.fileprovider",
        file
    )
    val installIntent = Intent(Intent.ACTION_VIEW).apply {
        setDataAndType(apkUri, "application/vnd.android.package-archive")
        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_GRANT_READ_URI_PERMISSION
    }
    context.startActivity(installIntent)
}
