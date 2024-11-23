interface Env {
  // 如果需要，可以在这里定义环境变量
}

class IframeExtractor {
  iframes: string[] = [];
  baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  element(element: Element) {
    const src = element.getAttribute('src');
    if (src) {
      try {
        const absoluteUrl = new URL(src, this.baseUrl).href;
        this.iframes.push(absoluteUrl);
      } catch (e) {
        console.error(`Invalid URL: ${src}`);
      }
    }
  }
}

async function extractIframes(url: string): Promise<string[]> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const extractor = new IframeExtractor(url);
    const rewriter = new HTMLRewriter()
      .on('iframe', extractor);

    await rewriter.transform(response).text();
    
    return extractor.iframes;
  } catch (error) {
    console.error('Error extracting iframes:', error);
    throw error;
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      // 从请求 URL 中获取目标 URL
      const url = new URL(request.url);
      const targetUrl = url.searchParams.get('url');
      
      if (!targetUrl) {
        return new Response('Please provide a URL parameter', {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // 提取 iframe
      const iframes = await extractIframes(targetUrl);
      
      // 返回结果
      return new Response(JSON.stringify({
        url: targetUrl,
        iframes: iframes
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      
    } catch (error) {
      return new Response(JSON.stringify({
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};
