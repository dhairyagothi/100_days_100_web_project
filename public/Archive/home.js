/*
*
*   Author : Raunak Singh 
*   Github : https://github.com/raunaksingh9800
*   Date 📅: 23 Jun 2024
*        
*   File Use : Gateway to the Script of homepage
*
*   Description 📄: 
             > this is home.js and this file is broken into 3 parts (

                - variable declaration and slection of html elements
                - Render DOM
                - Search Algorithm and Animation  

             ) 
   
                these parts are broken into more parts:

                    - variable declaration (line : 114 ) 
                        in this the main variable are projectData 
                        and the GRID_LAYOUT . Rest are self explanatory

                            1. projectData (line : 114 ) : 
                                This object is used to store the projects made and then   
                                map them to index.html using render DOM
                                the object structure is: 
                                <day : int> : {
                                    title : string,
                                    tag : string,
                                    href : string,
                                    description : string
                                }

                            2. GRID_LAYOUT (line : 285  ) :
                                When we use the grid layout to render the card randomly , 
                                Somtimes there are gaps felt empty to prevent this we use 
                                grid engine and we randomly select one of the grid config
                                out of the 3 . Now these layout is designed carefully to leave
                                no gaps but we renender one by one it wont look randome 
                                so we make 3 config which leaves no gap and then romdonly 
                                select them so this makes it look random .

                                < screen-breakpoint : [md , lg, xl ] > : <style : [row-tall, col-wide , '' ] > 

                    - Selection of html elements ( Line : 298 ) 
                        This part is self explanatory
                    
                    - Render DOM ( Line : 321 )
                        This part also has two parts inside it (

                            - Component Maker
                            - Append

                        )
                            1. Component Maker ( Line : 321 )
                                In this part we use document.createElement to create a div
                                and assign it style with class property using tailwindcss
                                And give the div a onclick function pointing to the href

                                Now the id plays a important role because when a user searchs 
                                the id tag is used to get the card and give the glow effect

                                next this func arguments are name, title ...... 
                                now we just create the element and return the component 
                                when the func is called

                            2. Append ( Line : 363 ) 
                                In this part as mentioned above we use a math func to generate 
                                random number between 0 and 2 . accordingly we append the component 
                                to the index.html 

                    - Search Algorithm and Animation ( Line : 404 ) 
                        This Part is also in two section ( 

                            - Keyboard Event
                            - Search Func

                        )

                            1 . Keyboard Event ( Line : 404 ) 
                                Over here we use basic JS to listen for keypress and accordingly
                                do some work
                                
                                For inputBox.onkeyup we just listen for an keypress and if so we
                                filter the projectdDtaTitle to find any match

                                In event.key === "Enter" what ever is the first suggestion in the list
                                take us there

                                Supports : ctrl + K or command + K to open search
                            
                            2. Search Func ( Line : 443 ) 
                                This is very simple 
                                    The dis(result) func is used to display the suggestion in a li form
                                    and added onClick and the arg result is just used to map

                                    The show() is used to search UI and activate the search Func

                                    The hide(index) is used to hide the search UI but also passed argument
                                    index to take user to the div
*
*/



