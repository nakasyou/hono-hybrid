import { generate } from '../src/mod.ts'
import app from './mod.tsx'

await generate(app, 'dist')
