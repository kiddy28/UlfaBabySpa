import React, { useState, useEffect, useMemo } from "react";
import {
  LayoutDashboard, Receipt, Sparkles, Boxes, Users, Wallet, UserCog,
  Plus, Trash2, AlertTriangle, TrendingUp, TrendingDown, Baby, X, Loader2
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const STORAGE_KEY = "spa-monitor-data-v1";

const PALETTE = {
  bg: "#FBF6F0",
  panel: "#FFFFFF",
  sidebar: "#4A5D53",
  sidebarSoft: "#5E7267",
  sage: "#6B8F7F",
  sageDark: "#4A5D53",
  blush: "#E7A99A",
  amber: "#D9A548",
  ink: "#3A322E",
  inkSoft: "#8A7E77",
  line: "#EAE0D6",
  danger: "#C4604D",
};

const CATEGORY_COLORS = ["#6B8F7F", "#E7A99A", "#D9A548", "#8DA6C9", "#A87CA0"];

const uid = () => Math.random().toString(36).slice(2, 10);
const todayISO = () => new Date().toISOString().slice(0, 10);
const fmtIDR = (n) =>
  "Rp " + Math.round(n || 0).toLocaleString("id-ID");
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

function seedData() {
  const svcIds = { baby: uid(), swim: uid(), momMassage: uid(), facial: uid(), newborn: uid() };
  const custIds = { a: uid(), b: uid(), c: uid() };
  const staffIds = { s1: uid(), s2: uid() };
  const now = new Date();
  const dayAgo = (n) => new Date(now.getTime() - n * 86400000).toISOString().slice(0, 10);

  return {
    services: [
      { id: svcIds.baby, name: "Baby Spa & Massage", category: "Bayi", price: 120000, duration: 45 },
      { id: svcIds.swim, name: "Baby Swim", category: "Bayi", price: 100000, duration: 30 },
      { id: svcIds.momMassage, name: "Postnatal Massage", category: "Ibu", price: 150000, duration: 60 },
      { id: svcIds.facial, name: "Mom Facial", category: "Ibu", price: 130000, duration: 50 },
      { id: svcIds.newborn, name: "Paket Newborn Care", category: "Paket", price: 400000, duration: 90 },
    ],
    staff: [
      { id: staffIds.s1, name: "Rani", role: "Terapis Bayi", phone: "0812-1111-2222" },
      { id: staffIds.s2, name: "Dewi", role: "Terapis Ibu", phone: "0813-3333-4444" },
    ],
    customers: [
      { id: custIds.a, name: "Sarah Putri", babyName: "Kiano", babyAge: "4 bulan", phone: "0811-2233-4455" },
      { id: custIds.b, name: "Amanda Yusuf", babyName: "Aqila", babyAge: "2 bulan", phone: "0822-5566-7788" },
      { id: custIds.c, name: "Nadia Rahmi", babyName: "-", babyAge: "-", phone: "0856-9988-7766" },
    ],
    transactions: [
      { id: uid(), date: dayAgo(0), customerId: custIds.a, serviceId: svcIds.baby, staffId: staffIds.s1, amount: 120000 },
      { id: uid(), date: dayAgo(0), customerId: custIds.b, serviceId: svcIds.momMassage, staffId: staffIds.s2, amount: 150000 },
      { id: uid(), date: dayAgo(1), customerId: custIds.c, serviceId: svcIds.facial, staffId: staffIds.s2, amount: 130000 },
      { id: uid(), date: dayAgo(2), customerId: custIds.a, serviceId: svcIds.swim, staffId: staffIds.s1, amount: 100000 },
      { id: uid(), date: dayAgo(3), customerId: custIds.b, serviceId: svcIds.newborn, staffId: staffIds.s1, amount: 400000 },
      { id: uid(), date: dayAgo(4), customerId: custIds.c, serviceId: svcIds.baby, staffId: staffIds.s1, amount: 120000 },
      { id: uid(), date: dayAgo(5), customerId: custIds.a, serviceId: svcIds.momMassage, staffId: staffIds.s2, amount: 150000 },
    ],
    packages: [
      { id: uid(), customerId: custIds.a, name: "Paket 5x Baby Spa", totalSessions: 5, usedSessions: 2, purchaseDate: dayAgo(10) },
      { id: uid(), customerId: custIds.b, name: "Paket 3x Postnatal Massage", totalSessions: 3, usedSessions: 3, purchaseDate: dayAgo(20) },
    ],
    inventory: [
      { id: uid(), name: "Minyak Pijat Bayi", unit: "botol", stock: 8, minStock: 5 },
      { id: uid(), name: "Lotion Bayi", unit: "botol", stock: 3, minStock: 5 },
      { id: uid(), name: "Handuk Bayi", unit: "pcs", stock: 20, minStock: 10 },
      { id: uid(), name: "Sabun Mandi Bayi", unit: "botol", stock: 6, minStock: 4 },
      { id: uid(), name: "Masker Wajah Ibu", unit: "pcs", stock: 12, minStock: 10 },
    ],
    expenses: [
      { id: uid(), date: dayAgo(1), category: "Gaji Terapis", amount: 1500000, note: "Gaji mingguan" },
      { id: uid(), date: dayAgo(3), category: "Bahan Habis Pakai", amount: 350000, note: "Beli minyak & lotion" },
      { id: uid(), date: dayAgo(5), category: "Sewa Tempat", amount: 2000000, note: "Sewa bulanan" },
    ],
  };
}

const NAV = [
  { key: "ringkasan", label: "Ringkasan", icon: LayoutDashboard },
  { key: "transaksi", label: "Transaksi", icon: Receipt },
  { key: "layanan", label: "Layanan & Paket", icon: Sparkles },
  { key: "stok", label: "Stok", icon: Boxes },
  { key: "pelanggan", label: "Pelanggan", icon: Users },
  { key: "keuangan", label: "Keuangan", icon: Wallet },
  { key: "staf", label: "Staf", icon: UserCog },
];

export default function SpaMonitor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("ringkasan");

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY, false);
        if (res && res.value) {
          setData(JSON.parse(res.value));
        } else {
          const seeded = seedData();
          setData(seeded);
          await window.storage.set(STORAGE_KEY, JSON.stringify(seeded), false);
        }
      } catch (e) {
        const seeded = seedData();
        setData(seeded);
        try { await window.storage.set(STORAGE_KEY, JSON.stringify(seeded), false); } catch (_) {}
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (updater) => {
    setData((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      setSaving(true);
      window.storage.set(STORAGE_KEY, JSON.stringify(next), false)
        .catch(() => {})
        .finally(() => setSaving(false));
      return next;
    });
  };

  if (loading || !data) {
    return (
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        height: "100%", minHeight: 480, background: PALETTE.bg, fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: PALETTE.inkSoft, gap: 10
      }}>
        <Loader2 size={18} className="spin" />
        <span>Memuat data usaha…</span>
        <style>{`.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: PALETTE.bg, minHeight: "100%", color: PALETTE.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .fx-display { font-family: 'Fraunces', serif; }
        .fx-input {
          font-family: 'Plus Jakarta Sans', sans-serif;
          border: 1px solid ${PALETTE.line};
          border-radius: 10px;
          padding: 9px 12px;
          font-size: 13.5px;
          background: #fff;
          color: ${PALETTE.ink};
          outline: none;
          width: 100%;
        }
        .fx-input:focus { border-color: ${PALETTE.sage}; box-shadow: 0 0 0 3px rgba(107,143,127,0.15); }
        .fx-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: ${PALETTE.sage}; color: #fff; border: none;
          border-radius: 10px; padding: 9px 16px; font-size: 13.5px; font-weight: 600;
          cursor: pointer; transition: background 0.15s;
        }
        .fx-btn:hover { background: ${PALETTE.sageDark}; }
        .fx-btn:focus-visible { outline: 2px solid ${PALETTE.amber}; outline-offset: 2px; }
        .fx-btn-ghost {
          background: transparent; color: ${PALETTE.danger}; border: none;
          cursor: pointer; padding: 6px; border-radius: 8px; display: inline-flex;
        }
        .fx-btn-ghost:hover { background: rgba(196,96,77,0.1); }
        .fx-navbtn:focus-visible, .fx-input:focus-visible { outline: 2px solid ${PALETTE.amber}; outline-offset: 2px; }
        .fx-table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
        .fx-table th { text-align: left; color: ${PALETTE.inkSoft}; font-weight: 600; font-size: 11.5px;
          text-transform: uppercase; letter-spacing: 0.04em; padding: 8px 10px; border-bottom: 1px solid ${PALETTE.line}; }
        .fx-table td { padding: 10px 10px; border-bottom: 1px solid ${PALETTE.line}; vertical-align: middle; }
        .fx-table tr:last-child td { border-bottom: none; }
        .fx-card { background: ${PALETTE.panel}; border-radius: 16px; padding: 20px; box-shadow: 0 1px 3px rgba(58,50,46,0.06); }
        @media (max-width: 760px) {
          .fx-shell { flex-direction: column; }
          .fx-sidebar { width: 100% !important; flex-direction: row !important; overflow-x: auto; padding: 10px !important; }
          .fx-sidebar .fx-brand { display: none; }
          .fx-navlist { flex-direction: row !important; gap: 6px !important; }
        }
      `}</style>

      <div className="fx-shell" style={{ display: "flex", minHeight: "100%" }}>
        <aside className="fx-sidebar" style={{
          width: 220, background: PALETTE.sidebar, color: "#EFEAE3",
          padding: "22px 14px", display: "flex", flexDirection: "column", gap: 22, flexShrink: 0
        }}>
          <div className="fx-brand" style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 6px" }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10, background: PALETTE.blush,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
            }}>
              <Baby size={18} color="#4A2F2A" />
            </div>
            <div>
              <div className="fx-display" style={{ fontSize: 15.5, fontWeight: 600, lineHeight: 1.1, color: "#fff" }}>Monitor Usaha</div>
              <div style={{ fontSize: 10.5, color: "#C8D3CB", letterSpacing: "0.03em" }}>BABY &amp; MOM SPA</div>
            </div>
          </div>

          <nav className="fx-navlist" style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {NAV.map((item) => {
              const Icon = item.icon;
              const active = tab === item.key;
              return (
                <button
                  key={item.key}
                  className="fx-navbtn"
                  onClick={() => setTab(item.key)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "9px 11px",
                    borderRadius: 10, border: "none", cursor: "pointer", textAlign: "left",
                    background: active ? PALETTE.sidebarSoft : "transparent",
                    color: active ? "#fff" : "#C8D3CB",
                    fontSize: 13.5, fontWeight: active ? 600 : 500, whiteSpace: "nowrap"
                  }}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div style={{ marginTop: "auto", fontSize: 11, color: "#9FAFA6", padding: "0 6px", display: "flex", alignItems: "center", gap: 6 }}>
            {saving ? (<><Loader2 size={12} className="spin" /> Menyimpan…</>) : "Tersimpan otomatis"}
          </div>
        </aside>

        <main style={{ flex: 1, padding: "26px 30px", minWidth: 0 }}>
          {tab === "ringkasan" && <Ringkasan data={data} />}
          {tab === "transaksi" && <Transaksi data={data} persist={persist} />}
          {tab === "layanan" && <Layanan data={data} persist={persist} />}
          {tab === "stok" && <Stok data={data} persist={persist} />}
          {tab === "pelanggan" && <Pelanggan data={data} persist={persist} />}
          {tab === "keuangan" && <Keuangan data={data} persist={persist} />}
          {tab === "staf" && <Staf data={data} persist={persist} />}
        </main>
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
      <div>
        <h1 className="fx-display" style={{ fontSize: 24, fontWeight: 600, margin: 0, color: PALETTE.ink }}>{title}</h1>
        {subtitle && <div style={{ fontSize: 13, color: PALETTE.inkSoft, marginTop: 3 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

function KpiCard({ label, value, icon: Icon, tint, delta }) {
  return (
    <div className="fx-card" style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 12, color: PALETTE.inkSoft, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.03em" }}>{label}</span>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: tint, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={15} color="#fff" />
        </div>
      </div>
      <div className="fx-display" style={{ fontSize: 22, fontWeight: 600, color: PALETTE.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</div>
      {delta !== undefined && (
        <div style={{ fontSize: 12, color: delta >= 0 ? PALETTE.sage : PALETTE.danger, display: "flex", alignItems: "center", gap: 4 }}>
          {delta >= 0 ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
          {Math.abs(delta).toFixed(0)}% vs periode lalu
        </div>
      )}
    </div>
  );
}

function Ringkasan({ data }) {
  const totalRevenue = data.transactions.reduce((s, t) => s + t.amount, 0);
  const totalExpense = data.expenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalRevenue - totalExpense;
  const lowStock = data.inventory.filter((i) => i.stock <= i.minStock);

  const revenueByDay = useMemo(() => {
    const map = {};
    data.transactions.forEach((t) => {
      map[t.date] = (map[t.date] || 0) + t.amount;
    });
    return Object.entries(map)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-7)
      .map(([date, total]) => ({ date: fmtDate(date).slice(0, 6), total }));
  }, [data.transactions]);

  const topServices = useMemo(() => {
    const map = {};
    data.transactions.forEach((t) => {
      const svc = data.services.find((s) => s.id === t.serviceId);
      const name = svc ? svc.name : "Lainnya";
      map[name] = (map[name] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [data.transactions, data.services]);

  return (
    <div>
      <SectionHeader title="Ringkasan Usaha" subtitle="Gambaran umum performa baby & mom spa Anda" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 20 }}>
        <KpiCard label="Total Pendapatan" value={fmtIDR(totalRevenue)} icon={Wallet} tint={PALETTE.sage} />
        <KpiCard label="Total Pengeluaran" value={fmtIDR(totalExpense)} icon={TrendingDown} tint={PALETTE.blush} />
        <KpiCard label="Laba Bersih" value={fmtIDR(netProfit)} icon={TrendingUp} tint={netProfit >= 0 ? PALETTE.sage : PALETTE.danger} />
        <KpiCard label="Total Booking" value={data.transactions.length} icon={Receipt} tint={PALETTE.amber} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="fx-card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Tren Pendapatan (7 transaksi terakhir)</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke={PALETTE.line} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: PALETTE.inkSoft }} axisLine={{ stroke: PALETTE.line }} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: PALETTE.inkSoft }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v / 1000}rb`} />
              <Tooltip formatter={(v) => fmtIDR(v)} contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${PALETTE.line}` }} />
              <Line type="monotone" dataKey="total" stroke={PALETTE.sage} strokeWidth={2.5} dot={{ r: 4, fill: PALETTE.sage }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="fx-card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Layanan Terlaris</div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={topServices} dataKey="count" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3}>
                {topServices.map((_, i) => <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${PALETTE.line}` }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 6 }}>
            {topServices.map((s, i) => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: PALETTE.inkSoft }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }} />
                {s.name} <span style={{ marginLeft: "auto", fontWeight: 600, color: PALETTE.ink }}>{s.count}x</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="fx-card" style={{ borderLeft: `4px solid ${PALETTE.amber}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 14, marginBottom: 10, color: "#8A5A1E" }}>
            <AlertTriangle size={16} /> Stok Menipis ({lowStock.length})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {lowStock.map((i) => (
              <span key={i.id} style={{ fontSize: 12.5, background: "#FBF0DC", color: "#8A5A1E", padding: "5px 10px", borderRadius: 999, fontWeight: 500 }}>
                {i.name} — sisa {i.stock} {i.unit}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyRow({ colSpan, text }) {
  return (
    <tr><td colSpan={colSpan} style={{ textAlign: "center", padding: "24px 10px", color: PALETTE.inkSoft, fontSize: 13 }}>{text}</td></tr>
  );
}

function Transaksi({ data, persist }) {
  const [form, setForm] = useState({ date: todayISO(), customerId: "", serviceId: "", staffId: "" });

  const addTransaction = () => {
    if (!form.customerId || !form.serviceId) return;
    const svc = data.services.find((s) => s.id === form.serviceId);
    persist((prev) => ({
      ...prev,
      transactions: [{ id: uid(), ...form, amount: svc ? svc.price : 0 }, ...prev.transactions],
    }));
    setForm({ date: todayISO(), customerId: "", serviceId: "", staffId: "" });
  };

  const removeTx = (id) => persist((prev) => ({ ...prev, transactions: prev.transactions.filter((t) => t.id !== id) }));

  const sorted = [...data.transactions].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <SectionHeader title="Transaksi & Booking" subtitle="Catat setiap kunjungan dan layanan yang terjual" />
      <div className="fx-card" style={{ marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 10, alignItems: "end" }}>
          <Field label="Tanggal">
            <input className="fx-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </Field>
          <Field label="Pelanggan">
            <select className="fx-input" value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}>
              <option value="">Pilih pelanggan</option>
              {data.customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Layanan">
            <select className="fx-input" value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })}>
              <option value="">Pilih layanan</option>
              {data.services.map((s) => <option key={s.id} value={s.id}>{s.name} — {fmtIDR(s.price)}</option>)}
            </select>
          </Field>
          <Field label="Terapis">
            <select className="fx-input" value={form.staffId} onChange={(e) => setForm({ ...form, staffId: e.target.value })}>
              <option value="">Pilih terapis</option>
              {data.staff.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <button className="fx-btn" onClick={addTransaction}><Plus size={15} /> Tambah</button>
        </div>
      </div>

      <div className="fx-card">
        <table className="fx-table">
          <thead>
            <tr><th>Tanggal</th><th>Pelanggan</th><th>Layanan</th><th>Terapis</th><th>Jumlah</th><th></th></tr>
          </thead>
          <tbody>
            {sorted.length === 0 && <EmptyRow colSpan={6} text="Belum ada transaksi. Tambahkan booking pertama Anda di atas." />}
            {sorted.map((t) => {
              const cust = data.customers.find((c) => c.id === t.customerId);
              const svc = data.services.find((s) => s.id === t.serviceId);
              const stf = data.staff.find((s) => s.id === t.staffId);
              return (
                <tr key={t.id}>
                  <td>{fmtDate(t.date)}</td>
                  <td>{cust ? cust.name : "—"}</td>
                  <td>{svc ? svc.name : "—"}</td>
                  <td>{stf ? stf.name : "—"}</td>
                  <td style={{ fontWeight: 600 }}>{fmtIDR(t.amount)}</td>
                  <td><button className="fx-btn-ghost" onClick={() => removeTx(t.id)}><Trash2 size={14} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 5 }}>
      <span style={{ fontSize: 11.5, fontWeight: 600, color: PALETTE.inkSoft, textTransform: "uppercase", letterSpacing: "0.03em" }}>{label}</span>
      {children}
    </label>
  );
}

function Layanan({ data, persist }) {
  const [svcForm, setSvcForm] = useState({ name: "", category: "Bayi", price: "", duration: "" });
  const [pkgForm, setPkgForm] = useState({ customerId: "", name: "", totalSessions: "" });

  const addService = () => {
    if (!svcForm.name || !svcForm.price) return;
    persist((prev) => ({ ...prev, services: [...prev.services, { id: uid(), ...svcForm, price: Number(svcForm.price), duration: Number(svcForm.duration) || 0 }] }));
    setSvcForm({ name: "", category: "Bayi", price: "", duration: "" });
  };
  const removeService = (id) => persist((prev) => ({ ...prev, services: prev.services.filter((s) => s.id !== id) }));

  const addPackage = () => {
    if (!pkgForm.customerId || !pkgForm.name || !pkgForm.totalSessions) return;
    persist((prev) => ({ ...prev, packages: [...prev.packages, { id: uid(), ...pkgForm, totalSessions: Number(pkgForm.totalSessions), usedSessions: 0, purchaseDate: todayISO() }] }));
    setPkgForm({ customerId: "", name: "", totalSessions: "" });
  };
  const bumpPackage = (id, delta) => persist((prev) => ({
    ...prev,
    packages: prev.packages.map((p) => p.id === id ? { ...p, usedSessions: Math.max(0, Math.min(p.totalSessions, p.usedSessions + delta)) } : p)
  }));
  const removePackage = (id) => persist((prev) => ({ ...prev, packages: prev.packages.filter((p) => p.id !== id) }));

  return (
    <div>
      <SectionHeader title="Layanan & Paket" subtitle="Kelola daftar layanan spa dan paket membership pelanggan" />

      <div className="fx-card" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Daftar Layanan</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px,1fr))", gap: 10, alignItems: "end", marginBottom: 14 }}>
          <Field label="Nama layanan"><input className="fx-input" value={svcForm.name} onChange={(e) => setSvcForm({ ...svcForm, name: e.target.value })} placeholder="mis. Baby Massage" /></Field>
          <Field label="Kategori">
            <select className="fx-input" value={svcForm.category} onChange={(e) => setSvcForm({ ...svcForm, category: e.target.value })}>
              <option>Bayi</option><option>Ibu</option><option>Paket</option>
            </select>
          </Field>
          <Field label="Harga (Rp)"><input className="fx-input" type="number" value={svcForm.price} onChange={(e) => setSvcForm({ ...svcForm, price: e.target.value })} placeholder="120000" /></Field>
          <Field label="Durasi (menit)"><input className="fx-input" type="number" value={svcForm.duration} onChange={(e) => setSvcForm({ ...svcForm, duration: e.target.value })} placeholder="45" /></Field>
          <button className="fx-btn" onClick={addService}><Plus size={15} /> Tambah</button>
        </div>
        <table className="fx-table">
          <thead><tr><th>Layanan</th><th>Kategori</th><th>Harga</th><th>Durasi</th><th></th></tr></thead>
          <tbody>
            {data.services.length === 0 && <EmptyRow colSpan={5} text="Belum ada layanan." />}
            {data.services.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td><td>{s.category}</td><td>{fmtIDR(s.price)}</td><td>{s.duration} mnt</td>
                <td><button className="fx-btn-ghost" onClick={() => removeService(s.id)}><Trash2 size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="fx-card">
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Paket Membership Pelanggan</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: 10, alignItems: "end", marginBottom: 14 }}>
          <Field label="Pelanggan">
            <select className="fx-input" value={pkgForm.customerId} onChange={(e) => setPkgForm({ ...pkgForm, customerId: e.target.value })}>
              <option value="">Pilih pelanggan</option>
              {data.customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Nama paket"><input className="fx-input" value={pkgForm.name} onChange={(e) => setPkgForm({ ...pkgForm, name: e.target.value })} placeholder="Paket 5x Baby Spa" /></Field>
          <Field label="Total sesi"><input className="fx-input" type="number" value={pkgForm.totalSessions} onChange={(e) => setPkgForm({ ...pkgForm, totalSessions: e.target.value })} placeholder="5" /></Field>
          <button className="fx-btn" onClick={addPackage}><Plus size={15} /> Tambah</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))", gap: 12 }}>
          {data.packages.length === 0 && <div style={{ color: PALETTE.inkSoft, fontSize: 13 }}>Belum ada paket aktif.</div>}
          {data.packages.map((p) => {
            const cust = data.customers.find((c) => c.id === p.customerId);
            const pct = p.totalSessions ? Math.round((p.usedSessions / p.totalSessions) * 100) : 0;
            return (
              <div key={p.id} style={{ border: `1px solid ${PALETTE.line}`, borderRadius: 12, padding: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{p.name}</div>
                  <button className="fx-btn-ghost" onClick={() => removePackage(p.id)}><Trash2 size={14} /></button>
                </div>
                <div style={{ fontSize: 12, color: PALETTE.inkSoft, marginBottom: 8 }}>{cust ? cust.name : "—"}</div>
                <div style={{ height: 8, borderRadius: 999, background: PALETTE.line, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: pct >= 100 ? PALETTE.amber : PALETTE.sage, borderRadius: 999 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 12.5, color: PALETTE.inkSoft }}>{p.usedSessions} / {p.totalSessions} sesi terpakai</span>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="fx-btn" style={{ padding: "4px 9px", background: PALETTE.line, color: PALETTE.ink }} onClick={() => bumpPackage(p.id, -1)}>−</button>
                    <button className="fx-btn" style={{ padding: "4px 9px" }} onClick={() => bumpPackage(p.id, 1)}>+</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Stok({ data, persist }) {
  const [form, setForm] = useState({ name: "", unit: "pcs", stock: "", minStock: "" });

  const addItem = () => {
    if (!form.name) return;
    persist((prev) => ({ ...prev, inventory: [...prev.inventory, { id: uid(), ...form, stock: Number(form.stock) || 0, minStock: Number(form.minStock) || 0 }] }));
    setForm({ name: "", unit: "pcs", stock: "", minStock: "" });
  };
  const adjust = (id, delta) => persist((prev) => ({ ...prev, inventory: prev.inventory.map((i) => i.id === id ? { ...i, stock: Math.max(0, i.stock + delta) } : i) }));
  const removeItem = (id) => persist((prev) => ({ ...prev, inventory: prev.inventory.filter((i) => i.id !== id) }));

  return (
    <div>
      <SectionHeader title="Stok Bahan & Perlengkapan" subtitle="Pantau bahan habis pakai agar tidak kehabisan saat sesi berlangsung" />
      <div className="fx-card" style={{ marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px,1fr))", gap: 10, alignItems: "end" }}>
          <Field label="Nama barang"><input className="fx-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="mis. Minyak Pijat" /></Field>
          <Field label="Satuan"><input className="fx-input" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} placeholder="botol" /></Field>
          <Field label="Stok saat ini"><input className="fx-input" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="10" /></Field>
          <Field label="Batas minimum"><input className="fx-input" type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} placeholder="5" /></Field>
          <button className="fx-btn" onClick={addItem}><Plus size={15} /> Tambah</button>
        </div>
      </div>
      <div className="fx-card">
        <table className="fx-table">
          <thead><tr><th>Barang</th><th>Stok</th><th>Batas Minimum</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {data.inventory.length === 0 && <EmptyRow colSpan={5} text="Belum ada barang di stok." />}
            {data.inventory.map((i) => {
              const low = i.stock <= i.minStock;
              return (
                <tr key={i.id}>
                  <td>{i.name}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button className="fx-btn" style={{ padding: "2px 8px", background: PALETTE.line, color: PALETTE.ink }} onClick={() => adjust(i.id, -1)}>−</button>
                      <span style={{ minWidth: 46, textAlign: "center", fontWeight: 600 }}>{i.stock} {i.unit}</span>
                      <button className="fx-btn" style={{ padding: "2px 8px" }} onClick={() => adjust(i.id, 1)}>+</button>
                    </div>
                  </td>
                  <td>{i.minStock} {i.unit}</td>
                  <td>
                    {low
                      ? <span style={{ fontSize: 12, background: "#FBF0DC", color: "#8A5A1E", padding: "3px 9px", borderRadius: 999, fontWeight: 600 }}>Menipis</span>
                      : <span style={{ fontSize: 12, background: "#E9F1EC", color: PALETTE.sageDark, padding: "3px 9px", borderRadius: 999, fontWeight: 600 }}>Aman</span>}
                  </td>
                  <td><button className="fx-btn-ghost" onClick={() => removeItem(i.id)}><Trash2 size={14} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Pelanggan({ data, persist }) {
  const [form, setForm] = useState({ name: "", babyName: "", babyAge: "", phone: "" });

  const addCustomer = () => {
    if (!form.name) return;
    persist((prev) => ({ ...prev, customers: [...prev.customers, { id: uid(), ...form }] }));
    setForm({ name: "", babyName: "", babyAge: "", phone: "" });
  };
  const removeCustomer = (id) => persist((prev) => ({ ...prev, customers: prev.customers.filter((c) => c.id !== id) }));

  return (
    <div>
      <SectionHeader title="Data Pelanggan" subtitle="Simpan data ibu & bayi untuk layanan yang lebih personal" />
      <div className="fx-card" style={{ marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px,1fr))", gap: 10, alignItems: "end" }}>
          <Field label="Nama ibu"><input className="fx-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Sarah Putri" /></Field>
          <Field label="Nama bayi"><input className="fx-input" value={form.babyName} onChange={(e) => setForm({ ...form, babyName: e.target.value })} placeholder="Kiano" /></Field>
          <Field label="Usia bayi"><input className="fx-input" value={form.babyAge} onChange={(e) => setForm({ ...form, babyAge: e.target.value })} placeholder="4 bulan" /></Field>
          <Field label="No. HP"><input className="fx-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0812xxxxxxx" /></Field>
          <button className="fx-btn" onClick={addCustomer}><Plus size={15} /> Tambah</button>
        </div>
      </div>
      <div className="fx-card">
        <table className="fx-table">
          <thead><tr><th>Nama Ibu</th><th>Bayi</th><th>Usia</th><th>No. HP</th><th>Kunjungan</th><th></th></tr></thead>
          <tbody>
            {data.customers.length === 0 && <EmptyRow colSpan={6} text="Belum ada data pelanggan." />}
            {data.customers.map((c) => {
              const visits = data.transactions.filter((t) => t.customerId === c.id).length;
              return (
                <tr key={c.id}>
                  <td>{c.name}</td><td>{c.babyName || "—"}</td><td>{c.babyAge || "—"}</td><td>{c.phone || "—"}</td>
                  <td>{visits}x</td>
                  <td><button className="fx-btn-ghost" onClick={() => removeCustomer(c.id)}><Trash2 size={14} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Keuangan({ data, persist }) {
  const [form, setForm] = useState({ date: todayISO(), category: "Bahan Habis Pakai", amount: "", note: "" });

  const addExpense = () => {
    if (!form.amount) return;
    persist((prev) => ({ ...prev, expenses: [{ id: uid(), ...form, amount: Number(form.amount) }, ...prev.expenses] }));
    setForm({ date: todayISO(), category: "Bahan Habis Pakai", amount: "", note: "" });
  };
  const removeExpense = (id) => persist((prev) => ({ ...prev, expenses: prev.expenses.filter((e) => e.id !== id) }));

  const totalRevenue = data.transactions.reduce((s, t) => s + t.amount, 0);
  const totalExpense = data.expenses.reduce((s, e) => s + e.amount, 0);
  const sorted = [...data.expenses].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div>
      <SectionHeader title="Keuangan" subtitle="Pantau pemasukan dan pengeluaran usaha" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 14, marginBottom: 18 }}>
        <KpiCard label="Pemasukan" value={fmtIDR(totalRevenue)} icon={TrendingUp} tint={PALETTE.sage} />
        <KpiCard label="Pengeluaran" value={fmtIDR(totalExpense)} icon={TrendingDown} tint={PALETTE.blush} />
        <KpiCard label="Laba Bersih" value={fmtIDR(totalRevenue - totalExpense)} icon={Wallet} tint={PALETTE.amber} />
      </div>

      <div className="fx-card" style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Catat Pengeluaran</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 10, alignItems: "end" }}>
          <Field label="Tanggal"><input className="fx-input" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
          <Field label="Kategori">
            <select className="fx-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option>Bahan Habis Pakai</option><option>Gaji Terapis</option><option>Sewa Tempat</option><option>Listrik & Air</option><option>Promosi</option><option>Lainnya</option>
            </select>
          </Field>
          <Field label="Jumlah (Rp)"><input className="fx-input" type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="350000" /></Field>
          <Field label="Catatan"><input className="fx-input" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="opsional" /></Field>
          <button className="fx-btn" onClick={addExpense}><Plus size={15} /> Tambah</button>
        </div>
      </div>

      <div className="fx-card">
        <table className="fx-table">
          <thead><tr><th>Tanggal</th><th>Kategori</th><th>Catatan</th><th>Jumlah</th><th></th></tr></thead>
          <tbody>
            {sorted.length === 0 && <EmptyRow colSpan={5} text="Belum ada pengeluaran tercatat." />}
            {sorted.map((e) => (
              <tr key={e.id}>
                <td>{fmtDate(e.date)}</td><td>{e.category}</td><td>{e.note || "—"}</td>
                <td style={{ fontWeight: 600, color: PALETTE.danger }}>−{fmtIDR(e.amount)}</td>
                <td><button className="fx-btn-ghost" onClick={() => removeExpense(e.id)}><Trash2 size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Staf({ data, persist }) {
  const [form, setForm] = useState({ name: "", role: "Terapis Bayi", phone: "" });

  const addStaff = () => {
    if (!form.name) return;
    persist((prev) => ({ ...prev, staff: [...prev.staff, { id: uid(), ...form }] }));
    setForm({ name: "", role: "Terapis Bayi", phone: "" });
  };
  const removeStaff = (id) => persist((prev) => ({ ...prev, staff: prev.staff.filter((s) => s.id !== id) }));

  return (
    <div>
      <SectionHeader title="Staf & Terapis" subtitle="Kelola tim dan pantau jumlah layanan yang ditangani" />
      <div className="fx-card" style={{ marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 10, alignItems: "end" }}>
          <Field label="Nama"><input className="fx-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Rani" /></Field>
          <Field label="Peran">
            <select className="fx-input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option>Terapis Bayi</option><option>Terapis Ibu</option><option>Resepsionis</option><option>Manajer</option>
            </select>
          </Field>
          <Field label="No. HP"><input className="fx-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="0812xxxxxxx" /></Field>
          <button className="fx-btn" onClick={addStaff}><Plus size={15} /> Tambah</button>
        </div>
      </div>
      <div className="fx-card">
        <table className="fx-table">
          <thead><tr><th>Nama</th><th>Peran</th><th>No. HP</th><th>Layanan Ditangani</th><th></th></tr></thead>
          <tbody>
            {data.staff.length === 0 && <EmptyRow colSpan={5} text="Belum ada data staf." />}
            {data.staff.map((s) => {
              const count = data.transactions.filter((t) => t.staffId === s.id).length;
              return (
                <tr key={s.id}>
                  <td>{s.name}</td><td>{s.role}</td><td>{s.phone || "—"}</td><td>{count}x</td>
                  <td><button className="fx-btn-ghost" onClick={() => removeStaff(s.id)}><Trash2 size={14} /></button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
