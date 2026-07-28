import { Injectable, BadRequestException } from '@nestjs/common'
import 'multer'

@Injectable()
export class UploadService {
  // In production, this would use Tencent COS SDK
  // For development, we save locally or return a mock URL

  async uploadImage(file: Express.Multer.File) {
    if (!file) throw new BadRequestException('请选择文件')
    // Mock: return a placeholder URL
    // In production: upload to COS and return CDN URL
    return { url: `https://cdn.fuyebang.com/images/${Date.now()}_${file.originalname}` }
  }

  async uploadImages(files: Express.Multer.File[]) {
    if (!files?.length) throw new BadRequestException('请选择文件')
    return Promise.all(files.map(f => this.uploadImage(f)))
  }
}
