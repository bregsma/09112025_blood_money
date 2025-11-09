let w = 48; 
let h = 48;
let pixelSize = 16; // You can change this value to adjust the pixel size

let img;
let video;
let ref;
let gradientImages = []; // Array to hold the gradient images


function preload() {

    gradientImages = [
        loadImage('https://i.ibb.co/YnS5hg2/pixel1.png'),
        loadImage('https://i.ibb.co/Fbx34LRX/pixel2.png'),
        loadImage('https://i.ibb.co/ZzKhw2gn/pixel3.png'),
        loadImage('https://i.ibb.co/h1dxJg8h/pixel4.png'),
        loadImage('https://i.ibb.co/1YD1QBcT/pixel5.png'),
        loadImage('https://i.ibb.co/G3rP3H3R/pixel6.png'),
        loadImage('https://i.ibb.co/5Xg2k9M3/pixel8.png'),
        loadImage('https://i.ibb.co/5Xg2k9M3/pixel8.png'),
        loadImage('https://i.ibb.co/Q3Z2dLTK/pixel8.png'),
        loadImage('https://i.ibb.co/yBWcQvTw/pixel11.png'),
        loadImage('https://i.ibb.co/jkpLK1ZC/pixel11.png'),
        loadImage('https://i.ibb.co/VYRL2y07/pixel11.png'),
        loadImage('https://i.ibb.co/rVQhK83/pixel12.png')
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
        background(255)
        ref.loadPixels();
        // console.log(test)
        for (let y = 0; y < ref.height; y += pixelSize) {
            for (let x = 0; x < ref.width; x += pixelSize) {
                let index = (x + y * ref.width) * 4;
                let r = ref.pixels[index];
                let g = ref.pixels[index + 1];
                let b = ref.pixels[index + 2];
                let brightness = (r + g + b) / 3; // Calculate brightness
                let gradientIndex = floor(map(brightness, 0, 255, 0, gradientImages.length-1)); // Map brightness to gradient index

                image(gradientImages[gradientIndex], x, y, pixelSize, pixelSize); // Draw the corresponding gradient image
                
            }
        }
        // image(video, 0,0, 100, 100);
    }

function mousePressed() {
    // if (video.isPlaying()) {
    //     video.pause();
    // } else {
    //     video.play();
    // }
}