const form = document.getElementById('deliveryForm');
const addressInput = document.getElementById('address');
const outsideBaseInput = document.getElementById('outsideBase');
const stopsInput = document.getElementById('stops');
const tipInput = document.getElementById('tip');
const areaStatus = document.getElementById('areaStatus');
const baseFeeEl = document.getElementById('baseFee');
const stopsFeeEl = document.getElementById('stopsFee');
const tipTotalEl = document.getElementById('tipTotal');
const totalEl = document.getElementById('total');

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function detectArea(address) {
  if (!address) return 'undetermined';
  const normalized = address.toLowerCase();
  if (normalized.includes('oak grove') || normalized.includes('71263')) {
    return 'oakGrove';
  }
  return 'outside';
}

function calculateFee() {
  const address = addressInput.value.trim();
  const area = detectArea(address);
  const outsideBase = Math.max(7, parseFloat(outsideBaseInput.value) || 7);
  const stops = Math.max(1, parseInt(stopsInput.value, 10) || 1);
  const tip = Math.max(0, parseFloat(tipInput.value) || 0);

  outsideBaseInput.value = outsideBase.toFixed(2);
  stopsInput.value = stops;
  tipInput.value = tip.toFixed(2);

  const additionalStops = Math.max(0, stops - 1);
  const additionalStopFee = additionalStops * 2;

  let baseFee = 7;
  let statusText = 'Add your address to detect area.';
  let statusClass = 'neutral';

  if (area === 'oakGrove') {
    baseFee = 7;
    statusText = 'Detected Oak Grove / 71263 — flat $7 rate applies.';
    statusClass = 'success';
  } else if (area === 'outside') {
    baseFee = outsideBase;
    statusText = 'Outside Oak Grove — using out-of-town base fee shown below.';
    statusClass = 'warning';
  }

  const total = baseFee + additionalStopFee + tip;

  baseFeeEl.textContent = formatCurrency(baseFee);
  stopsFeeEl.textContent = formatCurrency(additionalStopFee);
  tipTotalEl.textContent = formatCurrency(tip);
  totalEl.textContent = formatCurrency(total);

  if (areaStatus) {
    areaStatus.dataset.state = statusClass;
    areaStatus.querySelector('p').textContent = statusText;
  }
}

[addressInput, outsideBaseInput, stopsInput, tipInput].forEach((el) => {
  el.addEventListener('input', calculateFee);
  el.addEventListener('change', calculateFee);
});

calculateFee();
