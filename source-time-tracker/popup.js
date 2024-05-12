chrome.storage.local.get({ urls: [] }, (result) => {
  const urlList = document.getElementById("urlList");
  result.urls.forEach((entry) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = entry.url;
    a.textContent = entry.url;
    a.target = "_blank";
    const timestamp = new Date(entry.timestamp).toLocaleString();
    const timestampSpan = document.createElement("span");
    timestampSpan.textContent = timestamp;
    timestampSpan.classList.add("timestamp");
    li.appendChild(a);
    li.appendChild(timestampSpan);
    urlList.appendChild(li);
  });
});
