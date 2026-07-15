import { Controller, Get, UseGuards,Param,Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from './schemas/user.schema';

@Controller('admin/users')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN) // Strictly for Admins
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('learners')
  getLearners() {
    return this.usersService.findAllLearners();
  }

  @Get(':learnerId/metrics')
  getLearnerMetrics(@Param('learnerId') learnerId: string, @Request() req) {
    // Requires VideosService to be exported from VideosModule and imported into UsersModule
    // Or place this in VideosController. For simplicity, put it in VideosController if dependencies are tricky!
  }
}