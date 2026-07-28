import { Module } from '@nestjs/common'
import { SideHustlesController } from './side-hustles.controller'
import { SideHustlesService } from './side-hustles.service'
import { AdminSideHustlesController } from './admin-side-hustles.controller'

@Module({
  controllers: [SideHustlesController, AdminSideHustlesController],
  providers: [SideHustlesService],
})
export class SideHustlesModule {}
