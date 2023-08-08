import React, { useState } from "react";
import { FaCaretRight, FaCaretDown } from "react-icons/fa";
import { treeNodes } from "../data/nodes";

// Recursive component that represents a single node in the tree
function TreeNode({ node, searchQuery, onToggle, collapsedNodes }) {
  const childNodes = treeNodes.filter((n) => n.parent === node._id);
  const isMatch = node.name.toLowerCase().includes(searchQuery.toLowerCase());
  const isCollapsed = collapsedNodes.includes(node._id);

  const handleToggle = () => {
    onToggle(node._id);
  };

  if (node.parent === null || isMatch || hasMatchingChildren(node, searchQuery)) {
    const hasChildren = childNodes.length > 0;
    return (
      <li key={node._id}>
        <div
          onClick={hasChildren ? handleToggle : undefined}
          style={{ cursor: hasChildren ? "pointer" : "default" }}
        >
          {hasChildren && (isCollapsed ? <FaCaretRight /> : <FaCaretDown />)} {node.name}
        </div>
        {!isCollapsed && hasChildren && (
          <ul>
            {childNodes.map((childNode) => (
              <TreeNode
                key={childNode._id}
                node={childNode}
                searchQuery={searchQuery}
                onToggle={onToggle}
                collapsedNodes={collapsedNodes}
              />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return null;
}

// Check if a node has children that match the search query
function hasMatchingChildren(node, searchQuery) {
  const childNodes = treeNodes.filter((n) => n.parent === node._id);

  return childNodes.some(
    (n) =>
      n.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hasMatchingChildren(n, searchQuery)
  );
}

export default function Tree() {
  const [searchQuery, setSearchQuery] = useState("");
  const [collapsedNodes, setCollapsedNodes] = useState([]);

  // Search functionality
  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    // if search query is empty, expand all nodes
    if (!query) {
      setCollapsedNodes([]);
      return;
    }

    // Expand all nodes that match the search query
    if (query) {
      const matchingNodes = treeNodes.filter((node) => node.name.toLowerCase().includes(query));
      const matchingNodesParents = matchingNodes.map((node) => node.parent);

      const matchingNodesIds = matchingNodes.map((node) => node._id);

      const matchingNodesParentsAndChildren = treeNodes.filter((node) => {
        if (matchingNodesParents.includes(node._id)) {
          return true;
        }
        if (matchingNodesIds.includes(node._id)) {
          return true;
        }
        return false;
      });

      const matchingNodesParentsAndChildrenIds = matchingNodesParentsAndChildren.map(
        (node) => node._id
      );
      setCollapsedNodes((prevCollapsedNodes) => {
        const newCollapsedNodes = prevCollapsedNodes.filter(
          (id) => !matchingNodesParentsAndChildrenIds.includes(id)
        );
        return newCollapsedNodes;
      });
    }
  };

  // Toggle functionality
  const handleToggle = (nodeId) => {
    setCollapsedNodes((prevCollapsedNodes) =>
      prevCollapsedNodes.includes(nodeId)
        ? prevCollapsedNodes.filter((id) => id !== nodeId)
        : [...prevCollapsedNodes, nodeId]
    );
  };

  return (
    <div>
      <div className="search-container">
        <input
          type="text"
          className="search-input bg-gray-200 focus:bg-white border border-gray-300 rounded-md py-2 px-4 w-full"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
        />
        {searchQuery && (
          <button
            className="clear-search-button ml-2 text-sm text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={() => setSearchQuery("")}
          >
            Clear
          </button>
        )}
      </div>
      <div className="tree mt-4 p-4 bg-white shadow-md rounded-md">
        {treeNodes
          .filter((node) => node.parent === null)
          .map((node) => (
            <TreeNode
              key={node._id}
              node={node}
              searchQuery={searchQuery}
              onToggle={handleToggle}
              collapsedNodes={collapsedNodes}
            />
          ))}
      </div>
    </div>
  );
}
