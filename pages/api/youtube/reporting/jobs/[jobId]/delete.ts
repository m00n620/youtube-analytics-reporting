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
  if (req.method !== "DELETE") {
    res.status(405).send({ message: "Only DELETE requests allowed" })
    return
  }

  const jobId = req.query.jobId as string
  const session = await unstable_getServerSession(req, res, authOptions)

  if (session && session.accessToken) {
    const auth = oauth2Client(session.accessToken)
    const youtubeReporting = google.youtubereporting({ version: "v1", auth })
    try {
      const data = await youtubeReporting.jobs
        .delete({ jobId })
        .then((response) => response.data)
      return res.send(data)
    } catch (err) {
      return res.status(400).send(err)
    }
  }

  res.status(401).send({})
}
