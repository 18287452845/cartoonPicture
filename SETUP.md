# 🚀 快速开始指南

## 步骤 1: 克隆并安装

```bash
git clone <repository-url>
cd photo-toon-mvp
npm install
```

## 步骤 2: 配置 Cloudflare R2

### 2.1 创建 R2 存储桶

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **R2** 服务
3. 点击 **Create bucket**
4. 输入存储桶名称（如 `photo-toon-images`）
5. 创建完成

### 2.2 配置公开访问

1. 进入存储桶设置
2. 找到 **Public Access** 选项
3. 启用公开访问或配置自定义域名
4. 记录公开访问 URL（如 `https://photo-toon-images.r2.dev`）

### 2.3 创建 API Token

1. 在 R2 页面点击 **Manage R2 API Tokens**
2. 点击 **Create API token**
3. 选择权限：**Object Read & Write**
4. 保存以下信息：
   - Access Key ID
   - Secret Access Key
   - Account ID（在 R2 主页右侧可见）

## 步骤 3: 配置阿里云百炼

### 3.1 开通服务

1. 登录 [阿里云百炼控制台](https://dashscope.console.aliyun.com/)
2. 开通 **通义万相** 服务
3. 确保有足够的 API 调用额度

### 3.2 获取 API Key

1. 在控制台找到 **API-KEY 管理**
2. 创建新的 API Key
3. 保存 API Key（只显示一次）

### 3.3 查看可用模型

当前支持的图生图模型：
- `wanx-style-repaint-v1` - 风格化重绘（推荐）
- 其他模型请参考[官方文档](https://help.aliyun.com/zh/dashscope/)

## 步骤 4: 配置环境变量

```bash
# 复制示例文件
cp .env.example .env.local

# 编辑 .env.local，填入你的配置
nano .env.local
```

`.env.local` 示例：

```bash
# Cloudflare R2 配置
R2_ACCOUNT_ID=a1b2c3d4e5f6g7h8i9j0
R2_ACCESS_KEY_ID=1234567890abcdef
R2_SECRET_ACCESS_KEY=abcdef1234567890abcdef1234567890abcdef12
R2_BUCKET_NAME=photo-toon-images
R2_PUBLIC_URL=https://photo-toon-images.r2.dev

# 阿里云百炼配置
ALI_API_KEY=sk-1234567890abcdefghijklmnopqrstuv
ALI_API_URL=https://dashscope.aliyuncs.com/api/v1/services/aigc/image2image/generation
ALI_MODEL=wanx-style-repaint-v1

# Next.js 配置
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 步骤 5: 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 步骤 6: 测试功能

### 测试拍照功能
1. 点击 **拍照** 按钮
2. 允许浏览器访问摄像头
3. 拍摄照片并确认
4. 点击 **生成卡通风格**

### 测试上传功能
1. 点击 **上传图片** 按钮
2. 选择本地图片（支持 JPG、PNG、WEBP、GIF）
3. 预览图片
4. 点击 **生成卡通风格**

### 测试下载功能
1. 生成完成后，点击 **下载图片**
2. 或使用手机扫描二维码保存

## 🚨 常见问题

### Q: 上传失败，提示 "上传图片失败"
A: 检查 R2 配置是否正确，特别是：
- `R2_ACCESS_KEY_ID` 和 `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME` 是否存在
- API Token 权限是否包含 Write

### Q: 生成失败，提示 "阿里云 API 调用失败"
A: 检查阿里云配置：
- `ALI_API_KEY` 是否正确
- 是否开通了通义万相服务
- 是否有足够的 API 调用额度
- 网络是否能访问阿里云 API

### Q: 摄像头无法打开
A: 可能的原因：
- 浏览器未授予摄像头权限
- 使用 HTTPS 协议（本地开发可用 HTTP）
- 设备没有摄像头或被其他应用占用

### Q: 图片生成很慢
A: 这是正常现象：
- 阿里云 API 是异步任务，需要轮询获取结果
- 通常需要 10-30 秒
- 如果超过 60 秒，请检查 API 配额和网络

### Q: 二维码无法扫描
A: 检查：
- R2 存储桶是否配置了公开访问
- `R2_PUBLIC_URL` 是否正确
- 生成的图片 URL 是否可以直接访问

## 📦 生产部署

### Vercel 部署

1. 推送代码到 GitHub
2. 导入项目到 [Vercel](https://vercel.com/)
3. 配置环境变量（与 `.env.local` 相同）
4. 部署

### 其他平台

支持任何支持 Next.js 的平台：
- Netlify
- Railway
- 自托管（需要 Node.js 18+）

## 🔒 安全建议

1. **不要** 将 `.env.local` 提交到 Git
2. **不要** 在前端代码中暴露 API 密钥
3. 生产环境建议：
   - 配置 CORS 策略
   - 添加请求频率限制
   - 配置 CDN 加速
   - 监控 API 使用量

## 📊 监控和日志

查看服务器日志：
```bash
npm run dev  # 开发模式会显示详细日志
```

关键日志点：
- 图片上传成功/失败
- 阿里云 API 调用状态
- R2 存储操作结果

## 🎨 自定义配置

### 修改卡通风格

编辑 `src/lib/ali-client.ts`：

```typescript
const requestBody = {
  model: ALI_MODEL,
  input: {
    image_url: imageUrl,
    style_index: 0, // 修改这里：0-9 不同风格
  },
  parameters: {
    style: '<auto>', // 或指定具体风格
  },
}
```

### 修改上传大小限制

编辑 `src/lib/utils.ts`：

```typescript
const maxSize = 10 * 1024 * 1024 // 修改这里（字节）
```

### 修改超时设置

编辑 `src/app/api/generate/route.ts`：

```typescript
export const maxDuration = 60 // 修改这里（秒）
```

## 🆘 获取帮助

如遇到问题，请提供以下信息：
1. 错误截图或日志
2. 浏览器和版本
3. Node.js 版本
4. 操作步骤

提交 Issue 到 GitHub 仓库。
