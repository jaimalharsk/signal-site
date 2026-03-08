const SignalLoader = (() => {
  const dataPath = '/data/signals.json';

  async function loadSignals() {
    const res = await fetch(dataPath);
    if (!res.ok) throw new Error('Unable to load signals.');
    return res.json();
  }

  async function renderChannel(type, targetId) {
    const root = document.getElementById(targetId);
    if (!root) return;

    try {
      const entries = (await loadSignals())
        .filter(item => item.type === type)
        .sort((a, b) => new Date(b.date) - new Date(a.date));

      if (!entries.length) {
        root.innerHTML = '<p class="page-intro">No transmissions detected.</p>';
        return;
      }

      root.innerHTML = entries.map((item, index) => `
        <a class="card transmission ${type}" href="/signals/view.html?cid=${encodeURIComponent(item.cid)}">
          <div class="meta">Transmission #${String(index + 1).padStart(3, '0')}</div>
          <h3>${item.title}</h3>
          <div class="meta">Date: ${item.date}</div>
          <div class="source">Source: IPFS</div>
        </a>
      `).join('');
    } catch (err) {
      root.innerHTML = `<p class="page-intro">${err.message}</p>`;
    }
  }

  return { renderChannel };
})();
