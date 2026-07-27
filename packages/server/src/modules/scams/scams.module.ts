import { Module } from '@nestjs/common'
import { ScamsController } from './scams.controller'
import { ScamsService } from './scams.service'

@Module({ controllers: [ScamsController], providers: [ScamsService] })
export class ScamsModule {}
