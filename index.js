const express = require("express");
const app = express();
const port = 3000;
const crypto = require("crypto");
const bodyParser = require("express");

app.use(bodyParser.text({ type: "*/*" }));

app.listen(port, () => {
  console.info("- App listening at port: ", port);
});

app.post("/hook", (req, res) => {
  try {
    const encodedMessage = req.body;
    const authenticationTag = req.headers["x-authentication-tag"];
    const initializationVector = req.headers["x-initialization-vector"];
    const secretKey = req.headers["secret-key"];

    const encoded = Buffer.from(encodedMessage, "base64").toString("hex");
    const authTag = Buffer.from(authenticationTag, "base64").toString("hex");
    const iv = Buffer.from(initializationVector, "base64").toString("hex");
    const secret = Buffer.from(secretKey, "base64").toString("hex");

    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      Buffer.from(secret, "hex"),
      Buffer.from(iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(authTag, "hex"));

    let decrypted = decipher.update(encoded, "hex", "utf8");

    decrypted = `${decrypted}${decipher.final("utf8")}`;

    res.status(200);
    res.send(JSON.parse(decrypted));
  } catch (error) {
    res.status(400);
    res.send(error);
  }
});
