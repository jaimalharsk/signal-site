const IPFSViewer = (() => {
  const baseUrl = 'https://ipfs.io/ipfs/';

  async function loadCid(cid, targetId) {
    const root = document.getElementById(targetId);
    if (!root) return;

    if (!cid) {
      root.innerHTML = '<p>Missing CID parameter.</p>';
      return;
    }

    root.innerHTML = '<p>Locking to relay and decoding transmission...</p>';
    try {
      const res = await fetch(`${baseUrl}${encodeURIComponent(cid)}`);
      if (!res.ok) throw new Error(`IPFS request failed with ${res.status}`);
      const text = await res.text();

      const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(text);
      root.innerHTML = looksLikeHtml ? text : `<pre>${escapeHtml(text)}</pre>`;
    } catch (err) {
      root.innerHTML = `<p>Unable to load transmission from IPFS. ${err.message}</p>`;
    }
  }

  function escapeHtml(value) {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }

  return { loadCid };
})();
