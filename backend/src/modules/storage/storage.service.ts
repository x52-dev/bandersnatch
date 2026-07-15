import { Injectable, OnModuleInit, InternalServerErrorException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

@Injectable()
export class StorageService implements OnModuleInit {
  private uploadDir = path.join(process.cwd(), 'uploads');
  private baseUrl = process.env.API_URL || 'http://localhost:3000';

  onModuleInit() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // --- Helper: Convert Web Links to Direct Download Links ---
  private transformUrl(originalUrl: string): string {
    if (originalUrl.includes('drive.google.com')) {
      // Extract the ID from standard sharing links
      const match = originalUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || originalUrl.match(/id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        // 'confirm=t' bypasses the HTML virus scan warning page for files over 100MB
        return `https://drive.google.com/uc?export=download&confirm=t&id=${match[1]}`;
      }
    }
    return originalUrl; // Return as-is if it's not a recognizable GDrive link
  }

  // 1. Handle Local File Uploads
  async uploadFile(file: Express.Multer.File): Promise<string> {
    try {
      const ext = path.extname(file.originalname) || '.mp4';
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const filePath = path.join(this.uploadDir, filename);

      await fs.promises.writeFile(filePath, file.buffer);
      return `${this.baseUrl}/uploads/${filename}`;
    } catch (error) {
      throw new InternalServerErrorException('Failed to save file to disk');
    }
  }

  // 2. Handle URL Downloads with Smart Link Transformation
  async downloadAndStoreUrl(url: string): Promise<string> {
    try {
      // Transform the URL if it's from a known provider like Google Drive
      const directUrl = this.transformUrl(url);

      // Verify the URL is actually a file before streaming
      const headResponse = await axios.head(directUrl);
      const contentType = headResponse.headers['content-type'] || '';
      
      // Allow video files OR generic binary streams (which is how GDrive sends videos)
      if (typeof contentType === 'string' && !contentType.startsWith('video/') && !contentType.includes('application/octet-stream')) {
        throw new Error(`Invalid source. Expected a raw video file, but got: ${contentType}`);
      }

      const filename = `download-${Date.now()}.mp4`;
      const filePath = path.join(this.uploadDir, filename);

      // Stream the transformed URL directly to disk
      const response = await axios({ method: 'GET', url: directUrl, responseType: 'stream' });
      const writer = fs.createWriteStream(filePath);
      
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(`${this.baseUrl}/uploads/${filename}`));
        writer.on('error', reject);
      });

    } catch (error) {
      if (error.message.includes('Invalid source')) {
        throw new InternalServerErrorException(error.message);
      }
      throw new InternalServerErrorException('Failed to download video. Please ensure the link is publicly accessible.');
    }
  }
}