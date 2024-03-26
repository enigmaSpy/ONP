const userInput = document.querySelector(".form__input");
const onpTable = document.querySelector(".table__tbody");

let onpResult = [
    // {tact: 1,  input: userInput.value,stack: " ", outp: "Początek"},
]
const prorityTable = [
    { name: "(", value: 0 },
    { name: "+", value: 1 },
    { name: "-", value: 1 },
    { name: "*", value: 2 },
    { name: "/", value: 2 },
    { name: "^", value: 3 },
    { name: ")", value: 0 },
    { name: "sin", value: 4 },
    { name: "cos", value: 4 },
    { name: "tan", value: 4 },
    { name: "cot", value: 4 },
    { name: "log", value: 4 },
    { name: "ln", value: 4 },
    { name: "NEG", value: 4 },
];
const operations = prorityTable.map(item => item.name);
let stack = [];
let output = [];

const textResults =(inf,pos)=>{
    const results = document.querySelectorAll(".form__result--text");

    results[0].innerText = inf;
    results[1].innerText = pos;
};

const checkIfValid = () => {
    return new Promise((resolve) => {
        const word = userInput.value.trim();
        word = word.toLowerCase();
        if (word === "") resolve("empty");
        if (word.length < 3) resolve("toShort")
        const binaryOperation = operations.slice(1, 6);
        const unaryOperation = operations.slice(7);
        for (let symbol of binaryOperation) {
            if (word[0] === symbol || word[word.length - 1] === symbol) {
                resolve(false);
            }
        }
        for (let symbol of unaryOperation) {
            if (word[word.length - 1] === symbol) {
                resolve(false);
            }
        }
        resolve(true);
    });
};
const stackToOutput = () => {
    for (let i = stack.length - 1; i >= 0; i--) {
        let item = stack[i];
        if (item.name !== "(" && item.name !== ")") {
            output.push(item.name);
        }
    }
    stack = [];
    renderTable();
};
const handleSymbol = (symbol) => {
    const symbolData = prorityTable.find(item => item.name === symbol);
    if (!symbolData) {
        console.error(`Symbol ${symbol} not found in priority table`);
        return;
    }
    if (symbolData.name === ")") {
        let item;
        while ((item = stack.pop()).name !== "(") {
            output.push(item.name);
        }
        return;
    }
    if (symbolData.name === ")") {
        const bracketForm = [];
        for (let i = stack.length - 1; i >= 0; i--) {
            let item = stack[i];
            if (item.name === "(") {
                bracketForm.push(stack.pop().name);
            }
        }
        output = output.concat(bracketForm.reverse());
        return;
    }
    if (stack.length === 0) {
        stack.push(symbolData);
        return;
    };
    if (stack[stack.length - 1].value < symbolData.value || symbolData.name === "(") {
        stack.push(symbolData)
        return;
    } else {
        stackToOutput();
        stack.push(symbolData);
        return;
    }
}
const handleChar = (char) => {
    if (char === " ") return false;
    operations.includes(char) ? handleSymbol(char) : output.push(char);
}

const renderTable = () => {
    onpTable.innerHTML = "";
    table = onpResult.map(item => {
        return `<tr>
        <td>${item.tact}</td>
        <td>${item.input}</td>
        <td>${item.stack}</td>
        <td>${item.outp}</td>
        </tr>`
    }).join("");
    onpTable.innerHTML += table;
}

const rpn = async () => {

    const btn = document.querySelector(".form__button");
    btn.addEventListener("click", async e => {
        e.preventDefault();
        onpResult = [];
        stack = [];
        output = [];
        const validation = await checkIfValid();
        switch (validation) {
            case "empty":
                return console.error("Pusty wyraz");
            case "toShort":
                return console.error("Za krótki");
            case false:
                return console.error("Błąd składniowy");

            default:
                break;
        }

        const result = userInput.value.trim();
        const tokens = result.match(/log|ln|sin|cos|tan|cot|NEG|\b\w\b|[+\-*/()^]/g);
        const symbols = ["-", "+", "*", "/", "^"]

        tokens.forEach((char, index) => {
            if (index > 0 && symbols.includes(char) && symbols.includes(tokens[index - 1])) {
                console.error("Dwa symbole obok siebie: " + tokens[index - 1] + " i " + char);
                return;
            }
            handleChar(char);
            onpResult.push({
                tact: index + 1,
                input: char,
                stack: stack.map(item => item.name).join(""),
                outp: output.join("")
            });
            if (index === tokens.length - 1) {
                stackToOutput();
            }

        });
        onpTable.innerHTML += `
        <tr>
        <td>${onpResult.length + 1}</td>
        <td>;</td>
        <td></td>
        <td>${output.join("")}</td>
        </tr>
        `;
        textResults(userInput.value,output.join(""));
        console.log(stack);
        console.log(output);
    });
}
rpn()
