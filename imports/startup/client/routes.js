import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import App from '../../ui/App.jsx';
import Header from '../../ui/components/Header.jsx';
import Main from '../../ui/components/Main.jsx';

FlowRouter.route('/simulations/:_id', {
  name: 'Simulations.running',
  action() {
    mount(App, {
      header: <Header />, main: <Main /> ,
    });
  },
});

FlowRouter.route('/', {
  name: 'App.home',
  action() {
    mount(App, { header: <Header />, main: <Main /> });
  },
});
