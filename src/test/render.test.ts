import { Render, type RenderEventClick, type RenderEventMouseMove } from "reusable-canvas-preview";

export class RenderTest {
    private _render: Render;

    public constructor(render: Render) {
        this._render = render;
    }

    public start() {
        this._render.on("click", (e: RenderEventClick) => {
            console.log(e);
        });

        this._render.on("mousedown", (e: RenderEventMouseMove) => {
            console.log(e);
        });
    }
}
    