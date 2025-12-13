# 📦 存储服务配置指南

本项目支持多种存储服务，可根据需要选择最适合的存储提供商。

## 🎯 支持的存储服务

- **Cloudflare R2** - 全球 CDN，适合海外访问
- **阿里云 OSS** - 国内访问速度快，适合国内用户
- **七牛云** - 国内 CDN 加速，适合国内用户
- **腾讯云 COS** - 国内访问速度快，适合国内用户

## ⚙️ 配置方法

### 1. 选择存储提供商

在 `.env.local` 文件中设置 `STORAGE_PROVIDER` 环境变量：

```env
STORAGE_PROVIDER=r2        # 使用 Cloudflare R2
STORAGE_PROVIDER=alioss    # 使用阿里云 OSS
STORAGE_PROVIDER=qiniu     # 使用七牛云
STORAGE_PROVIDER=tencent   # 使用腾讯云 COS
```

### 2. Cloudflare R2 配置

```env
STORAGE_PROVIDER=r2

R2_ACCOUNT_ID=your-r2-account-id
R2_ACCESS_KEY_ID=your-r2-access-key-id
R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
R2_BUCKET_NAME=your-bucket-name
R2_PUBLIC_URL=https://your-public-url.r2.dev
```

**优点**：
- 全球 CDN 加速
- 价格便宜
- S3 兼容 API

**缺点**：
- 国内访问可能较慢

### 3. 阿里云 OSS 配置

```env
STORAGE_PROVIDER=alioss

ALI_OSS_REGION=oss-cn-hangzhou
ALI_OSS_ACCESS_KEY_ID=your-access-key-id
ALI_OSS_ACCESS_KEY_SECRET=your-access-key-secret
ALI_OSS_BUCKET=your-bucket-name
```

**区域选择**：
- `oss-cn-hangzhou` - 华东1（杭州）
- `oss-cn-shanghai` - 华东2（上海）
- `oss-cn-beijing` - 华北2（北京）
- `oss-cn-shenzhen` - 华南1（深圳）
- `oss-cn-guangzhou` - 华南2（广州）

**优点**：
- 国内访问速度快
- 与阿里云百炼 API 同源，访问更稳定
- 价格合理

**缺点**：
- 海外访问可能较慢

### 4. 七牛云配置

```env
STORAGE_PROVIDER=qiniu

QINIU_ACCESS_KEY=your-access-key
QINIU_SECRET_KEY=your-secret-key
QINIU_BUCKET=your-bucket-name
QINIU_DOMAIN=https://your-domain.com
```

**配置说明**：
- `QINIU_DOMAIN` 需要配置为你的七牛云绑定的自定义域名或默认域名
- 确保域名已配置 CDN 加速

**优点**：
- 国内 CDN 加速
- 价格便宜
- 访问速度快

**缺点**：
- 需要配置自定义域名

### 5. 腾讯云 COS 配置

```env
STORAGE_PROVIDER=tencent

TENCENT_COS_SECRET_ID=your-secret-id
TENCENT_COS_SECRET_KEY=your-secret-key
TENCENT_COS_REGION=ap-guangzhou
TENCENT_COS_BUCKET=your-bucket-name
TENCENT_COS_DOMAIN=https://your-domain.com
```

**区域选择**：
- `ap-guangzhou` - 广州
- `ap-shanghai` - 上海
- `ap-beijing` - 北京
- `ap-chengdu` - 成都

**配置说明**：
- `TENCENT_COS_DOMAIN` 可选，如果不配置，将使用默认域名
- 建议配置自定义域名以获得更好的访问体验

**优点**：
- 国内访问速度快
- 价格合理
- 与腾讯云服务集成好

**缺点**：
- 海外访问可能较慢

## 🔧 存储桶配置要求

### 公开访问设置

所有存储服务都需要配置公开读取权限：

1. **Cloudflare R2**
   - 在 R2 Dashboard 中配置公开访问
   - 设置 CORS 规则允许所有来源

2. **阿里云 OSS**
   - 在 OSS 控制台设置存储桶为公共读
   - 配置 CORS 规则

3. **七牛云**
   - 在空间设置中开启公开访问
   - 配置 CORS 规则

4. **腾讯云 COS**
   - 在存储桶设置中开启公共读权限
   - 配置 CORS 规则

### CORS 配置示例

```json
{
  "AllowedOrigins": ["*"],
  "AllowedMethods": ["GET", "HEAD"],
  "AllowedHeaders": ["*"],
  "ExposeHeaders": ["ETag"],
  "MaxAgeSeconds": 3600
}
```

## 📊 存储服务对比

| 特性 | R2 | 阿里云 OSS | 七牛云 | 腾讯云 COS |
|------|----|-----------|--------|-----------|
| 国内访问速度 | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 海外访问速度 | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐ | ⭐⭐ |
| 价格 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| 配置复杂度 | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 与阿里云集成 | ❌ | ✅ | ❌ | ❌ |

## 💡 推荐方案

### 国内用户为主
推荐使用 **阿里云 OSS** 或 **七牛云**，访问速度快，价格合理。

### 全球用户
推荐使用 **Cloudflare R2**，全球 CDN 加速。

### 混合方案
可以配置多个存储服务，根据用户地理位置动态选择（需要额外开发）。

## 🔍 验证配置

配置完成后，重启开发服务器并测试上传功能：

```bash
npm run dev
```

如果配置正确，上传的图片应该能够正常访问。

## ❓ 常见问题

### Q: 如何切换存储服务？
A: 只需修改 `.env.local` 中的 `STORAGE_PROVIDER` 值，并配置对应的环境变量即可。

### Q: 可以同时使用多个存储服务吗？
A: 当前版本只支持单一存储服务。如需多存储支持，需要额外开发。

### Q: 存储服务切换后，之前的图片会丢失吗？
A: 不会。切换存储服务只是改变新上传图片的存储位置，已上传的图片仍然保留在原存储服务中。

### Q: 如何迁移图片到新的存储服务？
A: 需要编写迁移脚本，从旧存储服务下载图片并上传到新存储服务。

---

**配置完成后，记得重启开发服务器！** 🚀

