const runBtn = document.getElementById("runBtn");
const output = document.getElementById("output");

const stages = [
    "lexical",
    "syntax",
    "semantic",
    "intermediate",
    "optimization",
    "target"
];

class CompilerEngine {

    constructor(code){
        this.code = code;
    }

    lexicalAnalysis(){

        const regex =
        /\b(int|float|char|if|else|for|while|return)\b|[a-zA-Z_]\w*|\d+|[+\-*/=;(){}]/g;

        const tokens = this.code.match(regex) || [];

        let html = "";

        tokens.forEach(token=>{

            let cls="identifier";

            if(
                ["int","float","char","if","else","for","while","return"]
                .includes(token)
            ){
                cls="keyword";
            }
            else if(/^\d+$/.test(token)){
                cls="number";
            }
            else if(/[+\-*/=;]/.test(token)){
                cls="operator";
            }

            html += `<span class="token ${cls}">${token}</span>`;
        });

        return html;
    }

    syntaxAnalysis(){

        const lines =
        this.code.split("\n")
        .filter(line=>line.trim());

        return lines
        .map(line=>`✓ ${line.trim()}`)
        .join("\n");
    }

    semanticAnalysis(){

        return `
✓ Variable Declaration Check Passed

✓ Type Check Passed

✓ Scope Validation Passed
`;
    }

    intermediateCode(){

        return `
t1 = a + b
c = t1
`;
    }

    optimization(){

        return `
Before:
t1 = a + b
c = t1

After:
c = a + b
`;
    }

    targetCode(){

        return `
MOV R1, a
MOV R2, b
ADD R3, R1, R2
MOV c, R3
`;
    }
}

function resetStages(){

    stages.forEach(id=>{

        const stage=document.getElementById(id);

        stage.classList.remove(
            "active",
            "completed"
        );
    });
}

function activateStage(id){

    document
    .getElementById(id)
    .classList.add("active");
}

function completeStage(id){

    const stage=document.getElementById(id);

    stage.classList.remove("active");
    stage.classList.add("completed");
}

async function visualize(){

    resetStages();

    const code =
    document.getElementById("codeInput").value;

    const compiler =
    new CompilerEngine(code);

    const phaseOutputs = {

        lexical:
        compiler.lexicalAnalysis(),

        syntax:
        compiler.syntaxAnalysis(),

        semantic:
        compiler.semanticAnalysis(),

        intermediate:
        compiler.intermediateCode(),

        optimization:
        compiler.optimization(),

        target:
        compiler.targetCode()
    };

    for(const phase of stages){

        activateStage(phase);

        output.innerHTML =
        phaseOutputs[phase];

        await new Promise(resolve =>
            setTimeout(resolve,1200)
        );

        completeStage(phase);
    }
}

runBtn.addEventListener(
    "click",
    visualize
);