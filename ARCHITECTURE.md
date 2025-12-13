# 🏗️ 系统架构文档

## 概览

这是一个基于 Next.js 14 的全栈 Web 应用，实现了照片转卡通风格的功能。采用了 App Router、TypeScript、Tailwind CSS 等现代技术栈。

## 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                         用户界面                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐    │
│  │拍照组件  │  │上传组件  │  │预览组件  │  │结果组件  │    │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘    │
└──────────────────────────┬──────────────────────────────────┘
                           │ fetch API
┌──────────────────────────▼──────────────────────────────────┐
│                      Next.js API Routes                      │
│  ┌──────────────────────┐  ┌──────────────────────────┐    │
│  │   /api/upload        │  │   /api/generate          │    │
│  │  - 接收 Base64       │  │  - 接收图片 URL          │    │
│  │  - 上传到 R2         │  │  - 调用阿里云 API        │    │
│  │  - 返回 URL          │  │  - 轮询获取结果          │    │
│  └──────────┬───────────┘  │  - 转存到 R2             │    │
│             │              └───────────┬──────────────┘    │
└─────────────┼──────────────────────────┼───────────────────┘
              │                          │
         ┌────▼────┐              ┌──────▼──────┐
         │         │              │             │
         │   R2    │◄─────────────│  阿里云 API  │
         │  Storage│              │   百炼/万相   │
         │         │              │             │
         └─────────┘              └─────────────┘
```

## 技术栈详解

### 前端

- **Next.js 14+**: React 框架，使用 App Router
- **TypeScript**: 类型安全
- **Tailwind CSS**: 实用优先的 CSS 框架
- **react-webcam**: 摄像头访问
- **qrcode.react**: 二维码生成
- **lucide-react**: 图标库

### 后端

- **Next.js API Routes**: 无服务器 API 端点
- **AWS SDK**: S3 兼容协议访问 R2
- **阿里云 DashScope API**: AI 图像生成

### 云服务

- **Cloudflare R2**: 对象存储（S3 兼容）
- **阿里云百炼**: AI 图像生成服务

## 核心模块

### 1. 前端组件 (`/src/components`)

#### CameraCapture.tsx
```typescript
功能: 摄像头拍照
特性:
  - 调用设备摄像头
  - 前后摄像头切换
  - 实时预览
  - 拍照并返回 Base64
技术:
  - react-webcam
  - getUserMedia API
```

#### ImageUploader.tsx
```typescript
功能: 本地图片上传
特性:
  - 文件选择
  - 文件验证（类型、大小）
  - 转换为 Base64
技术:
  - FileReader API
  - 拖放上传（可扩展）
```

#### ImagePreview.tsx
```typescript
功能: 图片预览和确认
特性:
  - 显示原始图片
  - 生成按钮
  - 加载状态
  - 取消功能
```

#### ResultDisplay.tsx
```typescript
功能: 结果展示
特性:
  - 显示生成的卡通图
  - 二维码生成
  - 下载功能
  - 重新开始
技术:
  - qrcode.react
  - Blob API (下载)
```

### 2. API 路由 (`/src/app/api`)

#### /api/upload
```typescript
请求: POST
输入: { image: string } // Base64
处理流程:
  1. 解析 Base64
  2. 转换为 Buffer
  3. 生成唯一文件名
  4. 上传到 R2
  5. 返回公开 URL
输出: { success: boolean, url: string, key: string }
```

#### /api/generate
```typescript
请求: POST
输入: { imageUrl: string }
处理流程:
  1. 调用阿里云 API
  2. 异步任务轮询
  3. 获取生成结果 URL
  4. 下载生成的图片
  5. 转存到 R2
  6. 返回最终 URL
输出: { success: boolean, imageUrl: string }
超时: 60秒
```

### 3. 工具库 (`/src/lib`)

#### r2-client.ts
```typescript
功能: R2 存储操作
主要函数:
  - uploadToR2(): 上传文件
  - getPresignedDownloadUrl(): 生成预签名 URL
  - generateUniqueKey(): 生成唯一文件名
技术:
  - @aws-sdk/client-s3
  - S3 兼容协议
```

#### ali-client.ts
```typescript
功能: 阿里云 API 调用
主要函数:
  - generateCartoonImage(): 生成卡通图
  - pollTaskResult(): 轮询任务状态
  - fetchAndConvertToBuffer(): 下载并转换图片
技术:
  - DashScope API
  - 异步任务处理
  - 轮询机制
```

#### utils.ts
```typescript
功能: 通用工具函数
主要函数:
  - base64ToBuffer(): Base64 转 Buffer
  - getFileExtensionFromBase64(): 获取文件扩展名
  - validateImageFile(): 验证文件
  - fileToBase64(): 文件转 Base64
