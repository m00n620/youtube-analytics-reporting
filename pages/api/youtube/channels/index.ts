import { google } from "googleapis"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]"
import { oauth2Client } from "../../../../lib/auth"

import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions)

  if (session && session.accessToken) {
    const auth = oauth2Client(session.accessToken)
    const youtube = google.youtube({ version: "v3", auth })
    const channels = await youtube.channels
      .list({
        mine: true,
        part: ["id,statistics,snippet"],
      })
      .then((response) => response.data)

    return res.send(channels)
  }
  res.status(401).send({})
}
