/**
 * 将图片路径解析成浏览器可直接渲染的地址。
 * 相对 API 路径会自动补上 `VITE_API_BASE_URL`，
 * 完整 URL、协议相对地址和内联资源则原样返回。
 */
export function getImageUrl(path: string | undefined | null): string {
    if (!path) return ''

    if (
        path.startsWith('http://') ||
        path.startsWith('https://') ||
        path.startsWith('//') ||
        path.startsWith('data:') ||
        path.startsWith('blob:')
    ) {
        return path
    }

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
    const normalizedPath = path.startsWith('/') ? path : `/${path}`

    return `${apiBaseUrl}${normalizedPath}`
}

/**
 * 从商品图片结构里拿第一张图。
 */
export function getFirstImageUrl(images: any): string {
    if (!images) return ''

    let imageUrl = ''

    if (Array.isArray(images)) {
        imageUrl = images[0] || ''
    } else if (images.images && Array.isArray(images.images)) {
        imageUrl = images.images[0] || ''
    }

    return getImageUrl(imageUrl)
}
