const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());

const cors = require('cors');
app.use(cors());

// 配置DynamoDB
AWS.config.update({
  region: "us-east-2",
});
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.post('/todos', (req, res) => {
  const { id, text, completed } = req.body;

  const params = {
    TableName: "Tasks",
    Item: {
      "id": id,
      "text": text,
      "completed": completed,
      "CreatedDTime": new Date().toISOString(),
    }
  };

  dynamoDb.put(params, (err, data) => {
    if (err) {
      console.log("Error", err);
      res.status(500).send("Error saving the todo");
    } else {
      console.log("Success", data);
      console.log("Successfully inserted item:", params.Item);
      res.status(200).send("ToDo saved");
    }
  });
});

app.listen(3000, () => console.log('Server is running on port 3000'));
