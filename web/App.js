import createElement from "virtual-dom/create-element";
import { patch, diff } from "virtual-dom";

const runCommand = dispatch => command => {
  if (!command) return;
  return command(dispatch);
};

export default ({ initModel, view, update, node }) => {
  let [model, command] = initModel;
  let currView = view(dispatch)(model);
  let rootNode = createElement(currView);
  node.appendChild(rootNode);
  runCommand(dispatch)(command);
  function dispatch(msg) {
    return payload => {
      const updates = update(msg)(payload)(model);
      model = updates[0];
      command = updates[1];
      runCommand(dispatch)(command);
      const newView = view(dispatch)(model);
      const patches = diff(currView, newView);
      rootNode = patch(rootNode, patches);
      currView = newView;
      return;
    };
  }
  return;
};
