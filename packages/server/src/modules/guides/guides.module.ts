import { Module } from '@nestjs/common'
import { GuidesController, ToolsController } from './guides.controller'
import { AdminGuidesController, AdminToolsController } from './admin-guides.controller'
import { GuidesService } from './guides.service'

@Module({
  controllers: [GuidesController, ToolsController, AdminGuidesController, AdminToolsController],
  providers: [GuidesService],
})
export class GuidesModule {}