// VAR - start
const projectData = {
    1: {
        title: "To-do List",
        tag: "tool",
        href: "TO_DO_LIST/todolist.html",
        description: "The To-do List project involves creating a comprehensive task management application. Users can add, delete, and manage their daily tasks with ease. The application will feature an intuitive user interface where tasks can be categorized, marked as complete, and prioritized. This project will help you understand fundamental concepts of web development, including DOM manipulation, event handling, and data storage using local storage or a backend database. It is a great way to enhance productivity and keep track of daily activities.",
    },
    2: {
        title: "Digital Clock",
        tag: "time",
        href: "digital_clock/digitalclock.html",
        description: "The Digital Clock project focuses on creating a real-time clock that displays the current time dynamically. This clock will update every second to show hours, minutes, and seconds, providing a live timepiece within a web page. You will learn how to use JavaScript to manipulate the DOM and handle timing events with setInterval. Additionally, you can customize the clock's appearance using CSS to make it visually appealing, demonstrating your skills in both functionality and design.",
    },
    3: {
        title: "Indian Flag",
        tag: "Design",
        href: "indianflag/flag.html",
        description: "The Indian Flag project involves designing the Indian national flag using HTML and CSS. This project will guide you through creating a precise and accurate representation of the flag by understanding CSS properties such as positioning, background colors, and dimensions. By the end of this project, you will have a deeper appreciation for layout design and how to use CSS to create intricate designs. It's a great exercise for improving your front-end development skills and attention to detail.",
    },
    4: {
        title: "Dropdown Navigation Bar",
        tag: "Web Development",
        href: "dropdown_navbar/index.html",
        description: "The Dropdown Navigation Bar project aims to create a responsive and interactive navigation bar with dropdown menus. This navigation bar will allow users to navigate through different sections of a website effortlessly. You will learn how to use HTML for structuring the menu, CSS for styling and positioning, and JavaScript for adding interactivity. This project is essential for understanding how to create user-friendly interfaces that enhance the overall user experience on a website.",
    },
    5: {
        title: "Animated Cursor",
        tag: "Web Design",
        href: "Animated-cursor/animated-cursor.html",
        description: "The Animated Cursor project involves creating custom cursor animations that enhance the user experience on a website. By modifying the default cursor appearance and adding animations, you can create a unique and engaging interaction for users. This project will teach you how to use CSS animations and JavaScript event handling to create dynamic cursor effects. It's a fun and creative way to learn more about CSS and JavaScript while adding a distinctive touch to your web projects.",
    },
    6: {
        title: "Auto Background Image Slider",
        tag: "Image",
        href: "Background-Image-sider/slider.html",
        description: "The Auto Background Image Slider project aims to create a dynamic background image slider that automatically transitions between images. This slider will enhance the visual appeal of a website by displaying a series of images in a smooth and automated manner. You will learn how to use JavaScript to manage the timing of image transitions, CSS to style the images and transitions, and HTML to structure the slider. This project is perfect for understanding how to create engaging and visually dynamic web elements.",
    },
    7: {
        title: "tagwriter Effect",
        tag: "Animation",
        href: "typewriter/typewriter.html",
        description: "The tagwriter Effect project involves creating a tagwriter animation effect where text is displayed as if it is being tagd out in real-time. This effect can be used to draw attention to specific text or create engaging introductions on a website. You will learn how to use JavaScript to control the timing of each character being displayed and CSS to style the text. This project will enhance your skills in creating animations and improving user interface design by adding an element of interactivity.",
    },
    8: {
        title: "Parallax Website",
        tag: "Web Design",
        href: "Parallel-x website/parallal.html",
        description: "The Parallax Website project involves creating a website with a parallax scrolling effect. In this effect, background images move at different speeds compared to the foreground content, creating an illusion of depth and immersion. You will learn how to use CSS for setting up the parallax effect and JavaScript for adding smooth scrolling behavior. This project will help you understand advanced web design techniques and how to create visually captivating websites that offer a unique user experience.",
    },
    9: {
        title: "CAPTCHA Generator",
        tag: "tool",
        href: "captcha/captcha.html",
        description: "The CAPTCHA Generator project involves creating a CAPTCHA system to verify human users and prevent automated bots from accessing certain parts of a website. You will learn how to generate random CAPTCHA codes, display them to users, and validate the user input using JavaScript. This project will help you understand the importance of web security and how to implement basic security measures in your web applications to protect against spam and automated attacks.",
    },
    10: {
        title: "QR Code Generator",
        tag: "tool",
        href: "qr generator/qr.html",
        description: "The QR Code Generator project aims to create an application that generates QR codes for various inputs, such as URLs, text, or contact information. You will learn how to use JavaScript libraries to generate QR codes dynamically and display them on a web page. This project will help you understand how to integrate external libraries into your web applications and provide useful functionalities that can be utilized in a variety of contexts, from marketing to information sharing.",
    },
    11: {
        title: "Serving Website Using Express",
        tag: "Web Development",
        href: "index.html",
        description: "The Serving Website Using Express project involves setting up a web server using Express.js, a popular web framework for Node.js. You will learn how to create server-side routes to serve HTML, CSS, and JavaScript files, handle HTTP requests, and manage middleware. This project will enhance your skills in backend development and help you understand the server-client architecture, providing a solid foundation for building full-stack web applications.",
    },
    12: {
        title: "Nodemailer Gmail Sender",
        tag: "Web API",
        href: "gmail_nodemailer/public/mail.html",
        description: "The Nodemailer Gmail Sender project involves creating an application that sends emails using Nodemailer and Gmail's SMTP service. You will learn how to set up and configure Nodemailer, handle user inputs for email addresses and messages, and send emails programmatically. This project will help you understand the basics of email protocols, how to integrate email functionality into your web applications, and enhance your skills in backend development using Node.js.",
    },
    13: {
        title: "Login Form Using MERN",
        tag: "Auth",
        href: "https://github.com/dhairyagothi/50_days_50_web_project/tree/Main/public/loginusingmern",
        description: "The Login Form Using MERN project involves creating a login form with user authentication using the MERN stack (MongoDB, Express.js, React.js, and Node.js). You will learn how to set up a backend server, create a frontend interface for user registration and login, and manage user data in a MongoDB database. This project will help you understand full-stack development, user authentication processes, and how to build secure web applications that handle sensitive user information.",
    },
    14: {
        title: "File Uploader",
        tag: "File Handling",
        href: "https://github.com/dhairyagothi/50_days_50_web_project/tree/Main/public/file_uploader",
        description: "The File Uploader project involves creating an application that allows users to upload files to a server. You will learn how to handle file uploads using HTML forms, process the files on the server using Node.js and Express.js, and store the files in a designated directory. This project will help you understand how to manage file uploads in web applications, handle user inputs securely, and manage server-side file storage efficiently.",
    },
    15: {
        title: "Progress Bar",
        tag: "Web Design",
        href: "progress_bar/progress_bar.html",
        description: "The Progress Bar project involves creating a dynamic progress bar that updates as tasks are completed. You will learn how to use HTML, CSS, and JavaScript to create a visually appealing progress bar that reflects the progress of various activities or processes. This project will help you understand how to use JavaScript to manipulate the DOM, create interactive UI components, and provide visual feedback to users about the status of their actions.",
    },
    16: {
        title: "Scroll Bar CSS",
        tag: "CSS",
        href: "index.html",
        description: "The Scroll Bar CSS project involves customizing the appearance of the browser's scroll bar using CSS. You will learn how to use CSS properties to change the size, color, and style of the scroll bar, making it more visually appealing and consistent with the overall design of your website. This project will enhance your skills in CSS and help you understand how to improve the visual aesthetics of web applications by customizing standard browser elements.",
    },
    17: {
        title: "Slider Using Swiper API",
        tag: "Web API",
        href: "slider box/index.html",
        description: "The Slider Using Swiper API project involves creating a responsive and interactive image slider using the Swiper API. You will learn how to integrate the Swiper library into your web application, configure various settings for the slider, and customize its appearance using CSS. This project will help you understand how to use third-party libraries to add advanced functionalities to your web applications and create engaging user interfaces that enhance the overall user experience.",
    },
    18: {
        title: "Solar System Carousel Website",
        tag: "Design",
        href: "carousal/index.html",
        description: "The Solar System Carousel Website project involves creating a website with a carousel that displays the planets of the solar system. You will learn how to use HTML, CSS, and JavaScript to create an interactive carousel that allows users to explore different planets by clicking on them. This project will enhance your skills in using CSS animations, JavaScript for interactivity, and integrating 3D models or images into web design, providing a visually appealing and educational user experience.",
    },
    19: {
        title: "Planto",
        tag: "Design",
        href: "plantwebsite/plant.html",
        description: "The Planto project involves creating a web application focused on plant care and management. Users can track their plants, set reminders for watering, and receive tips on plant care. This project will help you understand how to develop feature-rich applications with a focus on user interaction and data management. You will learn how to create a user-friendly interface, manage user inputs, and store data in a backend database. This project is perfect for understanding the full development cycle of a web application and creating a useful tool for plant enthusiasts.",
    },
    20: {
        title: "EveSparks",
        tag: "Web Development",
        href: "https://evesparks.onrender.com/",
        description: "The EveSparks project involves creating a web application designed for event management and planning. Users can create events, send invitations, and manage RSVPs. This project will enhance your skills in developing applications that handle user inputs, event scheduling, and notifications. You will learn how to create a backend server to manage event data, a frontend interface for users to interact with, and implement features that ensure a smooth and efficient event management process.",
    },
    21: {
        title: "Video Background Slider Using React",
        tag: "ReactJs",
        href: "https://github.com/dhairyagothi/50_days_50_web_project/tree/Main/public/travel_website",
        description: "The Video Background Slider Using React project involves creating a dynamic slider with video backgrounds using React.js. Users will see a series of video clips as background elements that slide automatically or can be controlled manually. This project will help you understand how to use React components, manage state and props, and integrate multimedia elements into your web applications. It's a great way to learn how to create visually engaging and interactive web components using modern front-end development techniques.",
    },
    22: {
        title: "Page Loader",
        tag: "Web",
        href: "./pageloader/pageloader.html",
        description: "The Page Loader project involves creating a loading animation that displays while a web page is loading. This project will help in enhancing user experience by providing visual feedback during page load times. You will learn how to use CSS for animations, JavaScript for controlling the display of the loader, and how to optimize the loading times of web pages. This project is essential for creating smooth and user-friendly web applications that keep users engaged even during loading periods.",
    },
    23: {
        title: "AI ChatBot",
        tag: "Ai",
        href: "./AI ChatBot/chatbot.html",
        description: "The AI ChatBot project involves creating a chatbot that uses artificial intelligence to interact with users. This chatbot will be capable of understanding and responding to user inputs, providing assistance, answering questions, or even performing tasks. You will learn how to integrate AI and machine learning models into your web applications, handle user inputs, and provide meaningful responses. This project will help you understand the basics of AI, how to use AI APIs, and create interactive applications that enhance user engagement and functionality.",
    },
    24: {
        title: "Tic-Tac-Toe",
        tag: "Game",
        href: "TicTacToe/index.html",
        description: "The Tic-Tac-Toe project involves creating an interactive tic-tac-toe game using HTML, CSS, and JavaScript. Users will be able to play the game against the computer or another player, with the game logic determining the winner. You will learn how to implement game logic, manage user interactions, and create a responsive game board. This project is perfect for understanding the fundamentals of game development, DOM manipulation, and creating interactive web applications that provide entertainment and engagement.",
    },
    25: {
        title: "Maze Game",
        tag: "game",
        href: "./Maze-Game-main/index.html",
        description: "The Maze Game project involves creating an interactive maze game where users navigate through a maze to reach an endpoint. You will learn how to generate maze layouts, handle user inputs for navigation, and detect collisions with maze walls. This project will enhance your skills in game development, JavaScript logic, and user interaction. By creating a challenging and engaging game, you will understand how to keep users entertained and create immersive experiences on the web.",
    },
    26: {
        title: "Memory Game",
        tag: "Web Development",
        href: "./MemoryGame/index.html",
        description: "The Memory Game project involves creating a card-matching memory game using HTML, CSS, and JavaScript. Players will flip cards to find matching pairs, testing their memory skills. You will learn how to create the game board, implement game logic for matching cards, and handle user interactions. This project will help you understand the principles of game development, JavaScript event handling, and DOM manipulation, resulting in a fun and educational game that improves cognitive skills.",
    },
    27: {
        title: "Wordle",
        tag: "game",
        href: "./WORDLE/index.html",
        description: "The Wordle project involves creating a word puzzle game inspired by the popular Wordle game. Players will guess a hidden word by inputting different word attempts, with the game providing feedback on the correctness of each guess. You will learn how to implement game logic, manage user inputs, and provide visual feedback. This project will help you understand how to create engaging word-based games, handle complex game states, and improve your skills in JavaScript and user interaction design.",
    },
    28: {
        title: "Snake Game",
        tag: "game",
        href: "./snake_game/index.html",
        description: "The Snake Game project involves creating the classic Snake game using HTML, CSS, and JavaScript. Players control a snake to collect food and grow in length, with the goal of achieving the highest score possible. You will learn how to implement game logic, handle user inputs for controlling the snake, and create smooth animations. This project will help you understand the basics of game development, JavaScript animations, and creating interactive user interfaces that provide entertainment and engagement.",
    },
}

