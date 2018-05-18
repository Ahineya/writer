class Sync {
  async load() {
    const response = await fetch('/sync');
    return await response.json();
  }

  async save(data) {
    const response = await fetch('/sync', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(data)
    });
    return await response.json();
  }
}

export const SyncService = new Sync();
