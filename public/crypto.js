
const encoder = new TextEncoder()
const decoder = new TextDecoder()
async function deriveKeyFromPassword(password){
   
    const data = encoder.encode(password)
    const hashed = await crypto.subtle.digest("SHA-256",data)
    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        hashed,
        {name:"AES-GCM"},
        false,
        ["encrypt","decrypt"]
    )
    return cryptoKey
}

async function encryptMessage(password,message){
    const iv = crypto.getRandomValues(new Uint8Array(12))
    const key = await deriveKeyFromPassword(password)
    const encoded= encoder.encode(message)
    const encrypted = await crypto.subtle.encrypt(
        {name:"AES-GCM",iv},
        key,
        encoded
    )
    return JSON.stringify({
        encrypted:Buffer.from(encrypted).toString("base64"),
        iv:Buffer.from(iv).toString("base64")
    })
}

async function decryptMessage(encryptedData,password){
    const parsed = JSON.parse(encryptedData);
    
    const encrypted = Buffer.from(parsed.encrypted, "base64");
    const iv = new Uint8Array(Buffer.from(parsed.iv, "base64"));

   const key = await deriveKeyFromPassword(password)


    const decrypted = await crypto.subtle.decrypt(
        {name:"AES-GCM",iv},
        key,
        encrypted
    )
    return decoder.decode(decrypted)
}

// async function handleSubmit(event) {
//     event.preventDefault()

//     const message = document.getElementId("message")
//     const password = document.getElementId("password")
//     const form = event.currentTarget
//     const submitButton = form.querySelector("button[type='submit']");
    

//     try{
//         submitButton.disabled=true
        
//         const res = await encryptMessage
//     }


// }

module.exports = {
  encryptMessage,
  decryptMessage,
};