import redis from "redis"
import fetch from "node-fetch"
import { argv } from "process"

const CACHE_TIME = 60 * 60 * 1
const client = redis.createClient()
client.on("error", (error) => console.log("redis error: ", error))
await client.connect()

const args = argv.slice(2)
const url = args[0]

if (!url) {
  console.log("usage: curl0 <url>")
  process.exit(1)
}

function isValidUrl(url) {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

async function fetchWithRedisCache(url) {
  if (!isValidUrl(url)) {
    console.log("error: invalid url")
    process.exit(1)
  }

  try {
    const cachedData = await client.get(url)
    if (cachedData) {
      console.log(cachedData)
      return
    }
    const response = await fetch(url)
    if (!response.ok) {
      console.log("error: http status not ok")
      process.exit(1)
    }

    const data = await response.text()
    client.setEx(url.trim(), CACHE_TIME, data)
    console.log(data)
  } catch (error) {
    console.log("error fetching the url: ", error.message)
    process.exit(1)
  }
}

async function main() {
  try {
    await fetchWithRedisCache(url)
  } finally {
    await client.quit()
  }
}

await main()