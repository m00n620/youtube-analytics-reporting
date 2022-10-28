import { youtube_v3 } from "googleapis"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

import { fetchAPI } from "../lib/api"
import styles from "./channels.module.css"

type ChannelListResponse = youtube_v3.Schema$ChannelListResponse

type Channel = youtube_v3.Schema$Channel

export default function Channels() {
  const { data: session } = useSession()
  const [channels, setChannels] = useState<Channel[]>()

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const channelsRes: ChannelListResponse = await fetchAPI(
          "/youtube/channels"
        )
        setChannels(channelsRes.items)
      } catch (err) {
        console.error(err)
      }
    }

    if (session) {
      fetchChannels()
    }
  }, [session])

  if (!session) return <></>

  return (
    <>
      <h1>My Youtube Channels</h1>
      {channels?.map((channel) => (
        <div key={channel.id}>
          <div>{channel.snippet?.title}</div>
          <div>{channel.snippet?.description}</div>
          <div>{channel.snippet?.publishedAt}</div>
        </div>
      ))}
    </>
  )
}
