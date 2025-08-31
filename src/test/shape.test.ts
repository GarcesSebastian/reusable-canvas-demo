import { Vector } from "reusable-canvas-preview";
import { Render, type ShapeEventClick } from "reusable-canvas-preview";

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
            rotation: 5,
            zIndex: 2,
        });

        this._render.creator.Rect({
            
        })

        const circle = this._render.creator.Circle({
            position: new Vector(100, 100),
            radius: 50,
            color: "red",
            zIndex: 1,
        });

        rect.on("click", (evt: ShapeEventClick) => {
            console.log(evt)
        })

        this._render.on("top", () => {
            circle.setTop();
        })

        this._render.on("bottom", () => {
            circle.setBottom();
        })

        this._render.on("front", () => {
            circle.setFront();
        })

        this._render.on("back", () => {
            circle.setBack();
        })
    }
}