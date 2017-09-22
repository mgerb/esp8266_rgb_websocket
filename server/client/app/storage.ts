import * as _ from 'lodash';
import { Device } from './model';

class StorageClass {

  private DEVICES_KEY: string = 'devices';
  private SELECTED_DEVICE_KEY: string = 'selected_device';

  public setSelectedDevice(device: Device): void {
    localStorage.setItem(this.SELECTED_DEVICE_KEY, JSON.stringify(device));
  }

  public getSelectedDevice(): Device {
    const device = localStorage.getItem(this.SELECTED_DEVICE_KEY);
    return device ? JSON.parse(device) : null;
  }

  public getAllDevices(): Device[] {
    return JSON.parse(localStorage.getItem(this.DEVICES_KEY));
  }

  public addDevice(device: Device): void {
    const store = JSON.parse(localStorage.getItem(this.DEVICES_KEY));
    const newStore = store || [];

    newStore.push(device);
    localStorage.setItem(this.DEVICES_KEY, JSON.stringify(newStore));
  }

  public removeDevice(id: string): void {
    const store = JSON.parse(localStorage.getItem(this.DEVICES_KEY));
    const newStore = _.reject(store, (s) => s.id === id);
    localStorage.setItem(this.DEVICES_KEY, JSON.stringify(newStore));
  }
}

export const Storage = new StorageClass();
