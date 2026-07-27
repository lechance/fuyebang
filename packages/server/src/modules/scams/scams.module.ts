import { Module } from '@nestjs/common'
import { ScamsController } from './scams.controller'
import { AdminScamsController } from './admin-scams.controller'
import { ScamsService } from './scams.service'

@Module({
  controllers: [ScamsController, AdminScamsController],
  providers: [ScamsService],
})
export class ScamsModule {}
