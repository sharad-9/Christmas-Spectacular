// --- Global Variables & Setup ---
        const PARALLAX_LAYERS = document.querySelectorAll('.parallax-layer');
        const COUNTDOWN_TARGET = new Date("December 25, 2025 00:00:00").getTime();
        const snowContainer = document.querySelector('.snow-container');
        const NUM_SNOWFLAKES = 70; 

        // --- 1. Complex JS Animation: Parallax Scroll Effect ---
        function applyParallax() {
            // Check if the element exists before trying to access properties
            if (!PARALLAX_LAYERS.length) return; 
            
            const scrollPos = window.pageYOffset;

            PARALLAX_LAYERS.forEach(layer => {
                const speed = layer.classList.contains('layer-deep-bg') ? 0.2 :
                              layer.classList.contains('layer-mid-bg') ? 0.5 : 0; 

                // Using translate3d ensures the browser uses the GPU for acceleration, making it smoother
                const yPos = scrollPos * speed;
                layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });
        }

        // Optimized event listener using requestAnimationFrame
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    applyParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // --- 2. Complex JS Animation: Countdown Timer ---
        function updateCountdown() {
            // Check if element exists before updating
            const countdownDisplay = document.getElementById("countdown-display");
            if (!countdownDisplay) return;

            const now = new Date().getTime();
            const distance = COUNTDOWN_TARGET - now;

            if (distance < 0) {
                countdownDisplay.innerHTML =
                    "<p class='text-4xl text-yellow-400 font-bold'>MERRY CHRISTMAS 2025!</p>";
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            // Update DOM
            document.getElementById("days").textContent = String(days).padStart(2, '0');
            document.getElementById("hours").textContent = String(hours).padStart(2, '0');
            document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
            document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
        }


        // --- 3. Dynamic Snow Generation using only JS and CSS ---
        function generateSnow() {
            if (!snowContainer) return; // Exit if container isn't found
            
            for (let i = 0; i < NUM_SNOWFLAKES; i++) {
                const flake = document.createElement('div');
                flake.classList.add('snow');

                const left = Math.random() * 100;
                const size = Math.random() * 3 + 1;
                const duration = Math.random() * 10 + 10; 
                const delay = Math.random() * -20; 

                flake.style.left = `${left}vw`;
                flake.style.width = `${size}px`;
                flake.style.height = `${size}px`;
                flake.style.animationDuration = `${duration}s`;
                flake.style.animationDelay = `${delay}s`;

                snowContainer.appendChild(flake);
            }
        }

       function setupAudioControl() {
            const audio = document.getElementById('christmas-music');
            const muteButton = document.getElementById('mute-button');
            const muteIcon = document.getElementById('mute-icon');

            // Set the audio to be muted initially due to browser autoplay restrictions
            // We will rely on the user clicking the button to start playback
            audio.muted = true;

            // Define icon SVGs (Volume 2 for On, Volume X for Off)
            const iconVolumeOn = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>';
            const iconVolumeOff = '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="22" x2="16" y1="9" y2="15"/><line x1="16" x2="22" y1="9" y2="15"/>'; 

            const updateIcon = () => {
                // Determine mute status by checking if audio is muted OR paused (initial state)
                muteIcon.innerHTML = (audio.muted || audio.paused) ? iconVolumeOff : iconVolumeOn;
            };

            const toggleMute = () => {
                if (audio.muted || audio.paused) {
                    // Try to unmute and play
                    audio.muted = false;
                    audio.play().catch(e => console.error("Audio play failed:", e));
                } else {
                    // Mute and pause
                    audio.muted = true;
                    audio.pause();
                }
                updateIcon();
            };

            muteButton.addEventListener('click', toggleMute);

            // Attempt to play and unmute once on the first user interaction 
            // This is the common workaround for browser autoplay policies
            document.addEventListener('click', () => {
                if (audio.paused && audio.muted) {
                     audio.muted = false; // Unmute initially
                     audio.play().catch(e => console.log("Autoplay blocked, user must click mute button."));
                }
            }, { once: true }); 
            
            // Initial state check should show muted/paused icon
            updateIcon(); 
        }

        function startTitleMarquee() {
            // Message for the title bar, including padding
            const MARQUEE_TEXT = "MERRY CHRISTMAS SPECTACULAR 2025 🎁 HAPPY HOLIDAYS! 🌟 ";
            let currentTitle = MARQUEE_TEXT;

            // Function to shift the characters and update the title
            function shiftTitle() {
                // Move the first character to the end
                currentTitle = currentTitle.substring(1) + currentTitle.substring(0, 1);
                document.title = currentTitle;
            }

            // Update the title every 200 milliseconds (0.2 seconds)
            setInterval(shiftTitle, 400);
        }

        function setupMobileMenu() {
            const toggleButton = document.getElementById('menu-toggle');
            const mobileMenu = document.getElementById('mobile-menu');
            const menuIcon = document.getElementById('menu-icon');
            
            // Icon SVGs (Menu and Close)
            const iconMenu = '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>';
            const iconClose = '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>';

            if (!toggleButton || !mobileMenu) return;

            const toggleMenu = () => {
                const isHidden = mobileMenu.classList.toggle('hidden');
                
                // Toggle icon based on whether the menu is hidden or visible
                menuIcon.innerHTML = isHidden ? iconMenu : iconClose;
            };

            toggleButton.addEventListener('click', toggleMenu);

            // Close menu if a link is clicked to navigate
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    mobileMenu.classList.add('hidden');
                    menuIcon.innerHTML = iconMenu;
                });
            });
        }


        // FIX: Use DOMContentLoaded for reliable initialization
        document.addEventListener('DOMContentLoaded', () => {
            // 1. Generate Snow Particles dynamically
            generateSnow();
            // 2. Apply initial Parallax settings
            applyParallax();
            // 3. Start the main JS loop (Countdown)
            setInterval(updateCountdown, 1000);
            updateCountdown(); 
            setupAudioControl();
            startTitleMarquee();
            setupMobileMenu();
        });