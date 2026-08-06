/* ==========================================================================
   1. CONSTANTS, HELPERS & FIREBASE / SUPABASE CONFIG
   ========================================================================== */
const uid = () => Math.random().toString(36).slice(2, 10);
const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtIDR = (n) => "Rp " + Math.round(n || 0).toLocaleString("id-ID");
const fmtDate = (d) => new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const CATEGORY_COLORS = ["#E85D88", "#4FA7B2", "#D9A548", "#A87CA0", "#E7A99A"];

const ICONS = {
  dashboard: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
  receipt: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="16" y2="11"/></svg>',
  sparkles: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4L12 3z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"/></svg>',
  boxes: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8l10-5 10 5-10 5-10-5z"/><path d="M2 8v9l10 5 10-5V8"/><path d="M12 13v9"/></svg>',
  users: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  wallet: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/></svg>',
  staff: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><circle cx="19" cy="11" r="2"/><path d="M22 21v-1a3 3 0 0 0-2-2.83"/></svg>',
  plus: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  trash: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  alert: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  up: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  down: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>'
};

// DATABASE AKUN LOKAL
const USERS = [
  { username: "admin", password: "Londoireng2026", name: "Ulfa (Owner)", role: "owner" },
  { username: "user", password: "user123", name: "user 1", role: "user" }
];

// KONFIGURASI SUPABASE
const SUPABASE_URL = "https://lmqmnmgwkifbbhjheqxr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtcW1ubWd3a2lmYmJoamhlcXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5ODE3MTYsImV4cCI6MjEwMTU1NzcxNn0.3n3Yjo-JqZqKMnit4_qQemuvjOE9U7ipq8VOTSxX_9I";

const supabaseClient = (typeof supabase !== "undefined") 
  ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

function showToast(msg, type = "info", undoCallback = null) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  const iconMap = { success: "✓", error: "✕", info: "ℹ" };
  
  let undoHtml = undoCallback ? `<button class="toast-undo-btn" id="toast-undo-btn">URUNGKAN</button>` : "";
  toast.innerHTML = `<div style="display:flex;align-items:center;"><span>${iconMap[type] || "ℹ"}</span> <span style="margin-left:6px;">${esc(msg)}</span> ${undoHtml}</div>`;
  container.appendChild(toast);

  let timer = setTimeout(() => {
    toast.style.animation = "toastOut 0.3s forwards";
    setTimeout(() => toast.remove(), 300);
  }, undoCallback ? 5000 : 3000);

  if (undoCallback) {
    toast.querySelector("#toast-undo-btn")?.addEventListener("click", () => {
      clearTimeout(timer);
      undoCallback();
      toast.remove();
    });
  }
}

function paginate(items = [], page = 1, pageSize = 5) {
  const total = items.length;
  const totalPages = Math.ceil(total / pageSize) || 1;
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * pageSize;
  const paginatedItems = items.slice(start, start + pageSize);

  const renderControls = (pageKey) => {
    if (total <= pageSize) return "";
    return `
      <div class="pagination-wrap" style="display:flex;justify-content:space-between;align-items:center;padding-top:12px;">
        <span style="font-size:12px;color:var(--inkSoft)">Menampilkan ${start + 1}-${Math.min(start + pageSize, total)} dari ${total} data</span>
        <div class="pagination-btns" style="display:flex;gap:4px;">
          <button class="fx-btn fx-btn-mini fx-btn-ghost" style="border:1px solid var(--line)" ${currentPage <= 1 ? 'disabled style="opacity:0.5"' : ''} data-page-action="${pageKey}" data-page="${currentPage - 1}">‹ Prev</button>
          <span style="align-self:center;font-weight:600;padding:0 6px;font-size:12px;">${currentPage} / ${totalPages}</span>
          <button class="fx-btn fx-btn-mini fx-btn-ghost" style="border:1px solid var(--line)" ${currentPage >= totalPages ? 'disabled style="opacity:0.5"' : ''} data-page-action="${pageKey}" data-page="${currentPage + 1}">Next ›</button>
        </div>
      </div>`;
  };
  return { items: paginatedItems, renderControls, currentPage, totalPages };
}

/* ==========================================================================
   2. STATE & DATA MANAGEMENT
   ========================================================================== */
let state = {
  tab: "ringkasan",
  data: null,
  currentUser: JSON.parse(localStorage.getItem("spa_user") || "null"),
  txPage: 1,
  custPage: 1,
  expPage: 1,
  custSearch: "",
  txSearch: "",
  dashboardPeriod: "7d",
  syncStatus: "online"
};

function setSyncStatus(status) {
  state.syncStatus = status;
  const badge = document.getElementById("sync-status-badge");
  if (!badge) return;
  
  if (status === "online") {
    badge.className = "sync-badge sync-online";
    badge.innerHTML = `<span class="sync-dot"></span> Online`;
  } else if (status === "syncing") {
    badge.className = "sync-badge sync-syncing";
    badge.innerHTML = `<span class="sync-dot"></span> Conecting...`;
  } else {
    badge.className = "sync-badge sync-offline";
    badge.innerHTML = `<span class="sync-dot"></span> Offline`;
  }
}

function seedData() {
  const svc = { baby: uid(), swim: uid(), momMassage: uid(), facial: uid(), newborn: uid() };
  const cust = { a: uid(), b: uid(), c: uid() };
  const stf = { s1: uid(), s2: uid() };
  const now = new Date();
  const dayAgo = n => new Date(now.getTime() - n * 86400000).toISOString().slice(0, 10);

  return {
    schedules: [
      { id: uid(), date: todayISO(), time: "09:00", customerId: cust.a, serviceId: svc.baby, staffId: stf.s1, type: "Studio", transportFee: 0, payMethod: "DP", dpAmount: 30000, status: "Akan Datang", note: "Request ruang AC" },
      { id: uid(), date: todayISO(), time: "13:30", customerId: cust.b, serviceId: svc.momMassage, staffId: stf.s2, type: "Home Care", transportFee: 15000, payMethod: "Cash", dpAmount: 0, status: "Akan Datang", note: "" }
    ],
    services: [
      { id: svc.baby, name: "Pijat Bayi", category: "Bayi", price: 100000, duration: 60 },
      { id: svc.swim, name: "Tambal ban", category: "Paket", price: 100000, duration: 30 },
      { id: svc.momMassage, name: "Pijat Ibu Hamil", category: "Ibu", price: 150000, duration: 60 },
      { id: svc.facial, name: "Newborn Care", category: "Bayi", price: 250000, duration: 60 },
      { id: svc.facial, name: "Servis AC", category: "Paket", price: 400000, duration: 90 },
    ],
    memberships: [
      { id: uid(), customerId: cust.a, name: "Paket Gold 5x Pijat Bayi", totalSessions: 5, usedSessions: 2, price: 450000 },
      { id: uid(), customerId: cust.b, name: "Paket Premium Ibu & Anak", totalSessions: 8, usedSessions: 5, price: 900000 }
    ],
    staff: [
      { id: stf.s1, name: "Ulfa", role: "Owner", phone: "0812-1111-2222" },
      { id: stf.s2, name: "Sugiono", role: "Terapis Bayi", phone: "0813-3333-4444" },
      { id: stf.s2, name: "Bahlil", role: "Marketing", phone: "0813-3333-31313" },
    ],
    customers: [
      { id: cust.a, name: "Yanti", babyName: "Yanto", dob: "2026-08-05", phone: "0811-2233-4455", address: "Jl. Mawar No. 12, Kel. Sukamaju" },
      { id: cust.b, name: "Christian", babyName: "Ronaldo", dob: "2024-08-10", phone: "0822-5566-7788", address: "Perum Graha Indah Blok C2/15" },
      { id: cust.c, name: "Yani", babyName: "Yono", dob: "", phone: "0856-9988-7766", address: "-" },
    ],
    transactions: [
      { id: uid(), date: dayAgo(0), customerId: cust.a, serviceId: svc.baby, staffId: stf.s1, type: "Studio", transportFee: 0, amount: 30000, note: "DP Reservasi" },
      { id: uid(), date: dayAgo(0), customerId: cust.b, serviceId: svc.momMassage, staffId: stf.s2, type: "Home Care", transportFee: 15000, amount: 165000, note: "Pelunasan" },
    ],
    inventory: [
      { id: uid(), name: "Minyak Pijat Bayi", unit: "botol", stock: 8, minStock: 2 },
      { id: uid(), name: "Lotion Bayi", unit: "botol", stock: 3, minStock: 2 },
      { id: uid(), name: "Masker Wajah", unit: "pcs", stock: 38, minStock: 10 },
      { id: uid(), name: "Kabel", unit: "meter", stock: 50, minStock: 15 },
    ],
    expenses: [
      { id: uid(), date: dayAgo(1), category: "Gaji", amount: 1500000, note: "Gaji mingguan" },
    ],
  };
}

async function load() {
  const cached = localStorage.getItem("spa_data");
  if (cached) {
    try { state.data = JSON.parse(cached); } catch(e) {}
  } else {
    state.data = seedData();
  }
  
  if (state.currentUser) {
    applyRolePermissions();
    renderTab();
  }

  if (supabaseClient) {
    try {
      setSyncStatus("syncing");
      const { data, error } = await supabaseClient
        .from('spa_data')
        .select('payload')
        .eq('id', 'main_data')
        .maybeSingle();

      if (data && data.payload) {
        state.data = data.payload;
        localStorage.setItem("spa_data", JSON.stringify(data.payload));
        setSyncStatus("online");
        if (state.currentUser) renderTab();
      } else if (!data) {
        save();
      }
    } catch (err) {
      console.warn("Menggunakan data lokal:", err);
      setSyncStatus("offline");
    }

    supabaseClient
      .channel('public:spa_data')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'spa_data' }, (payload) => {
        if (payload.new && payload.new.payload) {
          state.data = payload.new.payload;
          localStorage.setItem("spa_data", JSON.stringify(payload.new.payload));
          setSyncStatus("online");
          if (state.currentUser) renderTab();
        }
      })
      .subscribe();
  } else {
    setSyncStatus("offline");
  }
}

