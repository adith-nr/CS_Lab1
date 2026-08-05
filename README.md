# CS_Lab_1

A simple class portal where students can log in, set an encrypted personal message, unlock it using a password, and update their account password.

## Features

* Log in using a username and password
* View your own account page
* Set a short personal message
* Encrypt the message using a separate message password
* Unlock and decrypt the message from the account page
* Lock the message again by returning to the account page
* Change your account password
* Log out securely

## Message Encryption

Personal messages are encrypted using:

* AES-GCM encryption
* A key derived from the message password using SHA-256
* A randomly generated initialization vector for every message

The encrypted message and initialization vector are converted to Base64 and stored in the SQLite database.

The message password is not stored in the database. The same password must be entered later to decrypt the message.

## Tech Stack

* [Node.js](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) for database storage
* Node.js Web Crypto API for encryption and decryption
* Plain HTML and CSS
* No front-end framework

## Getting Started

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Start the server:

   ```bash
   npm start
   ```

3. Open the application in your browser:

   ```text
   http://localhost:3000
   ```

The database file, `classmates.db`, is created automatically the first time the application runs.

A few sample accounts are also added to the database for testing.

## Application Flow

1. Log in using a valid username and password.
2. Open the account page.
3. Select **Set My Message**.
4. Enter:

   * A password used to encrypt the message
   * The personal message
5. Save the message.
6. Return to the account page.
7. The message will appear as locked.
8. Enter the same message password and select **Unlock**.
9. The decrypted message will be displayed.

Entering an incorrect password will cause the decryption to fail and display an error message.

## Project Structure

```text
classmate-hub/
├── server.js              # Application entry point
├── db.js                  # Database setup
├── views.js               # Shared HTML page template
├── routes/
│   ├── login.js           # Login page and authentication
│   ├── account.js         # Account page, message unlock, and logout
│   ├── message.js         # Set and encrypt personal message
│   └── password.js        # Change account password
└── public/
    ├── crypto.js          # Message encryption and decryption
    └── style.css          # Application styling
```

## Routes

| Method | Route              | Description                                 |
| ------ | ------------------ | ------------------------------------------- |
| `GET`  | `/`                | Display the login page                      |
| `POST` | `/login`           | Authenticate the user                       |
| `GET`  | `/account`         | Display the account page and locked message |
| `POST` | `/account`         | Unlock and decrypt the personal message     |
| `GET`  | `/set-message`     | Display the message form                    |
| `POST` | `/set-message`     | Encrypt and save the message                |
| `GET`  | `/change-password` | Display the password change form            |
| `POST` | `/change-password` | Update the account password                 |
| `GET`  | `/logout`          | Clear the login cookie and log out          |

## Configuration

The application runs on port `3000` by default.

To use a different port, set the `PORT` environment variable before starting the server:

```bash
PORT=8080 npm start
```

## Important Notes

* The account password and message encryption password can be different.
* The message encryption password is not stored.
* If the message password is forgotten, the encrypted message cannot be decrypted.
* Every message uses a randomly generated initialization vector.
* The project is intended for learning purposes and demonstrates basic authentication, SQLite storage, and symmetric encryption.
