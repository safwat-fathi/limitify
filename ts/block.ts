(() => {
	// Function to retrieve query parameters
	function getQueryParam(param: string) {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get(param);
	}

	// Function to display the site name
	function displaySiteName() {
		const site = getQueryParam("site");
		
		if (site) {
			const messageElement = document.getElementById("message") as HTMLElement;
			messageElement.textContent = `You have reached your time limit for ${site}.`;
		}
	}

	// Execute on page load
	document.addEventListener("DOMContentLoaded", displaySiteName);
})()