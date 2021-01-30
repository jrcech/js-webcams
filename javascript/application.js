import { Application } from 'stimulus';
import { definitionsFromContext } from 'stimulus/webpack-helpers';

import './stylesheets';
import 'jquery';
import 'select2';

const application = Application.start();
const context = require.context('./controllers', true, /\.js$/);

application.load(definitionsFromContext(context));
