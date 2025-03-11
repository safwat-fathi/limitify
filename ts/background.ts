interface Website {
	url: string; // e.g., "safwat-fathi.me"
	timeLimit: number;
	timeUsed?: number;
	lastVisit?: number;
}

// Function to construct the URL to the block page
function getBlockPageUrl(siteName: string): string {
	const blockPageUrl = chrome.runtime.getURL("block.html");
	const url = new URL(blockPageUrl);
	url.searchParams.set("site", siteName);
	return url.toString();
}

// Listener for tab updates
chrome.tabs.onUpdated.addListener(handleTabUpdate);

async function handleTabUpdate(
	tabId: number,
	changeInfo: chrome.tabs.TabChangeInfo,
	tab: chrome.tabs.Tab
) {
	if (changeInfo.status === "complete" && tab.url) {
		try {
			const url = new URL(tab.url);
			const hostname = url.hostname;

			const data = await chrome.storage.local.get("websites");
			const websites: Website[] = data.websites || [];

			const site = websites.find((w: Website) => {
				return hostname === w.url || hostname.endsWith(`.${w.url}`);
			});

			if (site) {
				const now = Date.now();
				site.lastVisit = site.lastVisit || now;
				const elapsedMinutes = (now - site.lastVisit) / (1000 * 60);

				if (elapsedMinutes >= 1) {
					site.timeUsed = (site.timeUsed || 0) + Math.floor(elapsedMinutes);
					site.lastVisit = now;
				}

				if (site.timeUsed && site.timeUsed >= site.timeLimit) {
					const blockPageUrl = getBlockPageUrl(site.url); // Pass the site name as a query parameter
					await chrome.tabs.update(tabId, { url: blockPageUrl });
				}

				// Save the updated websites back to storage
				await chrome.storage.local.set({ websites });
			}
		} catch (error) {
			console.error(error);
		}
	}
}
