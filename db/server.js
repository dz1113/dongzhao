// db/server.js  ——  基于 Express 的简易数据服务器
// 端口号：3004
// 启动方式：cd db → node server.js

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3004;

// 读取 db.json 文件并返回其中的 poems 数组
app.get('/api/poems', (req, res) => {
  const dbPath = path.join(__dirname, 'db.json');
  fs.readFile(dbPath, 'utf-8', (err, data) => {
    if (err) {
      res.status(500).json({ error: '读取 db.json 失败', detail: err.message });
      return;
    }
    try {
      const json = JSON.parse(data);
      res.json(json.poems || []);
    } catch (e) {
      res.status(500).json({ error: 'db.json 格式错误', detail: e.message });
    }
  });
});

// 根路由：说明接口用法
app.get('/', (req, res) => {
  res.send(`
    <h2>📜 古诗词数据服务器</h2>
    <p>端口：${PORT}</p>
    <p>接口：<a href="/api/poems">/api/poems</a></p>
  `);
});

app.listen(PORT, () => {
  console.log(`✅ 数据服务器已启动：http://localhost:${PORT}`);
  console.log(`📜 诗词接口：http://localhost:${PORT}/api/poems`);
});
