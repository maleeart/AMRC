"use client";

import { useState, useEffect, useCallback } from "react";
import BackButton from "../components/BackButton";

const ADMIN_PASSWORD = "8888";
const SIZES = ["SSS","SS","S","M","L","XL","2XL","3XL","4XL","5XL","6XL","7XL","8XL","9XL"];

type Vote = { name: string; member_id: string; color: string; size: string | null };
type Rally = { name: string; member_id: string; phone: string };
type Friendship = { name: string; member_id: string; callsign: string; phone: string; option_id: number };

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [tab, setTab] = useState<"votes" | "rally" | "friendship">("votes");
  const [votes, setVotes] = useState<Vote[]>([]);
  const [rally, setRally] = useState<Rally[]>([]);
  const [friendship, setFriendship] = useState<Friendship[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Vote & Rally & Friendship>>({});
  const [editError, setEditError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("amrc_admin") === "1") setAuthed(true);
  }, []);

  const load = useCallback(async () => {
    const [vRes, rRes, fRes] = await Promise.all([
      fetch("/api/results"),
      fetch("/api/rally-list"),
      fetch("/api/friendship-list")
    ]);
    if (vRes.ok) setVotes(await vRes.json());
    if (rRes.ok) setRally(await rRes.json());
    if (fRes.ok) setFriendship(await fRes.json());
  }, []);

  useEffect(() => { if (authed) load(); }, [authed, load]);

  function login() {
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("amrc_admin", "1");
      setAuthed(true);
    } else {
      setPwError(true);
      setPw("");
    }
  }

  function logout() {
    sessionStorage.removeItem("amrc_admin");
    setAuthed(false);
  }

  async function deleteRow(type: "vote" | "rally" | "friendship", memberId: string) {
    if (!confirm("ลบรายการนี้?")) return;
    setBusy(true);
    const endpoint = type === "vote" ? "vote" : type === "rally" ? "rally" : "friendship";
    await fetch(`/api/${endpoint}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId }),
    });
    await load();
    setBusy(false);
  }

  async function saveEdit(type: "vote" | "rally" | "friendship") {
    setEditError("");
    setBusy(true);
    // editing state holds the ORIGINAL member_id as the key
    const originalMemberId = editing!;
    const endpoint = type === "vote" ? "vote" : type === "rally" ? "rally" : "friendship";
    try {
      // If member_id changed: delete old row first, then insert new
      if (editData.member_id !== originalMemberId) {
        await fetch(`/api/${endpoint}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memberId: originalMemberId }),
        });
      }
      const body = type === "vote"
        ? { name: editData.name, memberId: editData.member_id, color: editData.color, size: editData.size }
        : type === "rally"
        ? { name: editData.name, memberId: editData.member_id, phone: editData.phone }
        : { name: editData.name, memberId: editData.member_id, callsign: editData.callsign, phone: editData.phone, optionId: Number(editData.option_id) };
      const res = await fetch(`/api/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setEditError(data.error || "เกิดข้อผิดพลาด");
        setBusy(false);
        return;
      }
      setEditing(null);
      setEditError("");
      await load();
    } catch {
      setEditError("ไม่สามารถเชื่อมต่อได้");
    }
    setBusy(false);
  }

  if (!authed) {
    return (
      <main className="max-w-sm mx-auto px-4 py-20 text-center animate-[fadeIn_0.4s_ease]">
        <div className="text-4xl mb-4">🔐</div>
        <h1 className="text-xl font-bold text-gray-800 mb-6">ผู้ดูแลระบบ</h1>
        <input
          type="password"
          value={pw}
          onChange={(e) => { setPw(e.target.value); setPwError(false); }}
          onKeyDown={(e) => e.key === "Enter" && login()}
          placeholder="รหัสผ่าน"
          className={`w-full border-2 rounded-xl px-4 py-3 text-center text-2xl tracking-widest focus:outline-none ${pwError ? "border-red-400 bg-red-50" : "border-gray-300 focus:border-blue-400"}`}
          maxLength={4}
          autoFocus
        />
        {pwError && <p className="text-red-500 text-sm mt-2">รหัสผ่านไม่ถูกต้อง</p>}
        <button
          onClick={login}
          className="mt-4 w-full bg-blue-600 text-white font-semibold py-3 rounded-xl active:bg-blue-700 transition-colors"
        >
          เข้าสู่ระบบ
        </button>
        <BackButton href="/" />
      </main>
    );
  }

  const currentList = tab === "votes" ? votes : tab === "rally" ? rally : friendship;

  return (
    <main className="max-w-lg mx-auto px-4 py-8 animate-[fadeIn_0.4s_ease]">
      <div className="flex items-center justify-between mb-6">
        <BackButton href="/" />
        <button onClick={logout} className="text-xs text-gray-400 underline">ออกจากระบบ</button>
      </div>

      <h1 className="text-xl font-bold text-gray-800 mb-4">🛠 จัดการข้อมูล</h1>

      {/* Tabs */}
      <div className="flex rounded-xl bg-gray-100 p-1 mb-6 gap-1">
        {(["votes", "rally", "friendship"] as const).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setEditing(null); setEditError(""); }}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${tab === t ? "bg-white shadow text-gray-800" : "text-gray-500"}`}
          >
            {t === "votes" ? `👕 เสื้อ (${votes.length})` : t === "rally" ? `🚗 Rally (${rally.length})` : `🌊 Friendship (${friendship.length})`}
          </button>
        ))}
      </div>

      {/* Summary for Friendship */}
      {tab === "friendship" && (
        <div className="grid grid-cols-3 gap-2 bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 mb-4 text-center">
          <div className="bg-white border border-indigo-50 rounded-lg p-1.5 shadow-sm">
            <p className="text-[10px] text-sky-600 font-bold">🍽️ ทานอาหาร</p>
            <p className="text-sm font-extrabold text-sky-850 mt-0.5">
              {friendship.filter((r) => Number(r.option_id) === 1).length} คน
            </p>
          </div>
          <div className="bg-white border border-indigo-50 rounded-lg p-1.5 shadow-sm">
            <p className="text-[10px] text-indigo-600 font-bold">🧗‍♂️ กิจกรรม</p>
            <p className="text-sm font-extrabold text-indigo-850 mt-0.5">
              {friendship.filter((r) => Number(r.option_id) === 2).length} คน
            </p>
          </div>
          <div className="bg-white border border-indigo-50 rounded-lg p-1.5 shadow-sm">
            <p className="text-[10px] text-gray-500 font-bold">❌ ไม่สะดวก</p>
            <p className="text-sm font-extrabold text-gray-700 mt-0.5">
              {friendship.filter((r) => Number(r.option_id) === 3).length} คน
            </p>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {currentList.length === 0 && (
          <p className="text-center text-gray-400 text-sm py-8">ยังไม่มีข้อมูล</p>
        )}
        {currentList.map((row) => {
          const mid = row.member_id;
          const isEditing = editing === mid;
          return (
            <div key={mid} className={`bg-white border rounded-2xl p-4 transition-all duration-200 ${isEditing ? "border-blue-400 shadow-md" : "border-gray-100 shadow-sm"}`}>
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold text-gray-800"
                    value={editData.name || ""}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                    placeholder="ชื่อ-สกุล"
                  />
                  <input
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono text-gray-600"
                    value={editData.member_id || ""}
                    onChange={(e) => setEditData({ ...editData, member_id: e.target.value })}
                    placeholder="รหัสประจำตัว"
                  />
                  {tab === "votes" && (
                    <>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        value={editData.color || ""}
                        onChange={(e) => setEditData({ ...editData, color: e.target.value })}
                      >
                        <option value="white">ขาว</option>
                        <option value="black">ดำ</option>
                      </select>
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        value={editData.size || ""}
                        onChange={(e) => setEditData({ ...editData, size: e.target.value })}
                      >
                        <option value="">-- เลือกไซส์ --</option>
                        {SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </>
                  )}
                  {tab === "rally" && (
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                      value={editData.phone || ""}
                      onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                      placeholder="เบอร์โทร"
                    />
                  )}
                  {tab === "friendship" && (
                    <>
                      <input
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono uppercase"
                        value={editData.callsign || ""}
                        onChange={(e) => setEditData({ ...editData, callsign: e.target.value })}
                        placeholder="รหัสนามเรียกขาน (ถ้ามี)"
                      />
                      <input
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        value={editData.phone || ""}
                        onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                        placeholder="เบอร์โทร"
                      />
                      <select
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                        value={editData.option_id || 1}
                        onChange={(e) => setEditData({ ...editData, option_id: Number(e.target.value) })}
                      >
                        <option value={1}>ร่วมทานอาหาร</option>
                        <option value={2}>ร่วมทานอาหาร + เล่นกิจกรรม Adventure</option>
                        <option value={3}>ไม่สะดวกเข้าร่วม</option>
                      </select>
                    </>
                  )}
                  {editError && <p className="text-red-500 text-xs text-center">{editError}</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(tab === "votes" ? "vote" : tab === "rally" ? "rally" : "friendship")}
                      disabled={busy}
                      className="flex-1 bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg disabled:opacity-40"
                    >
                      {busy ? "กำลังบันทึก..." : "บันทึก"}
                    </button>
                    <button
                      onClick={() => { setEditing(null); setEditError(""); }}
                      className="flex-1 bg-gray-100 text-gray-700 text-sm font-semibold py-2 rounded-lg"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{row.name}</p>
                    <p className="text-xs text-gray-400">{row.member_id}</p>
                    {tab === "votes" && (
                      <div className="flex gap-1.5 mt-1">
                        {(row as Vote).size && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">{(row as Vote).size}</span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${(row as Vote).color === "white" ? "bg-gray-100 text-gray-600" : "bg-gray-800 text-white"}`}>
                          {(row as Vote).color === "white" ? "ขาว" : "ดำ"}
                        </span>
                      </div>
                    )}
                    {tab === "rally" && (
                      <p className="text-xs text-blue-600 mt-0.5">{(row as Rally).phone}</p>
                    )}
                    {tab === "friendship" && (
                      <div className="mt-1 space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {(row as Friendship).callsign && (
                            <span className="text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                              {(row as Friendship).callsign}
                            </span>
                          )}
                          <span className="text-xs text-blue-600 font-semibold">{(row as Friendship).phone}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-semibold bg-gray-50 border border-gray-100 px-2 py-1 rounded inline-block">
                          {Number((row as Friendship).option_id) === 1
                            ? "🍽️ ร่วมทานอาหาร"
                            : Number((row as Friendship).option_id) === 2
                            ? "🧗‍♂️ อาหาร + กิจกรรม"
                            : "❌ ไม่สะดวกเข้าร่วม"}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => { setEditing(mid); setEditData({ ...row }); }}
                      className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-base hover:bg-blue-100 transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => deleteRow(tab === "votes" ? "vote" : tab === "rally" ? "rally" : "friendship", mid)}
                      disabled={busy}
                      className="w-9 h-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center text-base hover:bg-red-100 transition-colors disabled:opacity-40"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
