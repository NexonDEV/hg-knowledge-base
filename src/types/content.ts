export interface Heading { level: 2 | 3; text: string; id: string }

export interface DocMeta {
    route: string
    slug: string
    title: string
    tags: string[]
    headings: Heading[]
    summary?: string
    group?: string
    order?: number
}

export interface DocModule { default: React.ComponentType<any> }
