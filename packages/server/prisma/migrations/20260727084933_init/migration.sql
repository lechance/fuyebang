-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BANNED', 'INACTIVE');

-- CreateEnum
CREATE TYPE "BannerPosition" AS ENUM ('HOME_TOP', 'HOME_MIDDLE', 'REVIEW_TOP');

-- CreateEnum
CREATE TYPE "BannerTargetType" AS ENUM ('REVIEW', 'ARTICLE', 'GUIDE', 'HUSTLE', 'URL', 'NONE');

-- CreateEnum
CREATE TYPE "CategorizableType" AS ENUM ('REVIEW', 'ARTICLE', 'SIDE_HUSTLE', 'GUIDE');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'PENDING_REVIEW');

-- CreateEnum
CREATE TYPE "ReviewDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD', 'EXPERT');

-- CreateEnum
CREATE TYPE "HustleCategory" AS ENUM ('SELF_MEDIA', 'E_COMMERCE', 'LOCAL_SERVICES', 'SKILL_BASED', 'RESOURCE_BASED', 'INVESTMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "ArticleType" AS ENUM ('POLICY_UPDATE', 'SEASONAL_ANALYSIS', 'MARKET_TREND', 'FAILURE_CASE', 'SUCCESS_STORY', 'TOOL_REVIEW', 'OTHER');

-- CreateEnum
CREATE TYPE "GuideCategory" AS ENUM ('BEGINNER', 'TOOL_RECOMMENDATION', 'FINANCIAL_PLANNING', 'COMPLIANCE', 'SKILL_IMPROVEMENT');

-- CreateEnum
CREATE TYPE "ScamStatus" AS ENUM ('PENDING', 'VERIFIED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "ScamSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('EXPERIENCE_SHARING', 'QUESTION', 'DISCUSSION', 'RESOURCE_SHARING', 'WARNING');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('PUBLISHED', 'HIDDEN', 'DELETED', 'REPORTED');

-- CreateEnum
CREATE TYPE "FavoriteType" AS ENUM ('REVIEW', 'ARTICLE', 'GUIDE', 'HUSTLE', 'POST');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('SYSTEM', 'COMMENT_REPLY', 'POST_LIKE', 'POST_COMMENT', 'REVIEW_UPDATE', 'SCAM_ALERT', 'NEW_FEATURE');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('BUG', 'FEATURE_REQUEST', 'CONTENT_SUGGESTION', 'OTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "openId" TEXT,
    "unionId" TEXT,
    "nickname" TEXT,
    "avatarUrl" TEXT,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ip" TEXT,
    "device" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "login_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "position" "BannerPosition" NOT NULL,
    "targetType" "BannerTargetType" NOT NULL,
    "targetId" TEXT,
    "targetUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "startAt" TIMESTAMP(3),
    "endAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "parentId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categorizations" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityType" "CategorizableType" NOT NULL,
    "reviewId" TEXT,
    "sideHustleId" TEXT,
    "articleId" TEXT,
    "guideId" TEXT,

    CONSTRAINT "categorizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "taggables" (
    "id" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityType" "CategorizableType" NOT NULL,
    "reviewId" TEXT,
    "sideHustleId" TEXT,
    "articleId" TEXT,
    "guideId" TEXT,

    CONSTRAINT "taggables_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "slug" TEXT NOT NULL,
    "scoreEarnings" DECIMAL(3,1) NOT NULL,
    "scoreRisk" DECIMAL(3,1) NOT NULL,
    "scoreMarketStability" DECIMAL(3,1) NOT NULL,
    "scoreDifficulty" DECIMAL(3,1) NOT NULL,
    "scoreCompliance" DECIMAL(3,1) NOT NULL,
    "scoreOverall" DECIMAL(3,1) NOT NULL,
    "incomeMin" DECIMAL(10,2),
    "incomeMax" DECIMAL(10,2),
    "incomeCurrency" TEXT NOT NULL DEFAULT 'CNY',
    "incomePeriod" TEXT NOT NULL DEFAULT 'monthly',
    "difficulty" "ReviewDifficulty" NOT NULL DEFAULT 'MEDIUM',
    "pros" TEXT[],
    "cons" TEXT[],
    "scamAlerts" TEXT[],
    "requirements" TEXT[],
    "timeCommitment" TEXT,
    "startupCost" DECIMAL(10,2),
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "status" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,
    "sideHustleId" TEXT,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_steps" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_reviews" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "income" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_votes" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vote" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "review_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "side_hustles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "shortDesc" TEXT NOT NULL,
    "icon" TEXT,
    "category" "HustleCategory" NOT NULL,
    "avgScoreOverall" DECIMAL(3,1),
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "incomePotential" TEXT,
    "entryBarrier" TEXT,
    "timeRequired" TEXT,
    "isHot" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "side_hustles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "articleType" "ArticleType" NOT NULL,
    "authorName" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,
    "status" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "relatedHustleId" TEXT,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guides" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImage" TEXT,
    "guideCategory" "GuideCategory" NOT NULL,
    "authorName" TEXT NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "status" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "guides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tools" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "logoUrl" TEXT,
    "website" TEXT,
    "category" TEXT NOT NULL,
    "isFree" BOOLEAN NOT NULL DEFAULT true,
    "price" TEXT,
    "rating" DECIMAL(2,1),
    "isRecommended" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tools_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scam_reports" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scamType" TEXT NOT NULL,
    "severity" "ScamSeverity" NOT NULL DEFAULT 'MEDIUM',
    "targetPlatform" TEXT,
    "evidenceUrls" TEXT[],
    "preventionTips" TEXT,
    "status" "ScamStatus" NOT NULL DEFAULT 'PENDING',
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reporterId" TEXT NOT NULL,
    "relatedHustleId" TEXT,

    CONSTRAINT "scam_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_posts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "postType" "PostType" NOT NULL DEFAULT 'DISCUSSION',
    "images" TEXT[],
    "tags" TEXT[],
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "favoriteCount" INTEGER NOT NULL DEFAULT 0,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "status" "PostStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "community_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "community_comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "postId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "community_comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityType" "FavoriteType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "browse_histories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "browse_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "entityType" TEXT,
    "entityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedbacks" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "FeedbackType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "images" TEXT[],
    "contactInfo" TEXT,
    "isResolved" BOOLEAN NOT NULL DEFAULT false,
    "adminReply" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "avatarUrl" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "details" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_stats" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "newUsers" INTEGER NOT NULL DEFAULT 0,
    "activeUsers" INTEGER NOT NULL DEFAULT 0,
    "totalViews" INTEGER NOT NULL DEFAULT 0,
    "reviewViews" INTEGER NOT NULL DEFAULT 0,
    "articleViews" INTEGER NOT NULL DEFAULT 0,
    "communityPosts" INTEGER NOT NULL DEFAULT 0,
    "communityComments" INTEGER NOT NULL DEFAULT 0,
    "newReviews" INTEGER NOT NULL DEFAULT 0,
    "scamReports" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "daily_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_openId_key" ON "users"("openId");

-- CreateIndex
CREATE INDEX "users_openId_idx" ON "users"("openId");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "login_logs_userId_idx" ON "login_logs"("userId");

-- CreateIndex
CREATE INDEX "login_logs_createdAt_idx" ON "login_logs"("createdAt");

-- CreateIndex
CREATE INDEX "banners_position_isActive_sortOrder_idx" ON "banners"("position", "isActive", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "categorizations_entityId_entityType_idx" ON "categorizations"("entityId", "entityType");

-- CreateIndex
CREATE UNIQUE INDEX "categorizations_categoryId_entityId_entityType_key" ON "categorizations"("categoryId", "entityId", "entityType");

-- CreateIndex
CREATE INDEX "taggables_entityId_entityType_idx" ON "taggables"("entityId", "entityType");

-- CreateIndex
CREATE UNIQUE INDEX "taggables_tagId_entityId_entityType_key" ON "taggables"("tagId", "entityId", "entityType");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_slug_key" ON "reviews"("slug");

-- CreateIndex
CREATE INDEX "reviews_status_isFeatured_idx" ON "reviews"("status", "isFeatured");

-- CreateIndex
CREATE INDEX "reviews_scoreOverall_idx" ON "reviews"("scoreOverall");

-- CreateIndex
CREATE INDEX "reviews_publishedAt_idx" ON "reviews"("publishedAt");

-- CreateIndex
CREATE INDEX "reviews_sideHustleId_idx" ON "reviews"("sideHustleId");

-- CreateIndex
CREATE INDEX "reviews_slug_idx" ON "reviews"("slug");

-- CreateIndex
CREATE INDEX "review_steps_reviewId_stepNumber_idx" ON "review_steps"("reviewId", "stepNumber");

-- CreateIndex
CREATE INDEX "user_reviews_reviewId_createdAt_idx" ON "user_reviews"("reviewId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_reviews_reviewId_userId_key" ON "user_reviews"("reviewId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "review_votes_reviewId_userId_key" ON "review_votes"("reviewId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "side_hustles_slug_key" ON "side_hustles"("slug");

-- CreateIndex
CREATE INDEX "side_hustles_category_status_idx" ON "side_hustles"("category", "status");

-- CreateIndex
CREATE INDEX "side_hustles_avgScoreOverall_idx" ON "side_hustles"("avgScoreOverall");

-- CreateIndex
CREATE INDEX "side_hustles_isHot_status_idx" ON "side_hustles"("isHot", "status");

-- CreateIndex
CREATE INDEX "articles_articleType_status_publishedAt_idx" ON "articles"("articleType", "status", "publishedAt");

-- CreateIndex
CREATE INDEX "articles_isFeatured_status_idx" ON "articles"("isFeatured", "status");

-- CreateIndex
CREATE INDEX "articles_publishedAt_idx" ON "articles"("publishedAt");

-- CreateIndex
CREATE INDEX "guides_guideCategory_status_publishedAt_idx" ON "guides"("guideCategory", "status", "publishedAt");

-- CreateIndex
CREATE INDEX "guides_isFeatured_status_idx" ON "guides"("isFeatured", "status");

-- CreateIndex
CREATE INDEX "scam_reports_status_severity_idx" ON "scam_reports"("status", "severity");

-- CreateIndex
CREATE INDEX "scam_reports_scamType_idx" ON "scam_reports"("scamType");

-- CreateIndex
CREATE INDEX "scam_reports_createdAt_idx" ON "scam_reports"("createdAt");

-- CreateIndex
CREATE INDEX "community_posts_status_createdAt_idx" ON "community_posts"("status", "createdAt");

-- CreateIndex
CREATE INDEX "community_posts_postType_status_idx" ON "community_posts"("postType", "status");

-- CreateIndex
CREATE INDEX "community_posts_authorId_idx" ON "community_posts"("authorId");

-- CreateIndex
CREATE INDEX "community_posts_isPinned_status_createdAt_idx" ON "community_posts"("isPinned", "status", "createdAt");

-- CreateIndex
CREATE INDEX "community_comments_postId_createdAt_idx" ON "community_comments"("postId", "createdAt");

-- CreateIndex
CREATE INDEX "community_comments_parentId_idx" ON "community_comments"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "user_likes_userId_postId_key" ON "user_likes"("userId", "postId");

-- CreateIndex
CREATE INDEX "user_favorites_userId_entityType_createdAt_idx" ON "user_favorites"("userId", "entityType", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_favorites_userId_entityId_entityType_key" ON "user_favorites"("userId", "entityId", "entityType");

-- CreateIndex
CREATE INDEX "browse_histories_userId_entityType_createdAt_idx" ON "browse_histories"("userId", "entityType", "createdAt");

-- CreateIndex
CREATE INDEX "notifications_userId_isRead_createdAt_idx" ON "notifications"("userId", "isRead", "createdAt");

-- CreateIndex
CREATE INDEX "feedbacks_userId_createdAt_idx" ON "feedbacks"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "feedbacks_type_idx" ON "feedbacks"("type");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_username_key" ON "admin_users"("username");

-- CreateIndex
CREATE INDEX "audit_logs_adminId_createdAt_idx" ON "audit_logs"("adminId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_action_createdAt_idx" ON "audit_logs"("action", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "daily_stats_date_key" ON "daily_stats"("date");

-- AddForeignKey
ALTER TABLE "login_logs" ADD CONSTRAINT "login_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorizations" ADD CONSTRAINT "categorizations_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorizations" ADD CONSTRAINT "categorizations_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorizations" ADD CONSTRAINT "categorizations_sideHustleId_fkey" FOREIGN KEY ("sideHustleId") REFERENCES "side_hustles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorizations" ADD CONSTRAINT "categorizations_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categorizations" ADD CONSTRAINT "categorizations_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "guides"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taggables" ADD CONSTRAINT "taggables_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taggables" ADD CONSTRAINT "taggables_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taggables" ADD CONSTRAINT "taggables_sideHustleId_fkey" FOREIGN KEY ("sideHustleId") REFERENCES "side_hustles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taggables" ADD CONSTRAINT "taggables_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "taggables" ADD CONSTRAINT "taggables_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "guides"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_sideHustleId_fkey" FOREIGN KEY ("sideHustleId") REFERENCES "side_hustles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_steps" ADD CONSTRAINT "review_steps_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_reviews" ADD CONSTRAINT "user_reviews_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_reviews" ADD CONSTRAINT "user_reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_votes" ADD CONSTRAINT "review_votes_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_votes" ADD CONSTRAINT "review_votes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_relatedHustleId_fkey" FOREIGN KEY ("relatedHustleId") REFERENCES "side_hustles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scam_reports" ADD CONSTRAINT "scam_reports_reporterId_fkey" FOREIGN KEY ("reporterId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scam_reports" ADD CONSTRAINT "scam_reports_relatedHustleId_fkey" FOREIGN KEY ("relatedHustleId") REFERENCES "side_hustles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "community_comments" ADD CONSTRAINT "community_comments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "community_comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_likes" ADD CONSTRAINT "user_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_likes" ADD CONSTRAINT "user_likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "community_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_favorites" ADD CONSTRAINT "user_favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "browse_histories" ADD CONSTRAINT "browse_histories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feedbacks" ADD CONSTRAINT "feedbacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
