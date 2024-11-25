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
    // 获取 src 和 data-src 属性
    const src = element.getAttribute('src');
    const dataSrc = element.getAttribute('data-src');

    // 处理 src 属性
    if (src) {
      try {
        const absoluteUrl = new URL(src, this.baseUrl).href;
        this.iframes.push(absoluteUrl);
      } catch (e) {
        console.error(`Invalid URL in src: ${src}`);
      }
    }

    // 处理 data-src 属性
    if (dataSrc) {
      try {
        const absoluteUrl = new URL(dataSrc, this.baseUrl).href;
        this.iframes.push(absoluteUrl);
      } catch (e) {
        console.error(`Invalid URL in data-src: ${dataSrc}`);
      }
    }
  }
}

async function extractIframes(url: string): Promise<string[]> {
  try {
    console.log(`Fetching URL: ${url}`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': url,
        'Cache-Control': 'no-cache'
      }
    });
    console.log(`Response status: ${response.status}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    console.log(`Page content length: ${text.length}`);
    
    // 使用正则表达式直接从 HTML 中提取 iframe URL
    const iframeRegex = /<iframe[^>]*(?:src|data-src)=["']([^"']+)["'][^>]*>/gi;
    const matches = text.matchAll(iframeRegex);
    const urls = [];
    
    for (const match of matches) {
      try {
        const iframeUrl = new URL(match[1], url).href;
        urls.push(iframeUrl);
        console.log(`Found iframe URL: ${iframeUrl}`);
      } catch (e) {
        console.error(`Invalid URL found: ${match[1]}`);
      }
    }

    console.log(`Found total iframes: ${urls.length}`);
    return urls;
  } catch (error) {
    console.error('Error extracting iframes:', error);
    throw error;
  }
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    try {
      const url = new URL(request.url);
      const targetUrl = url.searchParams.get('url');
      
      if (!targetUrl) {
        return new Response('Please provide a URL parameter', {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      console.log(`Processing request for URL: ${targetUrl}`);
      const iframes = await extractIframes(targetUrl);
      
      const response = {
        url: targetUrl,
        iframes: iframes,
        timestamp: new Date().toISOString()
      };

      return new Response(JSON.stringify(response, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
      
    } catch (error) {
      console.error('Error in fetch handler:', error);
      return new Response(JSON.stringify({
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        timestamp: new Date().toISOString()
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
