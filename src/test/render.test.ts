import { Render, type _RenderEventClick } from "reusable-canvas-preview";

export class RenderTest {
    private _render: Render;

    public constructor(render: Render) {
        this._render = render;
    }

    public start() {
        this._render.on("click", (e) => {
            console.log(e);
        });
    }
}
    