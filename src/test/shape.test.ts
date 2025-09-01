import { Vector } from "reusable-canvas-preview";
import { Render, type _ShapeEventClick } from "reusable-canvas-preview";

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

        this._render.creator.Rect({
            position: new Vector(600, 400),
            width: 100,
            height: 100,
            color: "red",
            zIndex: 1,
        });    
        
        this._render.creator.Circle({
            position: new Vector(200, 200),
            radius: 50,
            color: "green",
            zIndex: 3,
        });

        this._render.creator.Text({
            position: new Vector(200, 200),
            text: "Hello",
            fontSize: 30,
            fontFamily: "Arial",
            fontWeight: "bold",
            fontStyle: "italic",
            textAlign: "center",
            textBaseline: "bottom",
            color: "white",
            zIndex: 4,
        });

        const speed = 5;
        const states = {
            w: false,
            s: false,
            a: false,
            d: false,
        }

        this._render.on("update", () => {
            let direction = new Vector(0, 0);

            if (states.w) {
                direction = direction.add(new Vector(0, -1));
            }

            if (states.s) {
                direction = direction.add(new Vector(0, 1));
            }

            if (states.a) {
                direction = direction.add(new Vector(-1, 0));
            }

            if (states.d) {
                direction = direction.add(new Vector(1, 0));
            }

            rect.position = rect.position.add(direction.scale(speed));

            if (direction.x !== 0 || direction.y !== 0) {
                this._render.currentCamera.bind(rect.position);
            }
        })

        window.addEventListener("keydown", (e: KeyboardEvent) => {
            if (e.key === "w") {
                states.w = true;
            }

            if (e.key === "s") {
                states.s = true;
            }

            if (e.key === "a") {
                states.a = true;
            }

            if (e.key === "d") {
                states.d = true;
            }
        });

        window.addEventListener("keyup", (e: KeyboardEvent) => {
            if (e.key === "w") {
                states.w = false;
            }

            if (e.key === "s") {
                states.s = false;
            }

            if (e.key === "a") {
                states.a = false;
            }

            if (e.key === "d") {
                states.d = false;
            }
        });
    }
}