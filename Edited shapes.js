let i = 0;
let t = 0;
class shape {
    constructor(vNnum,nm,sm,fcm)
    {

        this.vNnum = vNnum;
        this.nm = nm;
        this.sm = sm;
        this.fcm = fcm;
        this.col = 20;

    }

    update(speed,col)
    {
        this.vNnum = lerp(speed,this.vNnum,0.09);
        //this.vNnum = speed;
        this.col = lerp(col,this.col,0.01);
       // this.col = noise(col)*col;
    }


    draw(width,height)
    {

        blendMode(MULTIPLY);
        noStroke();
        push();
        translate(width/2,height/2);

        fill(this.col,noise(this.col)*90,100);

        // VNnum = how close to circle / nm = inside movement / sm = movement/ fcm = speed

        // rotate the shape , alpha = number of frames / fcm (an input aviable)
        // some how controlling the speed that the shape is spinning

        rotate(frameCount/this.fcm);
        let dr = TWO_PI/this.vNnum;

        // using beginshape and endshape you can drrow any polygon
        beginShape();
        for(let i = 0; i  < this.vNnum + 3; i++){
            let ind = i%this.vNnum;
            let rad = dr *ind;
            // noise = random number generator in a sequence that can make the movement smoother
            let r = height*0.3 + noise(frameCount/this.nm + ind) *
                height*0.1 + sin(frameCount/this.sm + ind)*height*0.05;
            // drowing a curve
            curveVertex(cos(rad)*r, sin(rad)*r);
        }
        endShape();
        pop();

    }
}


let mic , fft;
function setup() {
    createCanvas(windowWidth, windowHeight);
    mic = new p5.AudioIn();
    mic.start();
    fft = new p5.FFT();
    fft.setInput(mic);
}

function mouseClicked(){
    if (getAudioContext().state !== 'running') {
        getAudioContext().resume();
    }
}

let s1 = new shape(18,50,20,150);
let s2 = new shape(15,60,25,120);
let s3 = new shape(12,45,15,150);
function draw() {

    let vol = mic.getLevel();
    vol = map(vol,0,0.99,15,30);
    //vol = round(vol);

    let spectrum = fft.analyze();
    let mid = fft.getEnergy("mid");
    let treble = fft.getEnergy("treble");
    let highMid = fft.getEnergy("highMid");
    hue1 = map(mid, 0, 255, 1, 100);
    hue2 = map(treble, 0, 255, 1, 100);
    hue3 = map(highMid, 0, 255, 1, 100);

    colorMode(HSB, 100);
    //to blend the colors
    blendMode(BLEND);
    background(100,0,100);
    //noStroke();

    s1.update(vol,hue1);
    s1.draw(width,height);
    s2.update(vol,hue2);
    s2.draw(width,height);
    s3.update(vol,hue3);
    s3.draw(width,height);

}