async function save() {
  if (!state.data) return;
  localStorage.setItem("spa_data", JSON.stringify(state.data));

  if (supabaseClient) {
    try {
      setSyncStatus("syncing");
      const { error } = await supabaseClient
        .from('spa_data')
        .upsert({ id: 'main_data', payload: state.data, updated_at: new Date() });

      if (error) setSyncStatus("offline");
      else setSyncStatus("online");
    } catch (err) {
      setSyncStatus("offline");
    }
  }
}

/* ==========================================================================
   FUNGSI EKSPOR, IMPOR & BACKUP
   ========================================================================== */
function exportToExcel() {
  if (!state.data || typeof XLSX === "undefined") {
    return showToast("Gagal mengekspor data!", "error");
  }
  const wb = XLSX.utils.book_new();
  Object.keys(state.data).forEach(key => {
    if (Array.isArray(state.data[key])) {
      const ws = XLSX.utils.json_to_sheet(state.data[key]);
      XLSX.utils.book_append_sheet(wb, ws, key);
    }
  });
  XLSX.writeFile(wb, `Ulfa_Baby_Spa_Data_${todayISO()}.xlsx`);
  showToast("Data berhasil diekspor ke Excel!", "success");
}

function backupData() {
  if (!state.data) return;
  const blob = new Blob([JSON.stringify(state.data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Backup_UlfaBabySpa_${todayISO()}.json`;
  a.click();
  showToast("Backup JSON berhasil diunduh!", "success");
}

function importDataFile(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  
  if (file.name.endsWith(".json")) {
    reader.onload = (e) => {
      try {
        state.data = JSON.parse(e.target.result);
        save();
        renderTab();
        showToast("Data JSON berhasil diimpor!", "success");
      } catch (err) {
        showToast("Format file JSON salah!", "error");
      }
    };
    reader.readAsText(file);
  } else {
    showToast("Fitur impor file Excel sedang dikembangkan", "info");
  }
}

/* ==========================================================================
   3. SISTEM LOGIN & OTORISASI
   ========================================================================== */
function renderLoginModal() {
  if (state.currentUser) {
    const existingModal = document.getElementById("login-overlay");
    if (existingModal) existingModal.remove();
    return;
  }

  let modal = document.getElementById("login-overlay");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "login-overlay";
    modal.className = "login-overlay";
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="login-card">
      <div class="login-brand-icon">
        <img src="icon.png" alt="Ulfa Baby Spa Logo">
      </div>
      <h2 class="login-title fx-display">Ulfa Baby Spa</h2>
      <p class="login-sub">Masuk untuk mengelola sistem</p>
      
      <form class="login-form" id="login-form">
        <div class="field">
          <label class="field-label" for="login-username">Username</label>
          <input class="fx-input" id="login-username" placeholder="Username" required autofocus>
        </div>
        <div class="field">
          <label class="field-label" for="login-password">Password</label>
          <input class="fx-input" type="password" id="login-password" placeholder="••••••••" required>
        </div>
        <button type="submit" class="fx-btn fx-btn-submit" style="margin-top:8px;">Masuk ke Aplikasi</button>
      </form>
    </div>
  `;

  const form = document.getElementById("login-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const u = document.getElementById("login-username").value.trim().toLowerCase();
      const p = document.getElementById("login-password").value;

      const found = USERS.find(user => user.username === u && user.password === p);
      if (found) {
        state.currentUser = found;
        localStorage.setItem("spa_user", JSON.stringify(found));
        showToast(`Selamat datang, ${found.name}!`, "success");
        modal.remove();
        
        const currentPage = document.body.getAttribute("data-page") || "ringkasan";
        if (found.role === "kasir" && ["ringkasan", "keuangan", "staf"].includes(currentPage)) {
          window.location.href = "jadwal.html";
        } else {
          applyRolePermissions();
          renderTab();
        }
      } else {
        showToast("Username atau Password salah!", "error");
      }
    });
  }
}

function applyRolePermissions() {
  if (!state.currentUser) return;
  const isKasir = state.currentUser.role === "kasir";

  document.querySelectorAll(".navbtn").forEach(btn => {
    const href = btn.getAttribute("href");
    if (isKasir && (href.includes("index.html") || href.includes("keuangan.html") || href.includes("staf.html"))) {
      btn.style.display = "none";
    } else {
      btn.style.display = "flex";
    }
  });

  let profileBadge = document.getElementById("user-profile-badge");
  const sidebar = document.querySelector(".sidebar");
  if (sidebar && !profileBadge) {
    profileBadge = document.createElement("div");
    profileBadge.id = "user-profile-badge";
    profileBadge.className = "user-profile-badge";
    sidebar.appendChild(profileBadge);
  }

  if (profileBadge) {
    profileBadge.innerHTML = `
      <div class="user-info-text">
        <strong style="color:#fff;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;">${esc(state.currentUser.name)}</strong>
        <span style="color:var(--blush);font-size:10px;text-transform:uppercase;">${esc(state.currentUser.role)}</span>
      </div>
      <button class="logout-btn" id="logout-btn" title="Keluar">
        <svg class="logout-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path>
          <line x1="12" y1="2" x2="12" y2="12"></line>
        </svg>
        <span class="logout-text">Keluar</span>
      </button>
    `;

    document.getElementById("logout-btn")?.addEventListener("click", () => {
      localStorage.removeItem("spa_user");
      state.currentUser = null;
      showToast("Anda telah keluar", "info");
      renderLoginModal();
    });
  }
/* ==========================================================================
   4. APP INITIALIZATION & PROTEKSI
   ========================================================================== */
function initApp() {
  const page = document.body.getAttribute("data-page") || "ringkasan";
  state.tab = page;

  if (!state.currentUser) {
    renderLoginModal();
  } else {
    if (state.currentUser.role === "kasir" && ["ringkasan", "keuangan", "staf"].includes(page)) {
      window.location.href = "jadwal.html";
      return;
    }
    applyRolePermissions();
    renderTab();
  }
  load();
}

function renderTab() {
  const main = document.getElementById("main");
  if (!main) return;

  if (!state.currentUser) {
    renderLoginModal();
    return;
  }

  if (!state.data) {
    main.innerHTML = `<div style="text-align:center; padding:60px 20px; font-weight:700; color:var(--inkSoft); font-size:15px;">⏳ Memuat data...</div>`;
    return;
  }

  const d = state.data;

  switch (state.tab) {
    case "ringkasan": main.innerHTML = viewRingkasan(d); bindRingkasan(); initCharts(d); break;
    case "jadwal": main.innerHTML = viewJadwal(d); bindJadwal(); break;
    case "transaksi": main.innerHTML = viewTransaksi(d); bindTransaksi(); break;
    case "layanan": main.innerHTML = viewLayanan(d); bindLayanan(); break;
    case "stok": main.innerHTML = viewStok(d); bindStok(); break;
    case "pelanggan": main.innerHTML = viewPelanggan(d); bindPelanggan(); break;
    case "keuangan": main.innerHTML = viewKeuangan(d); bindKeuangan(); break;
    case "staf": main.innerHTML = viewStaf(d); bindStaf(); break;
    default: main.innerHTML = viewRingkasan(d); bindRingkasan(); initCharts(d); break;
  }
}

function header(title, sub) {
  const syncClass = state.syncStatus === 'online' ? 'sync-online' : (state.syncStatus === 'syncing' ? 'sync-syncing' : 'sync-offline');
  const syncLabel = state.syncStatus === 'online' ? 'Terhubung Cloud' : (state.syncStatus === 'syncing' ? 'Menyimpan...' : 'Mode Lokal');

  return `
    <div class="section-header">
      <div class="header-title-group">
        <h1 class="section-title fx-display">${esc(title)}</h1>
        <p class="section-sub">${esc(sub)}</p>
      </div>
      <div style="display:flex;align-items:center;">
        <div id="sync-status-badge" class="sync-badge ${syncClass}">
          <span class="sync-dot"></span> ${syncLabel}
        </div>
        <div class="header-clock">
          <div class="clock-time" id="realtime-clock">00:00:00</div>
          <div class="clock-date" id="realtime-date">Senin, 1 Jan 2026</div>
        </div>
      </div>
    </div>
  `;
}

function kpiCard(label, value, iconKey, tint) {
  return `<div class="kpi-card">
    <div class="kpi-top"><span class="kpi-label">${esc(label)}</span>
      <div class="kpi-icon" style="background:${tint}">${ICONS[iconKey].replace(/currentColor/g, '#fff')}</div>
    </div>
    <div class="kpi-value">${value}</div>
  </div>`;
}

/* ==========================================================================
   5. MODULE: RINGKASAN
   ========================================================================== */
function filterDataByPeriod(txList = [], expList = [], period = "7d") {
  const now = new Date();
  const todayStr = todayISO();
  
  return {
    tx: txList.filter(t => {
      if (period === "today") return t.date === todayStr;
      if (period === "7d") {
        const diffDays = (now - new Date(t.date)) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 7;
      }
      if (period === "thisMonth") return t.date.slice(0, 7) === todayStr.slice(0, 7);
      return true;
    }),
    exp: expList.filter(e => {
      if (period === "today") return e.date === todayStr;
      if (period === "7d") {
        const diffDays = (now - new Date(e.date)) / (1000 * 60 * 60 * 24);
        return diffDays >= 0 && diffDays <= 7;
      }
      if (period === "thisMonth") return e.date.slice(0, 7) === todayStr.slice(0, 7);
      return true;
    })
  };
}

function viewRingkasan(d) {
  const filtered = filterDataByPeriod(d.transactions || [], d.expenses || [], state.dashboardPeriod);
  const totalRevenue = filtered.tx.reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.exp.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalRevenue - totalExpense;
  const lowStock = (d.inventory || []).filter(i => i.stock <= i.minStock);

  return `
    ${header("Ringkasan Usaha", "Gambaran umum performa Ulfa Baby Spa")}
    
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
      <h3 style="margin:0; font-size:15px; font-weight:700; color:var(--ink);">📊 Performa Keuangan</h3>
      <div class="period-filter-group">
        <button class="period-btn ${state.dashboardPeriod === 'today' ? 'active' : ''}" data-period="today">Hari Ini</button>
        <button class="period-btn ${state.dashboardPeriod === '7d' ? 'active' : ''}" data-period="7d">7 Hari Terakhir</button>
        <button class="period-btn ${state.dashboardPeriod === 'thisMonth' ? 'active' : ''}" data-period="thisMonth">Bulan Ini</button>
        <button class="period-btn ${state.dashboardPeriod === 'all' ? 'active' : ''}" data-period="all">Semua</button>
      </div>
    </div>

    <div class="kpi-grid">
      ${kpiCard("Total Pendapatan", fmtIDR(totalRevenue), "wallet", "var(--sage)")}
      ${kpiCard("Total Pengeluaran", fmtIDR(totalExpense), "down", "var(--blush)")}
      ${kpiCard("Laba Bersih", fmtIDR(netProfit), "up", netProfit >= 0 ? "var(--sage)" : "var(--danger)")}
      ${kpiCard("Total Booking", filtered.tx.length, "receipt", "var(--aqua)")}
    </div>
    
    <div class="charts-row">
      <div class="fx-card" style="position:relative;"><div class="card-title">Tren Pendapatan</div><div id="revenueChart"></div></div>
      <div class="fx-card"><div class="card-title">Layanan Terlaris</div><div id="servicesChart"></div></div>
    </div>

    ${lowStock.length > 0 ? `
    <div class="fx-card low-stock-card">
      <div class="low-alert-title">${ICONS.alert.replace('currentColor', '#8A5A1E')} Stok Menipis (${lowStock.length})</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;">
        ${lowStock.map(i => `<span class="badge badge-low">${esc(i.name)} — sisa ${i.stock} ${esc(i.unit)}</span>`).join("")}
      </div>
    </div>` : ""}
  `;
}

function bindRingkasan() {
  document.querySelectorAll('[data-period]').forEach(btn => {
    btn.addEventListener("click", () => {
      state.dashboardPeriod = btn.dataset.period;
      renderTab();
    });
  });
}

function initCharts(d) {
  const revWrap = document.getElementById("revenueChart");
  const svcWrap = document.getElementById("servicesChart");
  if (!revWrap || !svcWrap) return;

  const filtered = filterDataByPeriod(d.transactions || [], [], state.dashboardPeriod);
  const map = {};
  filtered.tx.forEach(t => { map[t.date] = (map[t.date] || 0) + t.amount; });
  const days = Object.keys(map).sort();

  if (days.length === 0) {
    revWrap.innerHTML = `<div style="color:var(--inkSoft);font-size:13px;padding:40px 0;text-align:center;">Belum ada data transaksi pada periode ini.</div>`;
  } else {
    const revData = days.map(k => map[k]);
    const maxVal = Math.max(...revData, 1);
    
    const W = 560, H = 220;
    const padL = 20, padR = 20, padT = 35, padB = 30;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;
    const stepX = revData.length > 1 ? chartW / (revData.length - 1) : 0;

    const points = revData.map((v, i) => ({
      x: padL + (revData.length > 1 ? i * stepX : chartW / 2),
      y: padT + chartH - (v / maxVal) * chartH,
      val: v,
      dateStr: fmtDate(days[i])
    }));

    const linePath = points.map((p, i) => (i === 0 ? "M" : "L") + p.x.toFixed(1) + "," + p.y.toFixed(1)).join(" ");

    revWrap.innerHTML = `
      <div id="chart-tooltip" class="chart-tooltip"></div>
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;overflow:visible;">
        <line x1="${padL}" y1="${padT}" x2="${W - padR}" y2="${padT}" stroke="#f0dbe1" stroke-dasharray="3,3" stroke-width="1"/>
        <line x1="${padL}" y1="${padT + chartH / 2}" x2="${W - padR}" y2="${padT + chartH / 2}" stroke="#f0dbe1" stroke-dasharray="3,3" stroke-width="1"/>
        <line x1="${padL}" y1="${padT + chartH}" x2="${W - padR}" y2="${padT + chartH}" stroke="#E85D88" stroke-opacity="0.3" stroke-width="1.5"/>

        <path d="${linePath}" fill="none" stroke="#E85D88" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>

        ${points.map((p, idx) => `
          <g class="chart-node" data-val="${fmtIDR(p.val)}" data-date="${p.dateStr}">
            <circle cx="${p.x}" cy="${p.y}" r="5" fill="#FFFFFF" stroke="#E85D88" stroke-width="2.5"/>
            <text x="${p.x}" y="${H - 8}" text-anchor="middle" fill="#7A626A" font-size="10">
              ${days[idx].slice(5)}
            </text>
          </g>
        `).join('')}
      </svg>
    `;

    const tooltip = document.getElementById("chart-tooltip");
    revWrap.querySelectorAll(".chart-node").forEach(node => {
      node.addEventListener("mouseenter", (e) => {
        tooltip.innerHTML = `<div>${node.dataset.date}</div><div style="color:#E85D88;">${node.dataset.val}</div>`;
        tooltip.classList.add("show");
      });
      node.addEventListener("mousemove", (e) => {
        const rect = revWrap.getBoundingClientRect();
        tooltip.style.left = (e.clientX - rect.left) + "px";
        tooltip.style.top = (e.clientY - rect.top - 10) + "px";
      });
      node.addEventListener("mouseleave", () => {
        tooltip.classList.remove("show");
      });
    });
  }

  const svcMap = {};
  filtered.tx.forEach(t => {
    const svc = (d.services || []).find(s => s.id === t.serviceId);
    const name = svc ? svc.name : "Lainnya";
    svcMap[name] = (svcMap[name] || 0) + 1;
  });
  const top = Object.entries(svcMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (top.length === 0) {
    svcWrap.innerHTML = `<div style="color:var(--inkSoft);font-size:13px;padding:40px 0;text-align:center;">Belum ada data.</div>`;
  } else {
    const maxCount = Math.max(...top.map(t => t[1]), 1);
    svcWrap.innerHTML = `<div style="display:flex;flex-direction:column;gap:12px;padding-top:4px;">
      ${top.map((t, i) => {
        const pct = Math.round((t[1] / maxCount) * 100);
        const color = CATEGORY_COLORS[i % CATEGORY_COLORS.length];
        return `<div>
            <div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:4px;">
              <span>${esc(t[0])}</span><span style="font-weight:600;">${t[1]}x</span>
            </div>
            <div style="height:9px;border-radius:999px;background:var(--line);overflow:hidden;">
              <div style="height:100%;width:${pct}%;background:${color};border-radius:999px;"></div>
            </div>
          </div>`;
      }).join("")}
    </div>`;
  }
}

/* ==========================================================================
   6. MODULE: JADWAL & BOOKING
   ========================================================================== */
function viewJadwal(d) {
  if (!d.schedules) d.schedules = [];
  const sorted = [...d.schedules].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  const upcomingTwo = sorted.filter(s => s.status === "Akan Datang").slice(0, 2);

  return `
    ${header("Jadwal & Booking Spa", "Atur janji temu, pembayaran DP, dan reservasi pelanggan")}
    
   ${upcomingTwo.length > 0 ? `
      <div class="alert-schedule-box">
        <div class="alert-schedule-header">
          <span class="alert-schedule-title">🔔 Reservasi Terdekat Hari Ini</span>
          <span class="alert-schedule-badge">${upcomingTwo.length} Jadwal</span>
        </div>
        <div class="alert-schedule-grid">
          ${upcomingTwo.map(s => {
            const cust = (d.customers || []).find(c => c.id === s.customerId);
            const svc = (d.services || []).find(srv => srv.id === s.serviceId);
            const stf = (d.staff || []).find(st => st.id === s.staffId);
            
            let payBadge = `<span class="badge-pay badge-cash">💵 Pay at Venue</span>`;
            if (s.payMethod === 'DP') {
              payBadge = `<span class="badge-pay badge-dp">💳 DP: ${fmtIDR(s.dpAmount)}</span>`;
            } else if (s.payMethod === 'Lunas') {
              payBadge = `<span class="badge-pay badge-lunas">✓ Lunas</span>`;
            }

            return `
              <div class="alert-schedule-card">
                <div class="sch-card-top">
                  <div class="sch-time-tag">
                    ⏰ <strong>${s.time} WIB</strong> <small>(${fmtDate(s.date)})</small>
                  </div>
                  ${payBadge}
                </div>
                <div class="sch-card-body">
                  <div class="sch-cust-name">Bunda ${cust ? esc(cust.name) : '-'}</div>
                  <div class="sch-baby-name">👶 Bayi: ${cust ? esc(cust.babyName || '-') : '-'}</div>
                  <div class="sch-detail-meta">
                    <span>💆 ${svc ? esc(svc.name) : '-'}</span>
                    <span>👩‍⚕️ ${stf ? esc(stf.name) : '-'}</span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    ` : ''}

    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
      <h3 style="margin:0; font-size:16px; font-weight:700; color:var(--ink);">📅 Agenda Booking</h3>
      <button class="fx-btn" id="open-sch-modal">${ICONS.plus} Tambah Reservasi Baru</button>
    </div>

    <div class="fx-card">
      <table class="fx-table">
        <thead>
          <tr>
            <th style="width: 14%;">WAKTU & TANGGAL</th>
            <th style="width: 18%;">PELANGGAN</th>
            <th style="width: 20%;">LAYANAN & TIPE</th>
            <th style="width: 12%;">TERAPIS</th>
            <th style="width: 14%;">METODE BAYAR</th>
            <th style="width: 10%;">STATUS</th>
            <th style="width: 12%; text-align: right;">AKSI</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.length === 0 ? '<tr class="empty-row"><td colspan="7">Belum ada agenda reservasi.</td></tr>' : ''}
          ${sorted.map(s => {
            const cust = (d.customers || []).find(c => c.id === s.customerId);
            const svc = (d.services || []).find(srv => srv.id === s.serviceId);
            const stf = (d.staff || []).find(st => st.id === s.staffId);
            
            const totalCost = (svc ? svc.price : 0) + (s.transportFee || 0);
            const dp = s.dpAmount || 0;
            const remaining = totalCost - dp;

            let paymentBadge = `<span class="badge" style="background:#FFF3CD; color:#856404; font-size:10.5px;">Bayar di Tempat</span>`;
            if (s.payMethod === "DP") {
              paymentBadge = `<span class="badge" style="background:#D1ECF1; color:#0C5460; font-size:10.5px;">DP: ${fmtIDR(dp)}<br><small>Sisa: ${fmtIDR(remaining)}</small></span>`;
            } else if (s.payMethod === "Lunas") {
              paymentBadge = `<span class="badge" style="background:#E2F0D9; color:#385723; font-size:10.5px;">✓ Lunas Awalan</span>`;
            }

            let statusBadge = `<span class="badge badge-ok">${s.status}</span>`;
            if (s.status === "Selesai") statusBadge = `<span class="badge" style="background:#E2F0D9; color:#385723;">✓ Selesai</span>`;

            const typeBadge = s.type === 'Home Care' 
              ? `<span class="badge" style="background:#E2F0D9; color:#385723; font-size:10px;">🏠 Home Care</span>` 
              : `<span class="badge" style="background:#FDECF1; color:var(--sageDark); font-size:10px;">🏢 Studio</span>`;

            return `<tr>
              <td>
                <strong style="color:var(--sageDark); font-size:13.5px;">⏰ ${s.time} WIB</strong><br>
                <small style="color:var(--inkSoft)">${fmtDate(s.date)}</small>
              </td>
              <td><strong>Bunda ${cust ? esc(cust.name) : "—"}</strong><br><small style="color:var(--inkSoft)">👶 ${cust ? esc(cust.babyName || '-') : '-'}</small></td>
              <td>${svc ? esc(svc.name) : "—"}<br>${typeBadge}</td>
              <td>${stf ? esc(stf.name) : "—"}</td>
              <td>${paymentBadge}</td>
              <td>${statusBadge}</td>
              <td style="text-align: right;">
                <div class="action-cell-group">
                  ${s.status === 'Akan Datang' ? `
                    <button class="fx-btn fx-btn-mini" data-action="complete-sch" data-id="${s.id}" style="background:#28a745; color:white;">✓ Selesai</button>
                  ` : ''}
                  <button class="fx-btn fx-btn-mini" data-action="wa-sch" data-id="${s.id}" style="background:#25D366; color:white;">💬 WA</button>
                  <button class="fx-btn-ghost" data-action="del-sch" data-id="${s.id}">${ICONS.trash}</button>
                </div>
              </td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>

    <!-- POP-UP MODAL RESERVASI -->
    <div class="modal-overlay" id="sch-modal">
      <div class="modal-container">
        <div class="modal-header">
          <div class="modal-title-group">
            <h3 class="modal-title">✨ Tambah Reservasi Baru</h3>
            <p class="modal-sub">Isi detail jadwal reservasi dan metode pembayaran pelanggan</p>
          </div>
          <button class="modal-close-btn" id="close-sch-modal" aria-label="Tutup">✕</button>
        </div>

        <div class="modal-body">
          <div class="modal-form-row">
            <div class="field">
              <label class="field-label" for="sch-date">📅 Tanggal Reservasi</label>
              <input class="fx-input" type="date" id="sch-date" value="${todayISO()}">
            </div>
            <div class="field">
              <label class="field-label" for="sch-time">⏰ Waktu / Jam</label>
              <input class="fx-input" type="time" id="sch-time" value="09:00">
            </div>
          </div>

          <div class="field field-relative">
            <label class="field-label" for="sch-cust-search">👤 Cari & Pilih Pelanggan</label>
            <div class="input-with-icon">
              <input class="fx-input" id="sch-cust-search" placeholder="Ketik nama ibu atau bayi..." autocomplete="off">
            </div>
            <input type="hidden" id="sch-customer-id">
            <div class="combobox-dropdown" id="sch-cust-dropdown"></div>
          </div>

          <div class="modal-form-row">
            <div class="field">
              <label class="field-label" for="sch-service">💆 Layanan Spa</label>
              <select class="fx-input" id="sch-service">
                <option value="">-- Pilih Layanan --</option>
                ${(d.services || []).map(s => `<option value="${s.id}">${esc(s.name)} — ${fmtIDR(s.price)}</option>`).join("")}
              </select>
            </div>
            <div class="field">
              <label class="field-label" for="sch-staff">👩‍⚕️ Terapis / Staf</label>
              <select class="fx-input" id="sch-staff">
                <option value="">-- Pilih Terapis --</option>
                ${(d.staff || []).map(s => `<option value="${s.id}">${esc(s.name)} (${esc(s.role)})</option>`).join("")}
              </select>
            </div>
          </div>

          <div class="modal-form-row">
            <div class="field">
              <label class="field-label" for="sch-type">📍 Tipe Layanan</label>
              <select class="fx-input" id="sch-type">
                <option value="Studio">🏢 Studio (Di Tempat)</option>
                <option value="Home Care">🏠 Home Care (Kunjungan)</option>
              </select>
            </div>
            <div class="field">
              <label class="field-label" for="sch-pay-method">💳 Metode Pembayaran</label>
              <select class="fx-input" id="sch-pay-method">
                <option value="Cash">💵 Bayar di Tempat (Cash)</option>
                <option value="DP">💸 Bayar Uang Muka (DP)</option>
                <option value="Lunas">✅ Langsung Lunas Sekarang</option>
              </select>
            </div>
          </div>

          <div class="modal-form-row">
            <div class="field" id="sch-transport-wrap" style="display:none;">
              <label class="field-label" for="sch-transport">🚗 Biaya Transport (Rp)</label>
              <input class="fx-input" type="number" id="sch-transport" placeholder="contoh: 15000">
            </div>

            <div class="field" id="sch-dp-wrap" style="display:none;">
              <label class="field-label" for="sch-dp">💰 Nominal DP / Uang Muka (Rp)</label>
              <input class="fx-input" type="number" id="sch-dp" placeholder="contoh: 50000">
            </div>
          </div>

          <div class="field">
            <label class="field-label" for="sch-note">📝 Catatan Tambahan / Alamat</label>
            <input class="fx-input" id="sch-note" placeholder="Permintaan khusus, patokan alamat, dll...">
          </div>
        </div>

        <div class="modal-footer">
          <button class="fx-btn fx-btn-submit" id="sch-add">
            ${ICONS.plus} Simpan Reservasi
          </button>
        </div>
      </div>
    </div>
  `;
}

function bindJadwal() {
  const modal = document.getElementById("sch-modal");
  const openBtn = document.getElementById("open-sch-modal");
  const closeBtn = document.getElementById("close-sch-modal");

  const showModal = () => { modal?.classList.add("active"); document.body.classList.add("modal-open"); };
  const hideModal = () => { modal?.classList.remove("active"); document.body.classList.remove("modal-open"); };

  openBtn?.addEventListener("click", showModal);
  closeBtn?.addEventListener("click", hideModal);
  modal?.addEventListener("click", (e) => { if (e.target === modal) hideModal(); });

  const paySelect = document.getElementById("sch-pay-method");
  const dpWrap = document.getElementById("sch-dp-wrap");
  paySelect?.addEventListener("change", (e) => {
    dpWrap.style.display = e.target.value === "DP" ? "block" : "none";
  });

  const typeSelect = document.getElementById("sch-type");
  const transportWrap = document.getElementById("sch-transport-wrap");
  typeSelect?.addEventListener("change", (e) => {
    transportWrap.style.display = e.target.value === "Home Care" ? "block" : "none";
  });

  const searchInput = document.getElementById("sch-cust-search");
  const hiddenInput = document.getElementById("sch-customer-id");
  const dropdown = document.getElementById("sch-cust-dropdown");

  if (searchInput && dropdown) {
    const renderDropdown = (query = "") => {
      const q = query.toLowerCase().trim();
      const filtered = (state.data.customers || []).filter(c => 
        c.name.toLowerCase().includes(q) || (c.babyName && c.babyName.toLowerCase().includes(q))
      );

      if (filtered.length === 0) {
        dropdown.innerHTML = `<div class="combobox-item empty">Pelanggan tidak ditemukan 😅</div>`;
      } else {
        dropdown.innerHTML = filtered.map(c => `
          <div class="combobox-item" data-id="${c.id}" data-name="Bunda ${esc(c.name)} (${esc(c.babyName || 'Bayi')})">
            <div class="cust-info">
              <span class="cust-mom">👩 Bunda ${esc(c.name)}</span>
              <span class="cust-baby">👶 ${esc(c.babyName || '-')}</span>
            </div>
            <span class="cust-badge">Pilih ➔</span>
          </div>
        `).join("");
      }
      dropdown.classList.add("show");
    };

    searchInput.addEventListener("focus", () => renderDropdown(searchInput.value));
    searchInput.addEventListener("input", (e) => {
      hiddenInput.value = "";
      renderDropdown(e.target.value);
    });

    dropdown.addEventListener("click", (e) => {
      const item = e.target.closest(".combobox-item:not(.empty)");
      if (item) {
        hiddenInput.value = item.dataset.id;
        searchInput.value = item.dataset.name;
        dropdown.classList.remove("show");
      }
    });

    document.addEventListener("click", (e) => {
      if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove("show");
      }
    });
  }

  document.getElementById("sch-add")?.addEventListener("click", () => {
    const customerId = document.getElementById("sch-customer-id").value;
    const serviceId = document.getElementById("sch-service").value;
    const payMethod = document.getElementById("sch-pay-method").value;
    const dpAmount = payMethod === "DP" ? (Number(document.getElementById("sch-dp").value) || 0) : 0;
    const transportFee = document.getElementById("sch-type").value === "Home Care" ? (Number(document.getElementById("sch-transport").value) || 0) : 0;

    if (!customerId) return showToast("Pilih pelanggan dari hasil pencarian!", "error");
    if (!serviceId) return showToast("Pilih Layanan!", "error");

    const svc = (state.data.services || []).find(s => s.id === serviceId);
    const totalCost = (svc ? svc.price : 0) + transportFee;

    if (!state.data.schedules) state.data.schedules = [];
    state.data.schedules.push({
      id: uid(),
      date: document.getElementById("sch-date").value || todayISO(),
      time: document.getElementById("sch-time").value || "09:00",
      customerId,
      serviceId,
      staffId: document.getElementById("sch-staff").value,
      type: document.getElementById("sch-type").value,
      transportFee,
      payMethod,
      dpAmount: payMethod === "Lunas" ? totalCost : dpAmount,
      status: "Akan Datang",
      note: document.getElementById("sch-note").value.trim()
    });

    const paidNow = payMethod === "Lunas" ? totalCost : (payMethod === "DP" ? dpAmount : 0);
    if (paidNow > 0) {
      if (!state.data.transactions) state.data.transactions = [];
      state.data.transactions.unshift({
        id: uid(),
        date: todayISO(),
        customerId,
        serviceId,
        staffId: document.getElementById("sch-staff").value,
        type: document.getElementById("sch-type").value,
        transportFee: 0,
        amount: paidNow,
        note: payMethod === "Lunas" ? "Pembayaran Lunas Booking" : "DP Reservasi"
      });
    }

    save();
    showToast("Reservasi berhasil disimpan!", "success");
    hideModal();
    renderTab();
  });

  document.querySelectorAll('[data-action="complete-sch"]').forEach(btn => btn.addEventListener("click", () => {
    const sch = state.data.schedules.find(s => s.id === btn.dataset.id);
    if (!sch) return;

    const svc = (state.data.services || []).find(s => s.id === sch.serviceId);
    const totalAmount = (svc ? svc.price : 0) + (sch.transportFee || 0);
    const dpPaid = sch.dpAmount || 0;
    const remainingToPay = Math.max(0, totalAmount - dpPaid);

    sch.status = "Selesai";
    if (remainingToPay > 0) {
      if (!state.data.transactions) state.data.transactions = [];
      state.data.transactions.unshift({
        id: uid(),
        date: sch.date,
        customerId: sch.customerId,
        serviceId: sch.serviceId,
        staffId: sch.staffId,
        type: sch.type || "Studio",
        transportFee: sch.transportFee || 0,
        amount: remainingToPay,
        note: "Pelunasan Perawatan"
      });
    }
    save(); showToast("Treatment selesai!", "success"); renderTab();
  }));

  document.querySelectorAll('[data-action="wa-sch"]').forEach(btn => btn.addEventListener("click", () => {
    const sch = state.data.schedules.find(s => s.id === btn.dataset.id);
    if (!sch) return;

    const cust = (state.data.customers || []).find(c => c.id === sch.customerId);
    const svc = (state.data.services || []).find(s => s.id === sch.serviceId);
    const stf = (state.data.staff || []).find(s => s.id === sch.staffId);

    if (!cust || !cust.phone) return showToast("Nomor HP belum terdaftar!", "error");
    let phoneStr = String(cust.phone).replace(/\D/g, "");
    if (phoneStr.startsWith("0")) phoneStr = "62" + phoneStr.slice(1);

    const jamFmt = sch.time ? `${sch.time.replace(':', '.')} WIB` : '09.00 WIB';
    const totalCost = (svc ? svc.price : 0) + (sch.transportFee || 0);
    const dpPaid = sch.dpAmount || 0;
    const remaining = totalCost - dpPaid;

    let dpStatusTxt = dpPaid > 0 
      ? `\n💳 DP Diterima: ${fmtIDR(dpPaid)}\n💵 Sisa Pelunasan: *${fmtIDR(remaining)}*`
      : `\n💵 Estimasi Biaya: *${fmtIDR(totalCost)}*`;

    const pesan = `Halo Bunda ${cust.name || ''}! \nKami ingin mengonfirmasi jadwal reservasi di Ulfa Baby Spa.\n Tanggal: ${fmtDate(sch.date)}\n Jam: ${jamFmt}\n Nama Bayi: ${cust.babyName || '-'}\n Layanan: ${svc ? svc.name : '-'} (${sch.type || 'Studio'})\n Terapis: ${stf ? stf.name : '-'}${dpStatusTxt}\n\nMohon konfirmasi kehadirannya ya, Bunda. Sampai jumpa! `;

    window.open(`https://wa.me/${phoneStr}?text=${encodeURIComponent(pesan)}`, "_blank");
  }));

  document.querySelectorAll('[data-action="del-sch"]').forEach(btn => btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const idx = state.data.schedules.findIndex(s => s.id === id);
    if (idx === -1) return;

    const deletedItem = state.data.schedules[idx];
    state.data.schedules.splice(idx, 1);
    save();
    renderTab();

    showToast("Jadwal reservasi dihapus", "info", () => {
      state.data.schedules.splice(idx, 0, deletedItem);
      save();
      renderTab();
      showToast("Penghapusan dibatalkan", "success");
    });
  }));
}

/* ==========================================================================
   7. MODULE: TRANSAKSI
   ========================================================================== */
function viewTransaksi(d) {
  if (!d.transactions) d.transactions = [];

  const totalRevenue = d.transactions.reduce((s, t) => s + t.amount, 0);
  const totalHomecare = d.transactions.filter(t => t.type === 'Home Care').length;
  const totalStudio = d.transactions.filter(t => t.type !== 'Home Care').length;

  let list = [...d.transactions];
  const searchQuery = (state.txSearch || "").toLowerCase().trim();

  if (searchQuery) {
    list = list.filter(t => {
      const cust = d.customers ? d.customers.find(c => c.id === t.customerId) : null;
      const svc = d.services ? d.services.find(s => s.id === t.serviceId) : null;
      return (cust && cust.name.toLowerCase().includes(searchQuery)) || (svc && svc.name.toLowerCase().includes(searchQuery));
    });
  }

  const sorted = list.sort((a, b) => b.date.localeCompare(a.date));
  const pg = paginate(sorted, state.txPage || 1, 6);

  return `
    ${header("Riwayat Transaksi", "Seluruh transaksi pencatatan DP & Pelunasan")}
    
    <div class="kpi-grid" style="margin-bottom:16px;">
      ${kpiCard("Total Omset Transaksi", fmtIDR(totalRevenue), "wallet", "var(--sage)")}
      ${kpiCard("Transaksi Studio", `${totalStudio} Kali`, "sparkles", "var(--aqua)")}
      ${kpiCard("Transaksi Home Care", `${totalHomecare} Kali`, "receipt", "var(--amber)")}
    </div>

    <div class="fx-card" style="padding: 16px 20px; margin-bottom: 16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
        <div style="display:flex; align-items:center; gap:8px;">
          <span style="font-weight:700; font-size:13px; color:var(--inkSoft);">🔍 CARI TRANSAKSI:</span>
          <input class="fx-input" id="tx-search-input" value="${esc(state.txSearch || '')}" placeholder="Ketik nama ibu / layanan..." style="width: 240px; padding: 7px 12px; font-size: 13px;">
        </div>
      </div>
    </div>

    <div class="fx-card">
      <table class="fx-table">
        <thead>
          <tr>
            <th style="width: 15%;">TANGGAL</th>
            <th style="width: 20%;">PELANGGAN</th>
            <th style="width: 22%;">LAYANAN & TIPE</th>
            <th style="width: 15%;">TERAPIS / KET</th>
            <th style="width: 15%;">JUMLAH</th>
            <th style="width: 13%; text-align: right;">AKSI</th>
          </tr>
        </thead>
        <tbody>
          ${pg.items.length === 0 ? '<tr class="empty-row"><td colspan="6">Belum ada riwayat transaksi.</td></tr>' : ''}
          ${pg.items.map(t => {
            const cust = d.customers ? d.customers.find(c => c.id === t.customerId) : null;
            const svc = d.services ? d.services.find(s => s.id === t.serviceId) : null;
            const stf = d.staff ? d.staff.find(s => s.id === t.staffId) : null;
            const typeBadge = t.type === 'Home Care' 
              ? `<span class="badge" style="background:#E2F0D9; color:#385723; font-size:10px;">🏠 Home Care</span>` 
              : `<span class="badge" style="background:#FDECF1; color:var(--sageDark); font-size:10px;">🏢 Studio</span>`;

            const noteBadge = t.note ? `<br><small style="color:var(--amber); font-weight:700;">[${esc(t.note)}]</small>` : '';

            return `<tr>
                    <td>${fmtDate(t.date)}</td>
                    <td><strong>Bunda ${cust ? esc(cust.name) : "—"}</strong></td>
                    <td>${svc ? esc(svc.name) : "—"}<br>${typeBadge}</td>
                    <td>${stf ? esc(stf.name) : "—"}${noteBadge}</td>
                    <td style="font-weight:600; color:var(--sageDark);">${fmtIDR(t.amount)}</td>
                    <td style="text-align: right;">
                      <div class="action-cell-group">
                        <button class="fx-btn fx-btn-mini" onclick="printReceipt('${t.id}')" style="background:#4A1E2B; color:white;">🖨️ Struk</button>
                        <button class="fx-btn fx-btn-mini" data-action="wa-tx" data-id="${t.id}" style="background:#25D366; color:white;">💬 WA</button>
                        <button class="fx-btn-ghost" data-action="del-tx" data-id="${t.id}">${ICONS.trash}</button>
                      </div>
                    </td>
                  </tr>`;
          }).join("")}
        </tbody>
      </table>
      ${pg.renderControls('tx')}
    </div>`;
}

function bindTransaksi() {
  const searchInput = document.getElementById("tx-search-input");
  searchInput?.addEventListener("input", (e) => {
    state.txSearch = e.target.value;
    state.txPage = 1;
    renderTab();
  });

  document.querySelectorAll('[data-action="del-tx"]').forEach(btn => btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const idx = state.data.transactions.findIndex(t => t.id === id);
    if (idx === -1) return;

    const deletedItem = state.data.transactions[idx];
    state.data.transactions.splice(idx, 1);
    save();
    renderTab();

    showToast("Transaksi berhasil dihapus", "info", () => {
      state.data.transactions.splice(idx, 0, deletedItem);
      save();
      renderTab();
      showToast("Transaksi dikembalikan", "success");
    });
  }));

  document.querySelectorAll('[data-action="wa-tx"]').forEach(btn => btn.addEventListener("click", () => {
    const tx = state.data.transactions.find(t => t.id === btn.dataset.id);
    if (!tx) return;
    const cust = state.data.customers ? state.data.customers.find(c => c.id === tx.customerId) : null;
    const svc = state.data.services ? state.data.services.find(s => s.id === tx.serviceId) : null;

    if (!cust || !cust.phone) return showToast("Nomor HP belum terdaftar!", "error");
    let phoneStr = String(cust.phone).replace(/\D/g, "");
    if (phoneStr.startsWith("0")) phoneStr = "62" + phoneStr.slice(1);

    const pesan = `Terima kasih atas pembayarannya di *Ulfa Baby Spa*! \n\n *NOTA PEMBAYARAN*\n Tanggal: ${fmtDate(tx.date)}\n Pelanggan: Bunda ${cust.name || '-'}\n Layanan: ${svc ? svc.name : '-'}\n Nominal Dibayar: *${fmtIDR(tx.amount)}* _(${tx.note || 'Lunas'})_\n\nSampai jumpa di perawatan berikutnya! `;
    window.open(`https://wa.me/${phoneStr}?text=${encodeURIComponent(pesan)}`, "_blank");
  }));

  document.querySelectorAll('[data-page-action="tx"]').forEach(btn => btn.addEventListener("click", () => {
    state.txPage = Number(btn.dataset.page); renderTab();
  }));
}

/* ==========================================================================
   8. MODULE: LAYANAN & MEMBERSHIP
   ========================================================================== */
function viewLayanan(d) {
  if (!d.memberships) d.memberships = [];

  return `
    ${header("Layanan & Membership", "Kelola daftar layanan spa dan paket membership pelanggan")}
    
    <div class="fx-card">
      <div class="card-title">➕ Tambah Layanan Spa Baru</div>
      <div class="form-grid">
        <div class="field"><span class="field-label">Nama layanan</span><input class="fx-input" id="svc-name" placeholder="mis. Baby Massage"></div>
        <div class="field"><span class="field-label">Kategori</span><select class="fx-input" id="svc-category"><option>Bayi</option><option>Ibu</option><option>Paket</option></select></div>
        <div class="field"><span class="field-label">Harga (Rp)</span><input class="fx-input" type="number" id="svc-price" placeholder="120000"></div>
        <div class="field"><span class="field-label">Durasi (menit)</span><input class="fx-input" type="number" id="svc-duration" placeholder="45"></div>
        <button class="fx-btn" id="svc-add">${ICONS.plus} Tambah</button>
      </div>
      
      <table class="fx-table" style="margin-top: 16px;">
        <thead>
          <tr>
            <th style="width: 35%;">LAYANAN</th>
            <th style="width: 20%;">KATEGORI</th>
            <th style="width: 20%;">HARGA</th>
            <th style="width: 15%;">DURASI</th>
            <th style="width: 10%; text-align: right;">AKSI</th>
          </tr>
        </thead>
        <tbody>
          ${(d.services || []).map(s => `<tr>
            <td><strong>${esc(s.name)}</strong></td>
            <td>${esc(s.category)}</td>
            <td style="font-weight:600; color:var(--sageDark);">${fmtIDR(s.price)}</td>
            <td>${s.duration} mnt</td>
            <td style="text-align: right;">
              <button class="fx-btn-ghost" data-action="del-svc" data-id="${s.id}">${ICONS.trash}</button>
            </td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>

    <div class="fx-card">
      <div class="card-title">⭐ Tambah Paket Membership Pelanggan</div>
      <div class="form-grid">
        <div class="field" style="grid-column: span 2;">
          <span class="field-label">Pilih Pelanggan</span>
          <select class="fx-input" id="mb-customer">
            <option value="">Pilih pelanggan...</option>
            ${(d.customers || []).map(c => `<option value="${c.id}">${esc(c.name)} (${esc(c.babyName || 'Bayi')})</option>`).join('')}
          </select>
        </div>
        <div class="field"><span class="field-label">Nama Paket</span><input class="fx-input" id="mb-name" placeholder="mis. Paket Gold 5x Massage"></div>
        <div class="field"><span class="field-label">Total Sesi Perawatan</span><input class="fx-input" type="number" id="mb-total" placeholder="5"></div>
        <div class="field"><span class="field-label">Harga Paket (Rp)</span><input class="fx-input" type="number" id="mb-price" placeholder="450000"></div>
        <button class="fx-btn" id="mb-add" style="margin-top: auto;">${ICONS.plus} Buat Paket</button>
      </div>

      <div style="margin-top: 24px;">
        <div class="card-title">💳 Daftar Membership Aktif</div>
        <div class="pkg-grid">
          ${d.memberships.length === 0 ? '<p style="color:var(--inkSoft); font-size:13px;">Belum ada paket membership terdaftar.</p>' : ''}
          ${d.memberships.map(m => {
            const cust = (d.customers || []).find(c => c.id === m.customerId);
            const remaining = m.totalSessions - m.usedSessions;
            const pct = Math.round((m.usedSessions / m.totalSessions) * 100);

            return `
              <div class="pkg-card">
                <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:8px;">
                  <div>
                    <strong style="font-size:14px; color:var(--ink);">${esc(m.name)}</strong><br>
                    <small style="color:var(--sageDark); font-weight:600;">Bunda ${cust ? esc(cust.name) : '-'}</small>
                  </div>
                  <button class="fx-btn-ghost" data-action="del-mb" data-id="${m.id}">${ICONS.trash}</button>
                </div>
                <div class="pkg-bar">
                  <div class="pkg-bar-fill" style="width:${pct}%;"></div>
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; font-size:12px; margin-bottom:12px;">
                  <span style="color:var(--inkSoft)">Terpakai: ${m.usedSessions}/${m.totalSessions} Sesi</span>
                  <strong style="color:${remaining > 0 ? '#385723' : 'var(--danger)'}">${remaining} Sesi Tersisa</strong>
                </div>
                <div style="display:flex; gap:6px;">
                  <button class="fx-btn fx-btn-mini" data-action="use-mb" data-id="${m.id}" style="width:100%;" ${remaining <= 0 ? 'disabled style="opacity:0.5"' : ''}>✓ Gunakan 1 Sesi</button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>`;
}

function bindLayanan() {
  document.getElementById("svc-add")?.addEventListener("click", () => {
    const name = document.getElementById("svc-name").value.trim();
    const price = Number(document.getElementById("svc-price").value) || 0;
    if (!name || !price) return showToast("Isi Nama dan Harga!", "error");
    if (!state.data.services) state.data.services = [];
    state.data.services.push({ id: uid(), name, category: document.getElementById("svc-category").value, price, duration: Number(document.getElementById("svc-duration").value) || 0 });
    save(); showToast("Layanan ditambahkan", "success"); renderTab();
  });

  document.querySelectorAll('[data-action="del-svc"]').forEach(btn => btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const idx = state.data.services.findIndex(s => s.id === id);
    if (idx === -1) return;

    const deletedItem = state.data.services[idx];
    state.data.services.splice(idx, 1);
    save();
    renderTab();

    showToast("Layanan dihapus", "info", () => {
      state.data.services.splice(idx, 0, deletedItem);
      save();
      renderTab();
      showToast("Layanan dikembalikan", "success");
    });
  }));

  document.getElementById("mb-add")?.addEventListener("click", () => {
    const customerId = document.getElementById("mb-customer").value;
    const name = document.getElementById("mb-name").value.trim();
    const totalSessions = Number(document.getElementById("mb-total").value) || 0;
    const price = Number(document.getElementById("mb-price").value) || 0;

    if (!customerId || !name || !totalSessions) return showToast("Lengkapi data membership!", "error");

    if (!state.data.memberships) state.data.memberships = [];
    state.data.memberships.push({
      id: uid(),
      customerId,
      name,
      totalSessions,
      usedSessions: 0,
      price
    });

    save(); showToast("Paket membership berhasil dibuat!", "success"); renderTab();
  });

  document.querySelectorAll('[data-action="use-mb"]').forEach(btn => btn.addEventListener("click", () => {
    const mb = state.data.memberships.find(m => m.id === btn.dataset.id);
    if (!mb) return;
    if (mb.usedSessions < mb.totalSessions) {
      mb.usedSessions++; save(); showToast("1 Sesi terpakai!", "success"); renderTab();
    }
  }));

  document.querySelectorAll('[data-action="del-mb"]').forEach(btn => btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const idx = state.data.memberships.findIndex(m => m.id === id);
    if (idx === -1) return;

    const deletedItem = state.data.memberships[idx];
    state.data.memberships.splice(idx, 1);
    save();
    renderTab();

    showToast("Paket membership dihapus", "info", () => {
      state.data.memberships.splice(idx, 0, deletedItem);
      save();
      renderTab();
      showToast("Membership dikembalikan", "success");
    });
  }));
}

/* ==========================================================================
   9. MODULE: STOK, PELANGGAN, KEUANGAN & STAF
   ========================================================================== */
function viewStok(d) {
  return `
    ${header("Stok Bahan & Perlengkapan", "Pantau bahan habis pakai agar tidak kehabisan")}
    <div class="fx-card">
      <div class="form-grid">
        <div class="field"><span class="field-label">Nama barang</span><input class="fx-input" id="inv-name" placeholder="mis. Minyak Pijat"></div>
        <div class="field"><span class="field-label">Satuan</span><input class="fx-input" id="inv-unit" placeholder="botol"></div>
        <div class="field"><span class="field-label">Stok saat ini</span><input class="fx-input" type="number" id="inv-stock" placeholder="10"></div>
        <div class="field"><span class="field-label">Batas minimum</span><input class="fx-input" type="number" id="inv-min" placeholder="1"></div>
        <button class="fx-btn" id="inv-add">${ICONS.plus} Tambah</button>
      </div>
    </div>
    <div class="fx-card">
      <table class="fx-table">
        <thead>
          <tr>
            <th style="width: 30%;">BARANG</th>
            <th style="width: 20%;">STOK</th>
            <th style="width: 20%;">BATAS MINIMUM</th>
            <th style="width: 20%;">STATUS</th>
            <th style="width: 10%; text-align: right;">AKSI</th>
          </tr>
        </thead>
        <tbody>
          ${(d.inventory || []).map(i => `<tr>
            <td><strong>${esc(i.name)}</strong></td>
            <td>${i.stock} ${esc(i.unit)}</td>
            <td>${i.minStock} ${esc(i.unit)}</td>
            <td>${i.stock <= i.minStock ? '<span class="badge badge-low">Menipis</span>' : '<span class="badge badge-ok">Aman</span>'}</td>
            <td style="text-align: right;">
              <button class="fx-btn-ghost" data-action="del-inv" data-id="${i.id}">${ICONS.trash}</button>
            </td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function bindStok() {
  document.getElementById("inv-add")?.addEventListener("click", () => {
    const name = document.getElementById("inv-name").value.trim();
    if (!name) return showToast("Isi Nama Barang!", "error");
    if (!state.data.inventory) state.data.inventory = [];
    state.data.inventory.push({ id: uid(), name, unit: document.getElementById("inv-unit").value.trim() || "pcs", stock: Number(document.getElementById("inv-stock").value) || 0, minStock: Number(document.getElementById("inv-min").value) || 0 });
    save(); showToast("Barang ditambahkan", "success"); renderTab();
  });

  document.querySelectorAll('[data-action="del-inv"]').forEach(btn => btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const idx = state.data.inventory.findIndex(i => i.id === id);
    if (idx === -1) return;

    const deletedItem = state.data.inventory[idx];
    state.data.inventory.splice(idx, 1);
    save();
    renderTab();

    showToast("Barang dihapus", "info", () => {
      state.data.inventory.splice(idx, 0, deletedItem);
      save();
      renderTab();
      showToast("Barang dikembalikan", "success");
    });
  }));
}

