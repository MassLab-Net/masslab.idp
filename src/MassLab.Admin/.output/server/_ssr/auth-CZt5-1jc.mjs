import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { I as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auth-CZt5-1jc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)(null);
var KEY = "masslab.iam.session.v2";
function AuthProvider({ children }) {
	const [session, setSession] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setSession(getStoredSession());
	}, []);
	const signIn = (nextSession) => {
		localStorage.setItem(KEY, JSON.stringify(nextSession));
		setSession(nextSession);
	};
	const signOut = () => {
		localStorage.removeItem(KEY);
		setSession(null);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			session,
			user: session?.user ?? null,
			signIn,
			signOut
		},
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
	return ctx;
}
function getStoredSession() {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return null;
		const session = JSON.parse(raw);
		if (!session?.accessToken || !session?.user || !session?.identityBaseUrl) {
			localStorage.removeItem(KEY);
			return null;
		}
		if (session.expiresAt <= Date.now()) {
			localStorage.removeItem(KEY);
			return null;
		}
		return session;
	} catch {
		localStorage.removeItem(KEY);
		return null;
	}
}
//#endregion
export { getStoredSession as n, useAuth as r, AuthProvider as t };
