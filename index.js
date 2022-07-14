const crypto = require("crypto");

const requestExample = {
  encoded:
    "Pe7qFBgnOWQOVsiI9PG9h9h3kS6D3kV5b9uAM+E7+ac48nK9LyXK6N4CwAEFw20nvQhbrjMqHOF4aJPhkihwbJxVnfegHNc8qYJa/nfEu4XQdSR1lJYhnN6glhyih5onsBsAI6MFxh07xC/NJMoCKyoCDP1utAKQTGr1mjKtjch2ovshYza3v3PD06TdAjIOoc7oPB7c86uKM3uZP65wjofU2jqdLZO1BRFC/kb10IKmT9lFFd0LNK/m03JyNE64AJkCjMp9I4/jaR5AWcAqwC5P7LMRVQiQ84BSzvXj+IFCd71ZGM9qRYsOWcSPhM0hv+18JdTOF8ZrFkoa0pCzXG65v1BHYFKq2thdltHn4UUm8qmmiV5qxSjJAAQDl536OLojGpYRB1TQ",
  iv: "EuThRs6pAsTq3e2C",
  tag: "Q7RbbOIcJWr6m1lhcfcM0g==",
  secret: "OcMtPtCI2Dgs3saUGqGOIrKJvydBxp/5E6C/58dGtao=",
};

try {
  const encoded = Buffer.from(requestExample.encoded, "base64").toString("hex");

  const iv = Buffer.from(requestExample.iv, "base64").toString("hex");

  const authTag = Buffer.from(requestExample.tag, "base64").toString("hex");

  const secret = Buffer.from(requestExample.secret, "base64").toString("hex");

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    Buffer.from(secret, "hex"),
    Buffer.from(iv, "hex")
  );

  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  let decrypted = decipher.update(encoded, "hex", "utf8");

  decrypted = `${decrypted}${decipher.final("utf8")}`;

  console.log({ DecyptedMessage: JSON.parse(decrypted) });
} catch (error) {
  console.log(error);
}
