import { Component, h, render } from 'preact';
import './scss/index.scss';

class Dashboard extends Component<any, any> {

  public render() {
    return (
      <div>test</div>
    );
  }
}

render(
  <Dashboard />,
  document.querySelector('#app') as Element,
);
