import { Component, h } from 'preact';
import * as _ from 'lodash';
import { Sidebar } from './sidebar.component';
import './dashboard.component.scss';
import { Device } from './sidebar.component';

interface State {
  red: number;
  green: number;
  blue: number;
  selectedDevice?: Device;
}

export const SELECTED_DEVICE_KEY = 'selectedDevice';

export class Dashboard extends Component<any, State> {

  private url: string = `ws://${window.location.host}/ws/channel/`;
  private ws: WebSocket;

  constructor(props: any) {
    super(props);
    this.state = {
      red: 0,
      green: 0,
      blue: 0,
    };
  }

  public componentDidMount() {
    const selectedDevice: Device = JSON.parse(localStorage.getItem(SELECTED_DEVICE_KEY));
    this.setState({selectedDevice});
    if (_.get(this.state, 'selectedDevice.id')) {
      this.startWebSocket(this.state.selectedDevice.id);
    }
  }

  private onColorInput(color: string, value: string) {
    const newState = {};
    newState[color] = parseInt(value, 10);
    this.setState(newState);
    this.ws.send(JSON.stringify(this.state));
  }

  private onSelectedDevice(selectedDevice: Device): void {
    localStorage.setItem(SELECTED_DEVICE_KEY, JSON.stringify(selectedDevice));
    this.setState({selectedDevice});
    this.startWebSocket(this.state.selectedDevice.id);
  }

  private startWebSocket(id: string): void {
    if (this.ws) {
      this.ws.close();
    }
    this.ws = new WebSocket(this.url + id);
    this.ws.onmessage = this.onMessage;
  }

  private onMessage(event: any) {
    console.log(event);
  }

  public render() {

    const { red, green, blue } = this.state;

    return (
      <div className="container">

        <Sidebar onSelect={this.onSelectedDevice.bind(this)}/>

        <div  className="slider__container">
          <h3 style={{textAlign: 'center'}}>{_.get(this.state, 'selectedDevice.name')}</h3>

          <div className="flex--center">
            <input
              className="rgb-text-input"
              type="number"
              value={red.toString()}
              onInput={(e: any) => this.onColorInput('red', e.target.value)}
            />
            <input
              className="range red"
              type="range"
              min="0"
              max="255"
              value={this.state.red.toString()}
              onInput={(e: any) => this.onColorInput('red', e.target.value)}
            />
          </div>
          <div className="flex--center">
            <input
              className="rgb-text-input"
              type="number"
              value={green.toString()}
              onInput={(e: any) => this.onColorInput('green', e.target.value)}
            />
            <input
              className="range green"
              type="range"
              min="0"
              max="255"
              value={green.toString()}
              onInput={(e: any) => this.onColorInput('green', e.target.value)}
            />
          </div>
          <div className="flex--center">
            <input
              className="rgb-text-input"
              type="number"
              value={blue.toString()}
              onInput={(e: any) => this.onColorInput('blue', e.target.value)}
            />
            <input
              className="range blue"
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
