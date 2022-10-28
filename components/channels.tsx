import dayjs from "dayjs"
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
      <h2>My Youtube Channels</h2>
      <div className={styles.channels}>
        {channels?.map((channel) => (
          <div key={channel.id} className={styles.channel}>
            <span
              style={{
                backgroundImage: `url('${channel.snippet?.thumbnails?.default?.url}')`,
              }}
              className={styles.thumbnail}
            />
            <div className={styles.channelInfo}>
              <p className={styles.channelTitle}>{channel.snippet?.title}</p>
              <p className={styles.channelDescription}>
                {channel.snippet?.description}
              </p>
              <p className={styles.channelPublishedAt}>
                Published at{" "}
                {dayjs(channel.snippet?.publishedAt).format("MM/DD/YYYY")}
              </p>
              <p className={styles.channelStats}>
                {channel.statistics?.videoCount} Videos,{" "}
                {channel.statistics?.subscriberCount} Subscribers,{" "}
                {channel.statistics?.viewCount} Views
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
