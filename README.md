This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Rice Leaf Disease Classification

This application uses the Hugging Face Inference API to detect diseases in rice leaves. Upload an image of a rice leaf to identify potential diseases and get treatment recommendations.

## Getting Started

### 1. Set Up Your Hugging Face Token

First, you need to obtain a Hugging Face API token:

1. Create an account on [Hugging Face](https://huggingface.co)
2. Go to your [Hugging Face tokens settings](https://huggingface.co/settings/tokens)
3. Create a new token with read access
4. Create a `.env.local` file in the project root with the following content:

```bash
HF_TOKEN=your_huggingface_token_here
```

This token is only used server-side and is never exposed to the client for security reasons.

### 2. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Supported Diseases

The model can detect the following rice leaf diseases:

- Bacterial Blight
- Blast
- Brown Spot
- Healthy
- Tungro

## How It Works

1. The web interface allows users to upload images of rice leaves
2. The image is sent to a secure Next.js API route
3. The API route forwards the request to the Hugging Face Inference API using your server-side token
4. The model (wilsondt/rice-disease-classification) analyzes the image
5. Results are displayed with disease information and treatment recommendations

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Hugging Face Inference API](https://huggingface.co/docs/api-inference/index)
- [Rice Disease Classification Model](https://huggingface.co/wilsondt/rice-disease-classification)

## Deployment

Deploy your application on [Vercel](https://vercel.com/) for the best experience with Next.js. Make sure to configure the HF_TOKEN as an environment variable in your deployment settings.
