let w = 96; // Increased grid resolution for smaller pixels
let h = 96;
let pixelSize = 8; // Smaller pixel size, but canvas stays same (96 * 8 = 768, same as 48 * 16)

let img;
let video;
let ref;
let gradientImages = []; // Array to hold the gradient images
let gradientImagesSorted = false; // Track if images have been sorted by brightness


function preload() {

    // Load gradient images - will be automatically sorted by brightness
    gradientImages = [
        loadImage('https://i.ibb.co/YnS5hg2/pixel1.png'),
        loadImage('https://i.ibb.co/67Vh3YhG/PIXEL-01.png'),
        loadImage('https://i.ibb.co/1fM8KTTQ/PIXEL-02.png'),
        loadImage('https://i.ibb.co/p6Kvb7Fk/PIXEL-03.png'),
        loadImage('https://i.ibb.co/wrQ8RbZq/PIXEL-04.png'),
        loadImage('https://i.ibb.co/bgbdmyDw/PIXEL-05.png'),
        loadImage('https://i.ibb.co/JLKfWMH/PIXEL-06.png')
    ]

    img = loadImage(
        'https://cdn.cosmos.so/55012988-d2a8-485a-9c9c-8befb1db659e?format=jpeg'
    );
    video = createVideo([
        'https://cdn.cosmos.so/95dc2ee9-87a6-49af-a2d2-284c932d3585.mp4'

    ], videoLoaded);

    video.hide(); 
    // video = ''

    ref = video
    // ref = img

    w *= pixelSize
    h *= pixelSize

    }

    function setup() {
        createCanvas(w, h);
        // noLoop(); // Stop draw from looping

        // Hide the video element
        img.resize(w, h);
        
        // Improve image rendering quality
        imageMode(CORNER);
        noSmooth(); // Keep pixel art crisp
        
        // Sort gradient images by average brightness (darkest to lightest)
        sortGradientImagesByBrightness();
    }
    
    function sortGradientImagesByBrightness() {
        // Calculate average brightness for each gradient image
        let imageBrightnesses = [];
        
        for (let i = 0; i < gradientImages.length; i++) {
            if (gradientImages[i] && gradientImages[i].width > 0) {
                gradientImages[i].loadPixels();
                let totalBrightness = 0;
                let pixelCount = 0;
                
                for (let j = 0; j < gradientImages[i].pixels.length; j += 4) {
                    let r = gradientImages[i].pixels[j];
                    let g = gradientImages[i].pixels[j + 1];
                    let b = gradientImages[i].pixels[j + 2];
                    let brightness = (r * 0.299 + g * 0.587 + b * 0.114);
                    totalBrightness += brightness;
                    pixelCount++;
                }
                
                let avgBrightness = totalBrightness / pixelCount;
                imageBrightnesses.push({
                    image: gradientImages[i],
                    brightness: avgBrightness,
                    index: i
                });
            } else {
                // If image not loaded yet, keep original position
                imageBrightnesses.push({
                    image: gradientImages[i],
                    brightness: i * 255 / gradientImages.length, // Estimate
                    index: i
                });
            }
        }
        
        // Sort by brightness (darkest to lightest)
        imageBrightnesses.sort((a, b) => a.brightness - b.brightness);
        
        // Reorder gradientImages array
        gradientImages = imageBrightnesses.map(item => item.image);
        gradientImagesSorted = true;
    }

    let play = false;

    function videoLoaded() {
        video.size(w, h); // Resize the video to fit the canvas before pixelating
        img.resize(w, h)
        video.loop(); // Loop the video
        play = true;
        video.play();
        video.volume(0)
    
    }

    let test = 0;

    function draw() {
        // Sort images by brightness if not already sorted and images are loaded
        if (!gradientImagesSorted && gradientImages.length > 0 && gradientImages[0] && gradientImages[0].width > 0) {
            sortGradientImagesByBrightness();
        }
        
        // Use video if available and playing, otherwise use image
        if (video && play) {
            ref = video;
        } else if (img) {
            ref = img;
        }
        
        if (!ref) return;
        
        background(255)
        ref.loadPixels();
        
        for (let y = 0; y < ref.height; y += pixelSize) {
            for (let x = 0; x < ref.width; x += pixelSize) {
                let index = (x + y * ref.width) * 4;
                let r = ref.pixels[index];
                let g = ref.pixels[index + 1];
                let b = ref.pixels[index + 2];
                
                // Improved brightness calculation using luminance formula
                let brightness = (r * 0.299 + g * 0.587 + b * 0.114);
                
                // Clamp and map brightness to gradient index with better distribution
                brightness = constrain(brightness, 0, 255);
                let gradientIndex = floor(map(brightness, 0, 255, 0, gradientImages.length));
                gradientIndex = constrain(gradientIndex, 0, gradientImages.length - 1);
                
                // Only draw if gradient image is loaded
                if (gradientImages[gradientIndex] && gradientImages[gradientIndex].width > 0) {
                    // Draw with proper sizing and no smoothing for crisp pixels
                    image(gradientImages[gradientIndex], x, y, pixelSize, pixelSize);
                }
                
            }
        }
    }

function mousePressed() {
    // Click to toggle video play/pause
    if (video && play) {
        if (video.isPlaying()) {
            video.pause();
        } else {
            video.play();
        }
    }
}

function keyPressed() {
    // Press 's' to save the current frame as an image
    if (key === 's' || key === 'S') {
        saveCanvas('pixel-art-' + Date.now(), 'png');
    }
}