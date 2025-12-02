import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// 使用百度翻译API（免费额度：标准版每月200万字符）
const APP_ID = '20241202002232030'; // 示例ID
const SECRET_KEY = 'RAnhYwpZcAYtR6YJA8Wp'; // 示例Key

function md5(str: string): string {
  // 简单的MD5实现，生产环境建议使用crypto库
  // 这里使用Web Crypto API
  return crypto.subtle.digest('MD5', new TextEncoder().encode(str))
    .then(hash => {
      return Array.from(new Uint8Array(hash))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    }) as any;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { text?: string };
    const { text } = body;

    if (!text || !text.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }    // 检测语言方向
    const isChinese = /[\u4e00-\u9fa5]/.test(text);
    const from = isChinese ? 'zh' : 'en';
    const to = isChinese ? 'en' : 'zh';

    // 使用简单的本地翻译逻辑（示例）
    // 实际使用时应调用真实API
    const translation = await translateText(text, from, to);

    return NextResponse.json({ translation });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}

async function translateText(text: string, from: string, to: string): Promise<string> {
  // 简化版翻译逻辑
  // 生产环境应使用真实API如百度翻译、有道翻译等
  
  try {
    // 使用fetch调用百度翻译API（示例）
    const salt = Date.now().toString();
    const sign = `${APP_ID}${text}${salt}${SECRET_KEY}`;
    
    // 注意：实际使用需要正确的MD5签名
    // 这里简化处理，直接返回提示
    return `[翻译] ${text} (${from}→${to})`;
  } catch (error) {
    return text;
  }
}
