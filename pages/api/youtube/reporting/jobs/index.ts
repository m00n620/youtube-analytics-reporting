// This is an example of how to access a session from an API route
import { google } from "googleapis"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]"

import type { NextApiRequest, NextApiResponse } from "next"
import { oauth2Client } from "../../../../../lib/auth"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET" && req.method !== "POST") {
    res.status(405).send({ message: "Only GET/POST requests allowed" })
    return
  }

  const session = await unstable_getServerSession(req, res, authOptions)

  if (session && session.accessToken) {
    const auth = oauth2Client(session.accessToken)
    const jobsApi = google.youtubereporting({ version: "v1", auth }).jobs
    if (req.method === "POST") {
      const requestBody = req.body
      try {
        const job = await jobsApi
          .create({ requestBody })
          .then((response) => response.data)
        return res.send(job)
      } catch (err) {
        return res.status(400).send(err)
      }
    } else if (req.method === "GET") {
      try {
        const jobs = await jobsApi.list().then((response) => response.data)
        return res.send(jobs)
      } catch (err) {
        return res.status(400).send(err)
      }
    }
  }

  res.status(401).send({})
}
