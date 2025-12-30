let map = L.map("map").setView([37.8, -85.5], 7);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

function loadState(stateCode) {
  Promise.all([
    fetch("../data/federal.json").then(r => r.json()),
    fetch(`../data/${stateCode.toLowerCase()}.json`).then(r => r.json())
  ]).then(([federal, state]) => {
    const data = [...federal, ...state].filter(i => i.state === stateCode);
    render(data);
  });
}

function render(data) {
  wmaLayer.clearLayers();
  const tbody = document.querySelector("#table tbody");
  tbody.innerHTML = "";

  data.forEach(item => {
    if (!item.lat || !item.lng) return;

    let row = tbody.insertRow();
    row.innerHTML = `
      <td>${item.name}</td>
      <td>${item.type || "WMA"}</td>
      <td>${item.county ? item.county.join(", ") : ""}</td>
    `;

    let marker = L.marker([item.lat, item.lng])
      .addTo(wmaLayer)
      .bindPopup(`<b>${item.name}</b><br>${item.type || "WMA"}`);

    row.onclick = () => {
      map.setView([item.lat, item.lng], 11);
      marker.openPopup();
    };
  });
}


