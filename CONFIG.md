# ⚙️ 配置文件设置指南

本文档说明如何配置项目的环境变量。

## 📝 环境变量配置

### 步骤 1: 创建 `.env.local` 文件

在项目根目录创建 `.env.local` 文件（如果不存在）。

### 步骤 2: 复制以下配置

将以下内容复制到 `.env.local` 文件中：

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

### 步骤 3: 验证配置

确保文件格式正确：
- 每行一个变量
- 变量名和值之间用 `=` 连接
- 值不需要引号（除非值中包含空格）
- 不要有多余的空格

### 步骤 4: 重启开发服务器

如果开发服务器正在运行，需要重启以加载新的环境变量：

```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

## 🔍 配置说明

### 阿里云百炼配置

| 变量名 | 说明 | 当前值 |
|--------|------|--------|
| `ALI_API_KEY` | 阿里云百炼 API Key | `sk-c27361038bbd4d8e98064916eff5157d` |
| `ALI_API_URL` | API 端点地址 | `https://dashscope.aliyuncs.com/api/v1/services/aigc/image2image/generation` |
| `ALI_MODEL` | 使用的模型 | `wanx-style-repaint-v1` |

### 存储服务配置

项目支持多种存储服务，通过 `STORAGE_PROVIDER` 环境变量选择：

- `r2` - Cloudflare R2（默认）
- `alioss` - 阿里云 OSS
- `qiniu` - 七牛云
- `tencent` - 腾讯云 COS

**详细配置说明请查看 [存储服务配置指南](./STORAGE_CONFIG.md)**

#### Cloudflare R2 配置（默认）

| 变量名 | 说明 | 当前值 |
|--------|------|--------|
| `STORAGE_PROVIDER` | 存储提供商 | `r2` |
| `R2_ACCOUNT_ID` | R2 账户 ID | `56dda3bd89d39733f0810ec557ff72a5` |
| `R2_ACCESS_KEY_ID` | 访问密钥 ID | `2ab4416c360022d07425d5022a30a243` |
| `R2_SECRET_ACCESS_KEY` | 秘密访问密钥 | `2eef3112af1a3e5cf3114be3de3231e05222e4b796107b0c5d0a4ca789c652cf` |
| `R2_BUCKET_NAME` | 存储桶名称 | `imagetemp` |
| `R2_PUBLIC_URL` | 公开访问 URL | `https://pub-0ee12a39b61943e89473bd5682d08f7b.r2.dev` |

**注意**：如果国内用户无法访问 R2，建议切换到阿里云 OSS、七牛云或腾讯云 COS。

## ✅ 验证配置

### 方法 1: 检查环境变量是否加载

在代码中临时添加（仅用于测试）：

```typescript
// 在 src/app/api/upload/route.ts 或 generate/route.ts 中
console.log('R2_ACCOUNT_ID:', process.env.R2_ACCOUNT_ID ? '已设置' : '未设置')
console.log('ALI_API_KEY:', process.env.ALI_API_KEY ? '已设置' : '未设置')
```

### 方法 2: 运行测试

1. 启动开发服务器：`npm run dev`
2. 访问应用并尝试上传图片
3. 检查控制台是否有错误

## 🔒 安全注意事项

1. ✅ **`.env.local` 已在 `.gitignore` 中**
   - 该文件不会被提交到 Git 仓库
   - 可以安全地包含敏感信息

2. ⚠️ **不要分享 `.env.local` 文件**
   - 包含敏感的 API 密钥
   - 不要通过邮件、聊天工具等分享

3. ✅ **生产环境使用平台环境变量**
   - Vercel/Netlify 等平台提供安全的环境变量管理
   - 参考 `DEPLOYMENT.md` 了解如何配置

## 🆘 常见问题

### Q: 环境变量未生效？

**A:** 检查以下几点：
1. 文件是否命名为 `.env.local`（注意前面的点）
2. 文件是否在项目根目录
3. 是否重启了开发服务器
4. 变量名是否正确（区分大小写）

### Q: 如何更新配置？

**A:** 
1. 编辑 `.env.local` 文件
2. 保存文件
3. 重启开发服务器

### Q: 可以创建多个环境文件吗？

**A:** 可以，Next.js 支持：
- `.env` - 所有环境
- `.env.local` - 本地覆盖（优先级最高，已加入 .gitignore）
- `.env.development` - 开发环境
- `.env.production` - 生产环境

## 📚 相关文档

- [Next.js 环境变量文档](https://nextjs.org/docs/basic-features/environment-variables)
- [部署文档](./DEPLOYMENT.md)
- [项目 README](./README.md)

---

**配置完成后，可以开始使用应用了！** 🎉

