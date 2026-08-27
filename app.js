/* ==========================================================================
   1. CONSTANTS, HELPERS & CONFIG
   ========================================================================== */
const uid = () => Math.random().toString(36).slice(2, 10);
const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtIDR = (n) => "Rp " + Math.round(n || 0).toLocaleString("id-ID");
const fmtDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};
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

const USERS = [
  { username: "admin", password: "04092000", name: "Ulfa (Owner)", role: "owner" },
  { username: "user", password: "user123", name: "user 1", role: "user" }
];

const SUPABASE_URL = "https://lmqmnmgwkifbbhjheqxr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxtcW1ubWd3a2lmYmJoamhlcXhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5ODE3MTYsImV4cCI6MjEwMTU1NzcxNn0.3n3Yjo-JqZqKMnit4_qQemuvjOE9U7ipq8VOTSxX_9I";

const supabaseClient = (typeof supabase !== "undefined") 
  ? supabase.createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

function showToast(msg, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  const iconMap = { success: "✓", error: "✕", info: "ℹ" };
  toast.innerHTML = `<div style="display:flex;align-items:center;"><span>${iconMap[type] || "ℹ"}</span> <span style="margin-left:6px;">${esc(msg)}</span></div>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "toastOut 0.3s forwards";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
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

function daysAgoText(dateStr) {
  if (!dateStr) return "Belum Pernah";
  const diffTime = Math.abs(new Date() - new Date(dateStr));
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Hari Ini";
  if (diffDays === 1) return "Kemarin";
  return `${diffDays} hari yang lalu`;
}

function showConfirmModal(title, text, onConfirm) {
  let overlay = document.getElementById("custom-confirm-modal");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "custom-confirm-modal";
    overlay.className = "modal-overlay";
    document.body.appendChild(overlay);
  }

  overlay.innerHTML = `
    <div class="modal-container" style="max-width:380px; text-align:center; padding:24px; background:#fff; border-radius:20px;">
      <div style="font-size:48px; margin-bottom:8px;">⚠️</div>
      <h3 style="margin:0 0 8px; font-size:18px; color:var(--ink);">${esc(title)}</h3>
      <p style="margin:0 0 20px; font-size:13px; color:var(--inkSoft); line-height:1.4;">${esc(text)}</p>
      <div style="display:flex; gap:10px; justify-content:center;">
        <button class="fx-btn fx-btn-ghost" id="confirm-cancel-btn" style="border:1px solid var(--line); width:100%;">Batal</button>
        <button class="fx-btn" id="confirm-ok-btn" style="background:var(--danger); color:white; width:100%;">Hapus</button>
      </div>
    </div>
  `;

  overlay.classList.add("active");

  document.getElementById("confirm-cancel-btn").onclick = () => overlay.classList.remove("active");
  document.getElementById("confirm-ok-btn").onclick = () => {
    overlay.classList.remove("active");
    onConfirm();
  };
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
  dashboardPeriod: "all",
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
  const svc = { baby: uid(), swim: uid(), momMassage: uid(), facial: uid() };
  const cust = { a: uid(), b: uid() };
  const stf = { s1: uid(), s2: uid() };

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
    memberships: [],
    staff: [
      { id: stf.s1, name: "Ulfa", role: "Owner", phone: "0812-1111-2222" },
      { id: stf.s2, name: "Sugiono", role: "Terapis Bayi", phone: "0813-3333-4444" },
    ],
    customers: [
      { id: cust.a, name: "Yanti", babyName: "Yanto", dob: "2026-08-05", phone: "0811-2233-4455", address: "Jl. Mawar No. 12" },
      { id: cust.b, name: "Christian", babyName: "Ronaldo", dob: "2024-08-10", phone: "0822-5566-7788", address: "Perum Graha Indah" },
    ],
    transactions: [
      { id: uid(), date: todayISO(), customerId: cust.a, serviceId: svc.baby, staffId: stf.s1, type: "Studio", amount: 30000, isDp: true, totalServiceCost: 100000, note: "DP Reservasi" },
      { id: uid(), date: todayISO(), customerId: cust.b, serviceId: svc.momMassage, staffId: stf.s2, type: "Home Care", amount: 165000, isDp: false, totalServiceCost: 165000, note: "Pelunasan Home Care" },
    ],
    inventory: [
      { id: uid(), name: "Minyak Pijat Bayi", unit: "botol", stock: 1, minStock: 3 },
      { id: uid(), name: "Lotion Aromaterapi", unit: "botol", stock: 10, minStock: 2 },
    ],
    expenses: [
      { id: uid(), date: todayISO(), category: "Gaji", amount: 1500000, note: "Gaji mingguan" },
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
      const { data } = await supabaseClient
        .from('spa_data')
        .select('payload')
        .eq('id', 'main_data')
        .maybeSingle();

      if (data && data.payload) {
        state.data = data.payload;
        localStorage.setItem("spa_data", JSON.stringify(data.payload));
        setSyncStatus("online");
        if (state.currentUser) renderTab();
      } else {
        save();
      }
    } catch (err) {
      setSyncStatus("offline");
    }
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
      await supabaseClient
        .from('spa_data')
        .upsert({ id: 'main_data', payload: state.data, updated_at: new Date() });
      setSyncStatus("online");
    } catch (err) {
      setSyncStatus("offline");
    }
  }
}

/* ==========================================================================
   3. AUTHENTICATION & LOGIN
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

  document.getElementById("login-form")?.addEventListener("submit", (e) => {
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
        <strong style="color:#fff;">${esc(state.currentUser.name)}</strong>
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
   4. RENDER LAYOUT
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

  if (!state.currentUser) { renderLoginModal(); return; }
  if (!state.data) { main.innerHTML = `<div style="text-align:center; padding:60px 20px;">⏳ Memuat data...</div>`; return; }

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
        <div id="sync-status-badge" class="sync-badge ${syncClass}"><span class="sync-dot"></span> ${syncLabel}</div>
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
   5. MODULE RINGKASAN & GRAFIK INTERAKTIF
   ========================================================================== */
function viewRingkasan(d) {
  const totalRevenue = (d.transactions || []).reduce((s, t) => s + (t.amount || 0), 0);
  const totalExpense = (d.expenses || []).reduce((s, e) => s + (e.amount || 0), 0);
  const netProfit = totalRevenue - totalExpense;

  const lowStockItems = (d.inventory || []).filter(i => Number(i.stock || 0) <= Number(i.minStock || 0));

  return `
    ${header("Ringkasan Usaha", "Gambaran umum performa Ulfa Baby Spa")}
    <div class="kpi-grid">
      ${kpiCard("Total Pendapatan", fmtIDR(totalRevenue), "wallet", "var(--sage)")}
      ${kpiCard("Total Pengeluaran", fmtIDR(totalExpense), "down", "var(--blush)")}
      ${kpiCard("Laba Bersih", fmtIDR(netProfit), "up", netProfit >= 0 ? "var(--sage)" : "var(--danger)")}
      ${kpiCard("Total Booking", (d.schedules || []).length, "receipt", "var(--aqua)")}
    </div>

    ${lowStockItems.length > 0 ? `
    <div class="fx-card" style="border-left:5px solid var(--amber); background:#FFFDF8; margin-bottom:20px;">
      <div style="display:flex; align-items:center; gap:8px; font-weight:700; color:#8A5A1E; margin-bottom:8px;">
        ${ICONS.alert.replace('currentColor', '#8A5A1E')} Peringatan Stok Menipis (${lowStockItems.length} Barang)
      </div>
      <div style="display:flex; flex-wrap:wrap; gap:8px;">
        ${lowStockItems.map(i => `<span class="badge" style="background:#FDF3E3; color:#B37418; font-size:12px;">⚠️ ${esc(i.name)}: Sisa ${i.stock} ${esc(i.unit || 'pcs')} (Min: ${i.minStock})</span>`).join("")}
      </div>
    </div>` : ""}

    <!-- KONTAINER GRAFIK LINE CHART -->
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap:16px; margin-top:16px;">
      <div class="fx-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h3 style="font-size:15px; margin:0; color:var(--ink);">📈 Tren Keuangan</h3>
          <small style="color:var(--inkSoft);">Pendapatan vs Pengeluaran</small>
        </div>
        <div style="position:relative; width:100%; height:220px;">
          <canvas id="chart-finance" style="width:100%; height:100%;"></canvas>
        </div>
      </div>

      <div class="fx-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <h3 style="font-size:15px; margin:0; color:var(--ink);">📉 Tren Layanan Terlaris</h3>
          <small style="color:var(--inkSoft);">Frekuensi Permintaan Layanan</small>
        </div>
        <div style="position:relative; width:100%; height:220px;">
          <canvas id="chart-services" style="width:100%; height:100%;"></canvas>
        </div>
      </div>
    </div>
  `;
}

function bindRingkasan() {}

/* FUNGSI RENDER GRAFIK DENGAN CANVAS HTML5 MURNI */
function initCharts(d) {
  setTimeout(() => {
    // -------------------------------------------------------------
    // 1. GRAFIK GARIS KEUANGAN (PENDAPATAN VS PENGELUARAN)
    // -------------------------------------------------------------
    const canvasFin = document.getElementById("chart-finance");
    if (canvasFin) {
      const ctx = canvasFin.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const rect = canvasFin.getBoundingClientRect();
      canvasFin.width = rect.width * dpr;
      canvasFin.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;
      const padding = { top: 30, bottom: 35, left: 20, right: 20 };

      // Kelompokkan data transaksi & pengeluaran berdasarkan tanggal
      const dateMap = {};
      (d.transactions || []).forEach(t => {
        if (!dateMap[t.date]) dateMap[t.date] = { rev: 0, exp: 0 };
        dateMap[t.date].rev += (t.amount || 0);
      });
      (d.expenses || []).forEach(e => {
        if (!dateMap[e.date]) dateMap[e.date] = { rev: 0, exp: 0 };
        dateMap[e.date].exp += (e.amount || 0);
      });

      let dates = Object.keys(dateMap).sort();
      if (dates.length < 2) {
        dates = [todayISO(), todayISO()];
        if (!dateMap[todayISO()]) dateMap[todayISO()] = { rev: 0, exp: 0 };
      }

      const revData = dates.map(date => dateMap[date].rev);
      const expData = dates.map(date => dateMap[date].exp);
      const maxVal = Math.max(...revData, ...expData, 100000);

      ctx.clearRect(0, 0, width, height);

      // Garis Acuan Grid (Dotted)
      ctx.strokeStyle = "#E2E8F0";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padding.left, height / 2);
      ctx.lineTo(width - padding.right, height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      const getX = (i) => padding.left + (i * (width - padding.left - padding.right) / (dates.length - 1 || 1));
      const getY = (val) => height - padding.bottom - (val / maxVal * (height - padding.top - padding.bottom));

      // Menggambar Line Chart Pendapatan (Hijau/Sage)
      ctx.beginPath();
      ctx.lineWidth = 3;
      ctx.strokeStyle = "#A3B18A";
      revData.forEach((val, i) => {
        const x = getX(i);
        const y = getY(val);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Titik Point Pendapatan
      revData.forEach((val, i) => {
        const x = getX(i);
        const y = getY(val);
        ctx.fillStyle = "#A3B18A";
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();

        // Label Nilai
        ctx.fillStyle = "#2B2D42";
        ctx.font = "bold 10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(fmtIDR(val), x, y - 10);

        // Label Tanggal
        ctx.fillStyle = "#8D99AE";
        ctx.font = "10px sans-serif";
        ctx.fillText(dates[i].slice(5), x, height - 10);
      });
    }

    // -------------------------------------------------------------
    // 2. GRAFIK GARIS LAYANAN TERLARIS (PERMINTAAN TREN)
    // -------------------------------------------------------------
    const canvasSvc = document.getElementById("chart-services");
    if (canvasSvc) {
      const ctx = canvasSvc.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const rect = canvasSvc.getBoundingClientRect();
      canvasSvc.width = rect.width * dpr;
      canvasSvc.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;
      const padding = { top: 30, bottom: 35, left: 30, right: 30 };

      const svcCounts = {};
      (d.transactions || []).forEach(t => {
        const svc = (d.services || []).find(s => s.id === t.serviceId);
        const name = svc ? svc.name : "Lainnya";
        svcCounts[name] = (svcCounts[name] || 0) + 1;
      });

      const labels = Object.keys(svcCounts);
      const dataValues = Object.values(svcCounts);

      if (labels.length === 0) {
        labels.push("Belum Ada Layanan");
        dataValues.push(0);
      }

      const maxSvcVal = Math.max(...dataValues, 5);

      ctx.clearRect(0, 0, width, height);

      // Garis Acuan Grid (Dotted)
      ctx.strokeStyle = "#E2E8F0";
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(padding.left, height / 2);
      ctx.lineTo(width - padding.right, height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      const getX = (i) => padding.left + (i * (width - padding.left - padding.right) / (labels.length - 1 || 1));
      const getY = (val) => height - padding.bottom - (val / maxSvcVal * (height - padding.top - padding.bottom));

      // Menggambar Line Chart Layanan (Merah Muda/Pink Accent)
      ctx.beginPath();
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = "#E85D88";
      dataValues.forEach((val, i) => {
        const x = getX(i);
        const y = getY(val);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Titik Point & Label Layanan
      dataValues.forEach((val, i) => {
        const x = getX(i);
        const y = getY(val);

        ctx.fillStyle = "#E85D88";
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Label Jumlah Transaksi
        ctx.fillStyle = "#4A1E2B";
        ctx.font = "bold 11px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(`${val}x`, x, y - 10);

        // Label Nama Layanan
        ctx.fillStyle = "#2B2D42";
        ctx.font = "10px sans-serif";
        ctx.fillText(labels[i], x, height - 10);
      });
    }
  }, 100);
}

/* ==========================================================================
   6. MODULE: JADWAL & BOOKING
   ========================================================================== */
if (!state.schFilter) state.schFilter = "Semua";

function viewJadwal(d) {
  if (!d.schedules) d.schedules = [];
  let list = [...d.schedules];
  if (state.schFilter !== "Semua") list = list.filter(s => s.status === state.schFilter);
  const sorted = list.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  return `
    ${header("Jadwal & Booking Spa", "Atur janji temu dan reservasi pelanggan")}
    
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
            <th style="width: 15%;">WAKTU</th>
            <th style="width: 20%;">PELANGGAN</th>
            <th style="width: 22%;">LAYANAN & TIPE</th>
            <th style="width: 13%;">TERAPIS</th>
            <th style="width: 15%;">METODE</th>
            <th style="width: 10%;">STATUS</th>
            <th style="width: 15%; text-align: right;">AKSI</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.length === 0 ? '<tr class="empty-row"><td colspan="7">Tidak ada reservasi.</td></tr>' : ''}
          ${sorted.map(s => {
            const cust = (d.customers || []).find(c => c.id === s.customerId);
            const svc = (d.services || []).find(srv => srv.id === s.serviceId);
            const stf = (d.staff || []).find(st => st.id === s.staffId);

            const typeBadge = s.type === 'Home Care' 
              ? `<span class="badge" style="background:#E2F0D9; color:#385723; font-size:10px;">🏠 Home Care (+${fmtIDR(s.transportFee || 0)})</span>` 
              : `<span class="badge" style="background:#FDECF1; color:var(--sageDark); font-size:10px;">🏢 Studio</span>`;

            return `<tr>
              <td>⏰ ${s.time}<br><small>${fmtDate(s.date)}</small></td>
              <td><strong>Bunda ${cust ? esc(cust.name) : "—"}</strong><br><small>👶 ${cust ? esc(cust.babyName || '-') : '-'}</small></td>
              <td>${svc ? esc(svc.name) : "—"}<br>${typeBadge}</td>
              <td>${stf ? esc(stf.name) : "—"}</td>
              <td><span class="badge">${s.payMethod}</span></td>
              <td><span class="badge ${s.status === 'Selesai' ? 'badge-ok' : ''}">${s.status}</span></td>
              <td style="text-align: right;">
                <div class="action-cell-group" style="display:flex; gap:4px; justify-content:flex-end;">
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
      <div class="modal-container" style="max-width:500px; background:white; padding:20px; border-radius:12px; margin:auto;">
        <div class="modal-header" style="display:flex; justify-content:space-between; margin-bottom:12px;">
          <h3 class="modal-title">✨ Tambah Reservasi Baru</h3>
          <button class="modal-close-btn" id="close-sch-modal" style="background:none; border:none; font-size:18px; cursor:pointer;">✕</button>
        </div>
        <div class="modal-body" style="display:flex; flex-direction:column; gap:10px;">
          <div style="display:flex; gap:10px;">
            <div style="flex:1;"><label class="field-label">Tanggal</label><input class="fx-input" type="date" id="sch-date" value="${todayISO()}"></div>
            <div style="flex:1;"><label class="field-label">Jam</label><input class="fx-input" type="time" id="sch-time" value="09:00"></div>
          </div>
          <div style="position:relative;">
            <label class="field-label">Pilih Pelanggan</label>
            <input class="fx-input" id="sch-cust-search" placeholder="Ketik nama ibu..." autocomplete="off">
            <input type="hidden" id="sch-customer-id">
            <div class="combobox-dropdown" id="sch-cust-dropdown" style="display:none; position:absolute; width:100%; z-index:100; background:white; border:1px solid #ccc; max-height:120px; overflow-y:auto;"></div>
          </div>
          <div style="display:flex; gap:10px;">
            <div style="flex:1;"><label class="field-label">Layanan</label>
              <select class="fx-input" id="sch-service">
                <option value="">-- Pilih --</option>
                ${(d.services || []).map(s => `<option value="${s.id}">${esc(s.name)} — ${fmtIDR(s.price)}</option>`).join("")}
              </select>
            </div>
            <div style="flex:1;"><label class="field-label">Terapis</label>
              <select class="fx-input" id="sch-staff">
                <option value="">-- Pilih --</option>
                ${(d.staff || []).map(s => `<option value="${s.id}">${esc(s.name)}</option>`).join("")}
              </select>
            </div>
          </div>
          <div style="display:flex; gap:10px;">
            <div style="flex:1;"><label class="field-label">Tipe Layanan</label>
              <select class="fx-input" id="sch-type">
                <option value="Studio">🏢 Studio (Di tempat)</option>
                <option value="Home Care">🏠 Home Care (Kunjungan)</option>
              </select>
            </div>
            <div style="flex:1;"><label class="field-label">Metode Bayar</label>
              <select class="fx-input" id="sch-pay-method">
                <option value="Cash">Bayar di Tempat (Cash)</option>
                <option value="DP">Uang Muka (DP)</option>
                <option value="Lunas">Lunas Sekarang</option>
              </select>
            </div>
          </div>

          <div id="sch-transport-wrap" style="display:none;">
            <label class="field-label">🚗 Biaya Transport / Jarak (Rp)</label>
            <input class="fx-input" type="number" id="sch-transport" placeholder="misal: 15000">
          </div>

          <div id="sch-dp-wrap" style="display:none;">
            <label class="field-label">Nominal DP (Rp)</label>
            <input class="fx-input" type="number" id="sch-dp" placeholder="misal: 50000">
          </div>

          <div><label class="field-label">Catatan</label><input class="fx-input" id="sch-note" placeholder="Permintaan khusus..."></div>
          <button class="fx-btn fx-btn-submit" id="sch-add" style="margin-top:10px; padding:12px;">${ICONS.plus} Simpan Reservasi</button>
        </div>
      </div>
    </div>
  `;
}

function bindJadwal() {
  const modal = document.getElementById("sch-modal");
  const openBtn = document.getElementById("open-sch-modal");
  const closeBtn = document.getElementById("close-sch-modal");

  openBtn?.addEventListener("click", () => { modal?.classList.add("active"); });
  closeBtn?.addEventListener("click", () => { modal?.classList.remove("active"); });

  document.querySelectorAll('[data-sch-filter]').forEach(btn => {
    btn.addEventListener("click", () => { state.schFilter = btn.dataset.schFilter; renderTab(); });
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

  const custSearch = document.getElementById("sch-cust-search");
  const custIdInput = document.getElementById("sch-customer-id");
  const custDropdown = document.getElementById("sch-cust-dropdown");

  if (custSearch && custDropdown) {
    custSearch.addEventListener("focus", () => {
      custDropdown.innerHTML = (state.data.customers || []).map(c => `<div class="cust-opt" data-id="${c.id}" data-name="Bunda ${esc(c.name)}" style="padding:6px; cursor:pointer;">Bunda ${esc(c.name)}</div>`).join("");
      custDropdown.style.display = "block";
    });

    custDropdown.addEventListener("click", (e) => {
      const item = e.target.closest(".cust-opt");
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
    const type = document.getElementById("sch-type").value;
    const payMethod = document.getElementById("sch-pay-method").value;
    const transportFee = type === "Home Care" ? (Number(document.getElementById("sch-transport").value) || 0) : 0;
    const dpAmount = payMethod === "DP" ? (Number(document.getElementById("sch-dp").value) || 0) : 0;

    if (!customerId || !serviceId) return showToast("Lengkapi Pelanggan & Layanan!", "error");

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
      type,
      transportFee,
      payMethod,
      dpAmount: payMethod === "Lunas" ? totalCost : dpAmount,
      status: "Akan Datang",
      note: document.getElementById("sch-note").value.trim()
    });

    if (!state.data.transactions) state.data.transactions = [];
    const amountToRecord = payMethod === "Lunas" ? totalCost : (payMethod === "DP" ? dpAmount : totalCost);
    const isDp = payMethod === "DP";
    const noteToRecord = payMethod === "Lunas" ? "Lunas Awalan" : (payMethod === "DP" ? "DP Reservasi" : "Bayar di Tempat");

    state.data.transactions.unshift({
      id: uid(),
      date: document.getElementById("sch-date").value || todayISO(),
      customerId,
      serviceId,
      staffId: document.getElementById("sch-staff").value,
      type,
      amount: amountToRecord,
      isDp: isDp,
      totalServiceCost: totalCost,
      note: noteToRecord
    });

    save();
    showToast("Reservasi disimpan & dicatat ke Transaksi!", "success");
    modal?.classList.remove("active");
    renderTab();
  });

  document.querySelectorAll('[data-action="complete-sch"]').forEach(btn => btn.addEventListener("click", () => {
    const sch = state.data.schedules.find(s => s.id === btn.dataset.id);
    if (!sch) return;
    sch.status = "Selesai";
    save();
    showToast("Jadwal ditandai Selesai!", "success");
    renderTab();
  }));

  document.querySelectorAll('[data-action="wa-sch"]').forEach(btn => btn.addEventListener("click", () => {
    const sch = state.data.schedules.find(s => s.id === btn.dataset.id);
    if (!sch) return;
    const cust = (state.data.customers || []).find(c => c.id === sch.customerId);
    if (!cust || !cust.phone) return showToast("Nomor HP belum terdaftar!", "error");

    let phoneStr = String(cust.phone).replace(/\D/g, "");
    if (phoneStr.startsWith("0")) phoneStr = "62" + phoneStr.slice(1);

    const pesan = `Halo Bunda ${cust.name}! \nKami konfirmasi jadwal spa tanggal ${fmtDate(sch.date)} jam ${sch.time} WIB ya. Terima kasih! `;
    window.open(`https://wa.me/${phoneStr}?text=${encodeURIComponent(pesan)}`, "_blank");
  }));

  document.querySelectorAll('[data-action="del-sch"]').forEach(btn => btn.addEventListener("click", () => {
    showConfirmModal("Hapus Jadwal?", "Data reservasi jadwal ini akan dihapus permanen.", () => {
      state.data.schedules = state.data.schedules.filter(s => s.id !== btn.dataset.id);
      save(); showToast("Jadwal dihapus", "info"); renderTab();
    });
  }));
}

/* ==========================================================================
   7. MODULE: TRANSAKSI
   ========================================================================== */
function viewTransaksi(d) {
  if (!d.transactions) d.transactions = [];

  const totalRevenue = d.transactions.reduce((s, t) => s + (t.amount || 0), 0);
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
  const pg = paginate(sorted, state.txPage || 1, 8);

  return `
    ${header("Riwayat Transaksi", "Seluruh transaksi tercatat disini")}
    
    <div class="kpi-grid" style="margin-bottom:16px;">
      ${kpiCard("Total Omset Transaksi", fmtIDR(totalRevenue), "wallet", "var(--sage)")}
      ${kpiCard("Jumlah Transaksi", `${d.transactions.length} Data`, "receipt", "var(--aqua)")}
    </div>

    <div class="fx-card" style="padding: 12px; margin-bottom: 16px;">
      <input class="fx-input" id="tx-search-input" value="${esc(state.txSearch || '')}" placeholder="🔍 Cari nama pelanggan / layanan..." style="width: 100%;">
    </div>

    <div class="fx-card">
      <table class="fx-table">
        <thead>
          <tr>
            <th style="width: 13%;">TANGGAL</th>
            <th style="width: 22%;">PELANGGAN</th>
            <th style="width: 22%;">LAYANAN & TIPE</th>
            <th style="width: 15%;">NOMINAL</th>
            <th style="width: 13%;">STATUS</th>
            <th style="width: 15%; text-align: right;">AKSI</th>
          </tr>
        </thead>
        <tbody>
          ${pg.items.length === 0 ? '<tr class="empty-row"><td colspan="6">Belum ada data transaksi.</td></tr>' : ''}
          ${pg.items.map(t => {
            const cust = (d.customers || []).find(c => c.id === t.customerId);
            const svc = (d.services || []).find(s => s.id === t.serviceId);
            const statusBadge = t.isDp 
              ? `<span class="badge" style="background:#FFF3CD; color:#856404; font-size:10px;">💸 DP</span>`
              : `<span class="badge" style="background:#E2F0D9; color:#385723; font-size:10px;">✅ Lunas</span>`;

            return `<tr>
                    <td>${fmtDate(t.date)}</td>
                    <td><strong>Bunda ${cust ? esc(cust.name) : "—"}</strong></td>
                    <td>${svc ? esc(svc.name) : "—"}<br><small style="color:var(--inkSoft);">[${esc(t.note || 'Transaksi')}]</small></td>
                    <td style="font-weight:600; color:var(--sageDark);">${fmtIDR(t.amount)}</td>
                    <td>${statusBadge}</td>
                    <td style="text-align: right;">
                      <div style="display:flex; gap:4px; justify-content:flex-end;">
                        <button class="fx-btn fx-btn-mini" data-action="print-tx" data-id="${t.id}" style="background:#4A1E2B; color:white;">🖨️ Struk</button>
                        <button class="fx-btn fx-btn-mini" data-action="thanks-wa" data-id="${t.id}" style="background:#25D366; color:white;">💬 WA</button>
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

  document.querySelectorAll('[data-action="print-tx"]').forEach(btn => btn.addEventListener("click", () => {
    printReceipt(btn.dataset.id);
  }));

  document.querySelectorAll('[data-action="thanks-wa"]').forEach(btn => btn.addEventListener("click", () => {
    const tx = (state.data.transactions || []).find(t => t.id === btn.dataset.id);
    if (!tx) return;
    const cust = (state.data.customers || []).find(c => c.id === tx.customerId);
    const svc = (state.data.services || []).find(s => s.id === tx.serviceId);

    if (!cust || !cust.phone) return showToast("Nomor HP pelanggan belum terdaftar!", "error");

    let phoneStr = String(cust.phone).replace(/\D/g, "");
    if (phoneStr.startsWith("0")) phoneStr = "62" + phoneStr.slice(1);

    const statusTxt = tx.isDp ? `pembayaran Uang Muka (DP) sebesar *${fmtIDR(tx.amount)}*` : `pembayaran *LUNAS* sebesar *${fmtIDR(tx.amount)}*`;
    const msg = `Terima kasih Bunda ${cust.name}! \n\nKami telah menerima ${statusTxt} untuk perawatan *${svc ? svc.name : 'Baby Spa'}*.\n\nSemoga si kecil sehat dan ceria selalu ya, Bunda! Ditunggu kedatangannya kembali di Ulfa Baby Spa. `;

    window.open(`https://wa.me/${phoneStr}?text=${encodeURIComponent(msg)}`, "_blank");
  }));

  document.querySelectorAll('[data-action="del-tx"]').forEach(btn => btn.addEventListener("click", () => {
    showConfirmModal("Hapus Transaksi?", "Data riwayat transaksi ini akan dihapus dari pencatatan.", () => {
      state.data.transactions = state.data.transactions.filter(t => t.id !== btn.dataset.id);
      save(); showToast("Transaksi dihapus", "info"); renderTab();
    });
  }));

  document.querySelectorAll('[data-page-action="tx"]').forEach(btn => btn.addEventListener("click", () => {
    state.txPage = Number(btn.dataset.page); renderTab();
  }));
}

function printReceipt(txId) {
  const tx = (state.data.transactions || []).find(t => t.id === txId);
  if (!tx) return showToast("Transaksi tidak ditemukan!", "error");

  const cust = (state.data.customers || []).find(c => c.id === tx.customerId);
  const svc = (state.data.services || []).find(s => s.id === tx.serviceId);
  const stf = (state.data.staff || []).find(s => s.id === tx.staffId);

  const printArea = document.getElementById("print-area");
  if (!printArea) return;

  const totalCost = tx.totalServiceCost || tx.amount;
  const remaining = Math.max(0, totalCost - tx.amount);

  const statusTitle = tx.isDp ? "=== STRUK UANG MUKA (DP) ===" : "=== STRUK LUNAS ===";

  printArea.innerHTML = `
    <div class="receipt-box" style="padding:15px; font-family:'Courier New', Courier, monospace; width:280px; margin:auto; border:1px solid #ccc; background:#fff;">
      <div style="text-align:center; border-bottom:1px dashed #000; padding-bottom:8px;">
        <h3 style="margin:0;">ULFA BABY SPA</h3>
        <p style="margin:2px 0; font-size:11px;">Layanan Spa Bayi & Ibu</p>
        <strong style="font-size:11px;">${statusTitle}</strong>
      </div>
      <div style="margin:10px 0; font-size:11px; line-height:1.4;">
        <div>Tanggal : ${fmtDate(tx.date)}</div>
        <div>Bunda   : ${esc(cust ? cust.name : '-')}</div>
        <div>Bayi    : ${esc(cust ? cust.babyName : '-')}</div>
        <div>Layanan : ${esc(svc ? svc.name : '-')} (${esc(tx.type || 'Studio')})</div>
        <div>Terapis : ${esc(stf ? stf.name : '-')}</div>
      </div>
      <div style="border-top:1px dashed #000; border-bottom:1px dashed #000; padding:6px 0; font-size:11px;">
        <div style="display:flex; justify-content:space-between;">
          <span>Total Layanan:</span>
          <span>${fmtIDR(totalCost)}</span>
        </div>
        <div style="display:flex; justify-content:space-between; font-weight:bold; margin-top:4px;">
          <span>Dibayar (${tx.isDp ? 'DP' : 'Lunas'}):</span>
          <span>${fmtIDR(tx.amount)}</span>
        </div>
        ${tx.isDp ? `
        <div style="display:flex; justify-content:space-between; color:red; margin-top:4px;">
          <span>Sisa Tagihan:</span>
          <span>${fmtIDR(remaining)}</span>
        </div>` : ''}
      </div>
      <div style="text-align:center; margin-top:10px; font-size:10px;">
        Terima Kasih atas Kunjungannya! ❤️<br>Semoga Si Kecil Sehat Selalu.
      </div>
    </div>
  `;

  window.print();
}

/* ==========================================================================
   8. MODULE: LAYANAN
   ========================================================================== */
function viewLayanan(d) {
  return `
    ${header("Layanan & Paket", "Kelola daftar harga dan jenis layanan spa")}
    <div class="fx-card">
      <div class="card-title">➕ Tambah Layanan Baru</div>
      <div class="form-grid">
        <div class="field"><label class="field-label">Nama Layanan</label><input class="fx-input" id="svc-name" placeholder="misal: Pijat Bayi"></div>
        <div class="field"><label class="field-label">Kategori</label><select class="fx-input" id="svc-category"><option>Bayi</option><option>Ibu</option><option>Paket</option></select></div>
        <div class="field"><label class="field-label">Harga (Rp)</label><input class="fx-input" type="number" id="svc-price" placeholder="100000"></div>
        <button class="fx-btn" id="svc-add">${ICONS.plus} Tambah Layanan</button>
      </div>
      <table class="fx-table" style="margin-top:16px;">
        <thead><tr><th>NAMA LAYANAN</th><th>KATEGORI</th><th>HARGA</th><th style="text-align:right;">AKSI</th></tr></thead>
        <tbody>
          ${(!d.services || d.services.length === 0) ? '<tr class="empty-row"><td colspan="4">Belum ada layanan terdaftar.</td></tr>' : ''}
          ${(d.services || []).map(s => `<tr>
            <td><strong>${esc(s.name)}</strong></td>
            <td><span class="badge" style="background:#FAF2F5; color:var(--sageDark);">${esc(s.category)}</span></td>
            <td style="font-weight:600; color:var(--sageDark);">${fmtIDR(s.price)}</td>
            <td style="text-align:right;"><button class="fx-btn-ghost" data-action="del-svc" data-id="${s.id}">${ICONS.trash}</button></td>
          </tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function bindLayanan() {
  document.getElementById("svc-add")?.addEventListener("click", () => {
    const name = document.getElementById("svc-name").value.trim();
    const price = Number(document.getElementById("svc-price").value) || 0;
    if (!name || !price) return showToast("Lengkapi nama & harga!", "error");
    if (!state.data.services) state.data.services = [];
    state.data.services.push({ id: uid(), name, category: document.getElementById("svc-category").value, price });
    save(); showToast("Layanan ditambahkan", "success"); renderTab();
  });

  document.querySelectorAll('[data-action="del-svc"]').forEach(btn => btn.addEventListener("click", () => {
    showConfirmModal("Hapus Layanan?", "Layanan ini akan dihapus dari sistem.", () => {
      state.data.services = state.data.services.filter(s => s.id !== btn.dataset.id); save(); renderTab();
    });
  }));
}

/* ==========================================================================
   9. MODULE: STOK
   ========================================================================== */
function viewStok(d) {
  return `
    ${header("Stok Bahan & Produk", "Kelola persediaan barang dan batas stok minimal")}
    <div class="fx-card">
      <div class="form-grid">
        <div class="field"><label class="field-label">Nama Barang</label><input class="fx-input" id="inv-name" placeholder="misal: Minyak Pijat"></div>
        <div class="field"><label class="field-label">Jumlah Stok</label><input class="fx-input" type="number" id="inv-stock" placeholder="10"></div>
        <div class="field"><label class="field-label">Stok Minimal</label><input class="fx-input" type="number" id="inv-min-stock" placeholder="2"></div>
        <button class="fx-btn" id="inv-add">${ICONS.plus} Tambah Barang</button>
      </div>
      <table class="fx-table" style="margin-top:16px;">
        <thead><tr><th>BARANG</th><th style="text-align:center;">STOK KONTROL</th><th>STOK MINIMAL</th><th>STATUS</th><th style="text-align:right;">AKSI</th></tr></thead>
        <tbody>
          ${(!d.inventory || d.inventory.length === 0) ? '<tr class="empty-row"><td colspan="5">Belum ada barang di persediaan.</td></tr>' : ''}
          ${(d.inventory || []).map(i => {
            const isLow = Number(i.stock || 0) <= Number(i.minStock || 0);
            return `<tr>
              <td><strong>${esc(i.name)}</strong></td>
              <td style="text-align:center;">
                <div style="display:inline-flex; align-items:center; gap:8px;">
                  <button class="fx-btn fx-btn-mini" data-action="minus-stock" data-id="${i.id}" style="background:var(--blush); color:var(--ink); font-weight:bold;">−</button>
                  <span style="font-weight:700; font-size:14px; min-width:30px; text-align:center;">${i.stock} ${esc(i.unit || 'pcs')}</span>
                  <button class="fx-btn fx-btn-mini" data-action="plus-stock" data-id="${i.id}" style="background:var(--sage); color:white; font-weight:bold;">+</button>
                </div>
              </td>
              <td>${i.minStock || 0} ${esc(i.unit || 'pcs')}</td>
              <td>${isLow ? '<span class="badge" style="background:#FDF3E3; color:#B37418;">⚠️ Menipis</span>' : '<span class="badge badge-ok">✓ Aman</span>'}</td>
              <td style="text-align:right;"><button class="fx-btn-ghost" data-action="del-inv" data-id="${i.id}">${ICONS.trash}</button></td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function bindStok() {
  document.getElementById("inv-add")?.addEventListener("click", () => {
    const name = document.getElementById("inv-name").value.trim();
    const stock = Number(document.getElementById("inv-stock").value) || 0;
    const minStock = Number(document.getElementById("inv-min-stock").value) || 0;
    if (!name) return showToast("Isi nama barang!", "error");
    if (!state.data.inventory) state.data.inventory = [];
    state.data.inventory.push({ id: uid(), name, stock, minStock, unit: "pcs" });
    save(); showToast("Barang ditambahkan", "success"); renderTab();
  });

  document.querySelectorAll('[data-action="plus-stock"]').forEach(btn => btn.addEventListener("click", () => {
    const item = state.data.inventory.find(i => i.id === btn.dataset.id);
    if (item) { item.stock++; save(); renderTab(); }
  }));

  document.querySelectorAll('[data-action="minus-stock"]').forEach(btn => btn.addEventListener("click", () => {
    const item = state.data.inventory.find(i => i.id === btn.dataset.id);
    if (item && item.stock > 0) { item.stock--; save(); renderTab(); }
  }));

  document.querySelectorAll('[data-action="del-inv"]').forEach(btn => btn.addEventListener("click", () => {
    showConfirmModal("Hapus Barang Stok?", "Data stok barang ini akan dihapus permanen.", () => {
      state.data.inventory = state.data.inventory.filter(i => i.id !== btn.dataset.id); save(); renderTab();
    });
  }));
}

/* ==========================================================================
   10. MODULE: PELANGGAN
   ========================================================================== */
function viewPelanggan(d) {
  return `
    ${header("Data Pelanggan", "Kelola Data Ibu, Bayi, Riwayat, dan Pengingat WA")}
    <div class="fx-card">
      <button class="fx-btn" id="open-cust-modal" style="margin-bottom:12px;">${ICONS.plus} Tambah Pelanggan Baru</button>
      <table class="fx-table">
        <thead><tr><th>NAMA IBU</th><th>NAMA BAYI & USIA</th><th>TERAKHIR ORDER</th><th>NO HP</th><th style="text-align:right;">AKSI</th></tr></thead>
        <tbody>
          ${(!d.customers || d.customers.length === 0) ? '<tr class="empty-row"><td colspan="5">Belum ada pelanggan.</td></tr>' : ''}
          ${(d.customers || []).map(c => {
            const custTxs = (d.transactions || []).filter(t => t.customerId === c.id);
            const lastTx = custTxs.sort((a,b) => b.date.localeCompare(a.date))[0];
            const lastOrderDate = lastTx ? lastTx.date : null;

            return `<tr>
              <td><strong>Bunda ${esc(c.name)}</strong></td>
              <td>👶 <strong>${esc(c.babyName || '-')}</strong><br><small style="color:var(--inkSoft);">Usia: ${calcAge(c.dob)}</small></td>
              <td>
                <strong style="color:var(--sageDark); font-size:12.5px;">${lastOrderDate ? fmtDate(lastOrderDate) : 'Belum Pernah'}</strong><br>
                <small style="color:var(--inkSoft);">${daysAgoText(lastOrderDate)}</small>
              </td>
              <td>${esc(c.phone || '-')}</td>
              <td style="text-align:right;">
                <div style="display:flex; gap:4px; justify-content:flex-end;">
                  <button class="fx-btn fx-btn-mini" data-action="remind-wa" data-id="${c.id}" style="background:#25D366; color:white;">🔔 WA Pengingat</button>
                  <button class="fx-btn fx-btn-mini" data-action="view-cust-detail" data-id="${c.id}" style="background:var(--aqua); color:white;">👁️ Detail</button>
                  <button class="fx-btn-ghost" data-action="del-cust" data-id="${c.id}">${ICONS.trash}</button>
                </div>
              </td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>

    <!-- MODAL POPUP DETAIL PELANGGAN -->
    <div class="modal-overlay" id="cust-detail-modal">
      <div class="modal-container" style="max-width:480px; background:white; padding:20px; border-radius:12px; margin:auto;" id="cust-detail-content"></div>
    </div>

    <!-- MODAL TAMBAH PELANGGAN -->
    <div class="modal-overlay" id="cust-modal">
      <div class="modal-container" style="max-width:400px; background:white; padding:20px; border-radius:12px; margin:auto;">
        <h3>➕ Tambah Pelanggan</h3>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <input class="fx-input" id="cust-name" placeholder="Nama Ibu">
          <input class="fx-input" id="cust-baby" placeholder="Nama Bayi">
          <label class="field-label" style="margin-top:4px;">Tanggal Lahir Bayi</label>
          <input class="fx-input" type="date" id="cust-dob">
          <input class="fx-input" id="cust-phone" placeholder="No. HP / WA">
          <input class="fx-input" id="cust-address" placeholder="Alamat">
          <button class="fx-btn" id="cust-add" style="margin-top:10px;">${ICONS.plus} Simpan</button>
          <button class="fx-btn-ghost" id="close-cust-modal">Batal</button>
        </div>
      </div>
    </div>
  `;
}

function bindPelanggan() {
  const modal = document.getElementById("cust-modal");
  const detailModal = document.getElementById("cust-detail-modal");

  document.getElementById("open-cust-modal")?.addEventListener("click", () => modal?.classList.add("active"));
  document.getElementById("close-cust-modal")?.addEventListener("click", () => modal?.classList.remove("active"));
  
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
    save(); showToast("Pelanggan Tersimpan!", "success"); modal?.classList.remove("active"); renderTab();
  });

  document.querySelectorAll('[data-action="remind-wa"]').forEach(btn => btn.addEventListener("click", () => {
    const cust = (state.data.customers || []).find(c => c.id === btn.dataset.id);
    if (!cust || !cust.phone) return showToast("Nomor HP pelanggan tidak ditemukan!", "error");

    let phoneStr = String(cust.phone).replace(/\D/g, "");
    if (phoneStr.startsWith("0")) phoneStr = "62" + phoneStr.slice(1);

    const custTxs = (state.data.transactions || []).filter(t => t.customerId === cust.id);
    const lastTx = custTxs.sort((a,b) => b.date.localeCompare(a.date))[0];
    const lastDateStr = lastTx ? fmtDate(lastTx.date) : "beberapa waktu lalu";

    const msg = `Halo Bunda ${cust.name}! 👋😊\n\nBagaimana kabar si kecil *${cust.babyName || 'bayi'}*?\nSemoga selalu sehat dan ceria ya, Bunda! ✨\n\nSekadar mengingatkan, perawatan spa terakhir si kecil di Ulfa Baby Spa adalah pada *${lastDateStr}*.\n\nAgar tumbuh kembang dan tidur si kecil tetap optimal, yuk ajak pijat & spa lagi! Hubungi kami untuk booking jadwal minggu ini ya, Bunda. 💖👶`;

    window.open(`https://wa.me/${phoneStr}?text=${encodeURIComponent(msg)}`, "_blank");
  }));

  document.querySelectorAll('[data-action="view-cust-detail"]').forEach(btn => btn.addEventListener("click", () => {
    const cust = (state.data.customers || []).find(c => c.id === btn.dataset.id);
    if (!cust) return;

    const txList = (state.data.transactions || []).filter(t => t.customerId === cust.id);
    const lastTx = txList.sort((a,b) => b.date.localeCompare(a.date))[0];
    const totalSpent = txList.reduce((s, t) => s + (t.amount || 0), 0);

    const detailContent = document.getElementById("cust-detail-content");
    if (detailContent) {
      detailContent.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--line); padding-bottom:10px; margin-bottom:12px;">
          <h3 style="margin:0; color:var(--ink);">👤 Detail Profil Pelanggan</h3>
          <button class="fx-btn-ghost" id="close-cust-detail-btn" style="font-size:16px;">✕</button>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px; font-size:13.5px;">
          <div><strong>Nama Ibu:</strong> Bunda ${esc(cust.name)}</div>
          <div><strong>Nama Bayi:</strong> 👶 ${esc(cust.babyName || '-')}</div>
          <div><strong>Usia Bayi:</strong> ${calcAge(cust.dob)} (${cust.dob ? fmtDate(cust.dob) : 'Tgl Lahir Belum Set'})</div>
          <div><strong>Terakhir Order:</strong> ${lastTx ? fmtDate(lastTx.date) + ' (' + daysAgoText(lastTx.date) + ')' : 'Belum Pernah'}</div>
          <div><strong>No. HP/WA:</strong> ${esc(cust.phone || '-')}</div>
          <div><strong>Alamat:</strong> ${esc(cust.address || '-')}</div>
          <hr style="border:none; border-top:1px dashed var(--line); margin:8px 0;">
          <div style="background:#FAF2F5; padding:10px; border-radius:8px;">
            <div><strong>Total Kunjungan/Repeat Order:</strong> <span class="badge badge-ok">${txList.length} kali</span></div>
            <div style="margin-top:4px;"><strong>Total Pengeluaran:</strong> <strong style="color:var(--sageDark);">${fmtIDR(totalSpent)}</strong></div>
          </div>
        </div>
      `;
      detailModal?.classList.add("active");
      document.getElementById("close-cust-detail-btn")?.addEventListener("click", () => detailModal?.classList.remove("active"));
    }
  }));

  document.querySelectorAll('[data-action="del-cust"]').forEach(btn => btn.addEventListener("click", () => {
    showConfirmModal("Hapus Pelanggan?", "Data profil pelanggan ini akan dihapus.", () => {
      state.data.customers = state.data.customers.filter(c => c.id !== btn.dataset.id); save(); renderTab();
    });
  }));
}

/* ==========================================================================
   11. MODULE: KEUANGAN & STAF
   ========================================================================== */
function viewKeuangan(d) {
  return `
    ${header("Keuangan", "Catat Pengeluaran Spa")}
    <div class="fx-card">
      <div class="form-grid">
        <div class="field"><label class="field-label">Kategori</label><input class="fx-input" id="exp-cat" placeholder="mis. Listrik/Gaji"></div>
        <div class="field"><label class="field-label">Jumlah (Rp)</label><input class="fx-input" type="number" id="exp-amount"></div>
        <button class="fx-btn" id="exp-add">${ICONS.plus} Catat Pengeluaran</button>
      </div>
      <table class="fx-table" style="margin-top:16px;">
        <thead><tr><th>TANGGAL</th><th>KATEGORI</th><th>NOMINAL</th><th style="text-align:right;">AKSI</th></tr></thead>
        <tbody>
          ${(!d.expenses || d.expenses.length === 0) ? '<tr class="empty-row"><td colspan="4">Belum ada pengeluaran dicatat.</td></tr>' : ''}
          ${(d.expenses || []).map(e => `<tr><td>${fmtDate(e.date)}</td><td>${esc(e.category)}</td><td style="color:var(--danger);">${fmtIDR(e.amount)}</td><td style="text-align:right;"><button class="fx-btn-ghost" data-action="del-exp" data-id="${e.id}">${ICONS.trash}</button></td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function bindKeuangan() {
  document.getElementById("exp-add")?.addEventListener("click", () => {
    const cat = document.getElementById("exp-cat").value.trim();
    const amount = Number(document.getElementById("exp-amount").value) || 0;
    if (!cat || !amount) return showToast("Isi kategori & jumlah!", "error");
    if (!state.data.expenses) state.data.expenses = [];
    state.data.expenses.unshift({ id: uid(), date: todayISO(), category: cat, amount });
    save(); showToast("Pengeluaran dicatat", "success"); renderTab();
  });

  document.querySelectorAll('[data-action="del-exp"]').forEach(btn => btn.addEventListener("click", () => {
    showConfirmModal("Hapus Pengeluaran?", "Catatan pengeluaran ini akan dihapus.", () => {
      state.data.expenses = state.data.expenses.filter(e => e.id !== btn.dataset.id); save(); renderTab();
    });
  }));
}

function viewStaf(d) {
  return `
    ${header("Staf & Terapis", "Daftar Tim Ulfa Baby Spa")}
    <div class="fx-card">
      <div class="form-grid">
        <div class="field"><label class="field-label">Nama Staf</label><input class="fx-input" id="stf-name" placeholder="Nama staf..."></div>
        <div class="field">
          <label class="field-label">Peran Staf</label>
          <select class="fx-input" id="stf-role">
            <option value="Owner">Owner</option>
            <option value="Terapis Bayi">Terapis Bayi</option>
            <option value="Terapis Ibu">Terapis Ibu</option>
            <option value="Kasir/Admin">Kasir / Admin</option>
          </select>
        </div>
        <button class="fx-btn" id="stf-add">${ICONS.plus} Tambah Staf</button>
      </div>
      <table class="fx-table" style="margin-top:16px;">
        <thead><tr><th>NAMA</th><th>PERAN</th><th style="text-align:right;">AKSI</th></tr></thead>
        <tbody>
          ${(!d.staff || d.staff.length === 0) ? '<tr class="empty-row"><td colspan="3">Belum ada staf terdaftar.</td></tr>' : ''}
          ${(d.staff || []).map(s => `<tr><td><strong>${esc(s.name)}</strong></td><td><span class="badge badge-ok">${esc(s.role)}</span></td><td style="text-align:right;"><button class="fx-btn-ghost" data-action="del-stf" data-id="${s.id}">${ICONS.trash}</button></td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function bindStaf() {
  document.getElementById("stf-add")?.addEventListener("click", () => {
    const name = document.getElementById("stf-name").value.trim();
    const role = document.getElementById("stf-role").value;
    if (!name) return showToast("Isi Nama Staf!", "error");
    if (!state.data.staff) state.data.staff = [];
    state.data.staff.push({ id: uid(), name, role });
    save(); showToast("Staf ditambahkan", "success"); renderTab();
  });

  document.querySelectorAll('[data-action="del-stf"]').forEach(btn => btn.addEventListener("click", () => {
    showConfirmModal("Hapus Data Staf?", "Data staf/terapis ini akan dihapus.", () => {
      state.data.staff = state.data.staff.filter(s => s.id !== btn.dataset.id); save(); renderTab();
    });
  }));
}

/* ==========================================================================
   12. INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initApp();
  setInterval(() => {
    const clockEl = document.getElementById("realtime-clock");
    if (clockEl) clockEl.textContent = new Date().toLocaleTimeString("id-ID");
  }, 1000);
});