function calcAge(birthDateStr) {
  if (!birthDateStr) return "—";
  const birth = new Date(birthDateStr);
  const now = new Date();
  
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months--;

  if (months < 0) return "Belum lahir";
  if (months === 0) {
    const diffDays = Math.floor((now - birth) / (1000 * 60 * 60 * 24));
    return `${diffDays} hari`;
  }
  if (months >= 24) {
    const years = Math.floor(months / 12);
    const remMonths = months % 12;
    return `${years} thn ${remMonths} bln`;
  }
  return `${months} bulan`;
}

function getCustomerBookingCount(customerId, data) {
  const txCount = (data.transactions || []).filter(t => t.customerId === customerId).length;
  const schCount = (data.schedules || []).filter(s => s.customerId === customerId && s.status !== "Selesai").length;
  return txCount + schCount;
}

function viewPelanggan(d) {
  const currentMonth = new Date().getMonth() + 1;
  const birthdayCustomers = (d.customers || []).filter(c => c.dob && (new Date(c.dob).getMonth() + 1 === currentMonth));

  let list = [...(d.customers || [])];
  const q = (state.custSearch || "").toLowerCase().trim();
  if (q) {
    list = list.filter(c => c.name.toLowerCase().includes(q) || (c.babyName && c.babyName.toLowerCase().includes(q)) || (c.phone && c.phone.includes(q)));
  }

  const pg = paginate(list, state.custPage, 6);

  return `
    ${header("Data Pelanggan", "Kelola data ibu, bayi, tanggal lahir, riwayat kunjungan, dan lokasi")}
    
    ${birthdayCustomers.length > 0 ? `
      <div class="birthday-alert-box">
        <div style="display:flex;align-items:center;gap:10px;">
          <span style="font-size:24px;">🎂</span>
          <div>
            <strong style="font-size:14px;color:#856404;">Ada ${birthdayCustomers.length} Bayi Ulang Tahun Bulan Ini!</strong>
            <div style="font-size:12px;color:#856404;margin-top:2px;">
              ${birthdayCustomers.map(c => `<b>${esc(c.babyName || 'Bayi')}</b> (${esc(c.name)})`).join(', ')}
            </div>
          </div>
        </div>
      </div>
    ` : ''}

    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:12px;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-weight:700; font-size:13px; color:var(--inkSoft);">🔍 CARI PELANGGAN:</span>
        <input class="fx-input" id="cust-search-input" value="${esc(state.custSearch || '')}" placeholder="Ketik nama ibu, bayi, HP..." style="width: 240px; padding: 7px 12px; font-size: 13px;">
      </div>
      <button class="fx-btn" id="open-cust-modal">${ICONS.plus} Tambah Pelanggan Baru</button>
    </div>

    <div class="fx-card">
      <table class="fx-table">
        <thead>
          <tr>
            <th style="width: 22%;">NAMA IBU</th>
            <th style="width: 22%;">DATA BAYI & USIA</th>
            <th style="width: 16%;">TOTAL RESERVASI</th>
            <th style="width: 15%;">NO. HP</th>
            <th style="width: 15%;">ALAMAT</th>
            <th style="width: 10%; text-align: right;">AKSI</th>
          </tr>
        </thead>
        <tbody>
          ${pg.items.length === 0 ? '<tr class="empty-row"><td colspan="6">Belum ada data pelanggan ditemukan.</td></tr>' : ''}
          ${pg.items.map(c => {
            const ageStr = c.dob ? calcAge(c.dob) : (c.babyAge || "—");
            const isBirthdayMonth = c.dob && (new Date(c.dob).getMonth() + 1 === currentMonth);
            const ultahBadge = isBirthdayMonth ? `<span class="badge" style="background:#FFF3CD; color:#856404; font-size:10px; margin-left:4px;">🎂 Ultah Bulan Ini</span>` : '';
            const bookingCount = getCustomerBookingCount(c.id, d);

            return `<tr>
              <td><strong>Bunda ${esc(c.name)}</strong></td>
              <td>
                👶 <strong>${esc(c.babyName) || "—"}</strong> ${ultahBadge}<br>
                <small style="color:var(--inkSoft)">Usia: ${ageStr} ${c.dob ? `(${fmtDate(c.dob)})` : ''}</small>
              </td>
              <td>
                <span class="badge" style="background:#E2F0D9; color:#385723; font-size:11px;">
                  🗓️ ${bookingCount} Kali Reservasi
                </span>
              </td>
              <td>${esc(c.phone) || "—"}</td>
              <td><small>${esc(c.address) || "—"}</small></td>
              <td style="text-align: right;">
                <div class="action-cell-group">
                  <button class="fx-btn fx-btn-mini" data-action="wa-reminder" data-id="${c.id}" style="background:#25D366; color:white;">💬 Sapa WA</button>
                  <button class="fx-btn-ghost" data-action="del-cust" data-id="${c.id}">${ICONS.trash}</button>
                </div>
              </td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
      ${pg.renderControls('cust')}
    </div>

    <div class="modal-overlay" id="cust-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">➕ Tambah Pelanggan Baru</h3>
          <button class="modal-close-btn" id="close-cust-modal">✕</button>
        </div>
        <div class="modal-body">
          <div class="field"><span class="field-label">Nama Ibu</span><input class="fx-input" id="cust-name" placeholder="mis. Bunda Yanti"></div>
          <div class="modal-form-row">
            <div class="field"><span class="field-label">Nama Bayi</span><input class="fx-input" id="cust-baby" placeholder="mis. Yanto"></div>
            <div class="field"><span class="field-label">Tgl Lahir Bayi</span><input class="fx-input" type="date" id="cust-dob"></div>
          </div>
          <div class="field"><span class="field-label">No. HP (WhatsApp)</span><input class="fx-input" id="cust-phone" placeholder="08123456789"></div>
          <div class="field"><span class="field-label">Alamat Lengkap</span><input class="fx-input" id="cust-address" placeholder="Jl. Mawar No. 12 / Perum Indah Blok A"></div>
        </div>
        <div class="modal-footer">
          <button class="fx-btn fx-btn-submit" id="cust-add">${ICONS.plus} Simpan Data Pelanggan</button>
        </div>
      </div>
    </div>`;
}

function bindPelanggan() {
  const modal = document.getElementById("cust-modal");
  const openBtn = document.getElementById("open-cust-modal");
  const closeBtn = document.getElementById("close-cust-modal");

  const showModal = () => { modal?.classList.add("active"); document.body.classList.add("modal-open"); };
  const hideModal = () => { modal?.classList.remove("active"); document.body.classList.remove("modal-open"); };

  openBtn?.addEventListener("click", showModal);
  closeBtn?.addEventListener("click", hideModal);
  modal?.addEventListener("click", (e) => { if (e.target === modal) hideModal(); });

  const searchInput = document.getElementById("cust-search-input");
  searchInput?.addEventListener("input", (e) => {
    state.custSearch = e.target.value;
    state.custPage = 1;
    renderTab();
  });

  document.getElementById("cust-add")?.addEventListener("click", () => {
    const name = document.getElementById("cust-name").value.trim();
    if (!name) return showToast("Isi Nama Ibu!", "error");

    if (!state.data.customers) state.data.customers = [];
    state.data.customers.unshift({
      id: uid(),
      name,
      babyName: document.getElementById("cust-baby").value.trim(),
      dob: document.getElementById("cust-dob").value,
      phone: document.getElementById("cust-phone").value.trim(),
      address: document.getElementById("cust-address").value.trim()
    });

    save(); showToast("Pelanggan berhasil ditambahkan", "success"); hideModal(); renderTab();
  });

  document.querySelectorAll('[data-action="del-cust"]').forEach(btn => btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const idx = state.data.customers.findIndex(c => c.id === id);
    if (idx === -1) return;

    const deletedItem = state.data.customers[idx];
    state.data.customers.splice(idx, 1);
    save();
    renderTab();

    showToast("Pelanggan dihapus", "info", () => {
      state.data.customers.splice(idx, 0, deletedItem);
      save();
      renderTab();
      showToast("Data pelanggan dikembalikan", "success");
    });
  }));

  document.querySelectorAll('[data-action="wa-reminder"]').forEach(btn => btn.addEventListener("click", () => {
    const cust = state.data.customers.find(c => c.id === btn.dataset.id);
    if (!cust || !cust.phone) return showToast("Nomor HP belum terdaftar!", "error");
    let phoneStr = String(cust.phone).replace(/\D/g, "");
    if (phoneStr.startsWith("0")) phoneStr = "62" + phoneStr.slice(1);

    const ageStr = cust.dob ? calcAge(cust.dob) : 'bayi';
    const pesan = `Halo Bunda ${cust.name}! \nBagaimana kabar adek ${cust.babyName || 'si kecil'}? (Usia ${ageStr})\nSudah waktunya perawatan di *Ulfa Baby Spa* nih, Bunda! `;
    window.open(`https://wa.me/${phoneStr}?text=${encodeURIComponent(pesan)}`, "_blank");
  }));

  document.querySelectorAll('[data-page-action="cust"]').forEach(btn => btn.addEventListener("click", () => {
    state.custPage = Number(btn.dataset.page); renderTab();
  }));
}

