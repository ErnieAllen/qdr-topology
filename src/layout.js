import React from 'react';
import {
  Avatar,
  Brand,
  Button,
  ButtonVariant,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  DropdownSeparator,
  KebabToggle,
  Nav,
  NavItem,
  NavList,
  Page,
  PageHeader,
  PageSidebar,
  SkipToContent,
  Toolbar,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';
// make sure you've installed @patternfly/patternfly
import accessibleStyles from '@patternfly/patternfly/utilities/Accessibility/accessibility.css';
import spacingStyles from '@patternfly/patternfly/utilities/Spacing/spacing.css';
import { css } from '@patternfly/react-styles';
import { BellIcon, CogIcon } from '@patternfly/react-icons';
import ChooseTopology from './choose-topology';
import DefineTopology from './define-topology';

const avatarImg = require('./assets/img_avatar.svg');

// By Original: FoobazSVG: Rehua - This file was derived from NetworkTopology-Mesh.png, Public Domain, https://commons.wikimedia.org/w/index.php?curid=31012050
const brandImg = require('./assets/NetworkTopology-Mesh.svg');

class PageLayoutDefaultNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
      isKebabDropdownOpen: false,
      activeItem: 0,
      chosenTopology: 'linear'
    };
    this.topologies = {
      linear: { center: false, default: 3, min: 1, max: 20 },
      mesh: { center: false, default: 4, min: 1, max: 20 },
      star: { center: true, default: 6, min: 1, max: 20 },
      ring: { center: false, default: 3, min: 1, max: 20 },
      ted: { center: false, default: 6, min: 1, max: 20 },
      bar_bell: { center: true, default: 6, min: 1, max: 20 },
      random: { center: false, default: 4, min: 1, max: 20 }
    };
  }

  onDropdownToggle = isDropdownOpen => {
    this.setState({
      isDropdownOpen
    });
  };

  onDropdownSelect = event => {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen
    });
  };

  onKebabDropdownToggle = isKebabDropdownOpen => {
    this.setState({
      isKebabDropdownOpen
    });
  };

  onKebabDropdownSelect = event => {
    this.setState({
      isKebabDropdownOpen: !this.state.isKebabDropdownOpen
    });
  };

  onNavSelect = result => {
    this.setState({
      activeItem: result.itemId
    });
  };

  // user clicked on a topology card, or changed the topology dropdown
  handleChooseTopology = x => {
    // change the page and set the topology
    this.setState({
      activeItem: 1,
      chosenTopology: x.toLowerCase()
    });
  };

  handleAddAddress = name => {
    const { allAddresses } = this.state;
    if (allAddresses.indexOf(name) < 0) {
      allAddresses.push(name);
      this.setState({ allAddresses });
    }
  };

  handleDelAddress = name => {
    const { allAddresses } = this.state;
    const index = allAddresses.indexOf(name);
    if (index >= 0) {
      allAddresses.splice(index, 1);
      this.setState({ allAddresses });
    }
  };

  render() {
    const { isDropdownOpen, isKebabDropdownOpen, activeItem, chosenTopology } = this.state;

    const CurrentPage = () => {
      if (activeItem === 0)
        // show the list of cards showing topologies
        return <ChooseTopology handleChooseTopology={this.handleChooseTopology} topologies={this.topologies} />;
      else if (activeItem === 1)
        // show the define topology page
        return (
          <DefineTopology
            topology={chosenTopology}
            minRouters={this.topologies[chosenTopology].min}
            maxRouters={this.topologies[chosenTopology].max}
            defaultRouters={this.topologies[chosenTopology].default}
            center={this.topologies[chosenTopology].center}
            handleChooseTopology={this.handleChooseTopology}
            handleAddAddress={this.handleAddAddress}
            handleDelAddress={this.handleDelAddress}
          />
        );
      return null;
    };

    const PageNav = (
      <Nav onSelect={this.onNavSelect} aria-label="Nav">
        <NavList>
          <NavItem itemId={0} isActive={activeItem === 0}>
            Choose topology
          </NavItem>
          <NavItem itemId={1} isActive={activeItem === 1}>
            Add Clients
          </NavItem>
          <NavItem itemId={2} isActive={activeItem === 2}>
            Deploy
          </NavItem>
          <NavItem itemId={3} isActive={activeItem === 3}>
            View Results
          </NavItem>
        </NavList>
      </Nav>
    );
    const kebabDropdownItems = [
      <DropdownItem key="notif">
        <BellIcon /> Notifications
      </DropdownItem>,
      <DropdownItem key="sett">
        <CogIcon /> Settings
      </DropdownItem>
    ];
    const userDropdownItems = [
      <DropdownItem key="link">Link</DropdownItem>,
      <DropdownItem component="button" key="action">
        Action
      </DropdownItem>,
      <DropdownItem isDisabled key="dis">
        Disabled Link
      </DropdownItem>,
      <DropdownItem isDisabled component="button" key="button">
        Disabled Action
      </DropdownItem>,
      <DropdownSeparator key="sep0" />,
      <DropdownItem key="sep">Separated Link</DropdownItem>,
      <DropdownItem component="button" key="sep1">
        Separated Action
      </DropdownItem>
    ];
    const PageToolbar = (
      <Toolbar>
        <ToolbarGroup className={css(accessibleStyles.screenReader, accessibleStyles.visibleOnLg)}>
          <ToolbarItem>
            <Button id="default-example-uid-01" aria-label="Notifications actions" variant={ButtonVariant.plain}>
              <BellIcon />
            </Button>
          </ToolbarItem>
          <ToolbarItem>
            <Button id="default-example-uid-02" aria-label="Settings actions" variant={ButtonVariant.plain}>
              <CogIcon />
            </Button>
          </ToolbarItem>
        </ToolbarGroup>
        <ToolbarGroup>
          <ToolbarItem className={css(accessibleStyles.hiddenOnLg, spacingStyles.mr_0)}>
            <Dropdown
              isPlain
              position="right"
              onSelect={this.onKebabDropdownSelect}
              toggle={<KebabToggle onToggle={this.onKebabDropdownToggle} />}
              isOpen={isKebabDropdownOpen}
              dropdownItems={kebabDropdownItems}
            />
          </ToolbarItem>
          <ToolbarItem className={css(accessibleStyles.screenReader, accessibleStyles.visibleOnMd)}>
            <Dropdown
              isPlain
              position="right"
              onSelect={this.onDropdownSelect}
              isOpen={isDropdownOpen}
              toggle={<DropdownToggle onToggle={this.onDropdownToggle}>anonymous</DropdownToggle>}
              dropdownItems={userDropdownItems}
            />
          </ToolbarItem>
        </ToolbarGroup>
      </Toolbar>
    );

    const Header = (
      <PageHeader
        className="topology-header"
        logo={<Brand src={brandImg} alt="Topology Logo" />}
        toolbar={PageToolbar}
        avatar={<Avatar src={avatarImg} alt="Avatar image" />}
        showNavToggle
      />
    );
    const Sidebar = <PageSidebar nav={PageNav} />;
    const PageSkipToContent = (
      <SkipToContent href="#main-content-page-layout-default-nav"> Skip to Content</SkipToContent>
    );

    return (
      <React.Fragment>
        <Page header={Header} sidebar={Sidebar} isManagedSidebar skipToContent={PageSkipToContent}>
          {CurrentPage()}
        </Page>
      </React.Fragment>
    );
  }
}

export default PageLayoutDefaultNav;
