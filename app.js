/* ==========================================================================
   1. CONSTANTS, HELPERS & CONFIG
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

const USERS = [
  { username: "admin", password: "Londoireng2026", name: "Ulfa (Owner)", role: "owner" },
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
  const svc = { baby: uid(), swim: uid(), momMassage: uid(), facial: uid(), newborn: uid() };
  const cust = { a: uid(), b: uid(), c: uid() };
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
      { id: uid(), date: todayISO(), customerId: cust.a, serviceId: svc.baby, staffId: stf.s1, type: "Studio", transportFee: 0, amount: 30000, note: "DP Reservasi" },
      { id: uid(), date: todayISO(), customerId: cust.b, serviceId: svc.momMassage, staffId: stf.s2, type: "Home Care", transportFee: 15000, amount: 165000, note: "Pelunasan" },
    ],
    inventory: [
      { id: uid(), name: "Minyak Pijat Bayi", unit: "botol", stock: 8, minStock: 2 },
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
   5. MODULE RINGKASAN
   ========================================================================== */
function viewRingkasan(d) {
  const totalRevenue = (d.transactions || []).reduce((s, t) => s + t.amount, 0);
  const totalExpense = (d.expenses || []).reduce((s, e) => s + e.amount, 0);
  const netProfit = totalRevenue - totalExpense;

  return `
    ${header("Ringkasan Usaha", "Gambaran umum performa Ulfa Baby Spa")}
    <div class="kpi-grid">
      ${kpiCard("Total Pendapatan", fmtIDR(totalRevenue), "wallet", "var(--sage)")}
      ${kpiCard("Total Pengeluaran", fmtIDR(totalExpense), "down", "var(--blush)")}
      ${kpiCard("Laba Bersih", fmtIDR(netProfit), "up", netProfit >= 0 ? "var(--sage)" : "var(--danger)")}
      ${kpiCard("Total Booking", (d.schedules || []).length, "receipt", "var(--aqua)")}
    </div>
    <div class="charts-row">
      <div class="fx-card"><div class="card-title">Tren Pendapatan</div><div id="revenueChart"></div></div>
      <div class="fx-card"><div class="card-title">Layanan Terlaris</div><div id="servicesChart"></div></div>
    </div>
  `;
}

function bindRingkasan() {}
function initCharts(d) {
  const revWrap = document.getElementById("revenueChart");
  const svcWrap = document.getElementById("servicesChart");
  if (!revWrap || !svcWrap) return;
  revWrap.innerHTML = `<div style="color:var(--inkSoft);font-size:13px;padding:30px 0;text-align:center;">Grafik aktif.</div>`;
  svcWrap.innerHTML = `<div style="color:var(--inkSoft);font-size:13px;padding:30px 0;text-align:center;">Layanan aktif.</div>`;
}

