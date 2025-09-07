import { Vector } from "reusable-canvas-preview";
import { Render, type _ShapeEventClick, type _ShapeEventInput } from "reusable-canvas-preview";

export class ShapeTest {
    private _render: Render;

    public constructor(render: Render) {
        this._render = render;
    }

    public start() {
        const rect = this._render.creator.Rect({
            position: new Vector(200, 200),
            width: 100,
            height: 100,
            color: "blue",
            zIndex: 2,
        });

        const rect2 = this._render.creator.Rect({
            position: new Vector(600, 400),
            width: 100,
            height: 100,
            color: "red",
            zIndex: 1,
        });

        const circle = this._render.creator.Circle({
            position: new Vector(200, 200),
            radius: 50,
            color: "green",
            zIndex: 3,
        });

        let isPressed = false;
        const throtle = 10; //ms
        let lastUpdate = performance.now();

        this._render.on("update", () => {
            const now = performance.now();
            if (now - lastUpdate < throtle) return;
            lastUpdate = now;
            
            if (!isPressed) return;
            
            const mousePos = this._render.mousePosition()
            const screenPos = this._render.toScreenCoordinates(rect.position)
            const direction = mousePos.sub(screenPos).normalize()

            rect.position = rect.position.add(direction.scale(3));
        })

        window.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "p") {
                isPressed = !isPressed;
                if (isPressed) {
                    this._render.currentCamera.bindForce(rect);
                } else {
                    this._render.currentCamera.unbind();
                }
            }
        });

        const txt = this._render.creator.Text({
            position: new Vector(400, 400),
            text: "Input Text...",
            fontSize: 20,
            fontFamily: "Arial",
            fontWeight: "bold",
            fontStyle: "normal",
            textAlign: "left",
            color: "white",
            backgroundColor: "rgba(255,0,0,1)",
            borderWidth: 2,
            borderColor: "white",
            padding: { top: 5, right: 5, bottom: 5, left: 5 },
            zIndex: 4,
        });

        Array.from({ length: 1 }).forEach((_, i) => {
            this._render.creator.Image({
                position: new Vector(Render.randomInt(0, this._render.canvas.width), Render.randomInt(0, this._render.canvas.height)),
                src: "https://spriteforge.garcessebastian.com/logo.png",
                width: 100,
                height: 100,
                zIndex: 5,
                cornerRadius: 10,
                borderWidth: 2,
                borderColor: "white",
            });
        })

        txt.on("input", (e: _ShapeEventInput) => {})
    }
}