import { emptyDir } from 'https://deno.land/std@0.210.0/fs/mod.ts'
import { PatternRouter, type Hono } from 'https://deno.land/x/hono@v3.11.2/mod.ts'
import { replaceUrlParam } from 'https://raw.githubusercontent.com/honojs/hono/v3.11.2/src/client/utils.ts'
import * as path from 'https://deno.land/std@0.210.0/path/mod.ts'

type SSGResponse = Response & {
  params: Record<string, string>[]
}
export const ssg = (res: Response, params?: Record<string, string>[]): SSGResponse => {
  res.headers.append('x-ssg', 'true')
  ;(res as SSGResponse).params = params ?? [{}]
  return res as SSGResponse
}
export const generate = async (app: Hono, dist: string) => {
  await emptyDir(dist)
  for (const route of app.routes) {
    if (route.method !== 'GET') {
      continue
    }
    const firstRes = await app.request(route.path)
    if (!firstRes.headers.has('x-ssg')) {
      continue
    }
    for (const param of (firstRes as SSGResponse).params) {
      const requestPath = replaceUrlParam(route.path, param)
      const res = await app.request(requestPath)
      
      let savePath = requestPath
      if (res.headers.get('Content-Type')?.includes('text/html')) {
        savePath = path.join(savePath, 'index.html')
      }
      savePath = path.join(dist, savePath)
      try {
        await Deno.mkdir(path.dirname(savePath), { recursive: true } )
      } catch (_e) {}
      await Deno.writeFile(savePath, new Uint8Array(await res.arrayBuffer()))
    }
    await Deno.writeFile(
      route.path === '/' ? 'index.html' : route.path,
      new Uint8Array(await firstRes.arrayBuffer())
    )
  }
}