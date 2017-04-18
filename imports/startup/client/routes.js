import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import App from '../../ui/containers/App.jsx';
// import ListPageContainer from '../../ui/containers/ListPageContainer.js';

// FlowRouter.route('/simulations/:_id', {
//   name: 'Simulations.show',
//   action() {
//     mount(AppContainer, {
//       main: <ListPageContainer/>,
//     });
//   },
// });

FlowRouter.route('/', {
  name: 'App.home',
  action() {
    mount(App, { main: null });
  },
});
