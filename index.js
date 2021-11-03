"use strict";
/* eslint node/no-extraneous-require: 0 */
var path = require("path");
var Funnel = require("broccoli-funnel");
var MergeTrees = require("broccoli-merge-trees");
const findWorkspaceRoot = require('find-yarn-workspace-root');

module.exports = {
  name: require("./package").name,
  _nodeModulesPath: null,

  included: function(app) {
    this._super.included.apply(this, arguments);

    let current = this;
    // Keep iterating upward until we don't have a grandparent.
    // Has to do this grandparent check because at some point we hit the project.
    do {
      app = current.app || app;
    } while (current.parent.parent && (current = current.parent));
    
    this.app = app;

    const workspaceRoot = findWorkspaceRoot(this.app.project.root);
    const root = workspaceRoot || this.app.project.root;
    this._nodeModulesPath = path.join(root, "node_modules");

    app.import("vendor/jsoneditor.css");
    app.import("vendor/jsoneditor-icons.svg", {
      destDir: "assets/img"
    });
  },

  treeForVendor(/* vendorTree */) {
    let cssTree = new Funnel(
      path.join(this._nodeModulesPath, "jsoneditor/dist"),
      {
        files: ["jsoneditor.css"]
      }
    );

    let iconTree = new Funnel(
      path.join(this._nodeModulesPath, "jsoneditor/dist/img"),
      {
        files: ["jsoneditor-icons.svg"]
      }
    );

    return new MergeTrees([cssTree, iconTree]);
  }
};
