module.exports.setAuth = (doc) => {
  var creds_json = {
    client_email: process.env.google_client_email,
    private_key: process.env.google_private_key.replace(/\\n/g, '\n')
  }  
  doc.useServiceAccountAuth(creds_json);
}