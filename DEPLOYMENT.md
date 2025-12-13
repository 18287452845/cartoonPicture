# 🚀 项目部署文档

本文档详细说明如何部署照片转卡通风格应用。

## 📋 目录

- [前置要求](#前置要求)
- [本地开发环境配置](#本地开发环境配置)
- [生产环境部署](#生产环境部署)
  - [Vercel 部署](#vercel-部署推荐)
  - [其他平台部署](#其他平台部署)
- [环境变量配置](#环境变量配置)
- [验证部署](#验证部署)
- [故障排查](#故障排查)

---

## 前置要求

### 1. 开发工具

- **Node.js**: 18.x 或更高版本
- **npm** 或 **yarn** 或 **pnpm**
- **Git**

### 2. 服务账号

- ✅ **阿里云百炼 API Key** (已配置)
- ✅ **Cloudflare R2 存储桶** (已配置)

---

## 本地开发环境配置

### 步骤 1: 克隆项目

```bash
git clone <your-repo-url>
cd cartoonPicture
```

### 步骤 2: 安装依赖

```bash
npm install
```

### 步骤 3: 配置环境变量

项目已包含 `.env.local` 文件，配置如下：

```env
# 阿里云百炼 API 配置
ALI_API_KEY=sk-c27361038bbd4d8e98064916eff5157d
ALI_API_URL=https://dashscope.aliyuncs.com/api/v1/services/aigc/image2image/generation
ALI_MODEL=wanx-style-repaint-v1

# Cloudflare R2 配置
R2_ACCOUNT_ID=56dda3bd89d39733f0810ec557ff72a5
R2_ACCESS_KEY_ID=2ab4416c360022d07425d5022a30a243
R2_SECRET_ACCESS_KEY=2eef3112af1a3e5cf3114be3de3231e05222e4b796107b0c5d0a4ca789c652cf
R2_BUCKET_NAME=imagetemp
R2_PUBLIC_URL=https://pub-0ee12a39b61943e89473bd5682d08f7b.r2.dev
```

> ⚠️ **注意**: `.env.local` 文件已包含敏感信息，请确保：
> - 不要将 `.env.local` 提交到 Git 仓库
> - 已在 `.gitignore` 中添加 `.env.local`

### 步骤 4: 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 步骤 5: 构建生产版本（本地测试）

```bash
npm run build
npm start
```

---

## 生产环境部署

### Vercel 部署（推荐）

Vercel 是 Next.js 官方推荐的部署平台，提供最佳性能和体验。

#### 方法 1: 通过 Vercel Dashboard

1. **登录 Vercel**
   - 访问 [https://vercel.com](https://vercel.com)
   - 使用 GitHub/GitLab/Bitbucket 账号登录

2. **导入项目**
   - 点击 "Add New Project"
   - 选择你的 Git 仓库
   - 点击 "Import"

3. **配置项目**
   - **Framework Preset**: Next.js (自动检测)
   - **Root Directory**: `./` (默认)
   - **Build Command**: `npm run build` (默认)
   - **Output Directory**: `.next` (默认)
   - **Install Command**: `npm install` (默认)

4. **配置环境变量**
   
   在 "Environment Variables" 部分添加以下变量：

   ```
   ALI_API_KEY = sk-c27361038bbd4d8e98064916eff5157d
   ALI_API_URL = https://dashscope.aliyuncs.com/api/v1/services/aigc/image2image/generation
   ALI_MODEL = wanx-style-repaint-v1
   R2_ACCOUNT_ID = 56dda3bd89d39733f0810ec557ff72a5
   R2_ACCESS_KEY_ID = 2ab4416c360022d07425d5022a30a243
   R2_SECRET_ACCESS_KEY = 2eef3112af1a3e5cf3114be3de3231e05222e4b796107b0c5d0a4ca789c652cf
   R2_BUCKET_NAME = imagetemp
   R2_PUBLIC_URL = https://pub-0ee12a39b61943e89473bd5682d08f7b.r2.dev
   ```

5. **部署**
   - 点击 "Deploy"
   - 等待构建完成（通常 2-5 分钟）
   - 部署成功后，Vercel 会提供一个 URL，如：`https://your-project.vercel.app`

#### 方法 2: 通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 在项目目录中部署
vercel

# 按照提示操作，环境变量会在交互式配置中设置
# 或使用以下命令设置环境变量
vercel env add ALI_API_KEY
vercel env add R2_ACCOUNT_ID
vercel env add R2_ACCESS_KEY_ID
vercel env add R2_SECRET_ACCESS_KEY
vercel env add R2_BUCKET_NAME
vercel env add R2_PUBLIC_URL
```

#### Vercel 配置说明

- **函数执行超时**: 默认 10 秒，本项目已设置为 60 秒（在 `src/app/api/generate/route.ts` 中）
- **Node.js 版本**: Vercel 自动使用 Node.js 18.x
- **自动 HTTPS**: Vercel 自动提供 SSL 证书

---

### 其他平台部署

#### Netlify 部署

1. **登录 Netlify**
   - 访问 [https://www.netlify.com](https://www.netlify.com)
   - 使用 GitHub 账号登录

2. **导入项目**
   - 点击 "Add new site" → "Import an existing project"
   - 选择 Git 仓库

3. **配置构建设置**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

4. **配置环境变量**
   - 在 "Site settings" → "Environment variables" 中添加所有环境变量

5. **部署**
   - 点击 "Deploy site"

#### 自托管服务器部署

##### 使用 PM2

```bash
# 1. 在服务器上安装 Node.js 和 npm
# 2. 克隆项目
git clone <your-repo-url>
cd cartoonPicture

# 3. 安装依赖
npm install

# 4. 创建 .env.local 文件（复制配置）

# 5. 构建项目
npm run build

# 6. 安装 PM2
npm install -g pm2

# 7. 启动应用
pm2 start npm --name "cartoon-picture" -- start

# 8. 设置开机自启
pm2 startup
pm2 save
```

##### 使用 Docker

创建 `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 注意：环境变量需要在运行时提供
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  cartoon-picture:
    build: .
    ports:
      - "3000:3000"
    environment:
      - ALI_API_KEY=sk-c27361038bbd4d8e98064916eff5157d
      - ALI_API_URL=https://dashscope.aliyuncs.com/api/v1/services/aigc/image2image/generation
      - ALI_MODEL=wanx-style-repaint-v1
      - R2_ACCOUNT_ID=56dda3bd89d39733f0810ec557ff72a5
      - R2_ACCESS_KEY_ID=2ab4416c360022d07425d5022a30a243
      - R2_SECRET_ACCESS_KEY=2eef3112af1a3e5cf3114be3de3231e05222e4b796107b0c5d0a4ca789c652cf
      - R2_BUCKET_NAME=imagetemp
      - R2_PUBLIC_URL=https://pub-0ee12a39b61943e89473bd5682d08f7b.r2.dev
    restart: unless-stopped
```

运行：

```bash
docker-compose up -d
```

---

## 环境变量配置

### 必需的环境变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `ALI_API_KEY` | 阿里云百炼 API Key | `sk-c27361038bbd4d8e98064916eff5157d` |
| `R2_ACCOUNT_ID` | Cloudflare R2 账户 ID | `56dda3bd89d39733f0810ec557ff72a5` |
| `R2_ACCESS_KEY_ID` | R2 Access Key ID | `2ab4416c360022d07425d5022a30a243` |
| `R2_SECRET_ACCESS_KEY` | R2 Secret Access Key | `2eef3112af1a3e5cf3114be3de3231e05222e4b796107b0c5d0a4ca789c652cf` |
| `R2_BUCKET_NAME` | R2 存储桶名称 | `imagetemp` |
| `R2_PUBLIC_URL` | R2 公开访问 URL | `https://pub-0ee12a39b61943e89473bd5682d08f7b.r2.dev` |

### 可选的环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `ALI_API_URL` | 阿里云 API 地址 | `https://dashscope.aliyuncs.com/api/v1/services/aigc/image2image/generation` |
| `ALI_MODEL` | 使用的模型名称 | `wanx-style-repaint-v1` |

### 环境变量安全建议

1. ✅ **不要提交敏感信息到 Git**
   - 确保 `.env.local` 在 `.gitignore` 中
   - 使用 `.env.example` 作为模板

2. ✅ **使用平台的环境变量管理**
   - Vercel/Netlify 等平台提供安全的环境变量管理
   - 生产环境使用环境变量，不要硬编码

3. ✅ **定期轮换密钥**
   - 定期更新 API Key 和 Access Key
   - 使用最小权限原则

---

## 验证部署

### 1. 检查应用是否正常运行

访问部署后的 URL，应该能看到应用界面。

### 2. 测试功能

1. **上传图片测试**
   - 上传一张测试图片
   - 检查是否能成功上传到 R2

2. **生成卡通图测试**
   - 确认上传后，点击生成
   - 检查是否能成功调用阿里云 API
   - 检查生成的图片是否保存到 R2

3. **检查控制台**
   - 打开浏览器开发者工具
   - 检查 Network 标签，确认 API 调用正常
   - 检查 Console，确认没有错误

### 3. 检查日志

**Vercel**:
- 在 Dashboard → Deployments → 选择部署 → "Functions" 标签查看日志

**Netlify**:
- 在 Dashboard → Deploys → 选择部署 → "Functions Log" 查看日志

**自托管**:
```bash
# PM2 查看日志
pm2 logs cartoon-picture

# Docker 查看日志
docker-compose logs -f
```

---

## 故障排查

### 常见问题

#### 1. 环境变量未生效

**症状**: API 调用失败，提示缺少配置

**解决方案**:
- 检查环境变量是否正确设置
- 确认变量名拼写正确（区分大小写）
- 重新部署应用（环境变量更改后需要重新部署）

#### 2. R2 上传失败

**症状**: 上传图片时报错

**可能原因**:
- R2 凭证错误
- 存储桶名称错误
- 网络连接问题

**解决方案**:
- 验证 R2 凭证是否正确
- 检查存储桶是否存在且可访问
- 确认 R2_PUBLIC_URL 配置正确

#### 3. 阿里云 API 调用失败

**症状**: 生成卡通图失败

**可能原因**:
- API Key 无效或过期
- API 配额用完
- 请求格式错误

**解决方案**:
- 验证 API Key 是否有效
- 检查阿里云控制台的 API 使用情况
- 查看 API 返回的错误信息

#### 4. 函数执行超时

**症状**: 生成图片时超时

**解决方案**:
- 确认已设置 `maxDuration = 60`（在 `src/app/api/generate/route.ts`）
- Vercel Pro 计划支持更长的执行时间
- 考虑优化图片大小或使用异步处理

#### 5. CORS 错误

**症状**: 浏览器控制台显示 CORS 错误

**解决方案**:
- Next.js API Routes 默认支持 CORS
- 如果使用自定义域名，检查域名配置
- 确认 R2 存储桶的 CORS 设置正确

### 调试技巧

1. **启用详细日志**
   ```typescript
   // 在 API 路由中添加
   console.log('Environment variables:', {
     hasAliKey: !!process.env.ALI_API_KEY,
     hasR2Config: !!process.env.R2_ACCOUNT_ID,
   })
   ```

2. **测试 API 端点**
   ```bash
   # 测试上传接口
   curl -X POST https://your-app.vercel.app/api/upload \
     -H "Content-Type: application/json" \
     -d '{"image": "data:image/jpeg;base64,..."}'
   ```

3. **检查网络请求**
   - 使用浏览器开发者工具的 Network 标签
   - 检查请求和响应状态码
   - 查看响应内容

---

## 性能优化建议

### 1. 图片优化

- 上传前压缩图片
- 使用适当的图片格式（WebP）
- 限制图片大小（建议 < 5MB）

### 2. 缓存策略

- 考虑使用 CDN 缓存生成的图片
- 实现客户端缓存

### 3. 异步处理

- 对于长时间运行的任务，考虑使用队列系统
- 使用 WebSocket 或 Server-Sent Events 推送结果

---

## 监控和维护

### 1. 监控指标

- API 调用次数和成功率
- 图片生成时间
- 存储使用量
- 错误率

### 2. 定期检查

- 检查 API 配额使用情况
- 监控 R2 存储和流量
- 检查应用性能

### 3. 备份

- 定期备份重要配置
- 保存环境变量到安全位置

---

## 支持与帮助

如果遇到问题：

1. 查看本文档的故障排查部分
2. 检查项目 README.md
3. 查看相关服务文档：
   - [Next.js 文档](https://nextjs.org/docs)
   - [Vercel 文档](https://vercel.com/docs)
   - [Cloudflare R2 文档](https://developers.cloudflare.com/r2/)
   - [阿里云百炼文档](https://help.aliyun.com/zh/dashscope/)

---

## 更新日志

- **2025-12-12**: 初始部署文档创建
- 配置完成：阿里云百炼 API 和 Cloudflare R2

---

**祝部署顺利！** 🎉

