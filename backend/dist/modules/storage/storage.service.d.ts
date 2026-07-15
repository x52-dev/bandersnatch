import { OnModuleInit } from '@nestjs/common';
export declare class StorageService implements OnModuleInit {
    private uploadDir;
    private baseUrl;
    onModuleInit(): void;
    private transformUrl;
    uploadFile(file: Express.Multer.File): Promise<string>;
    downloadAndStoreUrl(url: string): Promise<string>;
}
