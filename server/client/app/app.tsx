import { h, render } from 'preact';
import { Dashboard } from './components/dashboard.component';
import './scss/index.scss';

render(
  <Dashboard/>,
  document.querySelector('#app'),
);
