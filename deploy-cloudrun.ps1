$ErrorActionPreference = "Stop"

gcloud config set project trasterush

gcloud run deploy trasterush-frontend `
  --source . `
  --region europe-southwest1 `
  --allow-unauthenticated `
  --port 8080
