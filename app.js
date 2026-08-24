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
    badge.innerHTML = `<span class="sync-dot"></span> Connecting...`;
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
      { id: svc.swim, name: "Pijat + Berenang", category: "Bayi", price: 120000, duration: 45 },
      { id: svc.momMassage, name: "Pijat Ibu Hamil", category: "Ibu", price: 150000, duration: 60 },
      { id: svc.facial, name: "Newborn Care", category: "Bayi", price: 250000, duration: 60 },
    ],
    memberships: [
      { id: uid(), customerId: cust.a, name: "Paket Gold 5x Pijat Bayi", totalSessions: 5, usedSessions: 2, price: 450000 },
      { id: uid(), customerId: cust.b, name: "Paket Premium Ibu & Anak", totalSessions: 8, usedSessions: 5, price: 900000 }
    ],
    staff: [
      { id: stf.s1, name: "Ulfa", role: "Owner", phone: "0812-1111-2222" },
      { id: stf.s2, name: "Sugiono", role: "Terapis Bayi", phone: "0813-3333-4444" },
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
        <img src="icon.png" alt="Ulfa Baby Spa Logo" onerror="this.style.display='none'">
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
        applyRolePermissions();
        renderTab();
      } else {
        showToast("Username atau Password salah!", "error");
      }
    });
  }
}