const GRID_LAYOUT_V1 = [' ', '', 'xl:row-tall xl:col-wide', ' xl:row-tall ', 'xl:col-wide']
const GRID_LAYOUT_V2 = ['xl:row-tall xl:col-wide ', '', '', ' xl:row-tall ', 'xl:col-wide']
const GRID_LAYOUT_V3 = ['xl:row-tall xl:col-wide ', 'xl:row-tall', '', ' xl:row-tall ', '']

const projectDataLenght = Object.keys(projectData).length
let projectDataTitle = [];
const isMobile = window.innerWidth <= '724px'
let counterLoop = 1;
let isSearchOpen = false
let result = []
// VAR - end 

//  SLECTION OF HMTL ELEMENTS - start
const resultBox = document.querySelector('[searchList]')
const inputBox = document.querySelector('[search-input-box]')
const searchPage = document.querySelector('[search-compo]')
const searchButton = document.getElementById('searchButton')
const crossButton = document.getElementById('crossButton')
const containerForAppendOfGridBox = document.querySelector('[parent-grid-system]');
//  SLECTION OF HMTL ELEMENTS - end



window.onload = function () {
    for (i = 1; i <= projectDataLenght; i++) { projectDataTitle.push(projectData[i].title) }
    console.log(projectDataTitle)

}