/* ==========================================================================
   6. MODULE: JADWAL & BOOKING (SELESAI, WA, & PENAMBAHAN KE TRANSAKSI)
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
            <th style="width: 20%;">LAYANAN</th>
            <th style="width: 15%;">TERAPIS</th>
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

            return `<tr>
              <td>⏰ ${s.time}<br><small>${fmtDate(s.date)}</small></td>
              <td><strong>Bunda ${cust ? esc(cust.name) : "—"}</strong><br><small>👶 ${cust ? esc(cust.babyName || '-') : '-'}</small></td>
              <td>${svc ? esc(svc.name) : "—"}</td>
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
            <div style="flex:1;"><label class="field-label">Tipe</label>
              <select class="fx-input" id="sch-type"><option value="Studio">Studio</option><option value="Home Care">Home Care</option></select>
            </div>
            <div style="flex:1;"><label class="field-label">Metode Bayar</label>
              <select class="fx-input" id="sch-pay-method">
                <option value="Cash">Bayar di Tempat (Cash)</option>
                <option value="DP">Uang Muka (DP)</option>
                <option value="Lunas">Lunas Sekarang</option>
              </select>
            </div>
          </div>
          <div id="sch-dp-wrap" style="display:none;"><label class="field-label">Nominal DP (Rp)</label><input class="fx-input" type="number" id="sch-dp"></div>
          <div><label class="field-label">Catatan</label><input class="fx-input" id="sch-note"></div>
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

  // SIMPAN RESERVASI BARU & KONEKSIKAN DENGAN TRANSAKSI
  document.getElementById("sch-add")?.addEventListener("click", () => {
    const customerId = document.getElementById("sch-customer-id").value;
    const serviceId = document.getElementById("sch-service").value;
    const payMethod = document.getElementById("sch-pay-method").value;
    const dpAmount = payMethod === "DP" ? (Number(document.getElementById("sch-dp").value) || 0) : 0;

    if (!customerId || !serviceId) return showToast("Lengkapi Pelanggan & Layanan!", "error");

    const svc = (state.data.services || []).find(s => s.id === serviceId);
    const totalCost = svc ? svc.price : 0;

    if (!state.data.schedules) state.data.schedules = [];
    state.data.schedules.push({
      id: uid(),
      date: document.getElementById("sch-date").value || todayISO(),
      time: document.getElementById("sch-time").value || "09:00",
      customerId,
      serviceId,
      staffId: document.getElementById("sch-staff").value,
      type: document.getElementById("sch-type").value,
      payMethod,
      dpAmount: payMethod === "Lunas" ? totalCost : dpAmount,
      status: "Akan Datang",
      note: document.getElementById("sch-note").value.trim()
    });

    // MASUKKAN OTOMATIS KE TRANSAKSI
    if (!state.data.transactions) state.data.transactions = [];
    const amountToRecord = payMethod === "Lunas" ? totalCost : (payMethod === "DP" ? dpAmount : totalCost);
    const noteToRecord = payMethod === "Lunas" ? "Lunas Awalan" : (payMethod === "DP" ? "DP Reservasi" : "Bayar di Tempat");

    state.data.transactions.unshift({
      id: uid(),
      date: document.getElementById("sch-date").value || todayISO(),
      customerId,
      serviceId,
      staffId: document.getElementById("sch-staff").value,
      type: document.getElementById("sch-type").value,
      amount: amountToRecord,
      note: noteToRecord
    });

    save();
    showToast("Reservasi berhasil & otomatis masuk ke Menu Transaksi!", "success");
    modal?.classList.remove("active");
    renderTab();
  });

  // TOMBOL SELESAI
  document.querySelectorAll('[data-action="complete-sch"]').forEach(btn => btn.addEventListener("click", () => {
    const sch = state.data.schedules.find(s => s.id === btn.dataset.id);
    if (!sch) return;
    sch.status = "Selesai";
    save();
    showToast("Jadwal ditandai Selesai!", "success");
    renderTab();
  }));

  // TOMBOL WA
  document.querySelectorAll('[data-action="wa-sch"]').forEach(btn => btn.addEventListener("click", () => {
    const sch = state.data.schedules.find(s => s.id === btn.dataset.id);
    if (!sch) return;
    const cust = (state.data.customers || []).find(c => c.id === sch.customerId);
    if (!cust || !cust.phone) return showToast("Nomor HP belum terdaftar!", "error");

    let phoneStr = String(cust.phone).replace(/\D/g, "");
    if (phoneStr.startsWith("0")) phoneStr = "62" + phoneStr.slice(1);

    const pesan = `Halo Bunda ${cust.name}! 👋😊\nKami konfirmasi jadwal spa tanggal ${fmtDate(sch.date)} jam ${sch.time} WIB ya. Terima kasih! 💖`;
    window.open(`https://wa.me/${phoneStr}?text=${encodeURIComponent(pesan)}`, "_blank");
  }));

  document.querySelectorAll('[data-action="del-sch"]').forEach(btn => btn.addEventListener("click", () => {
    if (!confirm("Hapus jadwal ini?")) return;
    state.data.schedules = state.data.schedules.filter(s => s.id !== btn.dataset.id);
    save(); renderTab();
  }));
}

/* ==========================================================================
   7. MODULE: TRANSAKSI (TAMPILAN PASTI MUNCUL DATA)
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
            <th style="width: 15%;">TANGGAL</th>
            <th style="width: 25%;">PELANGGAN</th>
            <th style="width: 25%;">LAYANAN & TIPE</th>
            <th style="width: 20%;">NOMINAL</th>
            <th style="width: 15%; text-align: right;">AKSI</th>
          </tr>
        </thead>
        <tbody>
          ${pg.items.length === 0 ? '<tr class="empty-row"><td colspan="5">Belum ada data transaksi. Silakan input dari menu Jadwal.</td></tr>' : ''}
          ${pg.items.map(t => {
            const cust = (d.customers || []).find(c => c.id === t.customerId);
            const svc = (d.services || []).find(s => s.id === t.serviceId);

            return `<tr>
                    <td>${fmtDate(t.date)}</td>
                    <td><strong>Bunda ${cust ? esc(cust.name) : "—"}</strong></td>
                    <td>${svc ? esc(svc.name) : "—"}<br><small>[${esc(t.note || 'Lunas')}]</small></td>
                    <td style="font-weight:600; color:var(--sageDark);">${fmtIDR(t.amount)}</td>
                    <td style="text-align: right;">
                      <button class="fx-btn-ghost" data-action="del-tx" data-id="${t.id}">${ICONS.trash}</button>
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
    if (!confirm("Hapus transaksi ini?")) return;
    state.data.transactions = state.data.transactions.filter(t => t.id !== btn.dataset.id);
    save(); renderTab();
  }));

  document.querySelectorAll('[data-page-action="tx"]').forEach(btn => btn.addEventListener("click", () => {
    state.txPage = Number(btn.dataset.page); renderTab();
  }));
}

/* ==========================================================================
   8. MODULE: LAYANAN, STOK, PELANGGAN, KEUANGAN, STAF
   ========================================================================== */
