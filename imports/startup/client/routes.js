import React from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { mount } from 'react-mounter';

import AppContainer from '../../ui/AppContainer.jsx';
import Header from '../../ui/components/Header.jsx';
import Main from '../../ui/components/Main.jsx';
import NotFound from '../../ui/components/NotFound.jsx';

FlowRouter.route('/simulation/:_id', {
  name: 'Simulation',
  action: function(params, queryParams) {
    mount(AppContainer, { header: <Header />, main: <Main params={params}/> });
  },
});

FlowRouter.route('/', {
  name: 'App.home',
  action() {
    mount(AppContainer, { header: <Header />, main: <Main params={{}}/> });
  },
});

// the App_notFound template is used for unknown routes and missing lists
FlowRouter.notFound = {
  action() {
    mount(AppContainer, { main: <NotFound /> });
  },
};
