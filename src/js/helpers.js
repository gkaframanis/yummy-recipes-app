// To contain a couple of functions that we reuse time and time again.
import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(new Error(`Request took too long! Timeout after ${s} second`));
		}, s * 1000);
	});
};

export const AJAX = async function(url, uploadData=undefined) {
	try {
		const fetchPro = uploadData ? fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(uploadData),
		}) : fetch(url);
	
		const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
			// Convert to JSON
			const data = await res.json();
	
			if (!res.ok) throw new Error(`${data.message} (${res.status})`);
			// The resolved value of this promise.
			return data;
	} catch (err) {
		// We propagate the error by re-throwing it.
		throw err;
	}
}

/*
export const getJSON = async function (url) {
	try {
		// Getting the response | we need to get the id from the hash
		const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
		// Convert to JSON
		const data = await res.json();

		if (!res.ok) throw new Error(`${data.message} (${res.status})`);
		// The resolved value of this promise.
		return data;
	} catch (err) {
		// We propagate the error by re-throwing it.
		throw err;
	}
};

export const sendJSON = async function (url, uploadData) {
	try {

		const fetchPro = fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(uploadData),
		});

		// Getting the response | we need to get the id from the hash
		const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
		// Convert to JSON
		const data = await res.json();

		if (!res.ok) throw new Error(`${data.message} (${res.status})`);
		// The resolved value of this promise.
		return data;
	} catch (err) {
		// We propagate the error by re-throwing it.
		throw err;
	}
};
*/