```

## 数据流

### 1. 上传流程

```
用户选择图片
    ↓
转换为 Base64
    ↓
POST /api/upload
    ↓
r2Client.uploadToR2()
    ↓
返回 R2 URL
```

### 2. 生成流程

```
用户点击生成
    ↓
POST /api/generate (携带原图 URL)
    ↓
aliClient.generateCartoonImage()
    ↓
调用阿里云 API (异步)
    ↓
轮询任务状态 (最多 30 次，每 2 秒)
    ↓
获取生成结果 URL
    ↓
下载图片并转换为 Buffer
    ↓
上传到 R2
    ↓
返回最终 URL
    ↓
显示结果 + 二维码
```

## 安全设计

### 1. 密钥保护
- 所有 API 密钥仅存储在服务端环境变量
- 前端无法访问敏感信息
- 使用 API Routes 作为代理层

### 2. 输入验证
- 文件类型验证（仅允许图片）
- 文件大小限制（最大 10MB）
- Base64 格式验证

### 3. 错误处理
- try-catch 包裹所有异步操作
- 友好的错误提示
- 详细的服务端日志

### 4. 访问控制
- R2 使用公开访问或预签名 URL
- 可扩展：添加用户认证
- 可扩展：添加请求频率限制

## 性能优化

### 1. 图片处理
- 客户端压缩（可扩展）
- 懒加载组件
- 图片格式优化（WebP）

### 2. API 调用
- 异步处理，避免阻塞
- 轮询间隔优化（2 秒）
- 超时机制（60 秒）

### 3. 缓存策略
- R2 公开 URL 可缓存
- Next.js 静态资源优化
- 可扩展：CDN 加速

### 4. 代码分割
- 动态导入 CameraCapture（SSR 禁用）
- Next.js 自动代码分割
- 按需加载依赖

## 可扩展性

### 1. 功能扩展
- [ ] 多种卡通风格选择
- [ ] 图片编辑功能（裁剪、滤镜）
- [ ] 批量处理
- [ ] 历史记录
- [ ] 用户账户系统

### 2. 性能扩展
- [ ] 图片压缩
- [ ] CDN 集成
- [ ] 数据库集成（记录、统计）
- [ ] 队列系统（大量请求）

### 3. 部署扩展
- [ ] 多区域部署
- [ ] 负载均衡
- [ ] 监控和日志系统
- [ ] 自动扩展

## 监控和调试

### 开发模式日志

```bash
npm run dev
```

关键日志点：
- `调用阿里云 API 生成卡通图片...`
- `下载生成的图片...`
- `上传到 R2...`
- 错误堆栈跟踪

### 生产监控建议

1. **错误追踪**: Sentry、LogRocket
2. **性能监控**: Vercel Analytics、Google Analytics
3. **API 监控**: 阿里云控制台、Cloudflare Analytics
4. **成本监控**: R2 使用量、API 调用量

## 成本估算

### Cloudflare R2
- 存储: $0.015/GB/月
- 请求: 
  - 写入: $4.50/百万次
  - 读取: 免费
- 出站流量: 免费

### 阿里云百炼
- 按调用次数计费
- 不同模型价格不同
- 建议查看[官方定价](https://dashscope.console.aliyun.com/)

### 估算（1000 用户/月）
- R2 存储（每图 2MB）: ~$0.03
- R2 请求: ~$0.01
- 阿里云 API: ~$10-50（取决于模型）
- 总计: **~$10-50/月**

## 故障排查

### 常见问题诊断

1. **上传失败**
   - 检查 R2 凭证
   - 检查网络连接
   - 查看服务端日志

2. **生成失败**
   - 检查阿里云 API Key
   - 确认 API 额度
   - 查看阿里云控制台日志

3. **轮询超时**
   - 增加 maxAttempts
   - 检查网络延迟
   - 联系阿里云支持

4. **二维码无法访问**
   - 检查 R2 公开访问配置
   - 验证 R2_PUBLIC_URL
   - 测试 URL 可访问性

## 最佳实践

1. **环境变量管理**
   - 使用 `.env.local` 本地开发
   - 生产环境使用平台环境变量
   - 定期轮换密钥

2. **错误处理**
   - 始终使用 try-catch
   - 提供用户友好的错误信息
   - 记录详细的错误日志

3. **代码组织**
   - 组件单一职责
   - 工具函数复用
   - 类型定义集中管理

4. **测试**
   - 单元测试（工具函数）
   - 集成测试（API 路由）
   - E2E 测试（用户流程）

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License - 查看 LICENSE 文件了解详情
