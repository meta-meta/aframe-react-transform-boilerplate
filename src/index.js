import React from 'react';
import {render} from 'react-dom';
import {App} from './App';
import { Cursor } from 'react-cursor';
import atom from 'js-atom';
import initialState from './initialState';

window.stateAtom = atom.createAtom(initialState);

const queueRender = (key, ref, prevVal, curVal) => {
  var cur = window.cursor = Cursor.build(stateAtom.deref(), stateAtom.swap);
  window.app = render(<App cursor={cur}/>, document.getElementById('root'));
};

stateAtom.addWatch('react-renderer', queueRender);
queueRender('react-renderer', stateAtom, undefined, stateAtom.deref());
