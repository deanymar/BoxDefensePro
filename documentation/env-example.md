# BoxDefense Environment Template

# DATABASE
DATABASE_URL="postgresql://user:password@localhost:5432/boxdefense"

# CLOUD STORAGE (AWS S3 / Google Cloud Storage)
STORAGE_ENDPOINT="https://s3.amazonaws.com"
STORAGE_BUCKET="boxdefense-inventory-vault"
STORAGE_ACCESS_KEY="AKIA..."
STORAGE_SECRET_KEY="secret..."

# SECURITY
JWT_SECRET="a-very-long-and-secure-random-string"
QR_ENCRYPTION_KEY="aes-key-for-qr-codes"

# COMMUNICATION SERVICES (NEW)
SMS_PROVIDER="twilio"
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="token..."
TWILIO_PHONE_NUMBER="+15550001234"

EMAIL_PROVIDER="sendgrid"
SENDGRID_API_KEY="SG.xxx"
SYSTEM_EMAIL_SENDER="no-reply@boxdefense.io"

# APP SETTINGS
NODE_ENV="production"
PORT=3000