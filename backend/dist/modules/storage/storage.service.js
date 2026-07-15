"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const axios_1 = __importDefault(require("axios"));
let StorageService = class StorageService {
    uploadDir = path.join(process.cwd(), 'uploads');
    baseUrl = process.env.API_URL || 'http://localhost:3000';
    onModuleInit() {
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    transformUrl(originalUrl) {
        if (originalUrl.includes('drive.google.com')) {
            const match = originalUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || originalUrl.match(/id=([a-zA-Z0-9_-]+)/);
            if (match && match[1]) {
                return `https://drive.google.com/uc?export=download&confirm=t&id=${match[1]}`;
            }
        }
        return originalUrl;
    }
    async uploadFile(file) {
        try {
            const ext = path.extname(file.originalname) || '.mp4';
            const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
            const filePath = path.join(this.uploadDir, filename);
            await fs.promises.writeFile(filePath, file.buffer);
            return `${this.baseUrl}/uploads/${filename}`;
        }
        catch (error) {
            throw new common_1.InternalServerErrorException('Failed to save file to disk');
        }
    }
    async downloadAndStoreUrl(url) {
        try {
            const directUrl = this.transformUrl(url);
            const headResponse = await axios_1.default.head(directUrl);
            const contentType = headResponse.headers['content-type'] || '';
            if (typeof contentType === 'string' && !contentType.startsWith('video/') && !contentType.includes('application/octet-stream')) {
                throw new Error(`Invalid source. Expected a raw video file, but got: ${contentType}`);
            }
            const filename = `download-${Date.now()}.mp4`;
            const filePath = path.join(this.uploadDir, filename);
            const response = await (0, axios_1.default)({ method: 'GET', url: directUrl, responseType: 'stream' });
            const writer = fs.createWriteStream(filePath);
            response.data.pipe(writer);
            return new Promise((resolve, reject) => {
                writer.on('finish', () => resolve(`${this.baseUrl}/uploads/${filename}`));
                writer.on('error', reject);
            });
        }
        catch (error) {
            if (error.message.includes('Invalid source')) {
                throw new common_1.InternalServerErrorException(error.message);
            }
            throw new common_1.InternalServerErrorException('Failed to download video. Please ensure the link is publicly accessible.');
        }
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)()
], StorageService);
//# sourceMappingURL=storage.service.js.map