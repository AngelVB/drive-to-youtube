import { useState, useRef, useCallback } from "react";
import { storage } from "../storage";
import { TOKEN_TTL_MS } from "../constants";

export function usePersistedToken(tkKey, expKey) {
  const [token, setTokenState] = useState(() => storage.valid(tkKey, expKey));
  const ref = useRef(token);

  const setToken = useCallback((tk) => {
    ref.current = tk;
    setTokenState(tk);
    if (tk) {
      storage.set(tkKey, tk);
      storage.set(expKey, String(Date.now() + TOKEN_TTL_MS));
    } else {
      storage.del(tkKey, expKey);
    }
  }, [tkKey, expKey]);

  return [token, setToken, ref];
}
