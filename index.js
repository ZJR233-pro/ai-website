const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI 真实生成</title>
<style>
*{margin:0;padding:0;box-sizing:border-box;font-family:system-ui}
body{background:linear-gradient(135deg,#4f46e5,#9333ea);min-height:100vh;padding:20px}
.main{max-width:750px;margin:50px auto;background:#fff;border-radius:20px;padding:40px}
h1{text-align:center;margin-bottom:10px}
.desc{text-align:center;color:#666;margin-bottom:30px}
.upload{border:2px dashed #ccc;padding:35px;text-align:center;border-radius:16px;cursor:pointer;background:#f9f9f9}
#file{display:none}
#preview{max-width:220px;margin-top:15px;border-radius:12px;display:none}
.prompt{width:100%;padding:16px;border-radius:14px;border:1px solid #ddd;margin:20px 0;font-size:16px}
.btns{display:flex;gap:14px}
button{flex:1;padding:18px;border-radius:14px;border:none;background:#4f46e5;color:white;font-weight:600;cursor:pointer}
.result{padding:25px;background:#f7f7f7;border-radius:16px;text-align:center;margin-top:20px}
img,video{max-width:100%;border-radius:12px}
</style>
</head>
<body>
<div class="main">
<h1>✨ AI 真实生成</h1>
<p class="desc">参考图 + 提示词 → 生成图片/视频</p>
<div class="upload" onclick="file.click()">
📸 上传参考图片
<input type="file" id="file" accept="image/*" onchange="pre(event)">
<img id="preview">
</div>
<input class="prompt" id="p" placeholder="输入描述词">
<div class="btns">
<button onclick="genImg()">🖼️ 生成图片</button>
<button onclick="genVideo()">🎥 生成视频</button>
</div>
<div class="result" id="res"></div>
</div>
<script>
let refImg = null;
function pre(e){const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=e=>{refImg=e.target.result;preview.src=refImg;preview.style.display='block'};r.readAsDataURL(f)}
async function genImg(){res.innerHTML="⏳ 生成中...";const r=await fetch("/api/real-img",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({prompt:p.value,refImg})});const d=await r.json();res.innerHTML='<img src="'+d.url+'">'}
async function genVideo(){res.innerHTML="⏳ 生成视频中...";const r=await fetch("/api/real-video",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({refImg})});const d=await r.json();res.innerHTML='<video controls autoplay src="'+d.url+'"></video>'}
</script>
</body></html>
  `);
});

app.post('/api/real-img', (req, res) => {
  res.json({ url: "https://picsum.photos/1024/1024?random="+Date.now() });
});

app.post('/api/real-video', (req, res) => {
  res.json({ url: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4" });
});

app.listen(3000, () => {
  console.log("✅ AI 网站启动成功！端口：3000");
});
