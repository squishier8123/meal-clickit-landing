const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, 'images');
const optimizedDir = path.join(imagesDir, 'optimized');

// Create optimized directory if it doesn't exist
if (!fs.existsSync(optimizedDir)) {
    fs.mkdirSync(optimizedDir, { recursive: true });
}

// Image optimization settings
const settings = {
    jpeg: {
        quality: 80,
        mozjpeg: true
    },
    webp: {
        quality: 80
    },
    resize: {
        width: 1200,
        height: 900,
        fit: 'inside',
        withoutEnlargement: true
    }
};

async function optimizeImage(filename) {
    const inputPath = path.join(imagesDir, filename);
    const ext = path.extname(filename).toLowerCase();
    const baseName = path.basename(filename, ext);

    // Skip if not an image
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) {
        return null;
    }

    try {
        const stats = fs.statSync(inputPath);
        const originalSize = stats.size;

        // Create optimized JPEG
        const jpegPath = path.join(optimizedDir, `${baseName}.jpg`);
        await sharp(inputPath)
            .resize(settings.resize)
            .jpeg(settings.jpeg)
            .toFile(jpegPath);

        // Create WebP version (even better compression)
        const webpPath = path.join(optimizedDir, `${baseName}.webp`);
        await sharp(inputPath)
            .resize(settings.resize)
            .webp(settings.webp)
            .toFile(webpPath);

        // Get new sizes
        const jpegSize = fs.statSync(jpegPath).size;
        const webpSize = fs.statSync(webpPath).size;

        console.log(`${filename}:`);
        console.log(`  Original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
        console.log(`  JPEG:     ${(jpegSize / 1024).toFixed(0)} KB (${((1 - jpegSize / originalSize) * 100).toFixed(0)}% reduction)`);
        console.log(`  WebP:     ${(webpSize / 1024).toFixed(0)} KB (${((1 - webpSize / originalSize) * 100).toFixed(0)}% reduction)`);

        return { filename, originalSize, jpegSize, webpSize };

    } catch (error) {
        console.error(`Error processing ${filename}:`, error.message);
        return null;
    }
}

async function main() {
    console.log('Optimizing images for web...\n');

    const files = fs.readdirSync(imagesDir).filter(f =>
        ['.jpg', '.jpeg', '.png'].includes(path.extname(f).toLowerCase()) &&
        !f.includes('optimized')
    );

    let totalOriginal = 0;
    let totalOptimized = 0;

    for (const file of files) {
        const result = await optimizeImage(file);
        if (result) {
            totalOriginal += result.originalSize;
            totalOptimized += result.webpSize; // Use WebP as the target
        }
        console.log('');
    }

    console.log('=====================================');
    console.log(`Total original:  ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total optimized: ${(totalOptimized / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Total savings:   ${((1 - totalOptimized / totalOriginal) * 100).toFixed(0)}%`);
    console.log('\nOptimized images saved to: images/optimized/');
    console.log('Use the WebP versions for best performance.');
}

main().catch(console.error);
