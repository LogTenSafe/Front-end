import { http } from 'msw'
import { setupServer } from 'msw/node'
import { backupsJSON } from '../fixtures/allBackups'

const backend = setupServer(
  http.get('http://localhost:8080/backups.json', info => {
    const pageQuery = new URL(info.request.url).searchParams.get('page')
    const page = pageQuery ? Number.parseInt(pageQuery, 10) : 1
    const first = (page - 1) * 10
    const last = first + 10

    if (first < backupsJSON.length) {
      return new Response(JSON.stringify(backupsJSON.slice(first, last)), {
        headers: {
          'X-Next-Page': `/backups.json?page=${page + 1}`
        }
      })
    }
    return new Response(JSON.stringify(backupsJSON.slice(first, last)))
  })
)

export default backend
