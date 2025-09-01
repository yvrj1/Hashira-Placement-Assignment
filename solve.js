const fs = require('fs');


const DIGITS = '0123456789abcdefghijklmnopqrstuvwxyz';


function toDecimal(valueStr, base) {
    const baseBigInt = BigInt(base);
    let result = 0n;
    
    
    for (const char of valueStr.toLowerCase()) {
        const digit = DIGITS.indexOf(char);
        if (digit === -1 || digit >= base) {
            throw new Error(`Invalid digit '${char}' for base ${base}`);
        }
        result = result * baseBigInt + BigInt(digit);
    }
    return result;
}


function fromDecimal(decimalValue, base) {
    if (decimalValue === 0n) {
        return '0';
    }
    
    if (base === 1) {
        return '1'.repeat(Number(decimalValue));
    }

    const baseBigInt = BigInt(base);
    let result = '';
    let num = decimalValue;

    while (num > 0n) {
        const remainder = num % baseBigInt;
        result = DIGITS[Number(remainder)] + result;
        num = num / baseBigInt;
    }

    return result;
}


function evaluatePolynomial(coeffs, x) {
    
    let result = 0n;
    for (let i = coeffs.length - 1; i >= 0; i--) {
        result = result * x + coeffs[i];
    }
    return result;
}



function main() {
    try {
        
        const rawData = fs.readFileSync('input.json');
        const input = JSON.parse(rawData);

        
        const rootsStr = input.keys.filter(key => !isNaN(parseInt(key, 10)));
        const numericKeys = Object.keys(input).filter(key => !isNaN(parseInt(key, 10))).sort((a, b) => a - b);
        
        const degree = numericKeys.length > 0 ? parseInt(numericKeys[numericKeys.length - 1], 10) : -1;
        if (degree === -1) {
            console.log('{}'); 
            return;
        }

       
        const coefficients = [];
        for (let i = 0; i <= degree; i++) {
            const key = i.toString();
            if (input[key]) {
                const base = parseInt(input[key].base, 10);
                const value = input[key].value;
                coefficients.push(toDecimal(value, base));
            } else {
                
                coefficients.push(0n);
            }
        }
        
      
        const output = {};
        for (const rootStr of rootsStr) {
            const root = BigInt(rootStr);
            const base = Number(rootStr);

            
            const resultDecimal = evaluatePolynomial(coefficients, root);

            
            const resultInBase = fromDecimal(resultDecimal, base);
            output[rootStr] = {
                base: rootStr,
                value: resultInBase
            };
        }
        console.log(JSON.stringify(output, null, 2));

    } catch (error) {
        console.error("An error occurred:", error);
    }
}

main();
