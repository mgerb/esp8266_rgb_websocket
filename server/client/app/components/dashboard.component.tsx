import { Component, h } from 'preact';
import './dashboard.component.scss';

interface Props {}

interface State {
  red: number;
  green: number;
  blue: number;
}

export class Dashboard extends Component<Props, State> {

  private url: string = `ws://localhost:5000/ws/channel/1`;
  private ws: WebSocket;

  constructor(props: Props) {
    super(props);
    this.state = {
      red: 0,
      green: 0,
      blue: 0,
    };
  }

  public componentDidMount() {
    this.ws = new WebSocket(this.url);

  }

  private onColorInput(color: string, value: string) {
    const newState = {};
    newState[color] = parseInt(value, 10);

    this.setState(newState);

    this.ws.send(JSON.stringify(this.state));
  }

  public render() {

    const {red, green, blue} = this.state;

    return (
      <div className="container" style={{background: `rgb(${red},${green},${blue}`}}>
        <div>
          <div>
            <input
              type="range"
              min="0"
              max="255"
              value={this.state.red.toString()}
              onInput={(e: any) => this.onColorInput('red', e.target.value)}
            />
          </div>
          <div>
            <input
              type="range"
              min="0"
              max="255"
              value={this.state.green.toString()}
              onInput={(e: any) => this.onColorInput('green', e.target.value)}
            />
          </div>
          <div>
            <input
              type="range"
              min="0"
              max="255"
              value={this.state.blue.toString()}
              onInput={(e: any) => this.onColorInput('blue', e.target.value)}
            />
          </div>
        </div>
      </div>
    );
  }
}
