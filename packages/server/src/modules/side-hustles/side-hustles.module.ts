import { Module } from '@nestjs/common'
import { SideHustlesController } from './side-hustles.controller'
import { SideHustlesService } from './side-hustles.service'

@Module({ controllers: [SideHustlesController], providers: [SideHustlesService] })
export class SideHustlesModule {}
