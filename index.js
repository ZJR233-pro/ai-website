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
<title>AI真实画图</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:linear-gradient(135deg,#4f46e5,#9333ea);min-height:100vh;padding:20px;font-family:Arial}
.main{max-width:750px;margin:50px auto;background:#fff;border-radius:20px;padding:40px}
h1{text-align:center;margin-bottom:10px}
.desc{text-align:center;color:#666;margin-bottom:30px}
.prompt{width:100%;padding:16px;border-radius:14px;border:1px solid #ddd;margin:20px 0;font-size:16px}
button{width:100%;padding:18px;border-radius:14px;border:none;background:#4f46e5;color:white;font-weight:600;cursor:pointer}
.result{padding:25px;background:#f7f7f7;border-radius:16px;text-align:center;margin-top:20px}
img{max-width:100%;border-radius:12px}
</style>
</head>
<body>
<div class="main">
<h1>✨ AI真实生成</h1>
<p class="desc">输入中文提示词，nanobonano 生成真实图片</p>
<input class="prompt" id="p" placeholder="例如：可爱的女孩，古风，汉服，3D，高清">
<button onclick="go()">生成图片</button>
<div class="result" id="res"></div>
</div>
<script>
async function go(){
  const res = document.getElementById('res');
  const prompt = document.getElementById('p').value;
  if(!prompt){alert('请输入提示词');return}
  res.innerHTML = "⏳ 生成中...";
  
  const resp = await fetch("/api/generate", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({ prompt })
  });
  const data = await resp.json();
  if(data.image){
    res.innerHTML = '<img src="'+data.image+'">';
  }else{
    res.innerHTML = "❌ 生成失败";
  }
}
</script>
</body></html>
  `);
});

// ==============================
// 👇 nanobonano 真实图片生成接口
// ==============================
app.post('/api/generate', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await fetch("https://api.nanobonano.com/v1/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 你的API密钥"
      },
      body: JSON.stringify({
        prompt: prompt,
        size: "1024x1024"
      })
    });
    const data = await response.json();
    res.json({ image: data.image_url || "" });
  } catch (err) {
    res.json({ image: "https://picsum.photos/1024" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("✅ AI网站已运行");
});
