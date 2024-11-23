# Iframe Extractor

A lightweight Cloudflare Worker service that extracts iframe URLs from any given webpage. Built with TypeScript and deployed on Cloudflare's edge network for optimal performance.

## Features

- Extract all iframe sources from any webpage
- Convert relative URLs to absolute URLs
- Stream-based HTML parsing using Cloudflare's HTMLRewriter
- CORS-enabled API endpoint
- TypeScript support
- Easy deployment to Cloudflare Workers

## API Usage

Send a GET request to the worker with a `url` query parameter:

```
https://your-worker.workers.dev/?url=https://example.com
```

### Response Format

The API returns a JSON response with the following structure:

```json
{
  "url": "https://example.com",
  "iframes": [
    "https://example.com/iframe1.html",
    "https://example.com/iframe2.html"
  ]
}
```

### Error Handling

If an error occurs, the API will return a JSON response with an error message:

```json
{
  "error": "Error message here"
}
```

## Local Development

### Prerequisites

- [Bun](https://bun.sh/) installed on your system
- A Cloudflare account
- Wrangler CLI (installed as a dev dependency)

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/iframe-extractor.git
cd iframe-extractor
```

2. Install dependencies:
```bash
bun install
```

3. Start the development server:
```bash
bun run dev
```

The development server will be available at `http://localhost:8787`.

### Building

To build the project:
```bash
bun run build
```

## Deployment

1. Login to Cloudflare (if you haven't already):
```bash
bunx wrangler login
```

2. Deploy to Cloudflare Workers:
```bash
bun run deploy
```

## Technical Details

The service uses Cloudflare's HTMLRewriter API to efficiently parse HTML in a streaming fashion. This approach is more memory-efficient than loading the entire HTML document into memory, making it suitable for processing large webpages.

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
