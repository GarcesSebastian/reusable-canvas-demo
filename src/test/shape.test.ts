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

        this._render.transformer.add(rect);

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

        txt.on("input", (e: _ShapeEventInput) => {
            console.log(e.value)
        })
    }
}