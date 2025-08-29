/**
 * ██████╗ ██╗  ██╗ █████╗ ███╗   ██╗████████╗ ██████╗ ███╗   ███╗
 * ██╔══██╗██║  ██║██╔══██╗████╗  ██║╚══██╔══╝██╔═══██╗████╗ ████║
 * ██████╔╝███████║███████║██╔██╗ ██║   ██║   ██║   ██║██╔████╔██║
 * ██╔═══╝ ██╔══██║██╔══██║██║╚██╗██║   ██║   ██║   ██║██║╚██╔╝██║
 * ██║     ██║  ██║██║  ██║██║ ╚████║   ██║   ╚██████╔╝██║ ╚═╝ ██║
 * ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝
 * Copyright (c) 2025 Rıza Emre ARAS <r.emrearas@proton.me>
 */

(function(window) {
    'use strict';

    // Main ASCII art
    const phantomASCII = [
        '   ██████╗ ██╗  ██╗ █████╗ ███╗   ██╗████████╗ ██████╗ ███╗   ███╗',
        '   ██╔══██╗██║  ██║██╔══██╗████╗  ██║╚══██╔══╝██╔═══██╗████╗ ████║',
        '   ██████╔╝███████║███████║██╔██╗ ██║   ██║   ██║   ██║██╔████╔██║',
        '   ██╔═══╝ ██╔══██║██╔══██║██║╚██╗██║   ██║   ██║   ██║██║╚██╔╝██║',
        '   ██║     ██║  ██║██║  ██║██║ ╚████║   ██║   ╚██████╔╝██║ ╚═╝ ██║',
        '   ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝    ╚═════╝ ╚═╝     ╚═╝'
    ].join('\n');

    // PhantomASCII class
    class PhantomASCII {
        constructor(elementId, options = {}) {
            this.element = document.getElementById(elementId);
            if (!this.element) {
                console.warn(`PhantomASCII: Element with id '${elementId}' not found`);
                return;
            }

            // Default options
            this.options = {
                animationSpeed: options.animationSpeed || 500,
                autoStart: options.autoStart || false,
                onFrame: options.onFrame || null,
                onStart: options.onStart || null,
                onStop: options.onStop || null,
                onError: options.onError || null,
            };

            // Animation state
            this.isPlaying = false;
            this.interval = null;
            this.frame = 0;

            // Initialize
            this.element.textContent = phantomASCII;
            
            if (this.options.autoStart) {
                this.start();
            }
        }

        // Pulse effect
        pulseFrame() {
            const lines = phantomASCII.split('\n');
            const intensity = this.frame % 4;
            
            const pulsedLines = lines.map(line => {
                return line.split('').map(char => {
                    if (char === '█') {
                        switch (intensity) {
                            case 0: return '░';
                            case 1: return '▒';
                            case 2: return '▓';
                            case 3: return '█';
                        }
                    }
                    return char;
                }).join('');
            });
            
            this.element.textContent = pulsedLines.join('\n');
            this.frame++;

            // Call frame callback if provided
            if (this.options.onFrame) {
                this.options.onFrame(this.frame, intensity);
            }
        }

        // Start animation
        start() {
            if (this.isPlaying) return;

            this.isPlaying = true;
            this.frame = 0;

            // Call start callback if provided
            if (this.options.onStart) {
                this.options.onStart();
            }

            // Run first frame immediately
            this.pulseFrame();

            // Set up interval
            this.interval = setInterval(() => {
                this.pulseFrame();
            }, this.options.animationSpeed);
        }

        // Stop animation
        stop() {
            if (!this.isPlaying) return;

            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }

            this.isPlaying = false;
            
            // Reset to original
            this.element.textContent = phantomASCII;

            // Call stop callback if provided
            if (this.options.onStop) {
                this.options.onStop();
            }
        }

        // Toggle animation
        toggle() {
            if (this.isPlaying) {
                this.stop();
            } else {
                this.start();
            }
        }

        // Set animation speed
        setSpeed(speed) {
            this.options.animationSpeed = speed;
            
            // If playing, restart with new speed
            if (this.isPlaying) {
                this.stop();
                this.start();
            }
        }

        // Set error state
        setError(message) {
            // Stop any running animation
            this.stop();
            
            // Add error class
            this.element.classList.add('error');
            
            // Hide the ASCII art when error occurs
            this.element.style.display = 'none';
            
            // Call error callback if provided
            if (this.options.onError) {
                this.options.onError(message);
            }
        }

        // Clear error state
        clearError() {
            // Remove error class
            this.element.classList.remove('error');
            
            // Show the ASCII art again
            this.element.style.display = '';
            
            // Reset to original ASCII
            this.element.textContent = phantomASCII;
        }

        // Destroy instance
        destroy() {
            this.stop();
            this.clearError();
            
            this.element = null;
        }
    }

    // Export to global scope
    window.PhantomASCII = PhantomASCII;

})(window);