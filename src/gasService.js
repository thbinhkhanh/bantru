const GAS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycby8zx7YZ1yweQ_ZQii8PmTW8Vtmn2Jehe8A1YBNhNAT23zrAZToPJiZIDx3iopObULOvw/exec";

async function callGasFunction(action, payload = {}) {
  const formData = new URLSearchParams();
  formData.append("action", action);
  for (const key in payload) {
    formData.append(key, payload[key]);
  }

  const res = await fetch(GAS_WEB_APP_URL, {
    method: 'POST',
    body: formData, // Không cần header 'Content-Type' để tránh preflight
  });

  const json = await res.json();
  if (json.status === 'success') return json.data;
  else throw new Error(json.message);
}

// Các hàm gọi riêng:
export async function getSheetData() {
  return await callGasFunction('getSheetData');
}

export async function getSheetDataToGrid() {
  return await callGasFunction('getSheetDataToGrid');
}

export async function writeDateAndCheck(dateString) {
  return await callGasFunction('writeDateAndCheck', { dateString });
}

export async function getDataToSheetDataBaseUsingCache(columnNumber) {
  return await callGasFunction('getDataToSheetDataBase_UsingCache', { columnNumber });
}

export async function loadFreshDataToCache() {
  return await callGasFunction('loadFreshDataToCache');
}
