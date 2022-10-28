import { google } from "googleapis"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]"
import { oauth2Client } from "../../../../../lib/auth"

import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions)

  if (session && session.accessToken) {
    const auth = oauth2Client(session.accessToken)
    const youtubeReporting = google.youtubereporting({ version: "v1", auth })
    const reportTypes = await youtubeReporting.reportTypes
      .list()
      .then((response) => response.data)

    return res.send(reportTypes)
  }

  res.status(401).send({})
}