function applyRolePermissions() {
  if (!state.currentUser) return;

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
  const syncLabel = state.syncStatus === 'online' ? 'Online' : (state.syncStatus === 'syncing' ? 'Connecting' : 'Offline');

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
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;overflow:visible;">
        <line x1="${padL}" y1="${padT}" x2="${W - padR}" y2="${padT}" stroke="#f0dbe1" stroke-dasharray="3,3" stroke-width="1"/>
        <line x1="${padL}" y1="${padT + chartH / 2}" x2="${W - padR}" y2="${padT + chartH / 2}" stroke="#f0dbe1" stroke-dasharray="3,3" stroke-width="1"/>
        <line x1="${padL}" y1="${padT + chartH}" x2="${W - padR}" y2="${padT + chartH}" stroke="#E85D88" stroke-opacity="0.3" stroke-width="1.5"/>

        <path d="${linePath}" fill="none" stroke="#E85D88" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>

        ${points.map((p, idx) => `
          <g class="chart-node">
            <circle cx="${p.x}" cy="${p.y}" r="5" fill="#FFFFFF" stroke="#E85D88" stroke-width="2.5"/>
            <text x="${p.x}" y="${H - 8}" text-anchor="middle" fill="#7A626A" font-size="10">
              ${days[idx].slice(5)}
            </text>
          </g>
        `).join('')}
      </svg>
    `;
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
if (!state.schFilter) state.schFilter = "Semua";
if (!state.schView) state.schView = "table";

function viewJadwal(d) {
  if (!d.schedules) d.schedules = [];
  
  let list = [...d.schedules];
  if (state.schFilter !== "Semua") {
    list = list.filter(s => s.status === state.schFilter);
  }
  const sorted = list.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  return `
    ${header("Jadwal & Booking Spa", "Atur janji temu, pembayaran, dan reservasi pelanggan")}
    
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; flex-wrap:wrap; gap:10px;">
      <div class="status-filter-group">
        <button class="status-btn ${state.schFilter === 'Semua' ? 'active' : ''}" data-sch-filter="Semua">Semua</button>
        <button class="status-btn ${state.schFilter === 'Akan Datang' ? 'active' : ''}" data-sch-filter="Akan Datang">Akan Datang</button>
        <button class="status-btn ${state.schFilter === 'Selesai' ? 'active' : ''}" data-sch-filter="Selesai">Selesai</button>
      </div>

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
          ${sorted.length === 0 ? '<tr class="empty-row"><td colspan="7">Tidak ada agenda reservasi.</td></tr>' : ''}
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

    <!-- MODAL RESERVASI -->
    <div class="modal-overlay" id="sch-modal">
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">✨ Tambah Reservasi Baru</h3>
          <button class="modal-close-btn" id="close-sch-modal">✕</button>
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

          <div class="field" style="position:relative;">
            <label class="field-label" for="sch-cust-search">👤 Cari & Pilih Pelanggan</label>
            <input class="fx-input" id="sch-cust-search" placeholder="Ketik nama ibu atau bayi..." autocomplete="off">
            <input type="hidden" id="sch-customer-id">
            <div class="combobox-dropdown" id="sch-cust-dropdown" style="display:none; position:absolute; width:100%; z-index:1000; background:white; border:1px solid var(--line); border-radius:8px; max-height:150px; overflow-y:auto; box-shadow:0 4px 12px rgba(0,0,0,0.1);"></div>
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
              <label class="field-label" for="sch-dp">💰 Nominal DP (Rp)</label>
              <input class="fx-input" type="number" id="sch-dp" placeholder="contoh: 50000">
            </div>
          </div>

          <div class="field">
            <label class="field-label" for="sch-note">📝 Catatan Tambahan</label>
            <input class="fx-input" id="sch-note" placeholder="Permintaan khusus / alamat...">
          </div>
        </div>

        <div class="modal-footer" style="padding:16px; border-top:1px solid var(--line);">
          <button class="fx-btn fx-btn-submit" id="sch-add" style="width:100%;">
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

  document.querySelectorAll('[data-sch-filter]').forEach(btn => {
    btn.addEventListener("click", () => {
      state.schFilter = btn.dataset.schFilter;
      renderTab();
    });
  });

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

  // COMBOBOX CARI PELANGGAN
  const custSearch = document.getElementById("sch-cust-search");
  const custIdInput = document.getElementById("sch-customer-id");
  const custDropdown = document.getElementById("sch-cust-dropdown");

  if (custSearch && custDropdown) {
    const renderCustDropdown = (q) => {
      const filtered = (state.data.customers || []).filter(c => 
        c.name.toLowerCase().includes(q.toLowerCase()) || (c.babyName && c.babyName.toLowerCase().includes(q.toLowerCase()))
      );

      if (filtered.length === 0) {
        custDropdown.innerHTML = `<div style="padding:8px 12px; font-size:12px; color:var(--inkSoft);">Tidak ditemukan</div>`;
      } else {
        custDropdown.innerHTML = filtered.map(c => `
          <div class="cust-opt-item" data-id="${c.id}" data-name="Bunda ${esc(c.name)}" style="padding:8px 12px; cursor:pointer; border-bottom:1px solid #f0f0f0; font-size:13px;">
            <strong>Bunda ${esc(c.name)}</strong> <small>(Bayi: ${esc(c.babyName || '-')})</small>
          </div>
        `).join("");
      }
      custDropdown.style.display = "block";
    };

    custSearch.addEventListener("focus", () => renderCustDropdown(custSearch.value));
    custSearch.addEventListener("input", (e) => renderCustDropdown(e.target.value));

    custDropdown.addEventListener("click", (e) => {
      const item = e.target.closest(".cust-opt-item");
      if (item) {
        custIdInput.value = item.dataset.id;
        custSearch.value = item.dataset.name;
        custDropdown.style.display = "none";
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

    save();
    showToast("Reservasi berhasil disimpan!", "success");
    hideModal();
    renderTab();
  });

  document.querySelectorAll('[data-action="del-sch"]').forEach(btn => {
    btn.addEventListener("click", () => {
      if (!confirm("Hapus jadwal ini?")) return;
      state.data.schedules = state.data.schedules.filter(s => s.id !== btn.dataset.id);
      save(); showToast("Jadwal dihapus", "info"); renderTab();
    });
  });
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
    ${header("Riwayat Transaksi", "Seluruh transaksi tercatat disini")}
    
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

            return `<tr>
                    <td>${fmtDate(t.date)}</td>
                    <td><strong>Bunda ${cust ? esc(cust.name) : "—"}</strong></td>
                    <td>${svc ? esc(svc.name) : "—"}<br>${typeBadge}</td>
                    <td>${stf ? esc(stf.name) : "—"}</td>
                    <td style="font-weight:600; color:var(--sageDark);">${fmtIDR(t.amount)}</td>
                    <td style="text-align: right;">
                      <div class="action-cell-group">
                        <button class="fx-btn fx-btn-mini" onclick="printReceipt('${t.id}')" style="background:#4A1E2B; color:white;">🖨️ Struk</button>
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
    if (!confirm("Hapus transaksi?")) return;
    state.data.transactions = state.data.transactions.filter(t => t.id !== btn.dataset.id);
    save(); renderTab();
  }));

  document.querySelectorAll('[data-page-action="tx"]').forEach(btn => btn.addEventListener("click", () => {
    state.txPage = Number(btn.dataset.page); renderTab();
  }));
}

/* ==========================================================================
   8. MODULE: LAYANAN & MEMBERSHIP
   ========================================================================== */
function viewLayanan(d) {
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
    if (!confirm("Hapus layanan?")) return;
    state.data.services = state.data.services.filter(s => s.id !== btn.dataset.id);
    save(); renderTab();
  }));
}

/* ==========================================================================
   9. MODULE: STOK & PELANGGAN (DENGAN FIX PENYIMPANAN DATA)
   ========================================================================== */
function viewStok(d) {
  return `
    ${header("Stok Bahan & Perlengkapan", "Pantau dan sesuaikan jumlah bahan habis pakai")}
    <div class="fx-card">
      <div class="card-title">➕ Tambah Barang Baru</div>
      <div class="form-grid">
        <div class="field"><span class="field-label">Nama barang</span><input class="fx-input" id="inv-name" placeholder="mis. Minyak Pijat"></div>
        <div class="field"><span class="field-label">Satuan</span><input class="fx-input" id="inv-unit" placeholder="botol / pcs"></div>
        <div class="field"><span class="field-label">Stok awal</span><input class="fx-input" type="number" id="inv-stock" placeholder="10"></div>
        <div class="field"><span class="field-label">Batas minimum</span><input class="fx-input" type="number" id="inv-min" placeholder="2"></div>
        <button class="fx-btn" id="inv-add" style="margin-top:auto;">${ICONS.plus} Tambah</button>
      </div>
    </div>

    <div class="fx-card">
      <table class="fx-table">
        <thead>
          <tr>
            <th style="width: 30%;">BARANG</th>
            <th style="width: 20%;">STOK</th>
            <th style="width: 20%;">BATAS MIN</th>
            <th style="width: 20%;">STATUS</th>
            <th style="width: 10%; text-align: right;">AKSI</th>
          </tr>
        </thead>
        <tbody>
          ${(d.inventory || []).map(i => `<tr>
            <td><strong>${esc(i.name)}</strong></td>
            <td>${i.stock} ${esc(i.unit)}</td>
            <td>${i.minStock} ${esc(i.unit)}</td>
            <td>${i.stock <= i.minStock ? '<span class="badge badge-low">⚠️ Menipis</span>' : '<span class="badge badge-ok">Aman</span>'}</td>
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
    state.data.inventory.push({
      id: uid(),
      name,
      unit: document.getElementById("inv-unit").value.trim() || "pcs",
      stock: Number(document.getElementById("inv-stock").value) || 0,
      minStock: Number(document.getElementById("inv-min").value) || 0
    });
    save(); showToast("Barang ditambahkan", "success"); renderTab();
  });

  document.querySelectorAll('[data-action="del-inv"]').forEach(btn => btn.addEventListener("click", () => {
    state.data.inventory = state.data.inventory.filter(i => i.id !== btn.dataset.id);
    save(); renderTab();
  }));
}

function calcAge(birthDateStr) {
  if (!birthDateStr) return "—";
  const birth = new Date(birthDateStr);
  const now = new Date();
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  if (now.getDate() < birth.getDate()) months--;
  if (months < 0) return "Belum lahir";
  if (months === 0) return `${Math.floor((now - birth) / (1000 * 60 * 60 * 24))} hari`;
  if (months >= 24) return `${Math.floor(months / 12)} thn ${months % 12} bln`;
  return `${months} bulan`;
}

function viewPelanggan(d) {
  let list = [...(d.customers || [])];
  const q = (state.custSearch || "").toLowerCase().trim();
  if (q) {
    list = list.filter(c => c.name.toLowerCase().includes(q) || (c.babyName && c.babyName.toLowerCase().includes(q)) || (c.phone && c.phone.includes(q)));
  }

  const pg = paginate(list, state.custPage, 6);

  return `
    ${header("Data Pelanggan", "Kelola data ibu, bayi, tanggal lahir, dan lokasi")}
    
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
            <th style="width: 25%;">NAMA IBU</th>
            <th style="width: 25%;">DATA BAYI & USIA</th>
            <th style="width: 20%;">NO. HP</th>
            <th style="width: 20%;">ALAMAT</th>
            <th style="width: 10%; text-align: right;">AKSI</th>
          </tr>
        </thead>
        <tbody>
          ${pg.items.length === 0 ? '<tr class="empty-row"><td colspan="5">Belum ada data pelanggan ditemukan.</td></tr>' : ''}
          ${pg.items.map(c => `<tr>
            <td><strong>Bunda ${esc(c.name)}</strong></td>
            <td>👶 <strong>${esc(c.babyName) || "—"}</strong><br><small style="color:var(--inkSoft)">Usia: ${calcAge(c.dob)}</small></td>
            <td>${esc(c.phone) || "—"}</td>
            <td><small>${esc(c.address) || "—"}</small></td>
            <td style="text-align: right;">
              <button class="fx-btn-ghost" data-action="del-cust" data-id="${c.id}">${ICONS.trash}</button>
            </td>
          </tr>`).join("")}
        </tbody>
      </table>
      ${pg.renderControls('cust')}
    </div>

    <!-- POPUP MODAL TAMBAH PELANGGAN -->
    <div class="modal-overlay" id="cust-modal">
      <div class="modal-container" style="max-width:450px; background:white; padding:20px; border-radius:12px; margin:auto;">
        <div class="modal-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 class="modal-title" style="margin:0;">➕ Tambah Pelanggan Baru</h3>
          <button class="modal-close-btn" id="close-cust-modal" style="background:none; border:none; font-size:18px; cursor:pointer;">✕</button>
        </div>
        <div class="modal-body" style="display:flex; flex-direction:column; gap:12px;">
          <div class="field"><label class="field-label">Nama Ibu</label><input class="fx-input" id="cust-name" placeholder="mis. Bunda Yanti"></div>
          <div class="modal-form-row" style="display:flex; gap:10px;">
            <div class="field" style="flex:1;"><label class="field-label">Nama Bayi</label><input class="fx-input" id="cust-baby" placeholder="mis. Yanto"></div>
            <div class="field" style="flex:1;"><label class="field-label">Tgl Lahir Bayi</label><input class="fx-input" type="date" id="cust-dob"></div>
          </div>
          <div class="field"><label class="field-label">No. HP (WhatsApp)</label><input class="fx-input" id="cust-phone" placeholder="08123456789"></div>
          <div class="field"><label class="field-label">Alamat Lengkap</label><input class="fx-input" id="cust-address" placeholder="Jl. Mawar No. 12"></div>
          <button class="fx-btn fx-btn-submit" id="cust-add" style="margin-top:10px; padding:12px; width:100%;">${ICONS.plus} Simpan Data Pelanggan</button>
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

  const searchInput = document.getElementById("cust-search-input");
  searchInput?.addEventListener("input", (e) => {
    state.custSearch = e.target.value;
    state.custPage = 1;
    renderTab();
  });

  // TANGKAP TOMBOL SIMPAN PELANGGAN
  document.getElementById("cust-add")?.addEventListener("click", () => {
    const nameEl = document.getElementById("cust-name");
    const babyEl = document.getElementById("cust-baby");
    const dobEl = document.getElementById("cust-dob");
    const phoneEl = document.getElementById("cust-phone");
    const addrEl = document.getElementById("cust-address");

    const name = nameEl ? nameEl.value.trim() : "";
    if (!name) return showToast("Mohon isi Nama Ibu!", "error");

    if (!state.data.customers) state.data.customers = [];

    state.data.customers.unshift({
      id: uid(),
      name: name,
      babyName: babyEl ? babyEl.value.trim() : "",
      dob: dobEl ? dobEl.value : "",
      phone: phoneEl ? phoneEl.value.trim() : "",
      address: addrEl ? addrEl.value.trim() : ""
    });

    save();
    showToast("Pelanggan berhasil ditambahkan!", "success");
    hideModal();
    renderTab();
  });

  document.querySelectorAll('[data-action="del-cust"]').forEach(btn => btn.addEventListener("click", () => {
    if (!confirm("Hapus data pelanggan?")) return;
    state.data.customers = state.data.customers.filter(c => c.id !== btn.dataset.id);
    save(); renderTab();
  }));

  document.querySelectorAll('[data-page-action="cust"]').forEach(btn => btn.addEventListener("click", () => {
    state.custPage = Number(btn.dataset.page); renderTab();
  }));
}

/* ==========================================================================
   10. MODULE: KEUANGAN & STAF
   ========================================================================== */
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
        <div class="field"><span class="field-label">Kategori</span><select class="fx-input" id="exp-category"><option>Operasional</option><option>Marketing</option><option>Gaji</option><option>Lainnya</option></select></div>
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
    state.data.expenses = state.data.expenses.filter(e => e.id !== btn.dataset.id);
    save(); renderTab();
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
        <div class="field"><span class="field-label">Peran</span><select class="fx-input" id="staf-role"><option>Owner</option><option>Terapis Bayi</option><option>Terapis Ibu</option></select></div>
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
    state.data.staff = state.data.staff.filter(s => s.id !== btn.dataset.id);
    save(); renderTab();
  }));
}

/* ==========================================================================
   11. INITIALIZATION & PRINT RECEIPT
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

  printArea.innerHTML = `
    <div class="receipt-box" style="padding:20px; font-family:sans-serif;">
      <div style="text-align:center; border-bottom:1px dashed #ccc; padding-bottom:10px;">
        <h2 style="margin:0;">ULFA BABY SPA</h2>
        <p style="margin:4px 0; font-size:12px;">Layanan Spa Bayi & Ibu</p>
      </div>
      <div style="margin:10px 0; font-size:12px;">
        <div>Tanggal: ${fmtDate(tx.date)}</div>
        <div>Pelanggan: Bunda ${esc(cust ? cust.name : '-')}</div>
        <div>Layanan: ${esc(svc ? svc.name : '-')}</div>
        <div>Terapis: ${esc(stf ? stf.name : '-')}</div>
      </div>
      <div style="border-top:1px dashed #ccc; border-bottom:1px dashed #ccc; padding:10px 0; display:flex; justify-content:space-between; font-weight:bold;">
        <span>TOTAL DIBAYAR</span>
        <span>${fmtIDR(tx.amount)}</span>
      </div>
    </div>
  `;

  window.print();
}