function viewKeuangan(d) {
  const totalRevenue = (d.transactions || []).reduce((s, t) => s + t.amount, 0);
  const totalExpense = (d.expenses || []).reduce((s, e) => s + e.amount, 0);
  const pg = paginate(d.expenses || [], state.expPage, 5);

  return `
    ${header("Keuangan", "Pantau pemasukan dan pengeluaran")}
    <div class="kpi-grid">
      ${kpiCard("Total Pemasukan", fmtIDR(totalRevenue), "up", "var(--sage)")}
      ${kpiCard("Total Pengeluaran", fmtIDR(totalExpense), "down", "var(--blush)")}
      ${kpiCard("Laba Bersih", fmtIDR(totalRevenue - totalExpense), "wallet", "var(--aqua)")}
    </div>
    <div class="fx-card">
      <div class="form-grid">
        <div class="field"><span class="field-label">Tanggal</span><input class="fx-input" type="date" id="exp-date" value="${todayISO()}"></div>
        <div class="field"><span class="field-label">Kategori</span><select class="fx-input" id="exp-category"><option>Operasional</option><option>Marketing</option><option>Akomodasi</option><option>Gaji</option><option>Lainnya</option></select></div>
        <div class="field"><span class="field-label">Jumlah (Rp)</span><input class="fx-input" type="number" id="exp-amount"></div>
        <div class="field"><span class="field-label">Catatan</span><input class="fx-input" id="exp-note"></div>
        <button class="fx-btn" id="exp-add">${ICONS.plus} Tambah</button>
      </div>
    </div>
    <div class="fx-card">
      <table class="fx-table">
        <thead>
          <tr>
            <th style="width: 20%;">TANGGAL</th>
            <th style="width: 20%;">KATEGORI</th>
            <th style="width: 30%;">CATATAN</th>
            <th style="width: 20%;">JUMLAH</th>
            <th style="width: 10%; text-align: right;">AKSI</th>
          </tr>
        </thead>
        <tbody>
          ${pg.items.map(e => `<tr>
            <td>${fmtDate(e.date)}</td>
            <td>${esc(e.category)}</td>
            <td>${esc(e.note) || "—"}</td>
            <td style="color:var(--danger); font-weight:600;">−${fmtIDR(e.amount)}</td>
            <td style="text-align: right;">
              <button class="fx-btn-ghost" data-action="del-exp" data-id="${e.id}">${ICONS.trash}</button>
            </td>
          </tr>`).join("")}
        </tbody>
      </table>
      ${pg.renderControls('exp')}
    </div>`;
}

