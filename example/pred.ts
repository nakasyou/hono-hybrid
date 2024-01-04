import { Hono } from 'https://deno.land/x/hono@v3.11.2/mod.ts'
import app from './mod.tsx'
import { serveStatic } from 'https://deno.land/x/hono@v3.11.2/middleware.ts'

const newApp = new Hono()

newApp.use('/*', serveStatic({
  root: 'dist'
}))
newApp.route('/', app)

Deno.serve(newApp.fetch)