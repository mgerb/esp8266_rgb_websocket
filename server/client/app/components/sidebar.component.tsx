import { Component, h } from 'preact';
import * as _ from 'lodash';

import { Device } from '../model';
import { Storage } from '../storage';

import './sidebar.component.scss';

interface Props {
  onSelect: (device) => void;
}

interface State {
  closed: boolean;
  newDeviceId: string;
  newDeviceName: string;
  selectedDevice?: Device;
  devices?: Device[];
}

export class Sidebar extends Component<Props, State> {

  constructor(props: any) {
    super(props);
    this.state = {
      closed: true,
      newDeviceId: '',
      newDeviceName: '',
      devices: [],
    };
  }

  public componentDidMount() {
    const devices: Device[] = Storage.getAllDevices();
    const selectedDevice: Device = Storage.getSelectedDevice();
    this.setState({devices, selectedDevice});
  }

  private addDevice(): void {
    const { newDeviceId, newDeviceName } = this.state;
    Storage.addDevice({id: newDeviceId, name: newDeviceName});

    const devices = Storage.getAllDevices();

    // set selected device to the newly added device
    const selectedDevice = _.find(devices, (d: Device) => d.id === newDeviceId);
    this.selectDevice(selectedDevice);

    this.setState({
      newDeviceId: '',
      newDeviceName: '',
      devices,
    });
  }

  private removeDevice(id: string): void {
    Storage.removeDevice(id);
    this.setState({
      devices: Storage.getAllDevices(),
    });
  }

  private selectDevice(selectedDevice: Device): void {
    Storage.setSelectedDevice(selectedDevice);
    this.props.onSelect(selectedDevice);
    this.setState({selectedDevice});
  }

  private renderDevices() {
    const { devices } = this.state;
    return _.map(devices, (device: Device, index: any) => {
      return (
        <div className="sidebar__device" key={index} onClick={() => this.selectDevice(device)}>
          <div>
            <div>{device.name}</div>
          </div>
          <div>
            {_.get(this.state, 'selectedDevice.id') === device.id && <i className="fa fa-check"/>}
            <i className="fa fa-trash sidebar__trash" onClick={() => this.removeDevice(device.id)}/>
          </div>
        </div>
      );
    });
  }

  public render() {

    const { closed, newDeviceId, newDeviceName } = this.state;

    return (
      <div className={'sidebar ' + (closed ? 'closed' : '')}>
        <i
          class="fa fa-bars fa-3x toggler"
          aria-hidden="true"
          onClick={() => this.setState({closed: !this.state.closed})}
        />

        <form style={{padding: '10px'}}>
          <input
            className="sidebar__input"
            placeholder="Device ID"
            value={newDeviceId}
            onInput={(e: any) => this.setState({newDeviceId: e.target.value})}
          />
          <input
            className="sidebar__input"
            placeholder="Device Name"
            value={newDeviceName}
            onInput={(e: any) => this.setState({newDeviceName: e.target.value})}
          />
          <input
            type="button"
            className="button"
            style={{width: '100%'}}
            onClick={() => this.addDevice()}
            value="Add Device"
          />
        </form>

        <div className="sidebar__device-list">
          {this.renderDevices()}
        </div>

      </div>
    );
  }
}