function bindKeuangan() {
  document.getElementById("exp-add")?.addEventListener("click", () => {
    const amount = Number(document.getElementById("exp-amount").value) || 0;
    if (!amount) return showToast("Isi Jumlah pengeluaran!", "error");
    if (!state.data.expenses) state.data.expenses = [];
    state.data.expenses.unshift({ id: uid(), date: document.getElementById("exp-date").value || todayISO(), category: document.getElementById("exp-category").value, amount, note: document.getElementById("exp-note").value.trim() });
    save(); showToast("Pengeluaran dicatat", "success"); renderTab();
  });

  document.querySelectorAll('[data-action="del-exp"]').forEach(btn => btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const idx = state.data.expenses.findIndex(e => e.id === id);
    if (idx === -1) return;

    const deletedItem = state.data.expenses[idx];
    state.data.expenses.splice(idx, 1);
    save();
    renderTab();

    showToast("Pengeluaran dihapus", "info", () => {
      state.data.expenses.splice(idx, 0, deletedItem);
      save();
      renderTab();
      showToast("Catatan pengeluaran dikembalikan", "success");
    });
  }));

  document.querySelectorAll('[data-page-action="exp"]').forEach(btn => btn.addEventListener("click", () => {
    state.expPage = Number(btn.dataset.page); renderTab();
  }));
}

