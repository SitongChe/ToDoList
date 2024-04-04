const sql = require('mssql');

const config = {
  user: '你的用户名',
  password: '你的密码',
  database: '你的数据库名',
  server: '你的服务器地址',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: true, // 对于 Azure 必须启用加密
    trustServerCertificate: false // 对于自签名证书设为 true
  }
};

// 添加一个新的 ToDo 项
app.post('/todos', async (req, res) => {
  try {
    await sql.connect(config);
    const { text } = req.body;
    await sql.query`INSERT INTO ToDoItems (Text) VALUES (${text})`;
    res.status(201).send({ message: 'ToDo item added' });
  } catch (err) {
    console.error('数据库操作出错：', err);
    res.status(500).send({ message: 'Internal server error' });
  }
});

// 获取所有 ToDo 项
app.get('/todos', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query`SELECT * FROM ToDoItems`;
    res.status(200).json(result.recordset);
  } catch (err) {
    console.error('数据库操作出错：', err);
    res.status(500).send({ message: 'Internal server error' });
  }
});
