/**
 * Analytics & tracking utilities
 * GA4 + UTM parameter helpers
 */

// GA4 Measurement ID — 替换为真实 ID 后即可上线
export const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX';

/**
 * 给 Gumroad 链接追加 UTM 参数
 * 不同 content 值区分点击来源，在 GA4 里可以看到哪个位置的 CTA 效果最好
 */
export function addGumroadUtm(url: string, content: string): string {
  if (!url) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}utm_source=luneastertravel&utm_medium=website&utm_campaign=products&utm_content=${content}`;
}

/**
 * 给 shop all 链接追加 UTM
 */
export function addShopAllUtm(url: string, content: string): string {
  if (!url) return url;
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}utm_source=luneastertravel&utm_medium=website&utm_campaign=shop_all&utm_content=${content}`;
}
