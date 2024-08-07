import { ImageAnnotatorClient } from "@google-cloud/vision";

export default async function classifyImage(req, res) {
    if(req.method !== 'POST') {
        res.setHeader('Allow', ['POST'])
        res.status(405).end('Method not allowed')
        return
    }

    const image = req.body.image

    if(!image) {
        return res.status(400).json({ error: 'no image provided' })
    }

    try {
        const client = new ImageAnnotatorClient({
            keyFilename: 'pages/api/APIKEY.json'
        })
        const imageBuffer = Buffer.from(image, 'base64')
        const [result] = await client.labelDetection({
            image: {
                content: imageBuffer
            }
        })
        const labels = result.labelAnnotations
        console.log("LABELS", labels)
        return res.status(200).json(labels)
    } catch(e) {
        console.log('Vision API error: ', e)
        res.status(500).json({ error: 'Failed to classify image' })
        return
    }
}
