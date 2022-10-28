import { google } from "googleapis"

export function oauth2Client(accessToken: string) {
  const client = new google.auth.OAuth2(
    process.env.GOOGLE_ID,
    process.env.GOOGLE_SECRET
  )
  client.setCredentials({
    access_token: accessToken,
  })

  return client
}
