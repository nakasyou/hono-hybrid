/** @jsx jsx */
/** @jsxFrag Fragment */
import { Hono } from 'https://deno.land/x/hono@v3.11.2/mod.ts'
import { jsx } from 'https://deno.land/x/hono@v3.11.2/middleware.ts'
import { ssg } from '../src/mod.ts'

const app = new Hono()
app.post('/value', c => c.html(Math.random().toString()))
app.get('/', c => ssg(c.html(<html>
  <head>
    <meta charset='utf-8' />
    <script src="https://unpkg.com/htmx.org@1.9.10"></script>
  </head>
  <body>
    <h1>Hello world!</h1>
    <button hx-post="/value" hx-swap="innerHTML" hx-target="#value">
      Click me!
    </button>
    <div>
      Value:
      <span id="value"></span>
    </div>
  </body>
</html>)))

export default app
