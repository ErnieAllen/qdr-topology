import React from "react";

import * as d3 from "d3";

class Graph extends React.Component {
  constructor(props) {
    super(props);

    this.force = d3.layout
      .force()
      .size([this.props.dimensions.width, this.props.dimensions.height])
      .linkDistance(this.props.thumbNail ? 50 : 150)
      .charge(-800)
      .friction(0.1)
      .gravity(0.001);
  }

  // called only once when the component is initialized
  componentDidMount() {
    this.d3Graph = d3.select(this.svgg);

    this.force.on("tick", () => {
      // after force calculation starts, call updateGraph
      // which uses d3 to manipulate the attributes,
      // and React doesn't have to go through lifecycle on each tick
      this.d3Graph.call(this.updateGraph);
    });
    // call this manually to create svg circles and lines
    this.shouldComponentUpdate(this.props);
  }

  // called each time one of the properties changes
  // in our case, the number of routers probably changed
  shouldComponentUpdate(nextProps) {
    this.d3Graph = d3.select(this.svgg);

    var d3Nodes = this.d3Graph
      .selectAll(".node")
      .data(nextProps.nodes, node => node.key);
    d3Nodes
      .enter()
      .append("g")
      .call(this.enterNode);
    d3Nodes.exit().remove();
    d3Nodes.call(this.updateNode);
    d3Nodes.call(this.force.drag);

    var d3Links = this.d3Graph
      .selectAll(".link")
      .data(nextProps.links, link => link.key);
    d3Links
      .enter()
      .insert("line", ".node")
      .call(this.enterLink);
    d3Links.exit().remove();
    d3Links.call(this.updateLink);

    // we should actually clone the nodes and links
    // since we're not supposed to directly mutate
    // props passed in from parent, and d3's force function
    // mutates the nodes and links array directly
    this.force.nodes(nextProps.nodes).links(nextProps.links);
    this.force.start();

    return false;
  }

  enterNode = selection => {
    const graph = this;

    selection.classed("node", true);
    selection.append("circle").attr("r", d => d.size);

    if (!this.props.thumbNail) {
      selection
        .append("text")
        .attr("x", d => d.size + 5)
        .attr("dy", ".35em")
        .text(d => d.name);
    }

    selection
      .on("mouseover", function(n) {
        n.over = true;
        graph.updateNode(d3.select(this));
      })
      .on("mouseout", function(n) {
        n.over = false;
        graph.updateNode(d3.select(this));
      })
      .on("click", n => {
        if (graph.selected === n.key) {
          graph.selected = null;
          this.props.notifyCurrentRouter(null);
        } else {
          graph.selected = n.key;
          this.props.notifyCurrentRouter(n.name);
        }
        graph.refresh();
      });
  };

  refresh = () => {
    const circles = d3.selectAll("g.node");
    circles.classed("selected", d => d.key === this.selected);
  };

  updateNode = selection => {
    selection.attr("transform", d => {
      let r = 15;
      d.x = Math.max(Math.min(d.x, this.props.dimensions.width - r), r);
      d.y = Math.max(Math.min(d.y, this.props.dimensions.height - r), r);
      return `translate(${d.x || 0},${d.y || 0}) ${d.over ? "scale(1.1)" : ""}`;
    });
  };

  enterLink = selection => {
    selection.classed("link", true).attr("stroke-width", d => d.size);
  };

  updateLink = selection => {
    selection
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
  };

  updateGraph = selection => {
    selection.selectAll(".node").call(this.updateNode);
    selection.selectAll(".link").call(this.updateLink);
  };

  render() {
    const { width, height } = this.props.dimensions;
    return (
      <svg width={width} height={height}>
        <g ref={el => (this.svgg = el)} />
      </svg>
    );
  }
}

export default Graph;