/*
* RENDER DOME 
*       Component Maker (part 1) - start
*/

function componentMaker(num, config, title, tag, description, link) {
    const component = document.createElement('div');
    component.onclick = function () {
        window.location.href = `${link}`;
    };
    component.className = `animationBlock ${config} overflow-hidden bg-gray-900 w-full overflow-x-hidden flex flex-col rounded-xl px-5`;
    component.id = num;
    component.innerHTML = `
        <div class="flex flex-col">
            <div class="w-full flex flex-row justify-between text-sm pt-4">
                <div class="uppercase font-bold opacity-50">
                    ${tag}
                </div>
                <div class="opacity-30 font-semibold">
                    #${num}
                </div>
            </div>
            <div class="pt-5 font-medium text-2xl">
                ${title}
            </div>  
            <div class="pt-2 text-base opacity-50 text-clip truncate text-wrap w-full h-32">
                <p>${description}</p>
            </div>
        </div>
    `;
    return component;
}

/*
* RENDER DOME 
*       Component Maker (part 1) - end
*/

// GRID ENGINE
for (i = 0; i < (projectDataLenght); i++) {
    if (i % 5 == 0) {
        let x = Math.floor(Math.random() * 3);
        for (j = 0; j < 5; j++) {
            /*
            * RENDER DOME 
            *       Append (part 2) - start
            */
            try {
                if (x == 0) {
                    console.log("GV1-", counterLoop)
                    containerForAppendOfGridBox.appendChild(componentMaker(counterLoop, GRID_LAYOUT_V1[j], projectData[counterLoop].title, projectData[counterLoop].tag, projectData[counterLoop].description, projectData[counterLoop].href));
                }
                if (x == 1) {
                    console.log("GV2-", counterLoop)
                    containerForAppendOfGridBox.appendChild(componentMaker(counterLoop, GRID_LAYOUT_V2[j], projectData[counterLoop].title, projectData[counterLoop].tag, projectData[counterLoop].description, projectData[counterLoop].href));
                }
                if (x == 2) {
                    console.log("GV3-", counterLoop)
                    containerForAppendOfGridBox.appendChild(componentMaker(counterLoop, GRID_LAYOUT_V3[j], projectData[counterLoop].title, projectData[counterLoop].tag, projectData[counterLoop].description, projectData[counterLoop].href));
                }
            }
            catch {
            }
            /*
            * RENDER DOME 
            *       Append (part 2) - end
            */
            counterLoop++;
        }

    }

}