function viewStaf(d) {
  return `
    ${header("Staf & Terapis", "Kelola data tim")}
    <div class="fx-card">
      <div class="form-grid">
        <div class="field"><span class="field-label">Nama</span><input class="fx-input" id="staf-name"></div>
        <div class="field"><span class="field-label">Peran</span><select class="fx-input" id="staf-role"><option>Owner</option><option>Marketing</option><option>Terapis Bayi</option><option>Terapis Ibu</option></select></div>
        <div class="field"><span class="field-label">No. HP</span><input class="fx-input" id="staf-phone"></div>
        <button class="fx-btn" id="staf-add">${ICONS.plus} Tambah</button>
      </div>
    </div>
    <div class="fx-card">
      <table class="fx-table">
        <thead>
          <tr>
            <th style="width: 35%;">NAMA</th>
            <th style="width: 30%;">PERAN</th>
            <th style="width: 25%;">NO. HP</th>
            <th style="width: 10%; text-align: right;">AKSI</th>
          </tr>
        </thead>
        <tbody>
          ${(d.staff || []).map(s => `<tr>
            <td><strong>${esc(s.name)}</strong></td>
            <td>${esc(s.role)}</td>
            <td>${esc(s.phone) || "—"}</td>
            <td style="text-align: right;">
              <button class="fx-btn-ghost" data-action="del-staf" data-id="${s.id}">${ICONS.trash}</button>
            </td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>`;
}

function bindStaf() {
  document.getElementById("staf-add")?.addEventListener("click", () => {
    const name = document.getElementById("staf-name").value.trim();
    if (!name) return showToast("Isi Nama Staf!", "error");
    if (!state.data.staff) state.data.staff = [];
    state.data.staff.push({ id: uid(), name, role: document.getElementById("staf-role").value, phone: document.getElementById("staf-phone").value.trim() });
    save(); showToast("Staf ditambahkan", "success"); renderTab();
  });

  document.querySelectorAll('[data-action="del-staf"]').forEach(btn => btn.addEventListener("click", () => {
    const id = btn.dataset.id;
    const idx = state.data.staff.findIndex(s => s.id === id);
    if (idx === -1) return;

    const deletedItem = state.data.staff[idx];
    state.data.staff.splice(idx, 1);
    save();
    renderTab();

    showToast("Data staf dihapus", "info", () => {
      state.data.staff.splice(idx, 0, deletedItem);
      save();
      renderTab();
      showToast("Data staf dikembalikan", "success");
    });
  }));
}

/* ==========================================================================
   10. INITIALIZATION & PRINT RECEIPT
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initApp();
  startRealtimeClock();
});

function startRealtimeClock() {
  const updateClock = () => {
    const clockEl = document.getElementById("realtime-clock");
    const dateEl = document.getElementById("realtime-date");
    if (!clockEl || !dateEl) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).replace(/\./g, ":");
    const dateStr = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short", year: "numeric" });

    clockEl.textContent = timeStr;
    dateEl.textContent = dateStr;
  };
  updateClock();
  setInterval(updateClock, 1000);
}

function printReceipt(txId) {
  const tx = (state.data.transactions || []).find(t => t.id === txId);
  if (!tx) return showToast("Transaksi tidak ditemukan!", "error");

  const cust = (state.data.customers || []).find(c => c.id === tx.customerId);
  const svc = (state.data.services || []).find(s => s.id === tx.serviceId);
  const stf = (state.data.staff || []).find(s => s.id === tx.staffId);

  const printArea = document.getElementById("print-area");
  if (!printArea) return;

  const babyInfo = (cust && cust.babyName && cust.babyName !== "-") ? cust.babyName : "-";
  const noteText = tx.note ? ` (${tx.note})` : ' Pembayaran';

  printArea.innerHTML = `
    <div class="receipt-box">
      <div class="receipt-header">
        <h2 class="receipt-title">ULFA BABY SPA</h2>
        <p class="receipt-sub">Layanan Spa Bayi, Anak & Ibu</p>
        <p class="receipt-contact">WhatsApp: 0812-1111-2222</p>
      </div>

      <div class="receipt-divider"></div>

      <table class="receipt-info-table">
        <tr><td>No. Nota</td><td class="text-right">#${tx.id.toUpperCase()}</td></tr>
        <tr><td>Tanggal</td><td class="text-right">${fmtDate(tx.date)}</td></tr>
        <tr><td>Tipe</td><td class="text-right">${tx.type || 'Studio'}</td></tr>
        <tr><td>Pelanggan</td><td class="text-right">Bunda ${esc(cust ? cust.name : '-')}</td></tr>
        <tr><td>Nama Bayi</td><td class="text-right">${esc(babyInfo)}</td></tr>
        <tr><td>Terapis</td><td class="text-right">${esc(stf ? stf.name : '-')}</td></tr>
      </table>

      <div class="receipt-divider"></div>

      <table class="receipt-item-table">
        <thead>
          <tr>
            <th class="text-left">Keterangan Layanan</th>
            <th class="text-right">Jumlah</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <strong>${esc(svc ? svc.name : 'Layanan Spa')}</strong><br>
              <small style="color:#666">${esc(noteText)}</small>
            </td>
            <td class="text-right font-bold">${fmtIDR(tx.amount)}</td>
          </tr>
        </tbody>
      </table>

      <div class="receipt-divider"></div>

      <div class="receipt-total-row">
        <span>TOTAL DIBAYAR</span>
        <span>${fmtIDR(tx.amount)}</span>
      </div>

      <div class="receipt-status-tag">${esc(tx.note ? tx.note.toUpperCase() : 'LUNAS')}</div>

      <div class="receipt-footer">
        <p>Terima kasih telah mempercayakan<br>perawatan di <strong>Ulfa Baby Spa</strong> 💖</p>
        <small>Semoga si kecil sehat & ceria selalu!</small>
      </div>
    </div>
  `;

  window.print();
}
