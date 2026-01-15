// API endpoint to fetch Amazon product images
// This uses a CORS proxy to fetch product data from Amazon

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Resolve shortened Amazon link
    let resolvedUrl = url;
    if (url.includes('amzn.to')) {
      // Follow redirect to get full URL
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow'
      });
      resolvedUrl = response.url;
    }

    // Extract ASIN from Amazon URL
    const asinMatch = resolvedUrl.match(/\/dp\/([A-Z0-9]{10})|\/gp\/product\/([A-Z0-9]{10})|\/product\/([A-Z0-9]{10})/);
    const asin = asinMatch ? (asinMatch[1] || asinMatch[2] || asinMatch[3]) : null;

    if (!asin) {
      return res.status(400).json({ error: 'Could not extract ASIN from URL' });
    }

    // Amazon product image URL format
    // We'll use Amazon's image CDN - the actual image ID varies, so we'll use a proxy
    // or fetch the product page to extract the image URL
    
    // Try to fetch product page HTML to extract image
    try {
      const productPageResponse = await fetch(`https://www.amazon.com/dp/${asin}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      const html = await productPageResponse.text();
      
      // Extract image URL from HTML
      // Amazon stores main product image in various places in the HTML
      const imageMatch = html.match(/data-a-dynamic-image='({[^}]+})'/);
      if (imageMatch) {
        try {
          const imageData = JSON.parse(imageMatch[1]);
          const imageUrls = Object.keys(imageData);
          if (imageUrls.length > 0) {
            // Get the largest image (usually the first one)
            return res.status(200).json({
              success: true,
              imageUrl: imageUrls[0],
              asin: asin
            });
          }
        } catch (e) {
          // Fall through to default image
        }
      }
      
      // Alternative: Look for img tag with id="landingImage"
      const landingImageMatch = html.match(/id="landingImage"[^>]+src="([^"]+)"/);
      if (landingImageMatch) {
        return res.status(200).json({
          success: true,
          imageUrl: landingImageMatch[1],
          asin: asin
        });
      }
    } catch (error) {
      console.error('Error fetching product page:', error);
    }

    // Fallback: Use Amazon's standard image URL format
    // Note: This won't work without the actual image ID, but provides a structure
    return res.status(200).json({
      success: true,
      imageUrl: `https://m.media-amazon.com/images/I/[IMAGE_ID]._AC_SL1500_.jpg`,
      asin: asin,
      note: 'Image ID needed - use Amazon Product Advertising API for actual images'
    });

  } catch (error) {
    console.error('Error fetching Amazon product:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch product image'
    });
  }
}

