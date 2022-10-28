// This is an example of how to access a session from an API route
import { google } from "googleapis"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../../../../auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from "next"
import { oauth2Client } from "../../../../../../lib/auth"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions)
  const jobId = req.query.jobId as string

  if (session && session.accessToken) {
    const auth = oauth2Client(session.accessToken)
    const youtubeReporting = google.youtubereporting({ version: "v1", auth })
    const reports = await youtubeReporting.jobs.reports
      .list({ jobId })
      .then((response) => response.data)

    return res.send(reports)
  }

  res.status(401).send({})
}
