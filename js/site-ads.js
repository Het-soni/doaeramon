(() => {
  const container = document.querySelector("[data-display-ad]");
  const slot = window.dwConfig.displaySlot.trim();
  if (!container || !/^\d+$/.test(slot)) return;
  function mount() {
  const ad = document.createElement("ins");
  ad.className = "adsbygoogle";
  ad.style.display = "block";
  Object.assign(ad.dataset, {
    adClient: "ca-pub-8772972065670336", adSlot: slot,
    adFormat: "auto", fullWidthResponsive: "true"
  });
  container.replaceChildren(document.createTextNode("Advertisement"), ad);
  (window.adsbygoogle = window.adsbygoogle || []).push({});
  }
  if (container.closest("[hidden]")) document.addEventListener("dw-test-reward", mount, {once:true});
  else mount();
})();
