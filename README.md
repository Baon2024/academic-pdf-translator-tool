This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev/ pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

in order to translate pdfs, you need to open another terminal and cd src, cd backend, then: uvicorn server:app --reload --host 127.0.0.1 --port 3001

add a .env file in the /backend folder, with your HF api token, in the format: HF_TOKEN=xxxxxxxx