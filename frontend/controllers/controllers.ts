
export function createRandomString(){
    let s = "";

    for(let i=0; i<5; i++){
        const a = String.fromCharCode('A'.charCodeAt(0) + Math.floor(Math.random()*26));
        s += a;
    }

    return s;
}