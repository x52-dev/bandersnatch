import { Controller, Get, Post, Body, Put, Param, Patch, Delete, Request, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { VideosService } from './videos.service';
import { StorageService } from '../storage/storage.service';
import { UpdateVideoDto } from './dto/update-video.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

// @types/multer provides the Express.Multer namespace globally
@ApiTags('Videos')
@Controller('admin/videos')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class VideosController {
  constructor(
    private readonly videosService: VideosService, 
    private readonly storageService: StorageService
  ) {}

  @Post('upload/local')
  @ApiOperation({ summary: 'Upload a video via a remote URL' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadLocal(
    @UploadedFile() file: Express.Multer.File, 
    @Body('title') title: string, 
    @Body('description') description: string, 
    @Body('thumbnailUrl') thumbnailUrl: string, // Added thumbnailUrl
    @Request() req
  ) {
    const videoUrl = await this.storageService.uploadFile(file);
    return this.videosService.create({ title, description, videoUrl, thumbnailUrl, questions: [] }, req.user.sub);
  }

  @Post('upload/url')
  async uploadUrl(
    @Body('url') url: string, 
    @Body('title') title: string, 
    @Body('description') description: string, 
    @Body('thumbnailUrl') thumbnailUrl: string, // Added thumbnailUrl
    @Request() req
  ) {
    const videoUrl = await this.storageService.downloadAndStoreUrl(url);
    return this.videosService.create({ title, description, videoUrl, thumbnailUrl, questions: [] }, req.user.sub);
  }

  @Get() 
  findAll(@Request() req) { 
    return this.videosService.findAllAdmin(req.user.sub); 
  }
  
  @Get(':id') 
  findOne(@Param('id') id: string, @Request() req) { 
    return this.videosService.findOneAdmin(id, req.user.sub); 
  }
  
  @Put(':id') 
  update(@Param('id') id: string, @Body() updateVideoDto: UpdateVideoDto, @Request() req) { 
    // Passing req.user.sub as the 3rd argument to satisfy the Service
    return this.videosService.update(id, updateVideoDto, req.user.sub); 
  }
  
  @Patch(':id/publish') 
  togglePublish(@Param('id') id: string, @Body('isPublished') isPublished: boolean, @Request() req) { 
    // Passing req.user.sub as the 3rd argument to satisfy the Service
    return this.videosService.togglePublish(id, isPublished, req.user.sub); 
  }

  @Post(':id/assign')
  assign(@Param('id') id: string, @Body('learnerIds') learnerIds: string[]) {
    return this.videosService.assignToLearners(id, learnerIds);
  }

  @Get('metrics/:learnerId')
  getLearnerMetrics(@Param('learnerId') learnerId: string, @Request() req) {
    return this.videosService.getAdminLearnerMetrics(req.user.sub, learnerId);
  }

  // ADDED: The Delete endpoint mapped to the cascading delete method
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.videosService.remove(id, req.user.sub);
  }
}