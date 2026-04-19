import { useState, useRef, useCallback, useEffect } from "react";
import { LangContext } from "./i18n";
import { useLanguage } from "./hooks/useLanguage";
import { usePersistedToken } from "./hooks/usePersistedToken";
import { useUploadHistory } from "./hooks/useUploadHistory";
import { storage } from "./storage";
import { driveApi } from "./api/drive";
import { youtubeApi } from "./api/youtube";
import { S } from "./styles";
import { DRIVE_SCOPE, YT_SCOPES, LS } from "./constants";
import { Stepper } from "./components/Stepper";
import { SetupScreen } from "./screens/SetupScreen";
import { ChannelScreen } from "./screens/ChannelScreen";
import { BrowseScreen } from "./screens/BrowseScreen";
import { UploadScreen } from "./screens/UploadScreen";

export default function App() {
  const { lang, t, toggleLang } = useLanguage();

  const [clientId, setClientId]               = useState(() => storage.get(LS.cid) || "");
  const [driveToken, setDriveTk, driveRef]    = usePersistedToken(LS.dtk, LS.dexp);
  const [ytToken,    setYtTk,    ytRef]       = usePersistedToken(LS.ytk, LS.yexp);
  const [selectedChannel, setSelectedChannel] = useState(() => storage.get(LS.ch, true));
  const channelRef                            = useRef(selectedChannel);

  const [history, recordUpload] = useUploadHistory();
  const [channels, setChannels] = useState([]);
  const [videos,   setVideos]   = useState([]);
  const [selected, setSelected] = useState({});
  const [meta,     setMeta]     = useState({});
  const [uploads,  setUploads]  = useState({});
  const [step,     setStep]     = useState(() => {
    const d  = storage.valid(LS.dtk, LS.dexp);
    const y  = storage.valid(LS.ytk, LS.yexp);
    const ch = storage.get(LS.ch, true);
    return (d && y && ch) ? "browse" : "setup";
  });
  const [loading,   setLoading]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [authError, setAuthError] = useState("");

  const driveClientRef = useRef(null);
  const ytClientRef    = useRef(null);

  useEffect(() => {
    if (step === "browse" && driveRef.current && videos.length === 0) fetchVideos(driveRef.current);
  }, []);

  // ── helpers ──────────────────────────────────────────────────────────────

  const saveChannel = useCallback((ch) => {
    channelRef.current = ch;
    setSelectedChannel(ch);
    if (ch) storage.set(LS.ch, ch, true);
    else    storage.del(LS.ch);
  }, []);

  const handleClientIdChange = (val) => {
    setClientId(val);
    storage.set(LS.cid, val.trim());
  };

  const disconnectDrive = () => { setDriveTk(null); setVideos([]); setSelected({}); setStep("setup"); };
  const disconnectYT    = () => { setYtTk(null); saveChannel(null); setChannels([]); setStep("setup"); };

  const oauthErrorCb = useCallback((err) => {
    if (err.type === "popup_blocked") setAuthError(t.errPopupBlocked);
    else if (err.type === "popup_closed") setAuthError(t.errPopupClosed);
    else setAuthError("Error: " + JSON.stringify(err));
  }, [t]);

  // ── OAuth ─────────────────────────────────────────────────────────────────

  const connectDrive = useCallback(() => {
    setAuthError("");
    if (!window.google?.accounts?.oauth2) { setAuthError(t.errGISNotLoaded); return; }
    try {
      driveClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId.trim(), scope: DRIVE_SCOPE, prompt: "select_account",
        callback: (resp) => {
          if (resp.error) { setAuthError(t.errDriveAuth(resp.error, resp.error_description)); return; }
          setDriveTk(resp.access_token);
          fetchVideos(resp.access_token);
          if (ytRef.current && channelRef.current) setStep("browse");
        },
        error_callback: oauthErrorCb,
      });
      driveClientRef.current.requestAccessToken();
    } catch (e) { setAuthError(t.errOAuthDrive(e.message)); }
  }, [clientId, t, oauthErrorCb]);

  const connectYT = useCallback(() => {
    setAuthError("");
    if (!window.google?.accounts?.oauth2) { setAuthError(t.errGISNotLoaded); return; }
    try {
      ytClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId.trim(), scope: YT_SCOPES, prompt: "select_account",
        callback: (resp) => {
          if (resp.error) { setAuthError(t.errYTAuth(resp.error, resp.error_description)); return; }
          setYtTk(resp.access_token);
          fetchChannels(resp.access_token);
        },
        error_callback: oauthErrorCb,
      });
      ytClientRef.current.requestAccessToken();
    } catch (e) { setAuthError(t.errOAuthYT(e.message)); }
  }, [clientId, t, oauthErrorCb]);

  // ── API calls ─────────────────────────────────────────────────────────────

  const fetchChannels = async (tk) => {
    try {
      const items = await youtubeApi.listChannels(tk);
      if (!items.length) { setAuthError(t.errNoChannel); return; }
      setChannels(items);
      if (items.length === 1) {
        saveChannel(items[0]);
        if (driveRef.current) { setStep("browse"); fetchVideos(driveRef.current); }
      } else {
        setStep("channel");
      }
    } catch (e) { setAuthError(t.errChannels(e.message)); }
  };

  const fetchVideos = async (tk) => {
    setLoading(true);
    try {
      const files = await driveApi.listVideos(tk);
      setVideos(files);
      setMeta(Object.fromEntries(
        files.map(f => [f.id, { title: f.name.replace(/\.[^.]+$/, ""), description: "", privacy: "private" }])
      ));
    } catch (e) { setAuthError(t.errDriveLoad(e.message)); }
    setLoading(false);
  };

  // ── Upload ────────────────────────────────────────────────────────────────

  const updateUpload = (id, patch) => setUploads(p => ({ ...p, [id]: { ...p[id], ...patch } }));

  const uploadOne = async (file) => {
    const m = meta[file.id];
    updateUpload(file.id, { status: "downloading", progress: 0 });

    let blob;
    try {
      blob = await driveApi.downloadBlob(driveRef.current, file.id);
    } catch (e) {
      updateUpload(file.id, { status: "error", msg: t.errDownload(e.status) });
      return;
    }

    updateUpload(file.id, { status: "uploading", progress: 0 });

    let uploadUrl;
    try {
      uploadUrl = await youtubeApi.initResumableUpload(ytRef.current, blob, m);
    } catch (e) {
      const msg = e.reason === "youtubeSignupRequired" ? t.errYTNoSignup
        : e.reason === "uploadLimitExceeded"           ? t.errUploadLimit
        : e.message                                    ? t.errYTMsg(e.message)
        :                                                t.errYTStatus(e.status);
      updateUpload(file.id, { status: "error", msg });
      return;
    }

    if (!uploadUrl) { updateUpload(file.id, { status: "error", msg: t.errNoUploadUrl }); return; }

    try {
      const res = await youtubeApi.uploadBlob(uploadUrl, blob, (p) => updateUpload(file.id, { progress: p }));
      updateUpload(file.id, { status: "done", url: `https://youtu.be/${res.id}` });
      recordUpload(file.id, res.id, m.title);
    } catch (e) {
      const msg = e.network ? t.errNetwork : t.errUpload(e.status, e.text);
      updateUpload(file.id, { status: "error", msg });
    }
  };

  const startUploads = async () => {
    setUploading(true);
    setStep("upload");
    for (const f of videos.filter(v => selected[v.id])) await uploadOne(f);
    setUploading(false);
  };

  // ── Navigation ────────────────────────────────────────────────────────────

  const STEPS = [
    ["setup",  t.stepAccounts],
    ["browse", t.stepBrowse],
    ["upload", t.stepUpload],
  ];

  const canNav = (s) => {
    if (s === "setup")  return true;
    if (s === "browse") return !!(driveToken && selectedChannel);
    if (s === "upload") return uploading || Object.keys(uploads).length > 0;
    return false;
  };

  // ── Selection helpers ─────────────────────────────────────────────────────

  const handleSelectAll         = () => setSelected(Object.fromEntries(videos.map(v => [v.id, true])));
  const handleSelectNone        = () => setSelected({});
  const handleSelectNotUploaded = () => setSelected(Object.fromEntries(videos.filter(v => !history[v.id]).map(v => [v.id, true])));
  const handleToggle            = (id) => setSelected(s => ({ ...s, [id]: !s[id] }));
  const handleEditMeta          = (id, patch) => setMeta(m => ({ ...m, [id]: { ...m[id], ...patch } }));

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <LangContext.Provider value={{ t, lang, toggleLang }}>
      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#e8e8e8", fontFamily: "'Syne', sans-serif", paddingBottom: 90 }}>

        <header style={{ borderBottom: "1px solid #222", padding: "13px 22px", display: "flex", alignItems: "center", gap: 11, position: "sticky", top: 0, background: "#0a0a0a", zIndex: 20 }}>
          <div style={{ width: 24, height: 24, background: "#FF0000", borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="10" height="8" viewBox="0 0 11 8" fill="white"><polygon points="4,0 11,4 4,8" /><rect width="2" height="8" rx="1" /></svg>
          </div>
          <span style={{ fontWeight: 800, fontSize: 13, letterSpacing: "-.3px" }}>{t.appTitle}</span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <Stepper step={step} steps={STEPS} canNav={canNav} onNav={setStep} />
            <button onClick={toggleLang} style={{ ...S.btnSm, marginLeft: 6, padding: "3px 8px" }}>{t.langToggle}</button>
          </div>
        </header>

        <main style={{ maxWidth: 720, margin: "0 auto", padding: "28px 22px 0" }}>
          {step === "setup" && (
            <SetupScreen
              clientId={clientId}
              setClientId={handleClientIdChange}
              driveToken={driveToken}
              ytToken={ytToken}
              selectedChannel={selectedChannel}
              onConnectDrive={connectDrive}
              onConnectYT={connectYT}
              onDisconnectDrive={disconnectDrive}
              onDisconnectYT={disconnectYT}
              authError={authError}
              onGoToBrowse={() => setStep("browse")}
            />
          )}

          {step === "channel" && (
            <ChannelScreen
              channels={channels}
              selectedChannel={selectedChannel}
              authError={authError}
              onSelect={(ch) => {
                saveChannel(ch);
                if (driveRef.current) { setStep("browse"); fetchVideos(driveRef.current); }
                else setStep("setup");
              }}
              onBack={() => { setStep("setup"); setAuthError(""); }}
            />
          )}

          {step === "browse" && (
            <BrowseScreen
              videos={videos}
              selected={selected}
              history={history}
              meta={meta}
              loading={loading}
              selectedChannel={selectedChannel}
              onToggle={handleToggle}
              onSelectAll={handleSelectAll}
              onSelectNone={handleSelectNone}
              onSelectNotUploaded={handleSelectNotUploaded}
              onEditMeta={handleEditMeta}
              onStartUploads={startUploads}
              onChangeChannel={() => setStep("channel")}
            />
          )}

          {step === "upload" && (
            <UploadScreen
              videos={videos}
              selected={selected}
              uploads={uploads}
              meta={meta}
              uploading={uploading}
              onBack={() => setStep("browse")}
            />
          )}
        </main>

      </div>
    </LangContext.Provider>
  );
}
