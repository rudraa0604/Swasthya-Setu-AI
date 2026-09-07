const API_BASE = '/api';

export const apiClient = {
  // PHC & Rollups
  async getNationalRollup() {
    const res = await fetch(`${API_BASE}/phcs/rollup/national`);
    if (!res.ok) throw new Error('Failed to fetch national rollup');
    return res.json();
  },

  async getPHCs(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/phcs/${query ? '?' + query : ''}`);
    if (!res.ok) throw new Error('Failed to fetch PHCs');
    return res.json();
  },

  async getPHCDetail(phcId) {
    const res = await fetch(`${API_BASE}/phcs/${phcId}`);
    if (!res.ok) throw new Error(`Failed to fetch PHC detail for ${phcId}`);
    return res.json();
  },

  // Forecasts
  async getPHCForecasts(phcId, horizonDays = 14) {
    const res = await fetch(`${API_BASE}/forecast/${phcId}?horizon_days=${horizonDays}`);
    if (!res.ok) throw new Error(`Failed to fetch forecast for ${phcId}`);
    return res.json();
  },

  // Early Warning Alerts
  async getAlerts(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/alerts/${query ? '?' + query : ''}`);
    if (!res.ok) throw new Error('Failed to fetch alerts');
    return res.json();
  },

  async triggerAlertScan() {
    const res = await fetch(`${API_BASE}/alerts/scan-all`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to trigger alert scan');
    return res.json();
  },

  async resolveAlert(alertId) {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/resolve`, { method: 'PUT' });
    if (!res.ok) throw new Error('Failed to resolve alert');
    return res.json();
  },

  // Redistribution
  async getRecommendations(params = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/redistribution/recommendations${query ? '?' + query : ''}`);
    if (!res.ok) throw new Error('Failed to fetch recommendations');
    return res.json();
  },

  async generateRecommendations(stateId = 'ST-MH') {
    const res = await fetch(`${API_BASE}/redistribution/generate?state_id=${stateId}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to generate recommendations');
    return res.json();
  },

  async actOnRecommendation(recId, status) {
    const res = await fetch(`${API_BASE}/redistribution/recommendations/${recId}/action`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error(`Failed to act on recommendation ${recId}`);
    return res.json();
  },

  // Federated Learning
  async getFederatedStatus() {
    const res = await fetch(`${API_BASE}/federated/status`);
    if (!res.ok) throw new Error('Failed to fetch federated status');
    return res.json();
  },

  async runFederatedSimulation(rounds = 5) {
    const res = await fetch(`${API_BASE}/federated/simulate?rounds=${rounds}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to run federated simulation');
    return res.json();
  },

  // Offline Edge Storage & Sync Engine
  enqueueOfflineItem(itemType, payload) {
    const queue = JSON.parse(localStorage.getItem('swasthya_offline_queue') || '[]');
    const queueItem = {
      item_type: itemType,
      payload: payload,
      client_timestamp: new Date().toISOString()
    };
    queue.push(queueItem);
    localStorage.setItem('swasthya_offline_queue', JSON.stringify(queue));
    return queue.length;
  },

  getOfflineQueue() {
    return JSON.parse(localStorage.getItem('swasthya_offline_queue') || '[]');
  },

  async syncOfflineQueue(phcId) {
    const queue = this.getOfflineQueue();
    if (!queue || queue.length === 0) return { items_synced: 0 };

    const payload = {
      phc_id: phcId,
      items: queue
    };

    const res = await fetch(`${API_BASE}/sync/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Offline sync failed');
    const data = await res.json();
    
    // Clear local queue upon success
    localStorage.removeItem('swasthya_offline_queue');
    return data;
  },

  // Developer Admin & Live Customization Operations
  async getDevOverview() {
    const res = await fetch(`${API_BASE}/dev/overview`);
    if (!res.ok) throw new Error('Failed to fetch developer overview');
    return res.json();
  },

  async createPHC(phcData) {
    const res = await fetch(`${API_BASE}/phcs/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(phcData)
    });
    if (!res.ok) throw new Error('Failed to create PHC');
    return res.json();
  },

  async updatePHC(phcId, phcData) {
    const res = await fetch(`${API_BASE}/phcs/${phcId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(phcData)
    });
    if (!res.ok) throw new Error('Failed to update PHC');
    return res.json();
  },

  async deletePHC(phcId) {
    const res = await fetch(`${API_BASE}/phcs/${phcId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete PHC');
    return res.json();
  },

  async addOrUpdateStock(stockData) {
    const res = await fetch(`${API_BASE}/dev/stocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(stockData)
    });
    if (!res.ok) throw new Error('Failed to update medicine stock');
    return res.json();
  },

  async deleteStock(stockId) {
    const res = await fetch(`${API_BASE}/dev/stocks/${stockId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete stock');
    return res.json();
  },

  async triggerOutbreakStressTest(payload) {
    const res = await fetch(`${API_BASE}/dev/trigger-outbreak`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to trigger outbreak simulation');
    return res.json();
  },

  async resetAllStocksHealthy() {
    const res = await fetch(`${API_BASE}/dev/reset-healthy`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset stocks to healthy');
    return res.json();
  },

  async reseedDatabase() {
    const res = await fetch(`${API_BASE}/dev/reseed-database`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to re-seed database');
    return res.json();
  }
};

