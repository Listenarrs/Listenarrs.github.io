import React from 'react';
import {useLockBodyScroll, useNavbarMobileSidebar} from '@docusaurus/theme-common/internal';
import NavbarMobileSidebarHeader from '@theme/Navbar/MobileSidebar/Header';
import NavbarMobileSidebarPrimaryMenu from '@theme/Navbar/MobileSidebar/PrimaryMenu';

export default function NavbarMobileSidebar() {
  const mobileSidebar = useNavbarMobileSidebar();

  useLockBodyScroll(mobileSidebar.shown);

  if (!mobileSidebar.shouldRender) {
    return null;
  }

  return (
    <div className="navbar-sidebar">
      <NavbarMobileSidebarHeader />
      <div className="navbar-sidebar__items">
        <div className="navbar-sidebar__item menu">
          <NavbarMobileSidebarPrimaryMenu />
        </div>
      </div>
    </div>
  );
}
