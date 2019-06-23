import React from "react";
import { ForceGraph2D } from "react-force-graph";

class ShowSVG extends React.Component {
  static NODE_R = 4;

  constructor(props) {
    super(props);
    this.state = {
      data: { nodes: [], links: [] },
      highlightNodes: [],
      highlightLink: null
    };
    const data = this.setNodesLinks();
    this.state.data.nodes = data[0];
    this.state.data.links = data[1];
  }
  _handleNodeHover = node => {
    this.setState({ highlightNodes: node ? [node] : [] });
  };
  _handleLinkHover = link => {
    this.setState({
      highlightLink: link,
      highlightNodes: link ? [link.source, link.target] : []
    });
  };
  _paintRing = (node, ctx) => {
    const { NODE_R } = ShowSVG;
    // add ring just for highlighted nodes
    ctx.beginPath();
    ctx.arc(node.x, node.y, NODE_R * 1.4, 0, 2 * Math.PI, false);
    ctx.fillStyle = "red";
    ctx.fill();
  };
  setLinks = (topology, routers) => {
    let links = [];
    if (topology === "linear") {
      for (let i = 0; i < routers - 1; i++) {
        links.push({ source: `id${i}`, target: `id${i + 1}` });
      }
    } else if (topology === "mesh") {
      for (let i = 0; i < routers - 1; i++) {
        for (let j = i + 1; j < routers; j++) {
          links.push({ source: `id${i}`, target: `id${j}` });
        }
      }
    } else if (topology === "star") {
      for (let i = 0; i < routers; i++) {
        links.push({ source: "id0", target: `id${i}` });
      }
    } else if (topology === "ring") {
      for (let i = 0; i < routers - 1; i++) {
        links.push({ source: `id${i}`, target: `id${i + 1}` });
      }
      if (routers > 2)
        links.push({ source: `id${routers - 1}`, target: "id0" });
    } else if (topology === "ted") {
      links = this.setLinks("mesh", 4);
      links.push({ source: "id4", target: "id0" });
      links.push({ source: "id4", target: "id1" });
      links.push({ source: "id5", target: "id2" });
      links.push({ source: "id5", target: "id3" });
    } else if (topology === "bar_bell") {
      // link 1st 2 routers together
      links = this.setLinks("linear", Math.min(routers, 2));
      if (routers > 2) {
        // divide remainder into 2 groups
        let group1 = { start: 2, end: Math.ceil(routers / 2), j: 0 };
        let group2 = { start: group1.end + 1, end: routers - 1, j: 1 };
        let bell = group => {
          if (group.start >= routers) return;
          links.push({ source: `id${group.j}`, target: `id${group.start}` });
          if (group.start !== group.end)
            links.push({ source: `id${group.j}`, target: `id${group.end}` });
          for (let i = group.start; i < group.end; i++) {
            links.push({ source: `id${i}`, target: `id${i + 1}` });
          }
        };
        bell(group1);
        bell(group2);
      }
    } else if (topology === "random") {
      // random int from min to max inclusive
      let randomIntFromInterval = (min, max) =>
        Math.floor(Math.random() * (max - min + 1) + min);
      // are two nodes already connected
      let isConnected = (s, t) => {
        if (s === t) return true;
        return links.some(l => {
          return (l.s === s && l.t === t) || (l.t === s && l.s === t);
        });
      };

      // connect all nodes
      for (let i = 1; i < this.props.routers; i++) {
        let source = randomIntFromInterval(0, i - 1);
        links.push({
          source: `id${source}`,
          target: `id${i}`,
          s: source,
          t: i
        });
      }
      // add n-1 connections
      for (let i = 0; i < this.props.routers - 1; i++) {
        let source = randomIntFromInterval(0, this.props.routers - 1);
        let target = randomIntFromInterval(0, this.props.routers - 1);
        if (!isConnected(source, target)) {
          links.push({
            source: `id${source}`,
            target: `id${target}`,
            s: source,
            t: target
          });
        }
      }
    }
    return links;
  };

  setNodesLinks = () => {
    const nodes = [];
    let links = [];
    for (let i = 0; i < this.props.routers; i++) {
      nodes.push({ id: `id${i}`, name: `R${i}`, val: 3 });
    }
    links = this.setLinks(this.props.topology, this.props.routers);
    return [nodes, links];
  };

  componentDidUpdate(prevProps) {
    if (this.props.routers !== prevProps.routers) {
      const data = this.setNodesLinks();
      this.setState(({ data: { nodes, links } }) => {
        return {
          data: { nodes: data[0], links: data[1] }
        };
      });
    }
  }

  render() {
    const { NODE_R } = ShowSVG;
    const { data, highlightNodes, highlightLink } = this.state;

    return (
      <ForceGraph2D
        ref={el => {
          this.fg = el;
        }}
        width={this.props.dimensions.width}
        height={this.props.dimensions.height}
        graphData={data}
        nodeRelSize={NODE_R}
        linkWidth={link => (link === highlightLink ? 5 : 1)}
        nodeCanvasObjectMode={node =>
          highlightNodes.indexOf(node) !== -1 ? "before" : undefined
        }
        nodeCanvasObject={this._paintRing}
        onNodeHover={this._handleNodeHover}
        onLinkHover={this._handleLinkHover}
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
      />
    );
  }
}

export default ShowSVG;
