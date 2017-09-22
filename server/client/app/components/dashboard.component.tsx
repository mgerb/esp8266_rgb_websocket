import { Component, h } from 'preact';
import * as _ from 'lodash';
import { Sidebar } from './sidebar.component';
import './dashboard.component.scss';
import { Device } from '../model';
import { Storage } from '../storage';

interface State {
  red: number;
  green: number;
  blue: number;
  selectedDevice?: Device;
}

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
    const selectedDevice: Device = Storage.getSelectedDevice();
    this.setState({selectedDevice});
    if (_.get(this.state, 'selectedDevice.id')) {
      this.startWebSocket(this.state.selectedDevice.id);
    }
  }

  private onColorInput(color: string, value: string) {
    const newState = {};
    newState[color] = parseInt(value, 10);
    this.setState(newState);

    const data = _.cloneDeep(this.state);
    delete data.selectedDevice;
    this.ws.send(JSON.stringify(data));
  }

  private onSelectedDevice(selectedDevice: Device): void {
    this.setState({selectedDevice});
    this.startWebSocket(this.state.selectedDevice.id);
  }

  private startWebSocket(id: string): void {
    if (this.ws) {
      this.ws.close();
    }
    this.ws = new WebSocket(this.url + id);

    // get initial RGB values on open websocket
    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({type: 'init'}));
    };

    this.ws.onmessage = this.onMessage.bind(this);
  }

  private onMessage(event: any) {

    const { type, red, green, blue} = JSON.parse(event.data);

    if (type === 'init') {
      this.setState({
        red,
        green,
        blue,
      });
    }
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
