(() => {
	interface Website {
		url: string;
		timeLimit: number;
		timeUsed?: number;
		lastVisit?: number;
	}

	const $form = document.getElementById("website-form") as HTMLFormElement;
	const $website = document.getElementById("website") as HTMLInputElement;
	const $time = document.getElementById("time") as HTMLInputElement;
	const $websiteList = document.getElementById(
		"website-list"
	) as HTMLUListElement;

	function saveWebsites(websites: Website[]) {
		chrome.storage.local.set({ websites });
	}

	function renderWebsites(websites: Website[]) {
		$websiteList.innerHTML = "";
		websites.forEach((site, index) => {
			const li = document.createElement("li");
			li.textContent = `${site.url} - time limit: ${
				site.timeLimit
			} - minutes used: ${site.timeUsed || 0}`;
			const removeBtn = document.createElement("button");
			removeBtn.textContent = "Remove";
			removeBtn.onclick = () => {
				websites.splice(index, 1);
				saveWebsites(websites);
				renderWebsites(websites);
			};
			li.appendChild(removeBtn);
			$websiteList.appendChild(li);
		});
	}

	$form.addEventListener("submit", e => {
		e.preventDefault();

		let url = $website.value.trim();
		const timeLimit = parseInt($time.value, 10);

		if (!url || isNaN(timeLimit) || timeLimit < 1) {
			alert("Please enter a valid website URL and time limit.");
			return;
		}

		try {
			// Use the URL constructor to parse and extract the hostname
			const parsedUrl = new URL(
				url.startsWith("http") ? url : `https://${url}`
			);
			url = parsedUrl.hostname; // Extracts "safwat-fathi.me"
		} catch (error) {
			alert("Please enter a valid URL.");
			return;
		}

		chrome.storage.local.get({ websites: [] }, ({ websites }) => {
			websites.push({ url, timeLimit, timeUsed: 0 });
			saveWebsites(websites);
			renderWebsites(websites);
		});

		$form.reset();
	});

	chrome.storage.local.get({ websites: [] }, ({ websites }) => {
		renderWebsites(websites);
	});
})();
