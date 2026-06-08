const input = document.getElementById("commandInput");
const output = document.getElementById("output");

const commands = {

  help: `
Available Commands:

help       → Show all commands
about      → About me
skills     → My skills
projects   → My projects
contact    → Contact info
date       → Current date
clear      → Clear terminal
hack       → Start hacking 😈
pwd        → Show current directory
whoami     → Show current user
ls         → List files
`,

  about: `
Hi 👋
I am Sapna Jha.

Frontend Developer
Cybersecurity Learner
Open Source Enthusiast
`,

  skills: `
HTML
CSS
JavaScript
React
Git & GitHub
Cybersecurity Basics
`,

  projects: `
1. Fake Hacker Terminal
2. Portfolio Website
3. Dev Detective
4. Password Generator
`,

  contact: `
GitHub: https://github.com/sapnajha757

LinkedIn:
https://in.linkedin.com/in/sapna-jha-672598387
`
};

input.addEventListener("keydown", function(e){

  if(e.key === "Enter"){

    const command = input.value.trim().toLowerCase();

    output.innerHTML += `
<div class="command">
root@terminal:~$ ${command}
</div>
`;

    // CLEAR COMMAND
    if(command === "clear"){

      output.innerHTML = "";
    }

    // DATE COMMAND
    else if(command === "date"){

      output.innerHTML += `
<div class="response">
${new Date()}
</div>
`;
    }

    // HACK COMMAND
    else if(command === "hack"){

      output.innerHTML += `
<div class="response">
Initializing hack sequence...

Connecting to secure server...
Bypassing firewall...
Accessing encrypted files...
Downloading secret data...

Hack Complete ✅
</div>
`;
    }

    // PWD COMMAND
    else if(command === "pwd"){

      output.innerHTML += `
<div class="response">
/home/sapna/projects
</div>
`;
    }

    // WHOAMI COMMAND
    else if(command === "whoami"){

      output.innerHTML += `
<div class="response">
sapna
</div>
`;
    }

    // LS COMMAND
    else if(command === "ls"){

      output.innerHTML += `
<div class="response">
projects   documents   secrets.txt
</div>
`;
    }

    // COMMANDS OBJECT
    else if(commands[command]){

      output.innerHTML += `
<div class="response">
${commands[command]}
</div>
`;
    }

    // INVALID COMMAND
    else{

      output.innerHTML += `
<div class="response">
Command not found ❌

Type "help"
</div>
`;
    }

    // CLEAR INPUT
    input.value = "";

    // AUTO SCROLL
    output.scrollTop = output.scrollHeight;
  }

});