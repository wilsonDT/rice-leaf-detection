This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Rice Leaf Disease Classification

This application uses a machine learning model hosted on Hugging Face Spaces via the Gradio client to detect diseases in rice leaves. Upload an image of a rice leaf to identify potential diseases and get treatment recommendations.

## Getting Started

### 1. Install Dependencies

Make sure you have Node.js installed. Then, install the project dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

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

The model can detect several common rice leaf diseases, including:

- Bacterial Leaf Blight
- Brown Spot
- Leaf Blast
- Sheath Blight
- Rice Hispa
- Leaf Scald
- Narrow Brown Leaf Spot
- Healthy

(Note: The exact list depends on the underlying model version)

## How It Works

1. The web interface allows users to upload images of rice leaves.
2. The image is sent as base64 data to a secure Next.js API route (`/api/classify`).
3. The API route (running on the server) uses the `@gradio/client` library to connect to the public Hugging Face Space (`wilsondt/rice-disease-classification`).
4. The Gradio client sends the image to the model for analysis.
5. The API route parses the text response from Gradio.
6. Structured results are sent back to the client and displayed with disease information and treatment recommendations.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Gradio Client Documentation](https://www.gradio.app/guides/getting-started-with-the-js-client)
- [Hugging Face Spaces](https://huggingface.co/spaces)
- [Rice Disease Classification Space](https://huggingface.co/spaces/wilsondt/rice-disease-classification)

## Deployment

Deploy your application easily on [Vercel](https://vercel.com/). Since the application now connects to a public Gradio Space via an internal API route, no special environment variables (like API tokens) are required for basic functionality.
