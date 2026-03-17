const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// 前端界面
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI创作工坊</title>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
body { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
.container { max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
.card { background: white; border-radius: 20px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
h1 { text-align: center; color: white; margin-bottom: 30px; font-size: 2.5rem; }
h2 { color: #333; margin-bottom: 20px; font-size: 1.5rem; }
.input-group { margin-bottom: 20px; }
label { display: block; margin-bottom: 8px; color: #666; font-weight: 500; }
input, textarea { width: 100%; padding: 12px 16px; border: 1px solid #ddd; border-radius: 10px; font-size: 16px; resize: vertical; min-height: 80px; }
.upload-area { border: 2px dashed #ddd; border-radius: 10px; padding: 30px; text-align: center; cursor: pointer; transition: all 0.3s; }
.upload-area:hover { border-color: #667eea; background: #f8f9ff; }
.upload-area input { display: none; }
.preview { max-width: 100%; max-height: 200px; border-radius: 10px; margin-top: 15px; display: none; }
.btn { background: #667eea; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-size: 16px; cursor: pointer; transition: all 0.3s; font-weight: 500; }
.btn:hover { background: #5a67d8; transform: translateY(-2px); }
.result { margin-top: 20px; text-align: center; }
.result img, .result video { max-width: 100%; border-radius: 10px; margin-top: 10px; }
.loading { display: none; color: #667eea; font-weight: 500; margin-top: 10px; }
@media (max-width: 768px) {
  .container { grid-template-columns: 1fr; }
  h1 { font-size: 2rem; }
}
</style>
</head>
<body>
<h1>🎨 AI创作工坊</h1>
<div class="container">
  <!-- 图片生成模块 -->
  <div class="card">
    <h2>🖼️ 图片生成 (Nano bonano同款)</h2>
    <div class="input-group">
      <label for="img-prompt">描述词</label>
      <textarea id="img-prompt" placeholder="例如：可爱的小女孩，古风汉服，3D卡通风格，高清细腻"></textarea>
    </div>
    <div class="input-group">
      <label>参考图片（可选）</label>
      <div class="upload-area" onclick="document.getElementById('img-upload').click()">
        📸 点击上传参考图片
        <input type="file" id="img-upload" accept="image/*" onchange="previewImage(this, 'img-preview')">
      </div>
      <img id="img-preview" class="preview">
    </div>
    <button class="btn" onclick="generateImage()">生成图片</button>
    <div class="result" id="img-result">
      <div class="loading" id="img-loading">生成中...</div>
    </div>
  </div>

  <!-- 视频生成模块 -->
  <div class="card">
    <h2>🎥 视频生成 (可灵同款)</h2>
    <div class="input-group">
      <label for="video-prompt">视频描述</label>
      <textarea id="video-prompt" placeholder="例如：一只小猫在草地上玩耍，阳光明媚，温馨治愈，10秒短视频"></textarea>
    </div>
    <div class="input-group">
      <label>参考图片（可选）</label>
      <div class="upload-area" onclick="document.getElementById('video-upload').click()">
        📸 点击上传参考图片
        <input type="file" id="video-upload" accept="image/*" onchange="previewImage(this, 'video-preview')">
      </div>
      <img id="video-preview" class="preview">
    </div>
    <button class="btn" onclick="generateVideo()">生成视频</button>
    <div class="result" id="video-result">
      <div class="loading" id="video-loading">生成中...</div>
    </div>
  </div>
</div>

<script>
function previewImage(input, previewId) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = e => {
      const preview = document.getElementById(previewId);
      preview.src = e.target.result;
      preview.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
}

async function generateImage() {
  const prompt = document.getElementById('img-prompt').value;
  const fileInput = document.getElementById('img-upload');
  const resultDiv = document.getElementById('img-result');
  const loadingDiv = document.getElementById('img-loading');

  if (!prompt.trim()) {
    alert('请输入描述词');
    return;
  }

  loadingDiv.style.display = 'block';
  resultDiv.innerHTML = '';

  try {
    const formData = new FormData();
    formData.append('prompt', prompt);
    if (fileInput.files[0]) {
      formData.append('image', fileInput.files[0]);
    }

    const response = await fetch('/api/generate-image', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    loadingDiv.style.display = 'none';
    
    if (data.url) {
      resultDiv.innerHTML = '<img src="' + data.url + '" alt="生成的图片">';
    } else {
      resultDiv.innerHTML = '<p style="color: red;">生成失败，请稍后重试</p>';
    }
  } catch (error) {
    loadingDiv.style.display = 'none';
    resultDiv.innerHTML = '<p style="color: red;">生成失败：' + error.message + '</p>';
  }
}

async function generateVideo() {
  const prompt = document.getElementById('video-prompt').value;
  const fileInput = document.getElementById('video-upload');
  const resultDiv = document.getElementById('video-result');
  const loadingDiv = document.getElementById('video-loading');

  if (!prompt.trim()) {
    alert('请输入视频描述');
    return;
  }

  loadingDiv.style.display = 'block';
  resultDiv.innerHTML = '';

  try {
    const formData = new FormData();
    formData.append('prompt', prompt);
    if (fileInput.files[0]) {
      formData.append('image', fileInput.files[0]);
    }

    const response = await fetch('/api/generate-video', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    loadingDiv.style.display = 'none';
    
    if (data.url) {
      resultDiv.innerHTML = '<video controls autoplay muted src="' + data.url + '"></video>';
    } else {
      resultDiv.innerHTML = '<p style="color: red;">生成失败，请稍后重试</p>';
    }
  } catch (error) {
    loadingDiv.style.display = 'none';
    resultDiv.innerHTML = '<p style="color: red;">生成失败：' + error.message + '</p>';
  }
}
</script>
</body>
</html>
  `);
});

// 图片生成接口（模拟Nano bonano功能）
app.post('/api/generate-image', upload.single('image'), async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const hasImage = req.file;

    // 这里使用Pollinations的免费AI绘图接口，你可以替换为Nano bonano的官方接口
    let imageUrl;
    if (hasImage) {
      // 图生图：将图片转换为Base64传递给接口
      const base64Image = req.file.buffer.toString('base64');
      imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?image=${base64Image}&width=1024&height=1024`;
    } else {
      // 文生图
      imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024`;
    }

    // 如果你有Nano bonano的API密钥，可以替换为下面的官方接口调用：
    /*
    const response = await fetch('https://api.nanobonano.com/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_NANO_BONANO_API_KEY'
      },
      body: JSON.stringify({
        prompt: prompt,
        size: '1024x1024',
        ...(hasImage && { image: req.file.buffer.toString('base64') })
      })
    });
    const data = await response.json();
    imageUrl = data.image_url;
    */

    res.json({ url: imageUrl });
  } catch (error) {
    console.error('图片生成失败:', error);
    res.status(500).json({ error: '图片生成失败' });
  }
});

// 视频生成接口（模拟可灵功能）
app.post('/api/generate-video', upload.single('image'), async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const hasImage = req.file;

    // 这里使用示例视频，你可以替换为可灵的官方接口
    let videoUrl = 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4';

    // 如果你有可灵的API密钥，可以替换为下面的官方接口调用：
    /*
    const response = await fetch('https://api.keling.ai/v1/generate-video', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_KELING_API_KEY'
      },
      body: JSON.stringify({
        prompt: prompt,
        duration: 10,
        ...(hasImage && { image: req.file.buffer.toString('base64') })
      })
    });
    const data = await response.json();
    videoUrl = data.video_url;
    */

    res.json({ url: videoUrl });
  } catch (error) {
    console.error('视频生成失败:', error);
    res.status(500).json({ error: '视频生成失败' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ AI创作工坊已启动，端口：${PORT}`);
});
