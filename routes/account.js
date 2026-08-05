const express = require("express");
const {decryptMessage} = require("../public/crypto")
const router = express.Router();
const db = require("../db");
const { page } = require("../views");

router.get("/account", (req, res) => {
  if (!req.cookies.username) {
    return res.redirect("/");
  }

  const me = db
    .prepare("SELECT * FROM accounts WHERE username = ?")
    .get(req.cookies.username);

  if (!me) {
    res.clearCookie("username");
    return res.redirect("/");
  }

  const messageBlock = me.message
    ? `
      <div class="message-box">
        💬 <strong>${me.display_name}'s message:</strong><br>
        🔒 Message locked
      </div>

      <form method="POST" action="/account">
        <input
          type="password"
          name="password"
          placeholder="Enter message password"
          required
        >

        <button type="submit" class="btn btn-green">
          🔓 Unlock
        </button>
      </form>
    `
    : `<div class="message-box empty">💬 No message set yet.</div>`;

  res.send(page("My Page", `
    <h1>👋 Hi, ${me.display_name}!</h1>

    ${messageBlock}

    <div class="button-row">
      <a href="/set-message" class="btn btn-yellow">
        ✏️ Set My Message
      </a>

      <a href="/change-password" class="btn btn-green">
        🔑 Change Password
      </a>
    </div>

    <a href="/logout" class="btn btn-pink"
       style="margin-top: 14px; display:inline-block;">
      Log Out
    </a>
  `));
});

router.post("/account", async (req, res) => {
  if (!req.cookies.username) {
    return res.redirect("/");
  }

  const me = db
    .prepare("SELECT * FROM accounts WHERE username = ?")
    .get(req.cookies.username);

  if (!me || !me.message) {
    return res.redirect("/account");
  }

  try {
    const decryptedMessage = await decryptMessage(
      me.message,
      req.body.password
    );

    res.send(page("My Page", `
      <h1>👋 Hi, ${me.display_name}!</h1>

      <div class="message-box">
        💬 <strong>${me.display_name}'s message:</strong><br>
        ${decryptedMessage}
      </div>

      <div class="button-row">
        <a href="/set-message" class="btn btn-yellow">✏️ Set My Message</a>
        <a href="/account" class="btn btn-green">🔒 Lock</a>
      </div>

      <a href="/logout" class="btn btn-pink"
         style="margin-top: 14px; display:inline-block;">
        Log Out
      </a>
    `));
  } catch (error) {
    res.send(page("My Page", `
      <h1>👋 Hi, ${me.display_name}!</h1>

      <div class="message-box">
        🔒 Message locked
        <p style="color: red;">Incorrect password</p>
      </div>

      <form method="POST" action="/account">
        <input
          type="password"
          name="password"
          placeholder="Enter message password"
          required
          autofocus
        >
        <button type="submit" class="btn btn-green">
          🔓 Unlock
        </button>
      </form>

      <a href="/account" class="btn btn-pink">Back</a>
    `));
  }
});


router.get("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/");
});

module.exports = router;
