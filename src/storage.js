export const storage = {
  get(k, parse = false) {
    try { const v = localStorage.getItem(k); return parse ? JSON.parse(v) : v; }
    catch { return null; }
  },
  set(k, v, str = false) {
    try { localStorage.setItem(k, str ? JSON.stringify(v) : v); } catch {}
  },
  del(...ks) {
    ks.forEach(k => { try { localStorage.removeItem(k); } catch {} });
  },
  valid(k, expKey) {
    const tk = this.get(k);
    const exp = parseInt(this.get(expKey) || "0");
    return (tk && Date.now() < exp) ? tk : null;
  },
};
