import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'

import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './modules/auth/auth.module'
import { UsersModule } from './modules/users/users.module'
import { HomeModule } from './modules/home/home.module'
import { BannersModule } from './modules/banners/banners.module'
import { ReviewsModule } from './modules/reviews/reviews.module'
import { SideHustlesModule } from './modules/side-hustles/side-hustles.module'
import { ArticlesModule } from './modules/articles/articles.module'
import { GuidesModule } from './modules/guides/guides.module'
import { ScamsModule } from './modules/scams/scams.module'
import { CommunityModule } from './modules/community/community.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { SearchModule } from './modules/search/search.module'
import { UploadModule } from './modules/upload/upload.module'
import { FavoritesModule } from './modules/favorites/favorites.module'
import { HistoryModule } from './modules/history/history.module'
import { AnalyticsModule } from './modules/analytics/analytics.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 60 }]),
    PrismaModule,
    AuthModule,
    UsersModule,
    HomeModule,
    BannersModule,
    ReviewsModule,
    SideHustlesModule,
    ArticlesModule,
    GuidesModule,
    ScamsModule,
    CommunityModule,
    NotificationsModule,
    SearchModule,
    UploadModule,
    FavoritesModule,
    HistoryModule,
    AnalyticsModule,
  ],
})
export class AppModule {}
