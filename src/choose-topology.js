import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Gallery,
  GalleryItem,
  PageSection,
  PageSectionVariants,
  TextContent,
  Text
} from "@patternfly/react-core";

import ShowD3SVG from "./show-d3-svg";

class ChooseTopology extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <React.Fragment>
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h1">Welcome to Mercury</Text>
            <Text component="p" className="tag-line">
              Create a router network, add clients to it, run a test, analyse
              results, profit!
            </Text>
            <Text component="p">Choose a topology to get started</Text>
          </TextContent>
        </PageSection>
        <PageSection>
          <Gallery gutter="md">
            {Object.keys(this.props.topologies).map((x, i) => (
              <GalleryItem key={i}>
                <Card
                  onClick={() =>
                    this.props.handleChooseTopology(x, this.props.topologies[x])
                  }
                >
                  <CardHeader>
                    <ShowD3SVG
                      topology={x}
                      routers={this.props.topologies[x].default}
                      center={this.props.topologies[x].center}
                      dimensions={{ width: 150, height: 75 }}
                      radius={6}
                      thumbNail={true}
                      notifyCurrentRouter={() => {}}
                    />
                  </CardHeader>
                  <CardBody>{x}</CardBody>
                </Card>
              </GalleryItem>
            ))}
          </Gallery>
        </PageSection>
      </React.Fragment>
    );
  }
}

export default ChooseTopology;