function viewLayanan(d) {
  return `${header("Layanan", "Daftar Layanan")}<div class="fx-card"><p style="padding:10px;">Kelola Layanan Spa</p></div>`;
}
function bindLayanan() {}

function viewStok(d) {
  return `${header("Stok", "Daftar Stok")}<div class="fx-card"><p style="padding:10px;">Kelola Stok Barang</p></div>`;
}
function bindStok() {}

function calcAge(birthDateStr) {
  if (!birthDateStr) return "—";
  const birth = new Date(birthDateStr);
  const now = new Date();
  let months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  return `${months} bulan`;
}

function viewPelanggan(d) {
  return `
    ${header("Data Pelanggan", "Kelola Data Ibu & Bayi")}
    <div class="fx-card" style="padding:16px;">
      <button class="fx-btn" id="open-cust-modal">${ICONS.plus} Tambah Pelanggan Baru</button>
      <table class="fx-table" style="margin-top:12px;">
        <thead><tr><th>NAMA IBU</th><th>NAMA BAYI</th><th>NO HP</th><th>AKSI</th></tr></thead>
        <tbody>
          ${(d.customers || []).map(c => `<tr><td>Bunda ${esc(c.name)}</td><td>👶 ${esc(c.babyName)}</td><td>${esc(c.phone)}</td><td><button class="fx-btn-ghost" data-action="del-cust" data-id="${c.id}">${ICONS.trash}</button></td></tr>`).join("")}
        </tbody>
      </table>
    </div>
    <div class="modal-overlay" id="cust-modal">
      <div class="modal-container" style="max-width:400px; background:white; padding:20px; border-radius:12px; margin:auto;">
        <h3>➕ Tambah Pelanggan</h3>
        <input class="fx-input" id="cust-name" placeholder="Nama Ibu" style="margin-bottom:8px;">
        <input class="fx-input" id="cust-baby" placeholder="Nama Bayi" style="margin-bottom:8px;">
        <input class="fx-input" id="cust-phone" placeholder="No HP" style="margin-bottom:8px;">
        <button class="fx-btn" id="cust-add" style="width:100%;">${ICONS.plus} Simpan</button>
      </div>
    </div>
  `;
}

function bindPelanggan() {
  const modal = document.getElementById("cust-modal");
  document.getElementById("open-cust-modal")?.addEventListener("click", () => modal?.classList.add("active"));
  document.getElementById("cust-add")?.addEventListener("click", () => {
    const name = document.getElementById("cust-name").value.trim();
    if (!name) return showToast("Isi Nama Ibu!", "error");
    if (!state.data.customers) state.data.customers = [];
    state.data.customers.unshift({ id: uid(), name, babyName: document.getElementById("cust-baby").value, phone: document.getElementById("cust-phone").value });
    save(); showToast("Pelanggan Tersimpan!", "success"); modal?.classList.remove("active"); renderTab();
  });
  document.querySelectorAll('[data-action="del-cust"]').forEach(btn => btn.addEventListener("click", () => {
    state.data.customers = state.data.customers.filter(c => c.id !== btn.dataset.id); save(); renderTab();
  }));
}

function viewKeuangan(d) {
  return `${header("Keuangan", "Laporan Ringkasan")}<div class="fx-card"><p style="padding:10px;">Laporan Pemasukan & Pengeluaran</p></div>`;
}
function bindKeuangan() {}

function viewStaf(d) {
  return `${header("Staf & Terapis", "Daftar Tim")}<div class="fx-card"><p style="padding:10px;">Manajemen Tim</p></div>`;
}
function bindStaf() {}

/* ==========================================================================
   9. INITIALIZATION
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initApp();
  setInterval(() => {
    const clockEl = document.getElementById("realtime-clock");
    if (clockEl) clockEl.textContent = new Date().toLocaleTimeString("id-ID");
  }, 1000);
});
