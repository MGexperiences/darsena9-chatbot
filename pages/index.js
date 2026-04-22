import fs from 'fs'
import path from 'path'

export default function Home({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

export async function getStaticProps() {
  const html = fs.readFileSync(path.join(process.cwd(), 'public/index.html'), 'utf8')
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] || ''
  return { props: { html: body } }
}
