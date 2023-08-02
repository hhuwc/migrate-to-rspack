export default function fibonacci(num) {
    let a = 0;
    let b = 1;
    for (let i = 0; i < num; i++) {
        let c = a + b;
        a = b;
        b = c;
    }
    return a;
}