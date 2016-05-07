'use babel';

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'putco:post-selected-text': () => this.postSelectedText()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  postSelectedText() {
    var editor = atom.workspace.getActiveTextEditor();
    var selectedRange = editor.getSelectedBufferRange();
    var selectedText = editor.getTextInBufferRange(selectedRange);

    if (selectedText) {
      var request = new Request('http://putco.de/_save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `data=${selectedText}`
      });
      fetch(request)
        .then(function(response) {
          return response.json();
        })
        .then(function(response) {
          console.log(response);
        });
    }
  }

};
