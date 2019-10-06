import React, { PureComponent } from 'react';
import './LineDrawer.style.scss';

class LineDrawer extends PureComponent {
    constructor() {
        super();
        this.x1 = React.createRef();
        this.y1 = React.createRef();
        this.x2 = React.createRef();
        this.y2 = React.createRef();
        this.canvas = React.createRef();
        this.DrawCanvas = React.createRef();

        this.state = {
            checked: true
        };
    }

    componentDidMount() {
        this.drawLines();
    }

    getInputFromFields() {
        const canvas = this.canvas.current.getBoundingClientRect();
        const { checked } = this.state;
        const x1 = checked ? canvas.width / 2 : parseInt(this.x1.current.value, 10);
        const y1 = checked ? canvas.height / 2 : parseInt(this.y1.current.value, 10);
        const x2 = parseInt(this.x2.current.value, 10);
        const y2 = parseInt(this.y2.current.value, 10);
        this.drawLine(x1, y1, x2, y2);
    }

    drawLines() {
        const canvas = this.canvas.current.getBoundingClientRect();
        const ctx = this.canvas.current.getContext('2d');

        ctx.strokeStyle = '#000';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height);
        ctx.lineTo(canvas.width, 0);
        ctx.stroke();
        ctx.moveTo(canvas.width, canvas.height);
        ctx.lineTo(0, 0);
        ctx.stroke();
    }

    drawLine(x1, y1, x2, y2, color = '#000', ctx = this.canvas.current.getContext('2d'), fill = true) {
        let xn = x1;
        let yn = y1;
        const dx = Math.abs(x2 - x1);
        const dy = Math.abs(y2 - y1);
        const xi = (x1 < x2) ? 1 : -1;
        const yi = (y1 < y2) ? 1 : -1;
        ctx.fillStyle = color;
        if (fill) ctx.fillRect(x1, y1, 1, 1);
        else ctx.clearRect(x1, y1, 1, 1);
        if (dx >= dy) {
            let pn = 2 * dy - dx;
            while (xn !== x2) {
                xn += xi;
                if (pn > 0) {
                    yn += yi;
                    pn += 2 * (dy - dx);
                } else {
                    pn += 2 * dy;
                }
                if (fill) ctx.fillRect(xn, yn, 1, 1);
                else ctx.clearRect(xn, yn, 1, 1);
            }
        } else {
            let pn = 2 * dx - dy;
            while (yn !== y2) {
                yn += yi;
                if (pn < 0) {
                    pn += 2 * dx;
                } else {
                    xn += xi;
                    pn += 2 * (dx - dy);
                }
                if (fill) ctx.fillRect(xn, yn, 1, 1);
                else ctx.clearRect(xn, yn, 1, 1);
            }
        }
    }

    drawUserMovingLine(e) {
        const {
            mouseDown, startX, startY, lastX2, lastY2
        } = this.state;
        const canvas = this.canvas.current.getBoundingClientRect();
        const ctx = this.DrawCanvas.current.getContext('2d');
        const x2 = e.clientX - canvas.left;
        const y2 = e.clientY - canvas.top;
        if (mouseDown) {
            this.drawLine(startX, startY, lastX2, lastY2, '#fff', ctx, false);
            this.drawLine(startX, startY, x2, y2, '#000', ctx);
        }
        this.setState({ lastX2: x2, lastY2: y2 });
    }

    clearCanvas() {
        const canvas = this.canvas.current.getBoundingClientRect();
        const ctx = this.canvas.current.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawLines();
    }

    startUserLineDraw(e) {
        const canvas = this.canvas.current.getBoundingClientRect();
        this.setState({ mouseDown: true, startX: e.clientX - canvas.left, startY: e.clientY - canvas.top });
    }

    stopUserLineDraw() {
        const {
            startX, startY, lastX2, lastY2
        } = this.state;
        this.setState({ mouseDown: false });
        const canvas = this.DrawCanvas.current.getBoundingClientRect();
        const ctx = this.DrawCanvas.current.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.drawLine(startX, startY, lastX2, lastY2);
    }

    toggleCheckedState() {
        const { checked } = this.state;
        this.setState({ checked: !checked });
    }

    renderCanvas() {
        return (
            <>
                <canvas
                  ref={ this.canvas }
                  className="Canvas"
                  width={ 500 }
                  height={ 500 }
                />
                <canvas
                  ref={ this.DrawCanvas }
                  className="Draw-canvas"
                  width={ 500 }
                  height={ 500 }
                  onMouseDown={ (e) => this.startUserLineDraw(e) }
                  onMouseUp={ () => this.stopUserLineDraw() }
                  onMouseMove={ (e) => this.drawUserMovingLine(e) }
                />
                <div
                  className="wrapper"
                >
                    { this.renderFromCenter() }
                    <label htmlFor="x1" className="coord-input">
                        X2
                        <input
                          id="x1"
                          type="number"
                          className="radiusbox"
                          ref={ this.x2 }
                        />
                    </label>
                    <label htmlFor="y2" className="coord-input">
                        Y2
                        <input
                          id="y2"
                          type="number"
                          className="radiusbox"
                          ref={ this.y2 }
                        />
                    </label>
                    <button
                      className="drawbtn"
                      onClick={ () => this.getInputFromFields() }
                    >
                        Draw
                    </button>
                    <button
                      className="drawbtn"
                      onClick={ () => this.clearCanvas() }
                    >
                        Clear canvas
                    </button>
                </div>
            </>
        );
    }

    renderFromCenter() {
        const { checked } = this.state;
        return (
            <>
                <label className="coord-input" htmlFor="centerCheckbox">
                    X1 and Y1 are center
                    <input
                      id="centerCheckbox"
                      type="checkbox"
                      defaultChecked={ checked }
                      onChange={ () => this.toggleCheckedState() }
                    />
                </label>
                <label
                  htmlFor="x1"
                  className="coord-input"
                >
                    X1
                    <input
                      id="x1"
                      type="number"
                      className="radiusbox"
                      ref={ this.x1 }
                      disabled={ checked }
                    />
                </label>
                <label
                  htmlFor="y1"
                  className="coord-input"
                >
                    Y1
                    <input
                      id="y1"
                      type="number"
                      className="radiusbox"
                      ref={ this.y1 }
                      disabled={ checked }
                    />
                </label>
            </>
        );
    }


    render() {
        return (
            this.renderCanvas()
        );
    }
}

export default LineDrawer;
