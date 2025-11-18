// Figma API Client
// Dokumentasi: https://www.figma.com/developers/api

const FIGMA_API_BASE = 'https://api.figma.com/v1';

export class FigmaClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  async getFile(fileKey) {
    const response = await fetch(`${FIGMA_API_BASE}/files/${fileKey}`, {
      headers: {
        'X-Figma-Token': this.accessToken,
      },
    });
    return response.json();
  }

  async getImages(fileKey, ids, options = {}) {
    const { format = 'png', scale = 1 } = options;
    const idsParam = ids.join(',');
    const url = `${FIGMA_API_BASE}/images/${fileKey}?ids=${idsParam}&format=${format}&scale=${scale}`;
    
    const response = await fetch(url, {
      headers: {
        'X-Figma-Token': this.accessToken,
      },
    });
    return response.json();
  }

  async exportAsSvg(fileKey, nodeId) {
    const response = await fetch(
      `${FIGMA_API_BASE}/images/${fileKey}?ids=${nodeId}&format=svg`,
      {
        headers: {
          'X-Figma-Token': this.accessToken,
        },
      }
    );
    return response.json();
  }
}

// Usage example:
// const figma = new FigmaClient(process.env.FIGMA_ACCESS_TOKEN);
// const file = await figma.getFile('your-file-key');
// const images = await figma.getImages('your-file-key', ['node-id-1', 'node-id-2']);

