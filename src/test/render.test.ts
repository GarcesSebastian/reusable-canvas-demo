import { Render, type _RenderEventClick, type _RenderEventMouseMove } from "reusable-canvas-preview";

export class RenderTest {
    private _render: Render;

    public constructor(render: Render) {
        this._render = render;
    }

    public start() {
        this._render.on("click", (e: _RenderEventClick) => {
            console.log(e);
        });

        this._render.on("mousemove", (e: _RenderEventMouseMove) => {
            console.log(e);
        });
    }
}
    