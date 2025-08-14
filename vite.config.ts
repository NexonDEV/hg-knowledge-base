import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import tailwind from '@tailwindcss/vite'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMath from 'remark-math'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeHighlight from 'rehype-highlight'

const mdxPassThrough = [
  'mdxjsEsm','mdxFlowExpression','mdxTextExpression','mdxJsxFlowElement','mdxJsxTextElement'
]

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [
        remarkGfm,
        remarkFrontmatter,
        remarkMath,
      ],
      rehypePlugins: [
        [rehypeRaw, { passThrough: mdxPassThrough }],
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'append' }],
        rehypeKatex,
        rehypeHighlight,
      ],
    }),
    react(),
    tailwind(),
  ],
})
