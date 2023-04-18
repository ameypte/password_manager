export const simpleColumnarTranspositionDecrypt = (text, key) => {
    let plainText = "";
    const numOfColumns = Math.ceil(text.length / key.length);
    const numOfRows = key.length;

    const matrix = Array.from({ length: numOfRows }, () => []);

    let k = 0;
    for (let i = 0; i < numOfColumns; i++) {
        for (let j = 0; j < numOfRows; j++) {
            if (k < text.length) {
                matrix[j][i] = text[k];
                k++;
            }
        }
    }

    const sortedKey = [...key].sort();
    const colIndices = key.split("").map((char) => sortedKey.indexOf(char));

    for (let i = 0; i < numOfRows; i++) {
        for (let j = 0; j < numOfColumns; j++) {
            plainText += matrix[i][colIndices[j]] || "";
        }
    }

    return plainText;
};

export const multipleColumnarTranspositionDecrypt = (text, keys) => {
    let plainText = text;

    keys.forEach((key) => {
        plainText = simpleColumnarTranspositionDecrypt(plainText, key);
    });

    return plainText;
};

export const railFenceDecrypt = (text, key) => {
    const numOfRows = key;
    const numOfCols = Math.ceil(text.length / numOfRows);

    const matrix = Array.from({ length: numOfRows }, () => []);
    let index = 0;
    for (let i = 0; i < numOfCols; i++) {
        for (let j = 0; j < numOfRows; j++) {
            if (index < text.length) {
                matrix[j][i] = text[index];
                index++;
            }
        }
    }

    let plainText = "";
    let row = 0,
        col = 0;
    let dir = -1;

    for (let i = 0; i < text.length; i++) {
        if (row === 0 || row === numOfRows - 1) {
            dir = -dir;
        }
        plainText += matrix[row][col];
        row += dir;
        col++;
    }

    return plainText;
};
