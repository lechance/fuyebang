import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始填充数据...')

  // 清空已有数据（按依赖顺序）
  console.log('  清空旧数据...')
  await prisma.dailyStat.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.feedback.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.browseHistory.deleteMany()
  await prisma.userFavorite.deleteMany()
  await prisma.userLike.deleteMany()
  await prisma.communityComment.deleteMany()
  await prisma.communityPost.deleteMany()
  await prisma.scamReport.deleteMany()
  await prisma.tool.deleteMany()
  await prisma.guide.deleteMany()
  await prisma.article.deleteMany()
  await prisma.reviewStep.deleteMany()
  await prisma.userReview.deleteMany()
  await prisma.reviewVote.deleteMany()
  await prisma.review.deleteMany()
  await prisma.sideHustle.deleteMany()
  await prisma.taggable.deleteMany()
  await prisma.categorization.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.category.deleteMany()
  await prisma.banner.deleteMany()
  await prisma.loginLog.deleteMany()
  await prisma.adminUser.deleteMany()
  await prisma.user.deleteMany()

  // ========================
  // 1. 用户
  // ========================
  console.log('  创建用户...')

  const adminUser = await prisma.user.create({
    data: {
      nickname: '管理员',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  })

  const testUser = await prisma.user.create({
    data: {
      openId: 'test_openid_001',
      nickname: '副业小白',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test1',
      role: 'USER',
      status: 'ACTIVE',
    },
  })

  const testUser2 = await prisma.user.create({
    data: {
      openId: 'test_openid_002',
      nickname: '创业达人',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=test2',
      role: 'USER',
      status: 'ACTIVE',
    },
  })

  // Admin 后台账号
  const hashedPwd = await bcrypt.hash('admin123', 10)
  await prisma.adminUser.create({
    data: {
      username: 'admin',
      password: hashedPwd,
      nickname: '管理员',
      role: 'SUPER_ADMIN',
    },
  })

  // ========================
  // 2. 分类
  // ========================
  console.log('  创建分类...')

  const catOnline = await prisma.category.create({
    data: { name: '线上副业', slug: 'online', icon: '💻', sortOrder: 1 },
  })
  const catOffline = await prisma.category.create({
    data: { name: '线下副业', slug: 'offline', icon: '🏃', sortOrder: 2 },
  })
  const catCreative = await prisma.category.create({
    data: { name: '创意副业', slug: 'creative', icon: '🎨', sortOrder: 3 },
  })

  // 子分类
  await prisma.category.createMany({
    data: [
      { name: '自媒体', slug: 'self-media', icon: '📱', parentId: catOnline.id, sortOrder: 1 },
      { name: '电商带货', slug: 'ecommerce', icon: '🛒', parentId: catOnline.id, sortOrder: 2 },
      { name: '知识付费', slug: 'knowledge', icon: '📚', parentId: catOnline.id, sortOrder: 3 },
      { name: '跑腿服务', slug: 'delivery', icon: '🛵', parentId: catOffline.id, sortOrder: 1 },
      { name: '家教辅导', slug: 'tutoring', icon: '📝', parentId: catOffline.id, sortOrder: 2 },
      { name: '摄影摄像', slug: 'photography', icon: '📷', parentId: catCreative.id, sortOrder: 1 },
      { name: '手工艺品', slug: 'handcraft', icon: '✂️', parentId: catCreative.id, sortOrder: 2 },
    ],
  })

  // ========================
  // 3. 标签
  // ========================
  console.log('  创建标签...')

  await prisma.tag.createMany({
    data: [
      { name: '新手友好', slug: 'beginner-friendly', color: '#07c160' },
      { name: '高收益', slug: 'high-income', color: '#f59e0b' },
      { name: '低风险', slug: 'low-risk', color: '#3b82f6' },
      { name: '全职可做', slug: 'full-time', color: '#8b5cf6' },
      { name: '学生兼职', slug: 'student', color: '#ec4899' },
      { name: '在家可做', slug: 'work-from-home', color: '#10b981' },
      { name: '零成本', slug: 'zero-cost', color: '#ef4444' },
      { name: '长期稳定', slug: 'stable', color: '#14b8a6' },
    ],
  })

  // ========================
  // 4. 副业库
  // ========================
  console.log('  创建副业库...')

  const hustle1 = await prisma.sideHustle.create({
    data: {
      name: '抖音短视频带货',
      slug: 'douyin-ecommerce',
      description: '通过抖音平台发布短视频，挂载商品链接赚取佣金。适合有创意、会剪辑的用户。可以从好物分享、生活技巧等角度切入。',
      shortDesc: '抖音带货，风口上的副业，月入过万不是梦',
      icon: '🎬',
      category: 'SELF_MEDIA',
      avgScoreOverall: 7.5,
      totalReviews: 3,
      incomePotential: '3000-50000+/月',
      entryBarrier: '中',
      timeRequired: '3-5小时/天',
      isHot: true,
      viewCount: 2580,
      status: 'PUBLISHED',
    },
  })

  const hustle2 = await prisma.sideHustle.create({
    data: {
      name: '闲鱼无货源',
      slug: 'xianyu-dropshipping',
      description: '在闲鱼平台发布商品信息，通过信息差赚取差价。无需囤货，找到上家代发即可。适合有耐心、善于沟通的人。',
      shortDesc: '零成本起步，闲鱼倒卖赚差价',
      icon: '🏪',
      category: 'E_COMMERCE',
      avgScoreOverall: 6.8,
      totalReviews: 2,
      incomePotential: '1000-8000/月',
      entryBarrier: '低',
      timeRequired: '1-2小时/天',
      isHot: true,
      viewCount: 3200,
      status: 'PUBLISHED',
    },
  })

  const hustle3 = await prisma.sideHustle.create({
    data: {
      name: '知乎好物推荐',
      slug: 'zhihu-affiliate',
      description: '在知乎撰写高质量回答，插入商品卡片获取佣金。依靠内容沉淀带来持续收益，适合擅长写作的人。',
      shortDesc: '写写回答就能赚钱，内容越久越值钱',
      icon: '✍️',
      category: 'SELF_MEDIA',
      avgScoreOverall: 7.0,
      totalReviews: 2,
      incomePotential: '2000-20000/月',
      entryBarrier: '中',
      timeRequired: '2-3小时/天',
      isHot: false,
      viewCount: 1890,
      status: 'PUBLISHED',
    },
  })

  const hustle4 = await prisma.sideHustle.create({
    data: {
      name: '美团外卖众包',
      slug: 'meituan-delivery',
      description: '注册美团众包骑手，利用空闲时间接单配送。多劳多得，时间自由。适合有电动车的人。',
      shortDesc: '自由接单，多劳多得，时间灵活',
      icon: '🛵',
      category: 'LOCAL_SERVICES',
      avgScoreOverall: 6.0,
      totalReviews: 1,
      incomePotential: '2000-8000/月',
      entryBarrier: '低',
      timeRequired: '灵活',
      isHot: false,
      viewCount: 1200,
      status: 'PUBLISHED',
    },
  })

  const hustle5 = await prisma.sideHustle.create({
    data: {
      name: '在线英语家教',
      slug: 'online-english-tutoring',
      description: '通过在线平台为国内外学生提供英语教学服务。只需流利的英语和稳定的网络即可开始。',
      shortDesc: '足不出户教英语，时薪可观',
      icon: '🌍',
      category: 'SKILL_BASED',
      avgScoreOverall: 7.8,
      totalReviews: 2,
      incomePotential: '3000-15000/月',
      entryBarrier: '中',
      timeRequired: '2-3小时/天',
      isHot: false,
      viewCount: 890,
      status: 'PUBLISHED',
    },
  })

  const hustle6 = await prisma.sideHustle.create({
    data: {
      name: '摄影后期修图',
      slug: 'photo-editing',
      description: '为个人或商家提供照片后期处理服务，包括人像精修、产品图处理等。需要掌握PS/LR等工具。',
      shortDesc: '有一技之长，靠修图接单',
      icon: '📷',
      category: 'SKILL_BASED',
      avgScoreOverall: 7.2,
      totalReviews: 1,
      incomePotential: '2000-10000/月',
      entryBarrier: '中',
      timeRequired: '2-4小时/天',
      isHot: false,
      viewCount: 650,
      status: 'PUBLISHED',
    },
  })

  // ========================
  // 5. 评测数据
  // ========================
  console.log('  创建评测...')

  const review1 = await prisma.review.create({
    data: {
      title: '抖音短视频带货深度评测',
      summary: '2024年抖音带货还值得做吗？我们从收益、风险、稳定性、难度、合规五个维度进行全面分析。',
      content: `<h2>一、平台概况</h2><p>抖音日活用户已突破8亿，电商GMV持续增长。抖音带货分为短视频带货和直播带货两种形式。</p><h2>二、操作流程</h2><p>1. 注册抖音账号并实名认证 - 2. 积累1000粉丝开通橱窗 - 3. 选品并制作视频 - 4. 挂载商品链接 - 5. 通过视频流量获取佣金</p><h2>三、收益分析</h2><p>佣金比例通常在10%-50%不等。新手期月入500-2000，成熟期可达3000-50000+。</p><h2>四、风险提示</h2><p>平台政策变化快、内容同质化严重、需要持续输出优质内容。建议多账号矩阵运营分散风险。</p>`,
      coverImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
      slug: 'douyin-ecommerce-review',
      scoreEarnings: 8.5,
      scoreRisk: 6.0,
      scoreMarketStability: 7.0,
      scoreDifficulty: 6.5,
      scoreCompliance: 7.5,
      scoreOverall: 7.5,
      incomeMin: 3000,
      incomeMax: 50000,
      difficulty: 'MEDIUM',
      pros: ['流量巨大，天花板高', '变现路径多样', '官方扶持力度大', '可结合多种玩法'],
      cons: ['需要粉丝基础', '内容同质化严重', '平台政策变化风险', '需要持续输出'],
      scamAlerts: ['谨防"代运营"骗局', '不要相信"保证涨粉"的服务', '注意"卖课"和"带货"的区别'],
      requirements: ['有创意和表达欲', '掌握基础视频剪辑', '了解电商基本逻辑', '每天能投入3小时以上'],
      timeCommitment: '3-5小时/天',
      startupCost: 1000,
      isFeatured: true,
      viewCount: 1520,
      favoriteCount: 68,
      reviewCount: 3,
      status: 'PUBLISHED',
      publishedAt: new Date('2024-06-15'),
      authorId: adminUser.id,
      sideHustleId: hustle1.id,
    },
  })

  const review2 = await prisma.review.create({
    data: {
      title: '闲鱼无货源卖货全攻略',
      summary: '闲鱼无货源模式到底能不能赚钱？实操一个月，真实数据全公开。',
      content: `<h2>什么是闲鱼无货源？</h2><p>通过在闲鱼发布商品信息，当有买家下单后，从拼多多、1688等平台找上家代发，赚取差价。</p><h2>操作步骤</h2><p>1. 注册并养号 - 2. 选品（热门品类） - 3. 优化标题和图片 - 4. 发布后擦亮 - 5. 成交后代发</p><h2>收益数据</h2><p>单件利润：5-50元不等。日订单量：3-20单。月净利润：1000-8000元。</p>`,
      coverImage: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
      slug: 'xianyu-dropshipping-review',
      scoreEarnings: 6.0,
      scoreRisk: 5.0,
      scoreMarketStability: 6.5,
      scoreDifficulty: 4.0,
      scoreCompliance: 8.0,
      scoreOverall: 6.8,
      incomeMin: 1000,
      incomeMax: 8000,
      difficulty: 'EASY',
      pros: ['零成本起步', '上手简单', '时间灵活', '风险较低'],
      cons: ['利润空间有限', '竞争激烈', '售后问题多', '平台规则限制多'],
      scamAlerts: ['注意区分假货和正品', '不要做违禁品', '警惕代发商欺诈'],
      requirements: ['有耐心', '善于沟通', '熟悉手机操作', '有一定选品眼光'],
      timeCommitment: '1-2小时/天',
      startupCost: 0,
      isFeatured: true,
      viewCount: 3200,
      favoriteCount: 120,
      reviewCount: 2,
      status: 'PUBLISHED',
      publishedAt: new Date('2024-05-20'),
      authorId: adminUser.id,
      sideHustleId: hustle2.id,
    },
  })

  const review3 = await prisma.review.create({
    data: {
      title: '知乎好物推荐：内容变现的长期主义',
      summary: '通过写知乎回答插入商品卡片赚佣金，被动收入持续增长。一篇优质回答可能带来持续几年的收益。',
      content: `<h2>知乎好物推荐机制</h2><p>创作者在回答中插入商品卡片，当用户通过卡片购买后，创作者获得佣金。佣金比例5%-20%不等。</p><h2>如何开始</h2><p>1. 知乎账号注册满90天 - 2. 获得好物推荐权限 - 3. 选择熟悉的领域 - 4. 撰写高质量回答 - 5. 自然插入商品推荐</p><h2>收益预期</h2><p>前3个月：0-1000元/月。3-6个月：1000-5000元/月。6个月以上：5000-20000+元/月。</p>`,
      coverImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800',
      slug: 'zhihu-affiliate-review',
      scoreEarnings: 7.0,
      scoreRisk: 3.0,
      scoreMarketStability: 8.0,
      scoreDifficulty: 6.5,
      scoreCompliance: 9.0,
      scoreOverall: 7.0,
      incomeMin: 2000,
      incomeMax: 20000,
      difficulty: 'MEDIUM',
      pros: ['长期被动收入', '积累个人品牌', '合规性高', '内容越久越值钱'],
      cons: ['起效慢', '需要写作能力', '平台限制逐渐增多', '流量不稳定'],
      scamAlerts: [],
      requirements: ['良好的文字表达能力', '耐心和长期主义心态', '在某领域有专业认知'],
      timeCommitment: '2-3小时/天',
      startupCost: 0,
      isFeatured: false,
      viewCount: 1890,
      favoriteCount: 56,
      reviewCount: 2,
      status: 'PUBLISHED',
      publishedAt: new Date('2024-04-10'),
      authorId: adminUser.id,
      sideHustleId: hustle3.id,
    },
  })

  const review4 = await prisma.review.create({
    data: {
      title: '美团外卖众包骑手真实体验',
      summary: '下班后跑美团众包能赚多少？辛苦程度如何？一篇文章告诉你真实情况。',
      content: `<h2>美团众包是什么？</h2><p>美团官方的兼职配送平台，自由接单，按单结算。适合有电动车、熟悉路况的人。</p><h2>收入情况</h2><p>高峰期每单4-7元，平峰期每单3-5元。熟练骑手每小时可跑3-5单。日收入80-200元。</p><h2>注意事项</h2><p>注意交通安全、雨天单多价高但危险、需要办理健康证。平台抽成比例在15-25%。</p>`,
      coverImage: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=800',
      slug: 'meituan-delivery-review',
      scoreEarnings: 5.0,
      scoreRisk: 7.0,
      scoreMarketStability: 7.0,
      scoreDifficulty: 3.0,
      scoreCompliance: 8.0,
      scoreOverall: 6.0,
      incomeMin: 2000,
      incomeMax: 8000,
      difficulty: 'EASY',
      pros: ['时间自由', '当天结算', '门槛低', '锻炼身体'],
      cons: ['体力消耗大', '受天气影响', '交通安全风险', '收入有上限'],
      scamAlerts: ['不要相信"租车"骗局', '注意识别真假众包平台'],
      requirements: ['有电动车', '熟悉当地路况', '身体健康', '能吃苦'],
      timeCommitment: '灵活',
      startupCost: 3000,
      isFeatured: false,
      viewCount: 1200,
      favoriteCount: 34,
      reviewCount: 1,
      status: 'PUBLISHED',
      publishedAt: new Date('2024-03-05'),
      authorId: adminUser.id,
      sideHustleId: hustle4.id,
    },
  })

  // ========================
  // 6. 评测步骤
  // ========================
  console.log('  创建评测步骤...')

  await prisma.reviewStep.createMany({
    data: [
      { reviewId: review1.id, stepNumber: 1, title: '注册与实名认证', content: '下载抖音APP → 手机号注册 → 完成实名认证 → 完善个人资料' },
      { reviewId: review1.id, stepNumber: 2, title: '积累基础粉丝', content: '持续发布垂直内容 → 利用热门话题 → 保持更新频率 → 达到1000粉开橱窗' },
      { reviewId: review1.id, stepNumber: 3, title: '选品与上架', content: '精选联盟选品 → 申请样片 → 制作种草视频 → 挂载商品链接' },
      { reviewId: review1.id, stepNumber: 4, title: '优化与放大', content: '数据分析优化 → 投Dou+测试 → 矩阵号运营 → 私域引流' },
      { reviewId: review2.id, stepNumber: 1, title: '账号准备', content: '下载闲鱼 → 支付宝注册 → 完善个人资料 → 养号3-7天' },
      { reviewId: review2.id, stepNumber: 2, title: '选品策略', content: '选择热门品类 → 分析竞争对手 → 确定利润空间 → 准备商品图片' },
      { reviewId: review2.id, stepNumber: 3, title: '发布与运营', content: '优化标题 → 合理定价 → 定时擦亮 → 积极回复咨询' },
      { reviewId: review3.id, stepNumber: 1, title: '开通权限', content: '注册知乎 → 完成创作者等级 → 申请好物推荐权限' },
      { reviewId: review3.id, stepNumber: 2, title: '内容创作', content: '选择擅长领域 → 研究热门问题 → 撰写深度回答 → 自然植入商品' },
      { reviewId: review3.id, stepNumber: 3, title: '持续运营', content: '保持回答频率 → 维护已发内容 → 分析转化数据 → 优化推荐策略' },
    ],
  })

  // ========================
  // 7. 文章/资讯
  // ========================
  console.log('  创建资讯文章...')

  await prisma.article.createMany({
    data: [
      {
        title: '2024年最值得尝试的10个副业',
        summary: '从市场趋势、收入潜力、入门难度三个维度，为你筛选出2024年最适合普通人的10个副业方向。',
        content: '<h2>1. AI提示词工程师</h2><p>随着AI工具的普及，懂得如何与AI高效对话成为一项稀缺技能...</p><h2>2. 短视频带货</h2><p>依然是流量红利最大的领域...</p>',
        articleType: 'MARKET_TREND',
        authorName: '副业邦',
        isFeatured: true,
        viewCount: 5200,
        status: 'PUBLISHED',
        publishedAt: new Date('2024-07-20'),
      },
      {
        title: '副业避坑：这5种"轻松赚钱"都是骗局',
        summary: '刷单返利、打字录入、点赞赚钱...这些看似轻松的副业背后是精心设计的骗局。',
        content: '<h2>刷单返利类</h2><p>承诺"一单5元，日入300+"，但需要你先垫付资金...</p>',
        articleType: 'FAILURE_CASE',
        authorName: '副业邦',
        isFeatured: true,
        viewCount: 8900,
        status: 'PUBLISHED',
        publishedAt: new Date('2024-07-15'),
      },
      {
        title: '新规解读：网络直播带货合规要求',
        summary: '2024年最新直播带货监管政策解读，主播和商家必读。',
        content: '<h2>核心变化</h2><p>1. 必须显著标识广告 - 2. 主播需实名认证 - 3. 建立商品审核制度...</p>',
        articleType: 'POLICY_UPDATE',
        authorName: '法务专栏',
        isFeatured: false,
        viewCount: 2100,
        status: 'PUBLISHED',
        publishedAt: new Date('2024-07-10'),
      },
      {
        title: '从月薪5000到月入5万：我做自媒体这一年',
        summary: '一个普通上班族如何利用业余时间做自媒体，实现收入翻10倍的真实经历。',
        content: '<h2>起点</h2><p>2023年6月，我决定开始做小红书...</p>',
        articleType: 'SUCCESS_STORY',
        authorName: '小王',
        isFeatured: true,
        viewCount: 15000,
        status: 'PUBLISHED',
        publishedAt: new Date('2024-06-28'),
      },
    ],
  })

  // ========================
  // 8. 指南
  // ========================
  console.log('  创建创业指南...')

  await prisma.guide.createMany({
    data: [
      {
        title: '副业新手入门指南：从0到1的完整路线图',
        summary: '如果你是第一次想做副业，这篇文章将帮你理清思路，找到最适合你的方向。',
        content: '<h2>第一步：自我评估</h2><p>盘点你的技能、时间、资源...</p><h2>第二步：市场调研</h2><p>了解市场需求和竞争情况...</p><h2>第三步：小规模测试</h2><p>用最低成本验证可行性...</p>',
        guideCategory: 'BEGINNER',
        authorName: '副业邦',
        isFeatured: true,
        viewCount: 3200,
        status: 'PUBLISHED',
        publishedAt: new Date('2024-07-01'),
      },
      {
        title: '个人副业税务合规指南',
        summary: '做副业需要交税吗？怎么交？个体户和劳务报酬有什么区别？',
        content: '<h2>副业收入要交税吗？</h2><p>根据中国税法，个人从事经营活动取得的收入需要依法纳税...</p>',
        guideCategory: 'COMPLIANCE',
        authorName: '法务专栏',
        isFeatured: false,
        viewCount: 1800,
        status: 'PUBLISHED',
        publishedAt: new Date('2024-06-20'),
      },
      {
        title: '副业时间管理：如何平衡主业和副业',
        summary: '高效利用业余时间，让副业不影响主业的前提下稳步增长。',
        content: '<h2>时间管理的核心原则</h2><p>1. 固定时间段 - 2. 优先级排序 - 3. 批量处理...</p>',
        guideCategory: 'SKILL_IMPROVEMENT',
        authorName: '效率达人',
        isFeatured: false,
        viewCount: 950,
        status: 'PUBLISHED',
        publishedAt: new Date('2024-05-15'),
      },
    ],
  })

  // ========================
  // 9. 工具
  // ========================
  console.log('  创建工具推荐...')

  await prisma.tool.createMany({
    data: [
      { name: '剪映', description: '抖音官方视频剪辑工具，功能强大，适合短视频创作。', category: '内容创作', isFree: true, rating: 4.5, isRecommended: true },
      { name: 'Canva', description: '在线设计平台，海量模板，快速制作封面和海报。', logoUrl: 'https://www.canva.com/favicon.ico', category: '设计工具', isFree: true, rating: 4.5, isRecommended: true },
      { name: '蝉妈妈', description: '抖音数据分析平台，查看达人数据、商品数据、热门视频。', category: '数据分析', isFree: false, price: '¥299/月起', rating: 4.0, isRecommended: true },
      { name: '飞瓜数据', description: '短视频/直播数据分析工具，支持多平台数据监控。', category: '数据分析', isFree: false, price: '¥199/月起', rating: 4.0, isRecommended: false },
      { name: '石墨文档', description: '在线协作文档，适合团队管理和内容规划。', category: '办公效率', isFree: true, rating: 4.5, isRecommended: true },
      { name: '讯飞听见', description: '语音转文字工具，适合内容创作者快速生成文字稿。', category: '内容创作', isFree: false, price: '¥0.33/分钟', rating: 4.0, isRecommended: false },
    ],
  })

  // ========================
  // 10. 骗局举报
  // ========================
  console.log('  创建避坑数据...')

  await prisma.scamReport.create({
    data: {
      title: '警惕"抖音无人直播"骗局',
      description: '近期出现大量"抖音无人直播月入三万"的广告，实为售卖录播软件和虚假教程。购买后发现软件无效，且无法退款。受害者多为想通过副业赚钱的宝妈和学生。',
      scamType: '虚假培训',
      severity: 'HIGH',
      targetPlatform: '抖音',
      evidenceUrls: ['https://example.com/evidence1.png'],
      preventionTips: '凡是承诺"躺赚""日入过千"的都是骗局。正规的短视频带货需要实际投入时间和精力。',
      status: 'VERIFIED',
      reporterId: testUser.id,
      viewCount: 2200,
    },
  })

  await prisma.scamReport.create({
    data: {
      title: '刷单返利诈骗手段揭秘',
      description: '在QQ群/微信群发布"抖音点赞刷单，一单5元"的信息，前几单正常返利获取信任，后续诱导做大额任务后消失。',
      scamType: '刷单诈骗',
      severity: 'CRITICAL',
      targetPlatform: '微信/QQ',
      status: 'VERIFIED',
      reporterId: testUser2.id,
      viewCount: 5800,
    },
  })

  await prisma.scamReport.create({
    data: {
      title: '配音兼职骗局',
      description: '某配音平台声称招募兼职配音员，试音通过后要求缴纳"保证金"或"培训费"，缴费后便失联。',
      scamType: '虚假招聘',
      severity: 'MEDIUM',
      status: 'PENDING',
      reporterId: testUser.id,
      viewCount: 430,
    },
  })

  // ========================
  // 11. 社区帖子
  // ========================
  console.log('  创建社区帖子...')

  const post1 = await prisma.communityPost.create({
    data: {
      title: '做闲鱼3个月，终于月入过5000了！',
      content: '3月份开始尝试闲鱼无货源，每天花2小时打理。从最初半个月才出一单，到现在日均10单左右，分享一些经验给大家。',
      postType: 'EXPERIENCE_SHARING',
      tags: ['闲鱼', '电商', '经验分享'],
      viewCount: 890,
      likeCount: 45,
      commentCount: 12,
      isPinned: true,
      status: 'PUBLISHED',
      authorId: testUser.id,
    },
  })

  const post2 = await prisma.communityPost.create({
    data: {
      title: '求推荐适合上班族的副业',
      content: '朝九晚五的工作，下班后想找点事情做，有没有不耽误主业又能有点额外收入的副业推荐？',
      postType: 'QUESTION',
      tags: ['新手求助', '上班族'],
      viewCount: 320,
      likeCount: 15,
      commentCount: 8,
      status: 'PUBLISHED',
      authorId: testUser2.id,
    },
  })

  const post3 = await prisma.communityPost.create({
    data: {
      title: '大家觉得2024年下半年AI相关副业还有机会吗？',
      content: 'ChatGPT出来后，AI相关的副业越来越多。但是感觉现在竞争也激烈了，大家觉得还有机会入局吗？',
      postType: 'DISCUSSION',
      tags: ['AI', '副业方向'],
      viewCount: 560,
      likeCount: 28,
      commentCount: 15,
      status: 'PUBLISHED',
      authorId: testUser.id,
    },
  })

  // 帖子评论
  await prisma.communityComment.createMany({
    data: [
      { postId: post1.id, authorId: testUser2.id, content: '太棒了！能详细说说选品方法吗？' },
      { postId: post1.id, authorId: testUser.id, content: '主要做家居日用品和母婴用品，利润虽然不高但走量大' },
      { postId: post2.id, authorId: testUser.id, content: '可以考虑知乎好物推荐，前期投入时间，后期有被动收入' },
      { postId: post2.id, authorId: testUser2.id, content: '谢谢建议！我研究一下' },
      { postId: post3.id, authorId: testUser2.id, content: 'AI绘画还是有机会，但需要一些美术基础' },
    ],
  })

  // 帖子点赞
  await prisma.userLike.createMany({
    data: [
      { userId: testUser.id, postId: post2.id },
      { userId: testUser2.id, postId: post1.id },
      { userId: testUser.id, postId: post3.id },
    ],
  })

  // ========================
  // 12. 横幅
  // ========================
  console.log('  创建横幅...')

  await prisma.banner.createMany({
    data: [
      {
        title: '2024热门副业推荐',
        imageUrl: 'https://images.unsplash.com/photo-1553729459-afe8f2e6e6c3?w=800&h=400&fit=crop',
        position: 'HOME_TOP',
        targetType: 'REVIEW',
        targetId: review1.slug,
        sortOrder: 1,
        isActive: true,
      },
      {
        title: '闲鱼无货源从0到1',
        imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=400&fit=crop',
        position: 'HOME_TOP',
        targetType: 'REVIEW',
        targetId: review2.slug,
        sortOrder: 2,
        isActive: true,
      },
      {
        title: '副业避坑指南',
        imageUrl: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&h=400&fit=crop',
        position: 'HOME_MIDDLE',
        targetType: 'URL',
        targetUrl: '/pages/subpkg-scam/list',
        sortOrder: 1,
        isActive: true,
      },
    ],
  })

  // ========================
  // 13. 通知
  // ========================
  console.log('  创建通知...')

  await prisma.notification.createMany({
    data: [
      {
        userId: testUser.id,
        type: 'SYSTEM',
        title: '欢迎加入副业邦！',
        body: '在这里你可以查看副业评测、阅读行业资讯、参与社区讨论。',
        isRead: true,
      },
      {
        userId: testUser.id,
        type: 'POST_COMMENT',
        title: '创业达人评论了你的帖子',
        body: '太棒了！能详细说说选品方法吗？',
        entityType: 'POST',
        entityId: post1.id,
        isRead: false,
      },
      {
        userId: testUser.id,
        type: 'REVIEW_UPDATE',
        title: '抖音短视频带货评测已更新',
        body: '新增了2024年下半年平台政策变化的内容。',
        entityType: 'REVIEW',
        entityId: review1.slug,
        isRead: false,
      },
      {
        userId: testUser2.id,
        type: 'SYSTEM',
        title: '欢迎加入副业邦！',
        body: '在这里你可以查看副业评测、阅读行业资讯、参与社区讨论。',
        isRead: true,
      },
    ],
  })

  // ========================
  // 14. 用户收藏 & 浏览记录
  // ========================
  console.log('  创建用户行为数据...')

  await prisma.userFavorite.createMany({
    data: [
      { userId: testUser.id, entityId: review1.id, entityType: 'REVIEW' },
      { userId: testUser.id, entityId: review3.id, entityType: 'REVIEW' },
      { userId: testUser2.id, entityId: review2.id, entityType: 'REVIEW' },
    ],
  })

  await prisma.browseHistory.createMany({
    data: [
      { userId: testUser.id, entityId: review1.id, entityType: 'REVIEW' },
      { userId: testUser.id, entityId: review2.id, entityType: 'REVIEW' },
      { userId: testUser2.id, entityId: review3.id, entityType: 'REVIEW' },
      { userId: testUser2.id, entityId: review1.id, entityType: 'REVIEW' },
    ],
  })

  // ========================
  // 15. 用户评测评分
  // ========================
  console.log('  创建用户评测...')

  await prisma.userReview.createMany({
    data: [
      { reviewId: review1.id, userId: testUser.id, rating: 8, content: '做了3个月抖音带货，月入6000+，感觉还不错，就是需要持续学习', income: '6000/月', isVerified: false },
      { reviewId: review1.id, userId: testUser2.id, rating: 7, content: '做了半年，月入1.5万，但越来越卷了', income: '15000/月', isVerified: false },
      { reviewId: review2.id, userId: testUser.id, rating: 7, content: '闲鱼起步简单，但想做好也不容易，主要靠选品', income: '3000/月', isVerified: false },
    ],
  })

  // ========================
  // 16. 评测投票
  // ========================
  console.log('  创建评测投票...')

  await prisma.reviewVote.createMany({
    data: [
      { reviewId: review1.id, userId: testUser.id, vote: true },
      { reviewId: review1.id, userId: testUser2.id, vote: true },
      { reviewId: review2.id, userId: testUser.id, vote: true },
      { reviewId: review3.id, userId: testUser2.id, vote: true },
    ],
  })

  console.log('✅ 数据填充完成！')
  console.log('')
  console.log('📋 填充概要：')
  console.log(`  - 用户: 3 个 (管理员 + 2个测试用户)`)
  console.log(`  - Admin后台: admin / admin123`)
  console.log(`  - 分类: 10 个 (3 顶级 + 7 子级)`)
  console.log(`  - 标签: 8 个`)
  console.log(`  - 副业库: 6 个`)
  console.log(`  - 评测: 4 个 (含步骤和优劣势)`)
  console.log(`  - 资讯: 4 篇`)
  console.log(`  - 指南: 3 篇`)
  console.log(`  - 工具: 6 个`)
  console.log(`  - 骗局举报: 3 个`)
  console.log(`  - 社区帖子: 3 个 + 5 条评论 + 3 个点赞`)
  console.log(`  - 横幅: 3 个`)
  console.log(`  - 通知: 4 条`)
  console.log(`  - 收藏/浏览/评价/投票: 若干`)
}

main()
  .catch((e) => {
    console.error('❌ 填充失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
