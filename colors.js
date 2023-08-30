function green() {
    for(let t = 1.0; t < 129; t += 5 ) {
        console.log(100/(0.1*(t-64)*(t-64)));
    }
}

// green();

// console.log(970/255*385)

function red() {
    for (let x =1; x < 128; x += 5) {
        console.log(255*(128/x)/128);
    }
    
}

// red();

// function blue() {
//     for (let x =1; x < 128; x += 5) {
//         console.log((x^2 - x)/128*255)
//     }
// }

function blue() {
    for (let x = 1; x < 128; x += 5) {
        let newX = 0.05 * x;
        console.log(Math.pow(0.05 * x, 3))
    }
}

// blue();