function openGithub() {
    window.location.href = "https://github.com/dhairyagothi/50_days_50_web_project"
}




/*
* SEAECH ALGORITHM AND ANIMATION
*        Keyboard Event ( part 1) - start
*/
inputBox.onkeyup = function () {

    let input = inputBox.value;
    if (input.length) {
        result = projectDataTitle.filter((keyword) => {
            return keyword.toLowerCase().includes(input.toLowerCase())
        });
    }
    dis(result)
}
window.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        if (isSearchOpen) {
            hide(projectDataTitle.indexOf(result[0]))
        }
    }
});
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        if (isSearchOpen) hide()
    }
});
document.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && event.which == 75) {
        show()
    }
});

/*
* SEAECH ALGORITHM AND ANIMATION
*        Keyboard Event ( part 1) - end
*/



/*
* SEAECH ALGORITHM AND ANIMATION
*        Search Func  ( part 2 ) - start
*/
function dis(result) {
    const content = result.map((list) => {
        const index = projectDataTitle.indexOf(list); // Get the index of the item in the main array
        return `<li class="pt-4" onclick="hide(${index})">${list}</li>`;
    })

    resultBox.innerHTML = "<ul>" + content.join('') + "</ul>"
}

function show() {
    searchPage.style = " height: 100vh; opacity: 1;transition: height 0ms 0ms, opacity 400ms 0ms; "
    inputBox.focus();
    isSearchOpen = true
    document.getElementById('bodyTag').style = "overflow : hidden;"
    searchButton.style = "display : none;"
    crossButton.style = "display : block;"
}
function hide(index) {
    isSearchOpen = false
    searchPage.style = `
            overflow: hidden;
            height: 0;
            opacity: 0;
            transition: height 0ms 400ms, opacity 400ms 0ms;
            transition: height 0ms 400ms, opacity 400ms 0ms;`;
    searchButton.style = "display : block;"
    crossButton.style = "display : none;"
    resultBox.style = "display : none;"
    document.getElementById('bodyTag').style = `
    height: 100%;margin: 0;
    overflow-x: hidden;`

    window.location.href = `#${index + 1}`
    document.getElementById(`${index + 1}`).scrollIntoView({ behavior: 'smooth', block: 'center' });

    if (isMobile) {
        document.getElementById(`${index + 1}`).style = `animation: backgroundSlip 3s ease-in  ;`
    }
    else {
        document.getElementById(`${index + 1}`).style = `animation: backgroundSlip 1.5s ease-in  ;`
    }


    setTimeout(() => {
        document.getElementById(`${index + 1}`).style = `
        animation: appear ease-in ;
        animation-timeline: view();
        animation-range: entry 0% cover 30%;`
    }, (isMobile) ? 3000 : 1500)


}
function showLi() {
    resultBox.style = "display : block;"
}
/*
* SEAECH ALGORITHM AND ANIMATION
*        Search Func  ( part 2 ) - end
*/
