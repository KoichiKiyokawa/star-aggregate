import axios from 'axios'
import { token } from '../env'
import { range } from '../util'
import { StarLogRepository, TStarLog } from '../models/StarLogRepository'

const get = (endpoint: string) =>
  axios.get(endpoint, {
    headers: {
      Accept: 'application/vnd.github.v3.star+json',
      Authorization: `token ${token}`,
    },
  })

type EachPageResponse = { data: EachLog[]; request: { path: string } }

type EachLog = {
  starred_at: string // e.g. 2016-11-27T12:51:01Z
  user: {
    id: number // e.g. 5865074
  }
}

const CONCURRENCY = 10 // 同時に取得する並列数

export class StarLogService {
  constructor(private ownerWithRepository: string) {}

  async saveStarLogRecursively(startPage: number = 0) {
    concurrent: for (let i = startPage; ; i += CONCURRENCY) {
      const responseArray = await Promise.all(range(i, i + CONCURRENCY - 1).map((page) => this.getStarLog(page)))

      for (const eachPageResponse of responseArray) {
        if (eachPageResponse === null) break concurrent // 外側のfor文を抜け出す

        const starLogs = this.parseResponse(eachPageResponse)
        starLogs.forEach((log) => StarLogRepository.add(log))
      }
    }
  }

  private getStarLog(page: number = 0): Promise<EachPageResponse> {
    return get(`https://api.github.com/repos/${this.ownerWithRepository}/stargazers?page=${page}`).catch((err) => {
      console.log(`error: ${err.response}`)
      if (err.response.status === 422) {
        // 最大ページを超えてリクエストを送った場合
        return null
      }
    })
  }

  private parseResponse(response: EachPageResponse): TStarLog[] {
    const page = Number(response.request.path.match(/\?page=(\d+)/)[1]) // e.g. request.path: '/repos/sveltejs/svelte/stargazers?page=0'
    return response.data.map((res) => ({
      userID: res.user.id,
      starredAt: res.starred_at,
      ownerWithRepository: this.ownerWithRepository,
      page,
    }))
  }
}
