import React, { useEffect, useRef, useState } from 'react';

const FireworksIntro = ({ onComplete }) => {
    const canvasRef = useRef(null);
    const [opacity, setOpacity] = useState(1);
    const [textScale, setTextScale] = useState(0.8);
    const [textOpacity, setTextOpacity] = useState(0);

    useEffect(() => {
        // Reveal text animation
        const textTimer = setTimeout(() => {
            setTextScale(1);
            setTextOpacity(1);
        }, 100);

        // Fade out sequence
        const fadeOutTimer = setTimeout(() => {
            setOpacity(0);
        }, 2500); // Start fading before 3s

        const completeTimer = setTimeout(() => {
            onComplete && onComplete();
        }, 3000);

        return () => {
            clearTimeout(textTimer);
            clearTimeout(fadeOutTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        let fireworks = [];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Utility functions
        const random = (min, max) => Math.random() * (max - min) + min;

        // Firework class
        class Firework {
            constructor(sx, sy, tx, ty) {
                this.x = sx;
                this.y = sy;
                this.sx = sx;
                this.sy = sy;
                this.tx = tx;
                this.ty = ty;
                this.distanceToTarget = Math.sqrt(Math.pow(tx - sx, 2) + Math.pow(ty - sy, 2));
                this.distanceTraveled = 0;
                this.coordinates = [];
                this.coordinateCount = 3;
                while (this.coordinateCount--) {
                    this.coordinates.push([this.x, this.y]);
                }
                this.angle = Math.atan2(ty - sy, tx - sx);
                this.speed = 2;
                this.acceleration = 1.05;
                this.brightness = random(50, 70);
                this.targetRadius = 1;
            }

            update(index) {
                this.coordinates.pop();
                this.coordinates.unshift([this.x, this.y]);

                this.speed *= this.acceleration;
                const vx = Math.cos(this.angle) * this.speed;
                const vy = Math.sin(this.angle) * this.speed;

                this.distanceTraveled = Math.sqrt(Math.pow(this.x - this.sx, 2) + Math.pow(this.y - this.sy, 2));

                if (this.distanceTraveled >= this.distanceToTarget) {
                    createParticles(this.tx, this.ty);
                    fireworks.splice(index, 1);
                } else {
                    this.x += vx;
                    this.y += vy;
                }
            }

            draw() {
                ctx.beginPath();
                ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
                ctx.lineTo(this.x, this.y);
                ctx.strokeStyle = `hsl(${random(0, 360)}, 100%, ${this.brightness}%)`;
                ctx.stroke();
            }
        }

        // Particle class
        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.coordinates = [];
                this.coordinateCount = 5;
                while (this.coordinateCount--) {
                    this.coordinates.push([this.x, this.y]);
                }
                this.angle = random(0, Math.PI * 2);
                this.speed = random(1, 10);
                this.friction = 0.95;
                this.gravity = 1;
                this.hue = random(0, 360);
                this.brightness = random(50, 80);
                this.alpha = 1;
                this.decay = random(0.015, 0.03);
            }

            update(index) {
                this.coordinates.pop();
                this.coordinates.unshift([this.x, this.y]);
                this.speed *= this.friction;
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed + this.gravity;
                this.alpha -= this.decay;

                if (this.alpha <= this.decay) {
                    particles.splice(index, 1);
                }
            }

            draw() {
                ctx.beginPath();
                ctx.moveTo(this.coordinates[this.coordinates.length - 1][0], this.coordinates[this.coordinates.length - 1][1]);
                ctx.lineTo(this.x, this.y);
                ctx.strokeStyle = `hsla(${this.hue}, 100%, ${this.brightness}%, ${this.alpha})`;
                ctx.stroke();
            }
        }

        const createParticles = (x, y) => {
            let particleCount = 50;
            while (particleCount--) {
                particles.push(new Particle(x, y));
            }
        };

        // Main loop
        const loop = () => {
            animationFrameId = requestAnimationFrame(loop);

            // Trail effect
            ctx.globalCompositeOperation = 'destination-out';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = 'lighter';

            // Randomly launch fireworks
            if (Math.random() < 0.25) {
                fireworks.push(new Firework(
                    canvas.width / 2,
                    canvas.height,
                    random(0, canvas.width),
                    random(0, canvas.height / 2)
                ));
            }

            let i = fireworks.length;
            while (i--) {
                fireworks[i].draw();
                fireworks[i].update(i);
            }

            let j = particles.length;
            while (j--) {
                particles[j].draw();
                particles[j].update(j);
            }
        };

        loop();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-500 ease-out"
            style={{ opacity, pointerEvents: opacity === 0 ? 'none' : 'auto' }}
        >
            <canvas
                ref={canvasRef}
                className="absolute inset-0 block w-full h-full"
            />

            <div
                className="relative z-10 text-center text-white"
                style={{
                    transform: `scale(${textScale})`,
                    opacity: textOpacity,
                    transition: 'transform 1s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 1s ease-out'
                }}
            >
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)] font-sans">
                    Feliz y próspero Año Nuevo
                </h1>
            </div>
        </div>
    );
};

export default FireworksIntro;
