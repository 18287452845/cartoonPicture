# 📸 Photo Toon - 照片转卡通 MVP

基于 Next.js 14 的 Web 应用，支持上传照片或拍照，并通过阿里云百炼 AI 生成卡通风格图片。

## 📚 快速导航

- **[配置指南](./CONFIG.md)** - 环境变量配置说明
- **[存储服务配置](./STORAGE_CONFIG.md)** - 多存储服务配置指南（R2/阿里云OSS/七牛云/腾讯云COS）
- **[部署文档](./DEPLOYMENT.md)** - 详细的生产环境部署指南

## 🚀 技术栈

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **存储**: 支持多种存储服务
  - Cloudflare R2 (全球 CDN)
  - 阿里云 OSS (国内加速)
  - 七牛云 (国内 CDN)
  - 腾讯云 COS (国内加速)
- **AI 服务**: 阿里云百炼/通义万相
- **工具库**: 
  - `react-webcam` - 摄像头拍照
  - `qrcode.react` - 二维码生成
  - `lucide-react` - 图标

## 📁 项目结构

```
photo-toon-mvp/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload/route.ts      # 图片上传到 R2
│   │   │   └── generate/route.ts    # 调用阿里云生成卡通图
│   │   ├── layout.tsx               # 根布局
│   │   ├── page.tsx                 # 主页面
│   │   └── globals.css              # 全局样式
│   ├── components/
│   │   ├── CameraCapture.tsx        # 摄像头拍照组件
│   │   ├── ImageUploader.tsx        # 图片上传组件
│   │   ├── ImagePreview.tsx         # 图片预览组件
│   │   └── ResultDisplay.tsx        # 结果展示组件
│   ├── lib/
│   │   ├── r2-client.ts             # R2 客户端工具
│   │   ├── ali-client.ts            # 阿里云 API 客户端
│   │   └── utils.ts                 # 工具函数
│   └── types/
│       └── index.ts                 # TypeScript 类型定义
├── .env.example                     # 环境变量示例
└── README.md
```

## 🔧 环境配置

> 📖 **详细配置说明请查看 [CONFIG.md](./CONFIG.md)**

### 1. 复制环境变量文件

```bash
cp .env.example .env.local
```

### 2. 配置环境变量

编辑 `.env.local` 并填入你的配置（**已预配置，可直接使用**）：

#### Cloudflare R2 配置

前往 [Cloudflare Dashboard](https://dash.cloudflare.com/) 获取：

- `R2_ACCOUNT_ID`: Cloudflare 账户 ID
- `R2_ACCESS_KEY_ID`: R2 Access Key ID
- `R2_SECRET_ACCESS_KEY`: R2 Secret Access Key
- `R2_BUCKET_NAME`: 存储桶名称
- `R2_PUBLIC_URL`: 公开访问 URL (如 `https://your-bucket.r2.dev`)

#### 阿里云百炼配置

前往 [阿里云百炼控制台](https://dashscope.console.aliyun.com/) 获取：

- `ALI_API_KEY`: API Key
- `ALI_API_URL`: API 地址 (默认: `https://dashscope.aliyuncs.com/api/v1/services/aigc/image2image/generation`)
- `ALI_MODEL`: 模型名称 (默认: `wanx-style-repaint-v1`)

## 📦 安装依赖

```bash
npm install
```

## 🏃 运行项目

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 生产构建

```bash
npm run build
npm start
```

## 🎯 核心功能

### 1. 拍照/上传图片
- 支持调用设备摄像头拍照
- 支持上传本地图片文件
- 支持切换前后摄像头

### 2. 图片预览
- 实时预览选中的图片
- 确认后生成卡通风格

### 3. 卡通生成
- 原图上传至 Cloudflare R2
- 调用阿里云百炼 AI 生成卡通图
- 生成结果持久化存储至 R2

### 4. 结果展示
- 显示生成的卡通图片
- 生成二维码用于分享/下载
- 支持直接下载图片

## 🔄 工作流程

```
用户操作
  ↓
拍照/上传
  ↓
预览确认
  ↓
上传到 R2 (/api/upload)
  ↓
获取原图 URL
  ↓
调用阿里云 API (/api/generate)
  ↓
生成卡通图
  ↓
转存到 R2
  ↓
返回结果 URL
  ↓
展示 + 二维码
```

## 🛠️ API 端点

### POST /api/upload

上传图片到 Cloudflare R2

**请求体**:
```json
{
  "image": "data:image/jpeg;base64,..."
}
```

**响应**:
```json
{
  "success": true,
  "url": "https://your-bucket.r2.dev/originals/xxx.jpg",
  "key": "originals/xxx.jpg"
}
```

### POST /api/generate

生成卡通风格图片

**请求体**:
```json
{
  "imageUrl": "https://your-bucket.r2.dev/originals/xxx.jpg"
}
```

**响应**:
```json
{
  "success": true,
  "imageUrl": "https://your-bucket.r2.dev/cartoons/xxx.png"
}
```

## 📱 移动端支持

- 响应式设计，移动端优先
- 支持移动设备摄像头调用
- 触摸友好的交互体验

## 🔐 安全考虑

- API 密钥仅在服务端使用，不暴露给前端
- 图片上传大小限制为 10MB
- 支持的图片格式：JPG、PNG、WEBP、GIF

## 📝 注意事项

1. **阿里云 API**: 
   - 确保已开通阿里云百炼服务
   - 注意 API 调用配额和计费
   - 异步任务需要轮询获取结果（已实现）

2. **Cloudflare R2**:
   - 确保存储桶已配置公开访问
   - 注意存储和流量费用

3. **生产部署**:
   - 建议使用 Vercel/Netlify 等平台
   - 配置环境变量
   - 根据需要调整超时设置
   - 📖 **详细部署步骤请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)**

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可

MIT License
