export const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.readonly";

export const YT_SCOPES = [
  "https://www.googleapis.com/auth/youtube.upload",
  "https://www.googleapis.com/auth/youtube.readonly",
].join(" ");

export const PRIVACY_OPTIONS = ["private", "unlisted", "public"];

export const TOKEN_TTL_MS = 3500 * 1000;

export const LS = {
  lang: "dyt_lang",
  cid:  "dyt_cid",
  dtk:  "dyt_dtk",
  dexp: "dyt_dexp",
  ytk:  "dyt_ytk",
  yexp: "dyt_yexp",
  ch:   "dyt_ch",
  hist: "dyt_hist",
};
