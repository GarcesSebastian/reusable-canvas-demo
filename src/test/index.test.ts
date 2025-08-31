import { Render } from "@/library/Render";
import { RenderTest } from "./render.test";
import { ShapeTest } from "./shape.test";

export class Test {
    public _render: Render;

    private _renderTest: RenderTest;
    private _shapeTest: ShapeTest;

    public constructor(render: Render) {
        this._render = render;

        this._renderTest = new RenderTest(render);
        this._shapeTest = new ShapeTest(render);
    }

    public start() {
        this._renderTest.start();
        this._shapeTest.start();
    }
}