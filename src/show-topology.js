import React from 'react';
import { Button, ButtonVariant, Split, SplitItem, Stack, StackItem } from '@patternfly/react-core';
import { ChartDonutUtilization } from '@patternfly/react-charts';
import ShowD3SVG from './show-d3-svg';

class ShowTopology extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      routers: this.props.defaultRouters,
      dimensions: null
    };
  }

  // catch-22: We need to set the width,height of the svg when it is created,
  // but we don't want to use fixed numbers; we want the size to be determined
  // by the browser. However, we don't have the size until after the component is
  // rendered.
  // Solution: - Render the svg's container but not the svg.
  //           - Get the size of the container in componentDidMount()
  //           - Set the size as a state variable which will trigger a re-render
  //           - re-render the svg's container AND render the svg with the correct size
  componentDidMount() {
    this.setState({
      dimensions: {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight
      }
    });
  }

  Capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

  handleScaleUp = () => {
    let routers = Math.min(this.state.routers + 1, this.props.maxRouters);
    this.setState({ routers });
  };

  handleScaleDn = () => {
    let routers = Math.max(this.state.routers - 1, this.props.minRouters);
    this.setState({ routers });
  };

  render() {
    let { routers, dimensions } = this.state;

    return (
      <Stack gutter="md">
        <StackItem className="topo-middle">
          <Split gutter="md">
            <SplitItem className="topo-name">{this.Capitalize(this.props.topology)}</SplitItem>
            <SplitItem isFilled>
              <div className="deployment-donut">
                <div className="deployment-donut-row">
                  <div className="donut-chart-sm deployment-donut-column">
                    <ChartDonutUtilization
                      data={{
                        x: 'Routers',
                        y: (routers * 100) / this.props.maxRouters
                      }}
                      labels={datum => (datum.x ? `${datum.x} - ${datum.y}%` : null)}
                      subTitle="Routers"
                      title={routers}
                      width={150}
                    />
                  </div>
                  <div
                    className="deployment-donut-column scaling-controls fade-inline"
                    ng-if="(hpa &amp;&amp; !hpa.length) &amp;&amp; ((deploymentConfig || rc) | canIScale) &amp;&amp; !isIdled"
                  >
                    <Button title="Scale up" variant={ButtonVariant.plain} onClick={this.handleScaleUp}>
                      <i className="fa fa-chevron-up" />
                      <span className="sr-only">Scale up</span>
                    </Button>
                    <div>
                      <Button title="Scale down" variant={ButtonVariant.plain} onClick={this.handleScaleDn}>
                        <i className="fa fa-chevron-down" />
                        <span className="sr-only">Scale down</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </SplitItem>
          </Split>
        </StackItem>
        <StackItem isFilled>
          <div className="force-graph" ref={el => (this.container = el)}>
            {dimensions && (
              <ShowD3SVG
                topology={this.props.topology}
                center={this.props.center}
                routers={routers}
                dimensions={dimensions}
                notifyCurrentRouter={this.props.notifyCurrentRouter}
              />
            )}
          </div>
        </StackItem>
      </Stack>
    );
  }
}

export default ShowTopology;
