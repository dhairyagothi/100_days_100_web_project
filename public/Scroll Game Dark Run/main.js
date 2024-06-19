$(document).ready(function () {
    const hero = $("#hero");
    const obstacles = $(".obstacle");
    const bush = $(".bush");
    const floor = $(".floor");
    const object = $(".object");
    const finishLine = $("#finishLine");
    let gameRunning = true;
    let timerStarted = false;
    let startTime, intervalId;
    let highestScore = 0;
    const scrollSpeed = 20; // Increased speed for scrolling
    let isJumping = false;
    let lastScrollTime = 0;
    let isRunningRight = false;
    let isRunningLeft = false;
    let lastDirection = "idle-right"; // Start with idle-right
    let touchStartX = 0;
    let touchStartY = 0;

    function setHeroState(state) {
        hero.removeClass("idle-right idle-left running-right running-left");
        hero.addClass(state);
    }

    function handleIdleState() {
        if (lastDirection === "running-right") {
            setHeroState("idle-right");
        } else if (lastDirection === "running-left") {
            setHeroState("idle-left");
        } else {
            setHeroState("idle-right");
        }
    }

    setHeroState("idle-right");

    function startTimer() {
        startTime = Date.now();
        intervalId = setInterval(updateTimer, 100);
    }

    function updateTimer() {
        const now = Date.now();
        const elapsed = now - startTime;

        const minutes = Math.floor(elapsed / (1000 * 60));
        const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
        const milliseconds = Math.floor((elapsed % 1000) / 100);

        $("#chronometer, .chronometer").text(`${pad(minutes, 2)}:${pad(seconds, 2)}`);
    }

    function pad(number, length) {
        return number.toString().padStart(length, "0");
    }

    // Handle scrolling for both mouse wheel and touch events
    function handleScroll(scrollDirection) {
        $(".start").fadeOut();

        const now = Date.now();
        if (!gameRunning || now - lastScrollTime < 16) return; // Limit to 60 fps
        lastScrollTime = now;

        if (!timerStarted) {
            startTimer();
            timerStarted = true;
        }

        if (scrollDirection < 0 && !isRunningRight) {
            isRunningRight = true;
            isRunningLeft = false;
            lastDirection = "running-right";
            setHeroState("running-right");
        } else if (scrollDirection > 0 && !isRunningLeft) {
            isRunningLeft = true;
            isRunningRight = false;
            lastDirection = "running-left";
            setHeroState("running-left");
        }
        

        // Reset to idle state immediately when scrolling stops
        clearTimeout(hero.data("scrollTimeout"));
        hero.data(
            "scrollTimeout",
            setTimeout(() => {
                isRunningRight = false;
                isRunningLeft = false;
                handleIdleState();
            }, 200)
        ); // Adjust the delay as needed

        requestAnimationFrame(() => {
            $(".obstacle, .bush, .floor, .object, #finishLine").each(function () {
                const left = parseInt($(this).css("left"));
                $(this).css("left", left - scrollDirection * scrollSpeed + "px");
            });
            checkWin();
            checkHeroSilhouetteOverlap();
        });
    }

    $(window).on("mousewheel DOMMouseScroll", function (e) {
        const delta = e.originalEvent.wheelDelta || -e.originalEvent.detail;
        const scrollDirection = delta < 0 ? 1 : -1;
        handleScroll(scrollDirection);
    });

    // Handle touch events for scrolling
    $(document).on("touchstart", function (e) {
        touchStartX = e.originalEvent.touches[0].pageX;
        touchStartY = e.originalEvent.touches[0].pageY;
    });

    $(document).on("touchmove", function (e) {
        const touchEndX = e.originalEvent.touches[0].pageX;
        const touchEndY = e.originalEvent.touches[0].pageY;
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            const scrollDirection = deltaX < 0 ? 1 : -1;
            handleScroll(scrollDirection);
        }
    });

    // Handle Arrow Up key and touch events for jumping
    $(document).keydown(function (e) {
        if (!gameRunning || isJumping) return;

        if (e.key === "ArrowUp") {
            handleJump();
        }
    });

    $(document).on("touchstart", function (e) {
        const touchEndY = e.originalEvent.touches[0].pageY;

        if (touchStartY - touchEndY > 50) { // Swipe up detected
            handleJump();
        }
    });

    function handleJump() {
        if (!gameRunning || isJumping) return;

        isJumping = true;
        hero.addClass("jump");
        setTimeout(() => {
            hero.removeClass("jump");
            isJumping = false;
        }, 500); // Duration of the jump
    }

    function checkCollision() {
        const tolerance = 10;
        const heroPos = hero[0].getBoundingClientRect();

        $(".obstacle").each(function () {
            const obstaclePos = this.getBoundingClientRect();

            if (
                !(
                    heroPos.right < obstaclePos.left + tolerance ||
                    heroPos.left > obstaclePos.right - tolerance ||
                    heroPos.bottom < obstaclePos.top ||
                    heroPos.top > obstaclePos.bottom
                )
            ) {
                gameOver();
            }
        });
    }

    setInterval(checkCollision, 100);

    function checkWin() {
        const heroPos = hero[0].getBoundingClientRect();
        const finishPos = finishLine[0].getBoundingClientRect();

        if (
            !(
                heroPos.right < finishPos.left ||
                heroPos.left > finishPos.right ||
                heroPos.bottom < finishPos.top ||
                heroPos.top > finishPos.bottom
            )
        ) {
            gameWin();
        }
    }

    function gameOver() {
        if (!gameRunning) return;
        gameRunning = false;
        clearInterval(intervalId);
        $(".start").fadeOut();
				$(".game-over").fadeIn();
    }

    function gameWin() {
        if (!gameRunning) return;
        gameRunning = false;
        clearInterval(intervalId);
        const now = Date.now();
        const elapsed = now - startTime;
        if (elapsed < highestScore || highestScore === 0) {
            highestScore = elapsed;
            const minutes = Math.floor(highestScore / (1000 * 60));
            const seconds = Math.floor((highestScore % (1000 * 60)) / 1000);
            const milliseconds = Math.floor((highestScore % 1000) / 10);
            $("#highestScore, .highestScore").text(
                `${pad(minutes, 2)}:${pad(seconds, 2)}`
            );
        }
        $(".win").fadeIn();
			$(".bestTime").fadeIn();
			
    }

    $(".restartButton").click(function () {
        resetGame();
        $(".game-over, .win").fadeOut();
    });

    function resetGame() {
        gameRunning = true;
        timerStarted = false;
        clearInterval(intervalId);
        $("#chronometer, .chronometer").text("00:00");

        // Reset hero position
        hero.css("top", "calc(50% + 200px)");
        hero.removeClass("invert");

        // Reset obstacles, bush, floor, and finish line positions
        $(".obstacle, .bush, .floor, .object, #finishLine").each(function () {
            $(this).css("left", $(this).data("initialLeft"));
        });
    }

    // Store initial positions
    $(".obstacle, .bush, .floor, .object, #finishLine").each(function () {
        $(this).data("initialLeft", $(this).css("left"));
    });

    // Loop through each .bush element
    $(".bush").each(function (index) {
        var $bush = $(this);

        function toggleObstacle() {
            $bush.toggleClass("obstacle monster");
            setTimeout(
                toggleObstacle,
                $bush.hasClass("obstacle monster")
                    ? getToggleTime(index, true)
                    : getToggleTime(index, false)
            );
        }

        toggleObstacle();
    });

    // Function to get the toggle time based on the index and class status
    function getToggleTime(index, isObstacle) {
        // Define the toggle times for each nth-child
        var toggleTimes = [
            [3000, 4000], // nth-child(1)
            [4000, 5000], // nth-child(2)...
            [5000, 6500],
            [3500, 4000],
            [6000, 7000]
        ];

        // Return the appropriate time based on the index and class status
        return isObstacle ? toggleTimes[index][0] : toggleTimes[index][1];
    }

    function checkHeroSilhouetteOverlap() {
        const heroPos = hero[0].getBoundingClientRect();
        let heroInFrontOfEyes = false;

        $(".silhouette").each(function () {
            const bushPos = this.getBoundingClientRect();

            if (
                !(
                    heroPos.right < bushPos.left ||
                    heroPos.left > bushPos.right ||
                    heroPos.bottom < bushPos.top ||
                    heroPos.top > bushPos.bottom
                )
            ) {
                heroInFrontOfEyes = true;
            }
        });

        if (heroInFrontOfEyes) {
            hero.addClass("invert");
        } else {
            hero.removeClass("invert");
        }
    }
});

