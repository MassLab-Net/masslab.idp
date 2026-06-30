//#region node_modules/.nitro/vite/services/ssr/assets/identity-api-DHRTF7en.js
async function identityFetch(session, path, init) {
	const headers = new Headers(init?.headers);
	headers.set("Authorization", `Bearer ${session.accessToken}`);
	if (init?.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
	const response = await fetch(new URL(path, session.identityBaseUrl), {
		...init,
		headers
	});
	if (response.status === 401 || response.status === 403) throw new Error("Your admin session is no longer authorized.");
	if (!response.ok) {
		const payload = await tryReadJson(response);
		throw new Error(payload?.errors?.[0] ?? payload?.title ?? payload?.error_description ?? "Identity API request failed.");
	}
	if (response.status === 204) return;
	return await response.json();
}
async function tryReadJson(response) {
	try {
		return await response.json();
	} catch {
		return null;
	}
}
//#endregion
export { identityFetch as t };
