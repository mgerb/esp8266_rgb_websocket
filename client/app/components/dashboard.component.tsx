import axios from 'axios';
import { Component, h } from 'preact';
import './dashboard.component.scss';

interface State {
  ssid: string;
  password: string;
  deviceId: string;
  host: string;
  port: string;

  message: string;
  error: boolean;
}

export class Dashboard extends Component<any, State> {
  constructor() {
    super();
    this.state = {
      ssid: '',
      password: '',
      deviceId: '',
      host: '',
      port: '',

      message: '',
      error: false,
    };
  }

  public submit() {
    const { ssid, password, deviceId, host, port } = this.state;

    if (ssid === '' || password === '' || deviceId === '' || host === '' || port === '') {
      this.setState({
        message: 'All fields are required.',
        error: true,
      });

      return;
    }

    axios.get('/submit', {
        params: {
          ssid,
          password,
          deviceId,
          host,
          port,
        },
      })
      .then(() => {
        this.setState({
          message: 'Success! Rebooting device.',
          error: false,
        });
      })
      .catch(() => {
        this.setState({
          message: 'Server error.',
          error: true,
        });
      });

    this.setState({
      ssid: '',
      password: '',
      deviceId: '',
      host: '',
      port: '',
    });
  }

  public render() {
    return (
      <div className="container">
        <div className="form-container">
          <div className="header">Device Information</div>

          <div className="form-content">
            <div className="label">Wifi SSID</div>
            <input
              className="input"
              placeholder="..."
              value={this.state.ssid}
              onInput={(e: any) => this.setState({ ssid: e.target.value })}
            />

            <div className="label">Wifi Password</div>
            <input
              className="input"
              type="password"
              placeholder="..."
              value={this.state.password}
              onInput={(e: any) => this.setState({ password: e.target.value })}
            />

            <div className="label">Device ID</div>
            <input
              className="input"
              placeholder="..."
              value={this.state.deviceId}
              onInput={(e: any) => this.setState({ deviceId: e.target.value })}
            />

            <div className="label">Host Address</div>
            <input
              className="input"
              placeholder="..."
              value={this.state.host}
              onInput={(e: any) => this.setState({ host: e.target.value })}
            />

            <div className="label">Port</div>
            <input
              className="input"
              placeholder="..."
              type="number"
              value={this.state.port}
              onInput={(e: any) => this.setState({ port: e.target.value })}
            />

            <div className="button-container">
              <div className={this.state.error ? 'error' : 'success'}>
                {this.state.message}
              </div>
              <button
                className="button"
                type="submit"
                onClick={this.submit.bind(this)}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
